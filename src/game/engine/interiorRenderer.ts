import { InteriorRoom, InteriorStation } from '../world/interiorData';
import { PlayerEntity } from './entityRenderer';

const TILE = 40;

export function renderWalkableInterior(
  ctx: CanvasRenderingContext2D,
  room: InteriorRoom,
  playerX: number,
  playerY: number,
  player: PlayerEntity,
  canvasWidth: number,
  canvasHeight: number,
  focusedStation: InteriorStation | null
) {
  // Center room in canvas
  const roomW = room.widthTiles * TILE;
  const roomH = room.heightTiles * TILE;
  const originX = (canvasWidth - roomW) / 2;
  const originY = (canvasHeight - roomH) / 2;

  // Clear background
  ctx.fillStyle = '#060911';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 1. Room Outer Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.beginPath();
  ctx.roundRect(originX - 10, originY - 10, roomW + 20, roomH + 20, 16);
  ctx.fill();

  // 2. Floor Tiles
  renderFloor(ctx, room, originX, originY, roomW, roomH);

  // 3. Back Wall & Molding
  renderWalls(ctx, room, originX, originY, roomW);

  // 4. Exit Mat / Doorway
  renderExitDoor(ctx, room, originX, originY);

  // 5. Furniture & Interactive Stations
  room.stations.forEach((station) => {
    renderStation(ctx, station, originX, originY, station.id === focusedStation?.id);
  });

  // 6. Player Character inside Room
  renderInteriorPlayer(ctx, playerX + originX, playerY + originY, player);

  // 7. Ambient Lighting Halo from Ceiling Lamps
  renderInteriorLighting(ctx, originX, originY, roomW, roomH, room.trimColor);
}

function renderFloor(
  ctx: CanvasRenderingContext2D,
  room: InteriorRoom,
  originX: number,
  originY: number,
  roomW: number,
  roomH: number
) {
  // Base floor
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(originX, originY, roomW, roomH);

  for (let y = 2; y < room.heightTiles; y++) {
    for (let x = 0; x < room.widthTiles; x++) {
      const tileX = originX + x * TILE;
      const tileY = originY + y * TILE;

      if (room.floorType === 'MARBLE_CHECKER') {
        const isWhite = (x + y) % 2 === 0;
        ctx.fillStyle = isWhite ? '#f8fafc' : '#0f766e';
        ctx.fillRect(tileX, tileY, TILE, TILE);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(tileX, tileY, TILE, TILE);
      } else if (room.floorType === 'PARQUET_WOOD') {
        ctx.fillStyle = (x + y) % 2 === 0 ? '#78350f' : '#92400e';
        ctx.fillRect(tileX, tileY, TILE, TILE);
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 1;
        ctx.strokeRect(tileX, tileY, TILE, TILE);
      } else if (room.floorType === 'RUSTIC_PLANK') {
        ctx.fillStyle = '#451a03';
        ctx.fillRect(tileX, tileY, TILE, TILE);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(tileX + 1, tileY + 1, TILE - 2, TILE - 2);
        // Wood grain line
        ctx.fillStyle = '#292524';
        ctx.fillRect(tileX, tileY + 14, TILE, 1);
        ctx.fillRect(tileX, tileY + 28, TILE, 1);
      } else {
        // STUDIO_OAK
        ctx.fillStyle = '#b45309';
        ctx.fillRect(tileX, tileY, TILE, TILE);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(tileX + 1, tileY + 1, TILE - 2, TILE - 2);
      }
    }
  }

  // Decorative Central Persian Rug for Cafe / Studio
  if (room.floorType === 'RUSTIC_PLANK' || room.floorType === 'STUDIO_OAK') {
    const rugX = originX + 5 * TILE;
    const rugY = originY + 5 * TILE;
    const rugW = 6 * TILE;
    const rugH = 4 * TILE;

    ctx.fillStyle = '#991b1b'; // rich dark crimson
    ctx.beginPath();
    ctx.roundRect(rugX, rugY, rugW, rugH, 10);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b'; // golden fringe
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner pattern
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(rugX + 8, rugY + 8, rugW - 16, rugH - 16);
  }
}

function renderWalls(
  ctx: CanvasRenderingContext2D,
  room: InteriorRoom,
  originX: number,
  originY: number,
  roomW: number
) {
  const wallH = 2 * TILE; // 80px high back wall

  // Main Back Wall
  ctx.fillStyle = room.wallColor;
  ctx.fillRect(originX, originY, roomW, wallH);

  // Crown Molding at top
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(originX, originY, roomW, 8);

  // Baseboard trim at bottom
  ctx.fillStyle = room.trimColor;
  ctx.fillRect(originX, originY + wallH - 6, roomW, 6);

  // Wall Art / Features based on room
  if (room.buildingId === 'bldg_bank') {
    // 4.5% APY Sign on wall
    ctx.fillStyle = '#022c22';
    ctx.fillRect(originX + roomW / 2 - 120, originY + 18, 240, 32);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(originX + roomW / 2 - 120, originY + 18, 240, 32);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('FIRST PROSPERITY • 4.5% APY VAULT', originX + roomW / 2, originY + 38);
  } else if (room.buildingId === 'bldg_stock_exchange') {
    // Scrolling Ticker on wall
    ctx.fillStyle = '#020617';
    ctx.fillRect(originX + 20, originY + 16, roomW - 40, 36);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(originX + 20, originY + 16, roomW - 40, 36);

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    const tOffset = (Date.now() / 25) % 300;
    ctx.fillText('▲ S&P 500 $512.40 (+1.4%)   ▲ AAPL $234.10 (+2.1%)   ▲ VOO $470.80 (+1.2%)', originX + roomW / 2 - tOffset + 150, originY + 38);
  } else if (room.buildingId === 'bldg_cafe') {
    // Chalkboard Menu
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(originX + roomW / 2 - 100, originY + 16, 200, 38);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.strokeRect(originX + roomW / 2 - 100, originY + 16, 200, 38);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('☕ THE DAILY GRIND MENU', originX + roomW / 2, originY + 30);
    ctx.font = '9px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Espresso: $5 • Gig Consulting: +$350', originX + roomW / 2, originY + 44);
  }
}

