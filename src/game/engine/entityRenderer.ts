import { NPC } from '../entities/NPC';
import { Collectible } from '../entities/Collectible';

export interface PlayerEntity {
  x: number; // world px
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
  walkFrame: number;
  name: string;
  avatarEmoji: string;
  shirtColor: string;
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

  // 2. Render Wandering NPCs
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
      // Little triangle pointer
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

  // 3. Render Player Character
  const playerScreenX = canvasWidth / 2;
  const playerScreenY = canvasHeight / 2;

  // Player Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(playerScreenX, playerScreenY + 16, 14, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Walk Cycle Bob
  const walkBob = player.isMoving ? Math.sin(player.walkFrame * 0.8) * 3 : 0;
  const legOffset = player.isMoving ? Math.sin(player.walkFrame * 0.8) * 6 : 0;

  // Legs / Shoes
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(playerScreenX - 7, playerScreenY + 8 + legOffset, 5, 8);
  ctx.fillRect(playerScreenX + 2, playerScreenY + 8 - legOffset, 5, 8);

  // Torso / Jacket
  ctx.fillStyle = player.shirtColor || '#10b981';
  ctx.beginPath();
  ctx.roundRect(playerScreenX - 11, playerScreenY - 10 + walkBob, 22, 20, 6);
  ctx.fill();

  // Head
  ctx.fillStyle = '#fed7aa'; // warm skin tone
  ctx.beginPath();
  ctx.arc(playerScreenX, playerScreenY - 18 + walkBob, 11, 0, Math.PI * 2);
  ctx.fill();

  // Hair / Cap
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(playerScreenX, playerScreenY - 22 + walkBob, 10, Math.PI, Math.PI * 2);
  ctx.fill();

  // Face directional eyes
  ctx.fillStyle = '#0f172a';
  if (player.direction === 'down') {
    ctx.fillRect(playerScreenX - 4, playerScreenY - 18 + walkBob, 2.5, 3.5);
    ctx.fillRect(playerScreenX + 2, playerScreenY - 18 + walkBob, 2.5, 3.5);
  } else if (player.direction === 'up') {
    // looking away
  } else if (player.direction === 'left') {
    ctx.fillRect(playerScreenX - 8, playerScreenY - 18 + walkBob, 2.5, 3.5);
  } else if (player.direction === 'right') {
    ctx.fillRect(playerScreenX + 6, playerScreenY - 18 + walkBob, 2.5, 3.5);
  }

  // Name Tag & Title above player
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.5;
  const tagWidth = ctx.measureText(player.name).width + 18;
  ctx.beginPath();
  ctx.roundRect(playerScreenX - tagWidth / 2, playerScreenY - 46, tagWidth, 16, 5);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(player.name, playerScreenX, playerScreenY - 34);
}
