import { NPC } from '../entities/NPC';
import { Collectible } from '../entities/Collectible';
import { getAvatarVisualSpec, renderPlayerSprite, AvatarVisualSpec } from './avatarRenderer';
import { pedestrianEngine, Pedestrian } from './pedestrianAI';
import { vehicleEngine } from './vehicleEngine';

export interface PlayerEntity {
  x: number; // world px
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
  walkFrame: number;
  name: string;
  avatarEmoji: string;
  shirtColor: string;
  archetypeId?: string;
  vehicle?: 'FOOT' | 'BICYCLE' | 'CAR';
  hasPet?: boolean;
}

export function renderEntities(
  ctx: CanvasRenderingContext2D,
  player: PlayerEntity,
  npcs: NPC[],
  collectibles: Collectible[],
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number,
  focusedNpcId: string | null
) {
  // 1. Render Collectibles (Coins, Scrolls, Chests)
  collectibles.forEach((item) => {
    if (item.isCollected) return;

    const screenX = item.x - cameraX + canvasWidth / 2;
    const screenY = item.y - cameraY + canvasHeight / 2;

    // Bobbing animation
    const bob = Math.sin(Date.now() / 250 + item.pulseTimer) * 5;

    // Soft glow shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(screenX, screenY + 12, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    if (item.type === 'COIN') {
      // Golden spinning coin
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(screenX, screenY + bob, 11, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(screenX, screenY + bob, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('$', screenX, screenY + bob + 3.5);
    } else if (item.type === 'SCROLL') {
      // Ancient Knowledge Scroll
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.roundRect(screenX - 10, screenY + bob - 10, 20, 20, 4);
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = '12px serif';
      ctx.textAlign = 'center';
      ctx.fillText('📜', screenX, screenY + bob + 4);
    } else {
      // Chest
      ctx.font = '16px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎁', screenX, screenY + bob + 4);
    }
  });

  // 2. Render Wandering Quest NPCs
  npcs.forEach((npc) => {
    const screenX = npc.x - cameraX + canvasWidth / 2;
    const screenY = npc.y - cameraY + canvasHeight / 2;
    const isNearby = npc.id === focusedNpcId;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(screenX, screenY + 14, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // NPC Body
    ctx.fillStyle = npc.color;
    ctx.beginPath();
    ctx.roundRect(screenX - 10, screenY - 8, 20, 22, 6);
    ctx.fill();

    // NPC Head / Avatar
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(screenX, screenY - 14, 10, 0, Math.PI * 2);
    ctx.fill();

    // Emoji icon / portrait
    ctx.font = '14px serif';
    ctx.textAlign = 'center';
    ctx.fillText(npc.avatar, screenX, screenY - 9);

    // Name Tag
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(screenX - 35, screenY - 38, 70, 16, 4);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(npc.name, screenX, screenY - 26);

    // Speech Bubble (if talking or idling)
    if (npc.speechBubble && !isNearby) {
      const bubbleW = ctx.measureText(npc.speechBubble).width + 16;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(screenX - bubbleW / 2, screenY - 58, bubbleW, 16, 4);
      ctx.fill();
      // Triangle pointer
      ctx.beginPath();
      ctx.moveTo(screenX, screenY - 42);
      ctx.lineTo(screenX - 4, screenY - 46);
      ctx.lineTo(screenX + 4, screenY - 46);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(npc.speechBubble, screenX, screenY - 46);
    }

    // Interactive prompt if player is close
    if (isNearby) {
      const pulse = Math.sin(Date.now() / 180) * 3;
      ctx.fillStyle = '#34d399';
      ctx.font = 'extrabold 9px monospace';
      ctx.fillText('TALK [E] / TAP', screenX, screenY - 44 + pulse);
    }
  });

  // 3. Render Living GTA Crowd Pedestrians (Bankers, Tech Bros, Joggers, Socialites, Students)
  pedestrianEngine.pedestrians.forEach((ped) => {
    const screenX = ped.x - cameraX + canvasWidth / 2;
    const screenY = ped.y - cameraY + canvasHeight / 2;

    if (screenX < -50 || screenX > canvasWidth + 50 || screenY < -50 || screenY > canvasHeight + 50) {
      return;
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(screenX, screenY + 12, 9, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Walking animation bob
    const bob = Math.abs(Math.sin(ped.walkFrame)) * 3;

    // Legs
    const legOffset = Math.sin(ped.walkFrame) * 4;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(screenX - 4 + legOffset, screenY + 4, 3, 8);
    ctx.fillRect(screenX + 1 - legOffset, screenY + 4, 3, 8);

    // Torso / Outfit
    ctx.fillStyle = ped.outfitColor;
    ctx.beginPath();
    ctx.roundRect(screenX - 7, screenY - 8 - bob, 14, 14, 3);
    ctx.fill();

    // Head
    ctx.fillStyle = '#fed7aa'; // skin tone
    ctx.beginPath();
    ctx.arc(screenX, screenY - 14 - bob, 6, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = ped.hairColor;
    ctx.beginPath();
    ctx.arc(screenX, screenY - 16 - bob, 6, Math.PI, 0);
    ctx.fill();

    // Accessories
    if (ped.accessory === 'BRIEFCASE') {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(screenX + 8, screenY - 2 - bob, 5, 7);
    } else if (ped.accessory === 'COFFEE') {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(screenX + 7, screenY - 4 - bob, 4, 6);
      ctx.fillStyle = '#059669';
      ctx.fillRect(screenX + 7, screenY - 2 - bob, 4, 2);
    } else if (ped.accessory === 'BACKPACK') {
      ctx.fillStyle = '#475569';
      ctx.fillRect(screenX - 10, screenY - 6 - bob, 4, 8);
    } else if (ped.accessory === 'SUNGLASSES') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(screenX - 4, screenY - 15 - bob, 8, 2);
    }

    // Panic reaction indicator
    if (ped.isPanicking) {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'extrabold 12px sans-serif';
      ctx.fillText('❗', screenX, screenY - 24 - bob);
    }

    // Quip Speech Bubble
    if (ped.quip) {
      ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
      const bubbleW = ctx.measureText(ped.quip).width + 12;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.beginPath();
      ctx.roundRect(screenX - bubbleW / 2, screenY - 34 - bob, bubbleW, 14, 4);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(ped.quip, screenX, screenY - 24 - bob);
    }
  });

  // 4. Render Player Character
  const isDriving = vehicleEngine.playerVehicle !== null || player.vehicle === 'CAR';
  if (isDriving) {
    // Player is inside the vehicle! The vehicle renders the chassis and interior driving silhouette.
    return;
  }

  const playerScreenX = canvasWidth / 2;
  const playerScreenY = canvasHeight / 2;

  // Render Pet Companion (Compound Hound 🐕) if player has pet
  if (player.hasPet) {
    const petOffset = player.direction === 'left' ? 22 : -22;
    const petY = playerScreenY + 6;
    const petX = playerScreenX + petOffset;
    const petBob = player.isMoving ? Math.sin(player.walkFrame * 1.2) * 2 : 0;

    // Pet Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(petX, petY + 8, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dog body
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.roundRect(petX - 7, petY - 4 + petBob, 14, 10, 4);
    ctx.fill();

    // Dog head
    ctx.beginPath();
    ctx.arc(petX + (player.direction === 'left' ? -5 : 5), petY - 6 + petBob, 5, 0, Math.PI * 2);
    ctx.fill();

    // Wagging tail
    const wag = Math.sin(Date.now() / 120) * 4;
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(petX + (player.direction === 'left' ? 7 : -7), petY - 2 + petBob);
    ctx.lineTo(petX + (player.direction === 'left' ? 12 : -12), petY - 8 + petBob + wag);
    ctx.stroke();

    // Pet Label
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 8px monospace';
    ctx.fillText('🐕 Hound', petX, petY - 14);
  }

  // Render Bicycle if active
  if (player.vehicle === 'BICYCLE') {
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(playerScreenX - 12, playerScreenY + 14, 6, 0, Math.PI * 2);
    ctx.arc(playerScreenX + 12, playerScreenY + 14, 6, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(playerScreenX, playerScreenY + 14, 12, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Render High-Fidelity Archetype Avatar
  const spec = getAvatarVisualSpec(player.avatarEmoji, player.archetypeId);
  renderPlayerSprite(
    ctx,
    playerScreenX,
    playerScreenY,
    player.direction,
    player.isMoving,
    player.walkFrame,
    spec
  );

  // Player Name Tag
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(playerScreenX - 35, playerScreenY - 38, 70, 16, 4);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(player.name, playerScreenX, playerScreenY - 26);
}