function renderExitDoor(
  ctx: CanvasRenderingContext2D,
  room: InteriorRoom,
  originX: number,
  originY: number
) {
  const doorX = originX + room.doorTileX * TILE;
  const doorY = originY + room.doorTileY * TILE;

  // Red Welcome / Exit Carpet
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(doorX - 20, doorY, TILE + 40, TILE);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(doorX - 20, doorY, TILE + 40, TILE);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('▼ EXIT [ESC] ▼', doorX + TILE / 2, doorY + 24);
}

function renderStation(
  ctx: CanvasRenderingContext2D,
  station: InteriorStation,
  originX: number,
  originY: number,
  isFocused: boolean
) {
  const x = originX + station.tileX * TILE;
  const y = originY + station.tileY * TILE;
  const w = station.widthTiles * TILE;
  const h = station.heightTiles * TILE;

  // Drop Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h + 2, w / 2, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Main Counter / Furniture Body
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 8);
  ctx.fill();

  ctx.strokeStyle = isFocused ? '#10b981' : station.color;
  ctx.lineWidth = isFocused ? 3 : 2;
  ctx.stroke();

  // Top surface / Countertop
  ctx.fillStyle = '#334155';
  ctx.fillRect(x + 3, y + 3, w - 6, 16);

  // Icon / Character behind counter
  ctx.font = '22px serif';
  ctx.textAlign = 'center';
  ctx.fillText(station.icon, x + w / 2, y + h / 2 + 6);

  // Name Label Banner
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.beginPath();
  ctx.roundRect(x - 10, y - 24, w + 20, 18, 5);
  ctx.fill();
  ctx.strokeStyle = isFocused ? '#10b981' : 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = isFocused ? '#34d399' : '#ffffff';
  ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(station.name, x + w / 2, y - 12);

  // If player is standing close: Interactive Prompt
  if (isFocused) {
    const pulse = Math.sin(Date.now() / 180) * 4;
    ctx.fillStyle = '#34d399';
    ctx.font = 'black 10px monospace';
    ctx.fillText(`[E] ${station.actionLabel.toUpperCase()}`, x + w / 2, y + h + 18 + pulse);
  }
}

function renderInteriorPlayer(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  player: PlayerEntity
) {
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(px, py + 14, 12, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Walk Bob
  const bob = player.isMoving ? Math.sin(player.walkFrame * 0.8) * 3 : 0;
  const legOffset = player.isMoving ? Math.sin(player.walkFrame * 0.8) * 5 : 0;

  // Legs
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px - 6, py + 6 + legOffset, 4, 8);
  ctx.fillRect(px + 2, py + 6 - legOffset, 4, 8);

  // Torso
  ctx.fillStyle = player.shirtColor || '#10b981';
  ctx.beginPath();
  ctx.roundRect(px - 10, py - 10 + bob, 20, 18, 5);
  ctx.fill();

  // Head
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(px, py - 16 + bob, 10, 0, Math.PI * 2);
  ctx.fill();

  // Hair / Cap
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(px, py - 20 + bob, 9, Math.PI, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#0f172a';
  if (player.direction === 'down') {
    ctx.fillRect(px - 4, py - 16 + bob, 2, 3);
    ctx.fillRect(px + 2, py - 16 + bob, 2, 3);
  } else if (player.direction === 'left') {
    ctx.fillRect(px - 7, py - 16 + bob, 2, 3);
  } else if (player.direction === 'right') {
    ctx.fillRect(px + 5, py - 16 + bob, 2, 3);
  }

  // Name Tag
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(px - 30, py - 38, 60, 14, 4);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 8px sans-serif';
  ctx.fillText(player.name, px, py - 28);
}

function renderInteriorLighting(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  rw: number,
  rh: number,
  lightColor: string
) {
  // Soft ambient chandelier / ceiling lamp glow in center
  const cx = ox + rw / 2;
  const cy = oy + rh / 2;
  const rad = rw / 1.8;

  const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, rad);
  grad.addColorStop(0, 'rgba(254, 240, 138, 0.12)');
  grad.addColorStop(0.7, 'rgba(254, 240, 138, 0.03)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.35)');

  ctx.fillStyle = grad;
  ctx.fillRect(ox, oy, rw, rh);
}
