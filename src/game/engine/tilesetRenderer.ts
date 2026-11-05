import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, BUILDINGS, BuildingEntrance } from '../world/mapData';

/**
 * Procedural Canvas 2D World Renderer for Prosperity City Metropolis.
 * Expansive 64x50 map with rich 2.5D architectural styles:
 * - Animated Wall Street LED stock ticker
 * - Parked cars at Prestige Motors
 * - Cascading marble plaza fountain & water reflections
 * - Chimney smoke on residential houses
 * - Street crosswalks, avenue lanes, curbs & streetlamps
 * - Distinct custom architectural rendering for all 13 landmark buildings
 */

export function renderWorldMap(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number,
  activeBuildingId: string | null,
  questTargetBuildingId?: string | null
) {
  // Clear canvas
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Visible tile range with 2-tile margin
  const startTileX = Math.max(0, Math.floor((cameraX - canvasWidth / 2) / TILE_SIZE) - 2);
  const endTileX = Math.min(MAP_WIDTH, Math.ceil((cameraX + canvasWidth / 2) / TILE_SIZE) + 2);
  const startTileY = Math.max(0, Math.floor((cameraY - canvasHeight / 2) / TILE_SIZE) - 2);
  const endTileY = Math.min(MAP_HEIGHT, Math.ceil((cameraY + canvasHeight / 2) / TILE_SIZE) + 2);

  const time = Date.now() / 1000;

  // 1. Draw Base Terrain: Roads, Sidewalks, Plaza, Grass & Water
  for (let y = startTileY; y < endTileY; y++) {
    for (let x = startTileX; x < endTileX; x++) {
      const screenX = x * TILE_SIZE - cameraX + canvasWidth / 2;
      const screenY = y * TILE_SIZE - cameraY + canvasHeight / 2;

      // Urban layout definitions on 64x50 grid:
      // Avenues (Horizontal)
      const isRoadH = (y >= 13 && y <= 14) || (y >= 29 && y <= 30) || (y >= 41 && y <= 42);
      const isSidewalkH = y === 12 || y === 15 || y === 28 || y === 31 || y === 40 || y === 43;

      // Streets (Vertical)
      const isRoadV = (x >= 15 && x <= 16) || (x >= 27 && x <= 28) || (x >= 41 && x <= 42) || (x >= 51 && x <= 52);
      const isSidewalkV = x === 14 || x === 17 || x === 26 || x === 29 || x === 40 || x === 43 || x === 50 || x === 53;

      // Central Plaza
      const isPlaza = x >= 24 && x <= 34 && y >= 16 && y <= 24;

      // Water Pier (Oceanfront on east side)
      const isWater = x >= 54;
      const isBoardwalk = x >= 53 && x <= 58 && y >= 18 && y <= 26;

      if (isWater) {
        // Ocean Waterfront with animated waves
        ctx.fillStyle = '#0369a1';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

        // Animated wave ripples
        const waveOffset = Math.sin(time * 2 + (x * 0.5) + (y * 0.8)) * 3;
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(screenX + 6, screenY + 12 + waveOffset, 16, 2.5);
        ctx.fillRect(screenX + 22, screenY + 28 - waveOffset, 12, 2);

        // Seafoam highlights
        if ((x + y) % 3 === 0) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fillRect(screenX + 14, screenY + 18 + waveOffset, 8, 1.5);
        }

        // Wooden Boardwalk Pier
        if (isBoardwalk) {
          ctx.fillStyle = '#78350f'; // Dark wood
          ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#92400e'; // Plank surface
          ctx.fillRect(screenX + 1, screenY + 1, TILE_SIZE - 2, TILE_SIZE - 2);
          // Plank lines
          ctx.fillStyle = '#451a03';
          ctx.fillRect(screenX, screenY + 8, TILE_SIZE, 1.5);
          ctx.fillRect(screenX, screenY + 20, TILE_SIZE, 1.5);
          ctx.fillRect(screenX, screenY + 32, TILE_SIZE, 1.5);
        }
      } else if (isRoadH || isRoadV) {
        // High-detail Asphalt Road
        ctx.fillStyle = '#18202f';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

        // Asphalt texture micro-lines
        ctx.fillStyle = '#1e293b';
        if ((x + y) % 2 === 0) {
          ctx.fillRect(screenX + 4, screenY + 6, 8, 2);
          ctx.fillRect(screenX + 24, screenY + 22, 10, 2);
        }

        // Road Intersections: Pedestrian Zebra Crosswalks
        const isIntersection = (isRoadH && isRoadV);
        if (isIntersection) {
          // Crosswalk white stripes
          ctx.fillStyle = '#f8fafc';
          for (let i = 2; i < TILE_SIZE; i += 8) {
            ctx.fillRect(screenX + i, screenY + 4, 4, TILE_SIZE - 8);
          }
        } else {
          // Yellow double divider line
          ctx.fillStyle = '#facc15';
          if (isRoadH && (y === 13 || y === 29 || y === 41) && (x % 2 === 0)) {
            ctx.fillRect(screenX + 2, screenY + TILE_SIZE - 3, TILE_SIZE - 4, 3);
          }
          if (isRoadV && (x === 15 || x === 27 || x === 41 || x === 51) && (y % 2 === 0)) {
            ctx.fillRect(screenX + TILE_SIZE - 3, screenY + 2, 3, TILE_SIZE - 4);
          }
        }
      } else if (isSidewalkH || isSidewalkV) {
        // Sidewalk paving stones with beveled borders
        ctx.fillStyle = '#334155';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(screenX + 2, screenY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.strokeRect(screenX + 0.5, screenY + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
      } else if (isPlaza) {
        // Grand Central Plaza Herringbone Stone Brick
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#0d5952';
        ctx.fillRect(screenX + 2, screenY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        // Ornamental gold square inlay on alternating tiles
        if ((x + y) % 3 === 0) {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(screenX + 16, screenY + 16, 8, 8);
        }
      } else {
        // Lush Parks & Lawns
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

        // Grass blades & blooming wildflowers
        if ((x * 5 + y * 7) % 9 === 0) {
          ctx.fillStyle = '#10b981';
          ctx.fillRect(screenX + 8, screenY + 12, 3, 8);
          ctx.fillRect(screenX + 13, screenY + 8, 3, 12);
        }
        if ((x * 11 + y * 13) % 17 === 0) {
          // Colorful flower petals (red, yellow, purple)
          const flowerColors = ['#f43f5e', '#fbbf24', '#a855f7', '#38bdf8'];
          ctx.fillStyle = flowerColors[(x + y) % flowerColors.length];
          ctx.beginPath();
          ctx.arc(screenX + 20, screenY + 20, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // 2. Draw Environmental Features: Plaza Fountain, Trees, Park Benches, Wind Turbines
  renderPlazaFountain(ctx, cameraX, cameraY, canvasWidth, canvasHeight);
  renderCityGreeneryAndProps(ctx, cameraX, cameraY, canvasWidth, canvasHeight);
  renderCleanEnergyWindmills(ctx, cameraX, cameraY, canvasWidth, canvasHeight);

  // 3. Draw All 13 Distinct Buildings with 2.5D Customized Architecture
  BUILDINGS.forEach((bldg) => {
    const isHighlighted = bldg.id === activeBuildingId;
    const isQuestTarget = bldg.id === questTargetBuildingId;
    renderSpecializedBuilding(
      ctx,
      bldg,
      cameraX,
      cameraY,
      canvasWidth,
      canvasHeight,
      isHighlighted,
      isQuestTarget
    );
  });
}

/**
 * Multi-Tier Italian Marble Plaza Fountain with Water Reflections
 */
function renderPlazaFountain(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number
) {
  const centerX = 30 * TILE_SIZE - cameraX + canvasWidth / 2;
  const centerY = 20 * TILE_SIZE - cameraY + canvasHeight / 2;

  // Outer Grand Basin Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + 28, 56, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Outer Granite Rim
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 48, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 44, 0, Math.PI * 2);
  ctx.fill();

  // Water Pool
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 38, 0, Math.PI * 2);
  ctx.fill();

  // Middle Marble Tier
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0ea5e9';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
  ctx.fill();

  // Top Pedestal & Golden Compounding Spout
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
  ctx.fill();

  // Animated Water Sprays & Splashes
  const t = Date.now() / 350;
  for (let i = 0; i < 6; i++) {
    const angle = t + (i * Math.PI) / 3;
    const sprayDist = 28 + Math.sin(t * 3 + i) * 6;
    const dropX = centerX + Math.cos(angle) * sprayDist;
    const dropY = centerY + Math.sin(angle) * sprayDist;

    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.arc(dropX, dropY, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Freedom Bell Banner on Fountain
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(centerX - 50, centerY + 52, 100, 18, 6);
  ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🔔 FOUNTAIN OF FREEDOM', centerX, centerY + 64);
}

/**
 * Clean Energy Wind Farm (Eco Outskirts in SW corner)
 */
function renderCleanEnergyWindmills(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number
) {
  const windmillCoords = [{ x: 5, y: 44 }, { x: 7, y: 47 }];
  const t = Date.now() / 600;

  windmillCoords.forEach(({ x, y }) => {
    const screenX = x * TILE_SIZE - cameraX + canvasWidth / 2;
    const screenY = y * TILE_SIZE - cameraY + canvasHeight / 2;

    // Tower base
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(screenX + 16, screenY + 36);
    ctx.lineTo(screenX + 24, screenY + 36);
    ctx.lineTo(screenX + 21, screenY - 10);
    ctx.lineTo(screenX + 19, screenY - 10);
    ctx.closePath();
    ctx.fill();

    // Nacelle hub
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(screenX + 20, screenY - 10, 5, 0, Math.PI * 2);
    ctx.fill();

    // 3 Spinning blades
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2.5;
    for (let b = 0; b < 3; b++) {
      const bladeAngle = t + (b * Math.PI * 2) / 3;
      const endX = screenX + 20 + Math.cos(bladeAngle) * 26;
      const endY = screenY - 10 + Math.sin(bladeAngle) * 26;
      ctx.beginPath();
      ctx.moveTo(screenX + 20, screenY - 10);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  });
}

/**
 * City Trees, Park Benches & Street Props
 */
function renderCityGreeneryAndProps(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number
) {
  // Trees spread across parks and sidewalks
  const trees = [
    { x: 4, y: 8 }, { x: 7, y: 6 }, { x: 12, y: 6 },
    { x: 19, y: 6 }, { x: 30, y: 6 }, { x: 42, y: 6 },
    { x: 4, y: 20 }, { x: 7, y: 23 }, { x: 4, y: 34 },
    { x: 22, y: 17 }, { x: 22, y: 23 }, { x: 36, y: 17 }, { x: 36, y: 23 },
    { x: 20, y: 46 }, { x: 28, y: 46 }, { x: 36, y: 46 }, { x: 48, y: 46 },
  ];

  trees.forEach(({ x, y }) => {
    const screenX = x * TILE_SIZE - cameraX + canvasWidth / 2;
    const screenY = y * TILE_SIZE - cameraY + canvasHeight / 2;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(screenX + 20, screenY + 36, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Trunk
    ctx.fillStyle = '#78350f';
    ctx.fillRect(screenX + 17, screenY + 20, 6, 16);

    // Foliage 3D spheres
    ctx.fillStyle = '#047857';
    ctx.beginPath();
    ctx.arc(screenX + 20, screenY + 14, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(screenX + 17, screenY + 10, 13, 0, Math.PI * 2);
    ctx.fill();

    // Apple / Blossom dots
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(screenX + 14, screenY + 8, 2, 0, Math.PI * 2);
    ctx.arc(screenX + 24, screenY + 12, 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

/**
 * Specialized 2.5D Building Renderer based on Type
 */
function renderSpecializedBuilding(
  ctx: CanvasRenderingContext2D,
  bldg: BuildingEntrance,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number,
  isHighlighted: boolean,
  isQuestTarget: boolean
) {
  const bldgWidth = 5 * TILE_SIZE; // 200px wide
  const bldgHeight = 3.5 * TILE_SIZE; // 140px tall
  const topLeftX = (bldg.tileX - 2) * TILE_SIZE - cameraX + canvasWidth / 2;
  const topLeftY = (bldg.tileY - 2.8) * TILE_SIZE - cameraY + canvasHeight / 2;

  // Frustum Culling
  if (
    topLeftX + bldgWidth < -50 ||
    topLeftX > canvasWidth + 50 ||
    topLeftY + bldgHeight < -50 ||
    topLeftY > canvasHeight + 50
  ) {
    return;
  }

  // 1. In-World Golden Quest Waypoint Pillar of Light
  if (isQuestTarget) {
    const beamPulse = Math.sin(Date.now() / 200) * 0.15 + 0.35;
    const grad = ctx.createLinearGradient(0, topLeftY - 140, 0, topLeftY + bldgHeight);
    grad.addColorStop(0, 'rgba(245, 158, 11, 0)');
    grad.addColorStop(0.5, `rgba(245, 158, 11, ${beamPulse})`);
    grad.addColorStop(1, 'rgba(245, 158, 11, 0.7)');

    ctx.fillStyle = grad;
    ctx.fillRect(topLeftX + bldgWidth / 2 - 20, topLeftY - 120, 40, bldgHeight + 120);

    // Pulsing ground circle ring
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(topLeftX + bldgWidth / 2, topLeftY + bldgHeight - 5, 36, 12, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 2. Base Soft Building Drop Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.beginPath();
  ctx.roundRect(topLeftX - 6, topLeftY + bldgHeight - 12, bldgWidth + 12, 24, 10);
  ctx.fill();

  // 3. Render Architectural Structure by Building Type
  switch (bldg.type) {
    case 'STOCK_EXCHANGE':
      renderStockExchangeFacade(ctx, topLeftX, topLeftY, bldgWidth, bldgHeight, bldg, isHighlighted);
      break;
    case 'BANK':
      renderBankFacade(ctx, topLeftX, topLeftY, bldgWidth, bldgHeight, bldg, isHighlighted);
      break;
    case 'CAREER_TOWER':
      renderCareerSkyscraperFacade(ctx, topLeftX, topLeftY, bldgWidth, bldgHeight, bldg, isHighlighted);
      break;
    case 'AUTO_DEALER':
      renderAutoDealerFacade(ctx, topLeftX, topLeftY, bldgWidth, bldgHeight, bldg, isHighlighted);
      break;
    case 'SUPERSTORE':
      renderSupermarketFacade(ctx, topLeftX, topLeftY, bldgWidth, bldgHeight, bldg, isHighlighted);
      break;
    case 'HOME':
    case 'RENTAL_PROPERTY':
      renderResidentialHomeFacade(ctx, topLeftX, topLeftY, bldgWidth, bldgHeight, bldg, isHighlighted);
      break;
    case 'CRYPTO_LOUNGE':
      renderCryptoArcadeFacade(ctx, topLeftX, topLeftY, bldgWidth, bldgHeight, bldg, isHighlighted);
      break;
    case 'CAFE':
      renderCafeFacade(ctx, topLeftX, topLeftY, bldgWidth, bldgHeight, bldg, isHighlighted);
      break;
    default:
      renderModernCivicFacade(ctx, topLeftX, topLeftY, bldgWidth, bldgHeight, bldg, isHighlighted);
      break;
  }

  // 4. Floating Header Title Banner Above Building
  const bannerY = topLeftY - 14;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = isHighlighted ? '#10b981' : (isQuestTarget ? '#f59e0b' : 'rgba(255, 255, 255, 0.25)');
  ctx.lineWidth = isHighlighted || isQuestTarget ? 2 : 1;

  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  const titleText = `${bldg.icon} ${bldg.name}`;
  const textWidth = ctx.measureText(titleText).width;

  ctx.beginPath();
  ctx.roundRect(topLeftX + bldgWidth / 2 - textWidth / 2 - 12, bannerY - 14, textWidth + 24, 24, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isQuestTarget ? '#fbbf24' : '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(titleText, topLeftX + bldgWidth / 2, bannerY + 2);

  // 5. Interaction Indicator / Quest Target Pulse
  if (isHighlighted) {
    const pulseOffset = Math.sin(Date.now() / 180) * 4;
    ctx.fillStyle = '#34d399';
    ctx.font = 'extrabold 10px monospace';
    ctx.fillText('▼ ENTER [E] / TAP ▼', topLeftX + bldgWidth / 2, topLeftY + bldgHeight - 8 + pulseOffset);
  } else if (isQuestTarget) {
    const pulseOffset = Math.sin(Date.now() / 220) * 3;
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'extrabold 9px monospace';
    ctx.fillText('★ ACTIVE QUEST GOAL ★', topLeftX + bldgWidth / 2, bannerY - 18 + pulseOffset);
  }
}

/**
 * 1. Wall Street Stock Exchange Facade
 * Neoclassical columns, Golden Bull statue & Real-Time Animated Digital LED Ticker Marquee!
 */
function renderStockExchangeFacade(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bldg: BuildingEntrance,
  isHighlighted: boolean
) {
  // Marble Base & Walls
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(x, y + 20, w, h - 20, 8);
  ctx.fill();

  // Neoclassical Triangular Pediment Roof
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.moveTo(x - 4, y + 22);
  ctx.lineTo(x + w / 2, y - 10);
  ctx.lineTo(x + w + 4, y + 22);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#64748b';
  ctx.stroke();

  // Golden Bull Medallion in Pediment
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(x + w / 2, y + 8, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1e293b';
  ctx.font = '10px serif';
  ctx.textAlign = 'center';
  ctx.fillText('🐂', x + w / 2, y + 12);

  // 4 Grand Marble Columns
  const columnCols = [x + 22, x + 70, x + 120, x + 168];
  columnCols.forEach((colX) => {
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(colX, y + 22, 10, h - 56);
    // Column capital & base
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(colX - 2, y + 22, 14, 4);
    ctx.fillRect(colX - 2, y + h - 38, 14, 4);
  });

  // Animated LED Stock Ticker Screen Marquee
  const tickerY = y + 36;
  const tickerH = 20;
  ctx.fillStyle = '#020617';
  ctx.fillRect(x + 10, tickerY, w - 20, tickerH);
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 10, tickerY, w - 20, tickerH);

  // Scrolling stock text
  ctx.save();
  ctx.beginPath();
  ctx.rect(x + 12, tickerY, w - 24, tickerH);
  ctx.clip();

  const tickerText = '▲ VOO $512.40 (+1.4%)   ▲ AAPL $234.10 (+2.1%)   ▼ TSLA $218.50 (-1.8%)   ▲ BTC $88,400 (+4.6%)   ▲ SPY $580.10 (+1.1%)   ';
  const scrollOffset = (Date.now() / 25) % 650;

  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = '#22c55e';
  ctx.fillText(tickerText + tickerText, x + w - scrollOffset, tickerY + 14);
  ctx.restore();

  // Grand Entrance Steps & Double Doors
  renderGrandDoubleDoor(ctx, x + w / 2 - 18, y + h - 44, 36, 44, isHighlighted ? '#10b981' : '#06b6d4');
}

/**
 * 2. First Prosperity Bank & Vault Facade
 * Heavy Circular Vault Gear visible behind security glass & 4.5% APY Badge
 */
function renderBankFacade(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bldg: BuildingEntrance,
  isHighlighted: boolean
) {
  // Granite & Bronze Walls
  ctx.fillStyle = '#064e3b';
  ctx.beginPath();
  ctx.roundRect(x, y + 10, w, h - 10, 8);
  ctx.fill();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Roof Cresting & Emblem
  ctx.fillStyle = '#022c22';
  ctx.fillRect(x + 10, y + 14, w - 20, 20);

  ctx.fillStyle = '#34d399';
  ctx.font = 'black 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('FIRST PROSPERITY BANK • 4.5% APY VAULT', x + w / 2, y + 28);

  // Visible Steel Vault Door on Left Side
  const vaultCenterX = x + 40;
  const vaultCenterY = y + 74;

  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.arc(vaultCenterX, vaultCenterY, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Vault spoke wheel
  const t = Date.now() / 1000;
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  for (let s = 0; s < 4; s++) {
    const angle = t * 0.4 + (s * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(vaultCenterX - Math.cos(angle) * 16, vaultCenterY - Math.sin(angle) * 16);
    ctx.lineTo(vaultCenterX + Math.cos(angle) * 16, vaultCenterY + Math.sin(angle) * 16);
    ctx.stroke();
  }

  // Right Side Teller Windows
  for (let r = 0; r < 2; r++) {
    const winX = x + 130 + r * 34;
    const winY = y + 54;
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(winX, winY, 22, 28);
    ctx.strokeStyle = '#064e3b';
    ctx.strokeRect(winX, winY, 22, 28);
  }

  // Main Teller Entrance
  renderGrandDoubleDoor(ctx, x + 88, y + h - 44, 34, 44, isHighlighted ? '#34d399' : '#10b981');
}

/**
 * 3. Apex Career Tower Facade
 * 7-Story Modern Glass Skyscraper with Communications Mast & Blinking Beacon
 */
function renderCareerSkyscraperFacade(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bldg: BuildingEntrance,
  isHighlighted: boolean
) {
  // Tall Skyscraper Body
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(x + 10, y - 20, w - 20, h + 20, 8);
  ctx.fill();

  // Reflective Glass Panels (Grid of Cyan Windows)
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 6; col++) {
      const winX = x + 22 + col * 26;
      const winY = y - 10 + row * 22;
      ctx.fillStyle = (row + col) % 3 === 0 ? '#38bdf8' : '#0284c7';
      ctx.fillRect(winX, winY, 18, 14);
    }
  }

  // Rooftop Antenna Mast with Blinking Red Aviation Beacon
  const mastX = x + w / 2;
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(mastX, y - 20);
  ctx.lineTo(mastX, y - 48);
  ctx.stroke();

  // Blinking red beacon
  const beaconBlink = Math.sin(Date.now() / 250) > 0.1;
  ctx.fillStyle = beaconBlink ? '#ef4444' : '#7f1d1d';
  ctx.beginPath();
  ctx.arc(mastX, y - 48, 4, 0, Math.PI * 2);
  ctx.fill();
  if (beaconBlink) {
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.beginPath();
    ctx.arc(mastX, y - 48, 8, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Revolving Glass Double Doors
  renderGrandDoubleDoor(ctx, x + w / 2 - 18, y + h - 44, 36, 44, isHighlighted ? '#10b981' : '#3b82f6');
}

/**
 * 4. Prestige Motors Facade & Outdoor Car Lot with Parked Vector Cars
 */
function renderAutoDealerFacade(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bldg: BuildingEntrance,
  isHighlighted: boolean
) {
  // Showroom Building (Right 50%)
  const showX = x + 80;
  const showW = w - 80;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(showX, y + 10, showW, h - 10);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.strokeRect(showX, y + 10, showW, h - 10);

  // Showroom Glass Wall with Checkered Floor visible
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(showX + 8, y + 30, showW - 16, 40);

  // Left outdoor lot with 2 parked cars
  // 1. Red Sports Coupe (Upper)
  renderVectorCar(ctx, x + 8, y + 26, '#ef4444', '🏎️');
  // 2. Reliable Blue Sedan (Lower)
  renderVectorCar(ctx, x + 8, y + 74, '#3b82f6', '🚗');

  // Festive Bunting Flags across outdoor lot
  ctx.strokeStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(x + 4, y + 16);
  ctx.quadraticCurveTo(x + 40, y + 24, showX, y + 16);
  ctx.stroke();

  // Entrance
  renderGrandDoubleDoor(ctx, showX + showW / 2 - 16, y + h - 42, 32, 42, isHighlighted ? '#10b981' : '#ef4444');
}

/**
 * Helper to render a compact vector car sprite in the lot
 */
function renderVectorCar(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, emoji: string) {
  // Car shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(x + 28, y + 24, 28, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Car chassis
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y + 8, 56, 16, 4);
  ctx.fill();

  // Cabin
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(x + 14, y, 28, 12, [4, 4, 0, 0]);
  ctx.fill();

  // Wheels
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x + 6, y + 20, 10, 6);
  ctx.fillRect(x + 40, y + 20, 10, 6);

  // Headlight glow
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(x + 54, y + 12, 3, 4);
}

/**
 * 5. MegaMart Supermarket Facade
 * Striped Awning, Produce crates & Yellow Neon Marquee
 */
function renderSupermarketFacade(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bldg: BuildingEntrance,
  isHighlighted: boolean
) {
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x, y + 10, w, h - 10);

  // Large Red-and-White Striped Awning
  const awningH = 22;
  const awningY = y + 26;
  const stripeW = 14;
  for (let s = 0; s < w / stripeW; s++) {
    ctx.fillStyle = s % 2 === 0 ? '#ef4444' : '#f8fafc';
    ctx.fillRect(x + s * stripeW, awningY, stripeW, awningH);
  }

  // Neon Yellow Banner
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'black 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🛒 MEGAMART • UNIT PRICING SAVER', x + w / 2, y + 20);

  // Sliding Automatic Double Doors
  renderGrandDoubleDoor(ctx, x + w / 2 - 20, y + h - 44, 40, 44, isHighlighted ? '#10b981' : '#f59e0b');
}

/**
 * 6. Residential Homes & Turnkey Duplex
 * Pitched Shingle Roof, Red Brick Chimney with Rising Smoke Puffs, & For Sale / Sold Sign!
 */
function renderResidentialHomeFacade(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bldg: BuildingEntrance,
  isHighlighted: boolean
) {
  // Main House Body (Brick or siding)
  ctx.fillStyle = bldg.isOwnedByPlayer ? '#065f46' : '#1e293b';
  ctx.fillRect(x + 10, y + 30, w - 20, h - 30);

  // Pitched Shingle Roof
  ctx.fillStyle = '#7f1d1d'; // Crimson shingle
  ctx.beginPath();
  ctx.moveTo(x + 4, y + 32);
  ctx.lineTo(x + w / 2, y - 6);
  ctx.lineTo(x + w - 4, y + 32);
  ctx.closePath();
  ctx.fill();

  // Roof Shingle Horizontal Lines
  ctx.strokeStyle = '#991b1b';
  ctx.lineWidth = 1.5;
  for (let sl = 1; sl <= 3; sl++) {
    const ly = y + 32 - sl * 9;
    const inset = sl * 18;
    ctx.beginPath();
    ctx.moveTo(x + 4 + inset, ly);
    ctx.lineTo(x + w - 4 - inset, ly);
    ctx.stroke();
  }

  // Brick Chimney with Animated Smoke Puffs!
  const chimneyX = x + w - 38;
  const chimneyY = y - 18;
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(chimneyX, chimneyY, 14, 28);

  // Smoke puffs drifting up
  const t = Date.now() / 400;
  for (let p = 0; p < 3; p++) {
    const puffAge = (t + p * 1.2) % 3.6;
    const puffY = chimneyY - puffAge * 10;
    const puffX = chimneyX + 7 + Math.sin(puffAge * 2) * 5 + puffAge * 3;
    const puffAlpha = Math.max(0, 0.6 - puffAge * 0.15);

    ctx.fillStyle = `rgba(226, 232, 240, ${puffAlpha})`;
    ctx.beginPath();
    ctx.arc(puffX, puffY, 4 + puffAge * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Front Porch & Windows with Warm Light
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(x + 28, y + 46, 20, 20);
  ctx.fillRect(x + w - 48, y + 46, 20, 20);

  // Dynamic Real Estate Yard Sign
  const signX = x + 16;
  const signY = y + h - 34;

  ctx.fillStyle = '#78350f'; // wooden post
  ctx.fillRect(signX + 18, signY + 16, 4, 18);

  ctx.fillStyle = bldg.isOwnedByPlayer ? '#065f46' : '#991b1b';
  ctx.beginPath();
  ctx.roundRect(signX, signY, 42, 20, 4);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 7px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(bldg.isOwnedByPlayer ? 'OWNED' : 'FOR SALE', signX + 21, signY + 10);
  ctx.fillText(bldg.isOwnedByPlayer ? '+$2.4k/mo' : '$320k', signX + 21, signY + 17);

  // Front Door
  renderGrandDoubleDoor(ctx, x + w / 2 - 14, y + h - 38, 28, 38, isHighlighted ? '#10b981' : '#ec4899');
}

/**
 * 7. Cyberpunk Web3 Pier Arcade Facade
 * Neon Purple Trim & Rotating 3D Golden Bitcoin Logo
 */
function renderCryptoArcadeFacade(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bldg: BuildingEntrance,
  isHighlighted: boolean
) {
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(x, y + 10, w, h - 10, 8);
  ctx.fill();
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Spinning Golden Bitcoin Emblem above Entrance
  const coinX = x + w / 2;
  const coinY = y - 4;
  const t = Date.now() / 300;
  const coinScaleX = Math.cos(t);

  ctx.save();
  ctx.translate(coinX, coinY);
  ctx.scale(Math.abs(coinScaleX), 1);
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('₿', 0, 5);
  ctx.restore();

  // Neon Arcade Entrance
  renderGrandDoubleDoor(ctx, x + w / 2 - 18, y + h - 44, 36, 44, isHighlighted ? '#34d399' : '#a855f7');
}

/**
 * 8. The Daily Grind Cafe Facade
 * Striped Awning, Outdoor Cafe Table & Steaming Mug
 */
function renderCafeFacade(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bldg: BuildingEntrance,
  isHighlighted: boolean
) {
  ctx.fillStyle = '#292524';
  ctx.fillRect(x, y + 14, w, h - 14);

  // Warm Amber Awning
  ctx.fillStyle = '#d97706';
  ctx.fillRect(x, y + 18, w, 16);

  // Steaming Mug Sign
  ctx.fillStyle = '#ffffff';
  ctx.font = '16px serif';
  ctx.textAlign = 'center';
  ctx.fillText('☕', x + w / 2, y + 12);

  // Outdoor Patio Table
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.arc(x + 36, y + h - 18, 12, 0, Math.PI * 2);
  ctx.fill();

  renderGrandDoubleDoor(ctx, x + w / 2 - 16, y + h - 40, 32, 40, isHighlighted ? '#10b981' : '#d97706');
}

/**
 * Modern Civic / University / Clinic Generic Facade
 */
function renderModernCivicFacade(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bldg: BuildingEntrance,
  isHighlighted: boolean
) {
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(x, y + 10, w, h - 10, 8);
  ctx.fill();
  ctx.strokeStyle = bldg.color;
  ctx.lineWidth = isHighlighted ? 3 : 2;
  ctx.stroke();

  // Windows
  for (let c = 0; c < 4; c++) {
    const winX = x + 20 + c * 42;
    const winY = y + 36;
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(winX, winY, 24, 20);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(winX, winY, 24, 20);
  }

  renderGrandDoubleDoor(ctx, x + w / 2 - 18, y + h - 44, 36, 44, isHighlighted ? '#10b981' : bldg.color);
}

/**
 * Universal Grand Double Doorway with Glowing Carpet
 */
function renderGrandDoubleDoor(
  ctx: CanvasRenderingContext2D,
  doorX: number,
  doorY: number,
  doorW: number,
  doorH: number,
  accentColor: string
) {
  // Door frame
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(doorX, doorY, doorW, doorH, [6, 6, 0, 0]);
  ctx.fill();

  // Door panels
  ctx.fillStyle = '#334155';
  ctx.fillRect(doorX + 2, doorY + 2, doorW / 2 - 3, doorH - 6);
  ctx.fillRect(doorX + doorW / 2 + 1, doorY + 2, doorW / 2 - 3, doorH - 6);

  // Brass door handles
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(doorX + doorW / 2 - 3, doorY + doorH / 2 - 3, 2, 6);
  ctx.fillRect(doorX + doorW / 2 + 1, doorY + doorH / 2 - 3, 2, 6);

  // Glowing Entry Carpet
  ctx.fillStyle = accentColor;
  ctx.fillRect(doorX - 2, doorY + doorH - 4, doorW + 4, 4);
}
