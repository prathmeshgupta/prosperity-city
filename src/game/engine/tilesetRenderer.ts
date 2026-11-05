import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, BUILDINGS, BuildingEntrance } from '../world/mapData';

/**
 * Procedural Canvas 2D World Renderer.
 * High-performance, crisp, colorful top-down art style.
 * Zero external asset loading required, works offline.
 */

export function renderWorldMap(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number,
  activeBuildingId: string | null
) {
  // Clear screen
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Visible tile range
  const startTileX = Math.max(0, Math.floor((cameraX - canvasWidth / 2) / TILE_SIZE) - 1);
  const endTileX = Math.min(MAP_WIDTH, Math.ceil((cameraX + canvasWidth / 2) / TILE_SIZE) + 1);
  const startTileY = Math.max(0, Math.floor((cameraY - canvasHeight / 2) / TILE_SIZE) - 1);
  const endTileY = Math.min(MAP_HEIGHT, Math.ceil((cameraY + canvasHeight / 2) / TILE_SIZE) + 1);

  // 1. Draw Base Terrain & Roads
  for (let y = startTileY; y < endTileY; y++) {
    for (let x = startTileX; x < endTileX; x++) {
      const screenX = x * TILE_SIZE - cameraX + canvasWidth / 2;
      const screenY = y * TILE_SIZE - cameraY + canvasHeight / 2;

      // Determine terrain type
      const isRoadH = y === 12 || y === 13 || y === 25 || y === 26;
      const isRoadV = x === 14 || x === 15 || x === 24 || x === 25 || x === 34 || x === 35;
      const isSidewalkH = y === 11 || y === 14 || y === 24 || y === 27;
      const isSidewalkV = x === 13 || x === 16 || x === 23 || x === 26 || x === 33 || x === 36;
      const isPlaza = x >= 20 && x <= 28 && y >= 15 && y <= 20;
      const isWater = x >= 44 && y >= 10 && y <= 24;

      if (isWater) {
        // Shimmering Water Pier
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
        // Water ripples
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(screenX + 8, screenY + 12, 12, 2);
        ctx.fillRect(screenX + 22, screenY + 26, 10, 2);
      } else if (isRoadH || isRoadV) {
        // Asphalt Road
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

        // Center markings
        ctx.fillStyle = '#facc15';
        if (isRoadH && (y === 12 || y === 25) && (x % 2 === 0)) {
          ctx.fillRect(screenX + 4, screenY + TILE_SIZE - 2, TILE_SIZE - 8, 3);
        }
        if (isRoadV && (x === 14 || x === 24 || x === 34) && (y % 2 === 0)) {
          ctx.fillRect(screenX + TILE_SIZE - 2, screenY + 4, 3, TILE_SIZE - 8);
        }
      } else if (isSidewalkH || isSidewalkV) {
        // Sidewalk paving
        ctx.fillStyle = '#334155';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = '#475569';
        ctx.strokeRect(screenX + 0.5, screenY + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
      } else if (isPlaza) {
        // Central Town Plaza Stone Brick
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#0f766e';
        ctx.fillRect(screenX + 2, screenY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      } else {
        // Lush Grassland & Parks
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
        // Grass flower accents
        if ((x + y * 7) % 11 === 0) {
          ctx.fillStyle = '#10b981';
          ctx.fillRect(screenX + 12, screenY + 14, 4, 6);
          ctx.fillRect(screenX + 18, screenY + 10, 4, 10);
        }
        if ((x * 3 + y * 5) % 17 === 0) {
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(screenX + 20, screenY + 20, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // 2. Draw Decorative Features (Plaza Fountain, Trees, Streetlamps)
  renderPlazaFountain(ctx, cameraX, cameraY, canvasWidth, canvasHeight);
  renderTreesAndDecorations(ctx, cameraX, cameraY, canvasWidth, canvasHeight);

  // 3. Draw Buildings with 3D Depth, Windows, and Glowing Neon Signage
  BUILDINGS.forEach((bldg) => {
    renderBuilding(ctx, bldg, cameraX, cameraY, canvasWidth, canvasHeight, bldg.id === activeBuildingId);
  });
}

function renderPlazaFountain(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number
) {
  // Center fountain in Plaza at (24.5, 17.5) tiles
  const centerX = 24.5 * TILE_SIZE - cameraX + canvasWidth / 2;
  const centerY = 17.5 * TILE_SIZE - cameraY + canvasHeight / 2;

  // Outer stone rim
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 38, 0, Math.PI * 2);
  ctx.fill();

  // Water pool
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 32, 0, Math.PI * 2);
  ctx.fill();

  // Water shimmer
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
  ctx.fill();

  // Center spout & gold coin pedestal
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
  ctx.fill();

  // Animated splash droplets
  const t = Date.now() / 400;
  for (let i = 0; i < 4; i++) {
    const angle = t + (i * Math.PI) / 2;
    const dropX = centerX + Math.cos(angle) * 14;
    const dropY = centerY + Math.sin(angle) * 14;
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(dropX - 2, dropY - 2, 4, 4);
  }
}

function renderTreesAndDecorations(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number
) {
  const treeCoords = [
    { x: 5, y: 5 }, { x: 7, y: 5 }, { x: 5, y: 15 }, { x: 5, y: 18 },
    { x: 21, y: 14 }, { x: 27, y: 14 }, { x: 21, y: 21 }, { x: 27, y: 21 },
    { x: 32, y: 5 }, { x: 41, y: 5 }, { x: 43, y: 7 }, { x: 32, y: 27 },
    { x: 12, y: 27 }, { x: 5, y: 29 }, { x: 22, y: 31 }, { x: 26, y: 31 },
  ];

  treeCoords.forEach(({ x, y }) => {
    const screenX = x * TILE_SIZE - cameraX + canvasWidth / 2;
    const screenY = y * TILE_SIZE - cameraY + canvasHeight / 2;

    // Tree shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(screenX + 20, screenY + 34, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Trunk
    ctx.fillStyle = '#78350f';
    ctx.fillRect(screenX + 16, screenY + 18, 8, 16);

    // Foliage layers
    ctx.fillStyle = '#047857';
    ctx.beginPath();
    ctx.arc(screenX + 20, screenY + 14, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(screenX + 18, screenY + 10, 13, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderBuilding(
  ctx: CanvasRenderingContext2D,
  bldg: BuildingEntrance,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number,
  isHighlighted: boolean
) {
  // Building spans 4 tiles wide x 3 tiles high
  const bldgWidth = 4 * TILE_SIZE;
  const bldgHeight = 3 * TILE_SIZE;
  const topLeftX = (bldg.tileX - 1.5) * TILE_SIZE - cameraX + canvasWidth / 2;
  const topLeftY = (bldg.tileY - 2.5) * TILE_SIZE - cameraY + canvasHeight / 2;

  // 1. Soft Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.roundRect(topLeftX - 4, topLeftY + bldgHeight - 10, bldgWidth + 8, 20, 8);
  ctx.fill();

  // 2. Main Facade Wall
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(topLeftX, topLeftY, bldgWidth, bldgHeight, 10);
  ctx.fill();

  // Front accent border
  ctx.strokeStyle = isHighlighted ? '#34d399' : bldg.color;
  ctx.lineWidth = isHighlighted ? 3 : 2;
  ctx.stroke();

  // 3. Roof Parapet
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(topLeftX + 4, topLeftY + 4, bldgWidth - 8, 24, 6);
  ctx.fill();

  // 4. Glowing Neon Sign & Icon
  ctx.fillStyle = bldg.color;
  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(bldg.name.split(' ')[0].toUpperCase(), topLeftX + bldgWidth / 2, topLeftY + 20);

  // 5. Windows with Warm Light
  const windowCols = 4;
  for (let c = 0; c < windowCols; c++) {
    const winX = topLeftX + 16 + c * 34;
    const winY = topLeftY + 38;
    ctx.fillStyle = '#fef08a'; // warm yellow light
    ctx.fillRect(winX, winY, 20, 18);
    // Window mullions
    ctx.fillStyle = '#334155';
    ctx.fillRect(winX + 9, winY, 2, 18);
    ctx.fillRect(winX, winY + 8, 20, 2);
  }

  // 6. Glowing Entrance Doorway
  const doorWidth = 32;
  const doorHeight = 44;
  const doorX = topLeftX + (bldgWidth - doorWidth) / 2;
  const doorY = topLeftY + bldgHeight - doorHeight;

  ctx.fillStyle = isHighlighted ? '#10b981' : '#334155';
  ctx.beginPath();
  ctx.roundRect(doorX, doorY, doorWidth, doorHeight, [6, 6, 0, 0]);
  ctx.fill();

  // Glowing Door Threshold / Carpet
  ctx.fillStyle = bldg.color;
  ctx.fillRect(doorX + 2, doorY + doorHeight - 4, doorWidth - 4, 4);

  // Door Icon
  ctx.font = '16px serif';
  ctx.fillText(bldg.icon, doorX + doorWidth / 2, doorY + 26);

  // Floating Label Banner above building
  const bannerY = topLeftY - 12;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = isHighlighted ? '#10b981' : 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  const textWidth = ctx.measureText(bldg.name).width;
  ctx.beginPath();
  ctx.roundRect(topLeftX + bldgWidth / 2 - textWidth / 2 - 10, bannerY - 14, textWidth + 20, 22, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(bldg.name, topLeftX + bldgWidth / 2, bannerY + 1);

  // If highlighted, pulse "PRESS [E] OR CLICK TO ENTER" prompt
  if (isHighlighted) {
    const pulseOffset = Math.sin(Date.now() / 200) * 4;
    ctx.fillStyle = '#10b981';
    ctx.font = 'extrabold 10px monospace';
    ctx.fillText('▼ ENTER [E] / TAP ▼', topLeftX + bldgWidth / 2, doorY - 8 + pulseOffset);
  }
}
