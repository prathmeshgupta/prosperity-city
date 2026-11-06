import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, BUILDINGS, BuildingEntrance } from '../world/mapData';
import { STREET_PROPS, StreetProp } from '../world/streetProps';

/**
 * Procedural Canvas 2D World Renderer for Prosperity City Metropolis.
 * Expansive 96x72 map (3,840px x 2,880px) across 10 distinct districts:
 * - Animated Wall Street LED stock ticker & Federal Reserve bond yield display
 * - Multi-directional urban vehicle traffic (cars, taxis, electric sedans) strictly constrained to roads (NEVER driving into water!)
 * - Cascading marble plaza fountain & water reflections
 * - Chimney smoke on residential houses & turnkey duplexes
 * - Street crosswalks, avenue lanes, curbs, streetlamps & street trees
 * - Interactive street props: 24/7 ATMs, News Kiosks, Coffee Carts, Park Benches, Yard Signs
 * - Dedicated custom architectural 2.5D facades for ALL building types
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

  // 1. Draw Base Terrain: Roads, Sidewalks, Plaza, Grass, Beach & Ocean Water
  for (let y = startTileY; y < endTileY; y++) {
    for (let x = startTileX; x < endTileX; x++) {
      const screenX = x * TILE_SIZE - cameraX + canvasWidth / 2;
      const screenY = y * TILE_SIZE - cameraY + canvasHeight / 2;

      // Urban layout definitions on 96x72 grid:
      // Avenues (Horizontal)
      const isRoadH =
        (y >= 14 && y <= 15) ||
        (y >= 28 && y <= 29) ||
        (y >= 42 && y <= 43) ||
        (y >= 56 && y <= 57);

      const isSidewalkH =
        y === 13 || y === 16 ||
        y === 27 || y === 30 ||
        y === 41 || y === 44 ||
        y === 55 || y === 58;

      // Streets (Vertical) - Roads stop strictly before the beach (at x <= 79)
      const isRoadV =
        (x >= 16 && x <= 17) ||
        (x >= 32 && x <= 33) ||
        (x >= 44 && x <= 45) ||
        (x >= 58 && x <= 59) ||
        (x >= 68 && x <= 69) ||
        (x >= 78 && x <= 79);

      const isSidewalkV =
        x === 15 || x === 18 ||
        x === 31 || x === 34 ||
        x === 43 || x === 46 ||
        x === 57 || x === 60 ||
        x === 67 || x === 70 ||
        x === 77 || x === 80;

      // Central Town Plaza (Center)
      const isPlaza = x >= 40 && x <= 52 && y >= 20 && y <= 28;

      // Oceanfront Waterfront (East Coast)
      const isBeach = x >= 81 && x <= 83;
      const isWater = x >= 84;
      const isBoardwalk = x >= 80 && x <= 92 && y >= 24 && y <= 28;

      if (isWater) {
        // Ocean Waterfront with animated waves
        ctx.fillStyle = '#0369a1';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

        // Animated wave ripples
        const waveOffset = Math.sin(time * 2 + x * 0.5 + y * 0.8) * 3;
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
          ctx.fillStyle = '#78350f';
          ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#92400e';
          ctx.fillRect(screenX + 2, screenY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          ctx.fillStyle = '#451a03';
          ctx.fillRect(screenX, screenY + 8, TILE_SIZE, 1.5);
          ctx.fillRect(screenX, screenY + 20, TILE_SIZE, 1.5);
          ctx.fillRect(screenX, screenY + 32, TILE_SIZE, 1.5);
        }
      } else if (isBeach) {
        // Golden Sandy Beach Transition
        ctx.fillStyle = '#d97706';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(screenX + 2, screenY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        // Sand ripples
        ctx.fillStyle = '#b45309';
        ctx.fillRect(screenX + 8, screenY + 14, 12, 1.5);
        ctx.fillRect(screenX + 20, screenY + 28, 10, 1.5);
      } else if ((isRoadH || isRoadV) && x <= 79) {
        // High-detail Asphalt Road (strictly ends at x <= 79, before beach/water)
        ctx.fillStyle = '#18202f';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

        // Asphalt texture micro-lines
        ctx.fillStyle = '#1e293b';
        if ((x + y) % 2 === 0) {
          ctx.fillRect(screenX + 4, screenY + 6, 8, 2);
          ctx.fillRect(screenX + 24, screenY + 22, 10, 2);
        }

        // Road Intersections: Pedestrian Zebra Crosswalks
        const isIntersection = isRoadH && isRoadV;
        if (isIntersection) {
          ctx.fillStyle = '#f8fafc';
          for (let i = 2; i < TILE_SIZE; i += 8) {
            ctx.fillRect(screenX + i, screenY + 4, 4, TILE_SIZE - 8);
          }
        } else {
          // Yellow double divider line
          ctx.fillStyle = '#facc15';
          if (isRoadH && (y === 14 || y === 28 || y === 42 || y === 56) && x % 2 === 0) {
            ctx.fillRect(screenX + 2, screenY + TILE_SIZE - 3, TILE_SIZE - 4, 3);
          }
          if (isRoadV && (x === 16 || x === 32 || x === 44 || x === 58 || x === 68 || x === 78) && y % 2 === 0) {
            ctx.fillRect(screenX + TILE_SIZE - 3, screenY + 2, 3, TILE_SIZE - 4);
          }
        }
      } else if ((isSidewalkH || isSidewalkV) && x <= 80) {
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
          const flowerColors = ['#f43f5e', '#fbbf24', '#a855f7', '#38bdf8'];
          ctx.fillStyle = flowerColors[(x + y) % flowerColors.length];
          ctx.beginPath();
          ctx.arc(screenX + 20, screenY + 20, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // 2. Draw Environmental Features: Plaza Fountain, Trees, Park Benches, Wind Turbines, Streetlamps & Traffic
  renderPlazaFountain(ctx, cameraX, cameraY, canvasWidth, canvasHeight);
  renderCityGreeneryAndProps(ctx, cameraX, cameraY, canvasWidth, canvasHeight);
  renderStreetlampsAndGlow(ctx, cameraX, cameraY, canvasWidth, canvasHeight);
  renderCleanEnergyWindmills(ctx, cameraX, cameraY, canvasWidth, canvasHeight);
  renderStreetProps(ctx, cameraX, cameraY, canvasWidth, canvasHeight);

  // 3. Draw Ambient Traffic (Cars STRICTLY confined to asphalt roads, NEVER in water!)
  renderTrafficAndCruisingCars(ctx, cameraX, cameraY, canvasWidth, canvasHeight);

  // 4. Draw All 20 Distinct Buildings with 2.5D Customized Architecture
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
  const centerX = 46 * TILE_SIZE - cameraX + canvasWidth / 2;
  const centerY = 24 * TILE_SIZE - cameraY + canvasHeight / 2;

  // Outer Grand Basin Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + 28, 56, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tier 1: Outer Stone Basin
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + 14, 52, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + 10, 50, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Basin Water (Turquoise with shimmer)
  const time = Date.now() / 1000;
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + 10, 44, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  // Animated Water Ripples
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 1.5;
  for (let r = 10; r <= 36; r += 12) {
    const rippleRadius = (r + (time * 15) % 15);
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 10, rippleRadius, rippleRadius * 0.36, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Tier 2: Elevated Middle Basin
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY - 6, 26, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY - 8, 22, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tier 3: Golden Freedom Bell & Angel Spire at Center
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(centerX, centerY - 24, 7, 0, Math.PI * 2);
  ctx.fill();

  // Spouting Water Particles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 + time * 2;
    const sprayX = centerX + Math.cos(angle) * 16;
    const sprayY = centerY - 8 + Math.sin(angle) * 6;
    ctx.beginPath();
    ctx.arc(sprayX, sprayY, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Animated Ambient Cruising Cars on Metropolitan Avenues
 * CRITICAL FIX: Cars are strictly bounded to the road network (x from 17*40 to 78*40)!
 * They turn or reverse at road bounds and NEVER cross past x = 79 into the beach or ocean water!
 */
function renderTrafficAndCruisingCars(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number
) {
  const time = Date.now() / 1000;

  // Road boundary limits in world pixels:
  // West boundary: tile 17 * 40 = 680 px
  // East boundary: tile 78 * 40 = 3120 px (Road stops before beach at tile 81 and water at tile 84!)
  const minRoadX = 17 * TILE_SIZE;
  const maxRoadX = 78 * TILE_SIZE;
  const roadSpanX = maxRoadX - minRoadX;

  const minRoadY = 15 * TILE_SIZE;
  const maxRoadY = 57 * TILE_SIZE;
  const roadSpanY = maxRoadY - minRoadY;

  // Horizontal Cruising Cars (Avenues 1, 2, 3, 4)
  const horizontalCars = [
    // Avenue 1 Eastbound (y = 14.3)
    { id: 'c1', color: '#facc15', roofColor: '#ca8a04', speed: 110, y: 14.3 * TILE_SIZE, offset: 200, dir: 1 },
    { id: 'c2', color: '#0ea5e9', roofColor: '#0284c7', speed: 95, y: 14.3 * TILE_SIZE, offset: 1400, dir: 1 },
    // Avenue 1 Westbound (y = 15.3)
    { id: 'c3', color: '#ef4444', roofColor: '#b91c1c', speed: 105, y: 15.3 * TILE_SIZE, offset: 600, dir: -1 },
    // Avenue 2 Eastbound (y = 28.3)
    { id: 'c4', color: '#10b981', roofColor: '#047857', speed: 90, y: 28.3 * TILE_SIZE, offset: 800, dir: 1 },
    // Avenue 2 Westbound (y = 29.3)
    { id: 'c5', color: '#a855f7', roofColor: '#7e22ce', speed: 125, y: 29.3 * TILE_SIZE, offset: 1900, dir: -1 },
    // Avenue 3 Eastbound (y = 42.3)
    { id: 'c6', color: '#f97316', roofColor: '#c2410c', speed: 100, y: 42.3 * TILE_SIZE, offset: 300, dir: 1 },
    // Avenue 3 Westbound (y = 43.3)
    { id: 'c7', color: '#38bdf8', roofColor: '#0284c7', speed: 115, y: 43.3 * TILE_SIZE, offset: 1100, dir: -1 },
    // Avenue 4 Eastbound (y = 56.3)
    { id: 'c8', color: '#ec4899', roofColor: '#be185d', speed: 95, y: 56.3 * TILE_SIZE, offset: 500, dir: 1 },
  ];

  horizontalCars.forEach((car) => {
    let worldX: number;
    if (car.dir === 1) {
      worldX = minRoadX + ((time * car.speed + car.offset) % roadSpanX);
    } else {
      worldX = maxRoadX - ((time * car.speed + car.offset) % roadSpanX);
    }

    const screenX = worldX - cameraX + canvasWidth / 2;
    const screenY = car.y - cameraY + canvasHeight / 2;

    // Frustum cull
    if (screenX < -60 || screenX > canvasWidth + 60 || screenY < -40 || screenY > canvasHeight + 40) {
      return;
    }

    renderCarSprite(ctx, screenX, screenY, car.color, car.roofColor, car.dir);
  });

  // Vertical Cruising Traffic (North/South on Streets x = 32.5, 44.5, 68.5)
  const verticalCars = [
    { id: 'vc1', color: '#3b82f6', roofColor: '#1d4ed8', speed: 90, x: 32.3 * TILE_SIZE, offset: 100, dir: 1 },
    { id: 'vc2', color: '#f59e0b', roofColor: '#d97706', speed: 105, x: 44.3 * TILE_SIZE, offset: 800, dir: -1 },
    { id: 'vc3', color: '#10b981', roofColor: '#059669', speed: 85, x: 68.3 * TILE_SIZE, offset: 1500, dir: 1 },
  ];

  verticalCars.forEach((car) => {
    let worldY: number;
    if (car.dir === 1) {
      worldY = minRoadY + ((time * car.speed + car.offset) % roadSpanY);
    } else {
      worldY = maxRoadY - ((time * car.speed + car.offset) % roadSpanY);
    }

    const screenX = car.x - cameraX + canvasWidth / 2;
    const screenY = worldY - cameraY + canvasHeight / 2;

    if (screenX < -60 || screenX > canvasWidth + 60 || screenY < -40 || screenY > canvasHeight + 40) {
      return;
    }

    renderVerticalCarSprite(ctx, screenX, screenY, car.color, car.roofColor, car.dir);
  });
}

function renderCarSprite(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  color: string,
  roofColor: string,
  dir: number
) {
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(screenX + 16, screenY + 12, 18, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Car Body Chassis
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(screenX, screenY - 4, 32, 16, 4);
  ctx.fill();

  // Car Cabin / Roof
  ctx.fillStyle = roofColor;
  ctx.beginPath();
  ctx.roundRect(screenX + 6, screenY - 7, 18, 14, 3);
  ctx.fill();

  // Windshield & Lights
  ctx.fillStyle = '#bae6fd';
  if (dir === 1) {
    ctx.fillRect(screenX + 20, screenY - 5, 3, 10);
    ctx.fillRect(screenX + 7, screenY - 5, 2, 10);
    // Headlights
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(screenX + 31, screenY - 2, 2, 3);
    ctx.fillRect(screenX + 31, screenY + 7, 2, 3);
    // Taillights
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(screenX - 1, screenY - 2, 2, 3);
    ctx.fillRect(screenX - 1, screenY + 7, 2, 3);
  } else {
    ctx.fillRect(screenX + 9, screenY - 5, 3, 10);
    ctx.fillRect(screenX + 23, screenY - 5, 2, 10);
    // Headlights
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(screenX - 1, screenY - 2, 2, 3);
    ctx.fillRect(screenX - 1, screenY + 7, 2, 3);
    // Taillights
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(screenX + 31, screenY - 2, 2, 3);
    ctx.fillRect(screenX + 31, screenY + 7, 2, 3);
  }
}

function renderVerticalCarSprite(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  color: string,
  roofColor: string,
  dir: number
) {
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(screenX + 8, screenY + 16, 8, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Car Body Chassis (vertical)
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(screenX - 2, screenY, 16, 32, 4);
  ctx.fill();

  // Cabin
  ctx.fillStyle = roofColor;
  ctx.beginPath();
  ctx.roundRect(screenX + 1, screenY + 6, 10, 18, 3);
  ctx.fill();

  // Headlights
  ctx.fillStyle = '#fef08a';
  if (dir === 1) {
    ctx.fillRect(screenX, screenY + 31, 3, 2);
    ctx.fillRect(screenX + 9, screenY + 31, 3, 2);
  } else {
    ctx.fillRect(screenX, screenY - 1, 3, 2);
    ctx.fillRect(screenX + 9, screenY - 1, 3, 2);
  }
}

/**
 * Render Interactive Street Props (ATMs, News Kiosks, Coffee Carts, Benches, Yard Signs)
 */
function renderStreetProps(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number
) {
  STREET_PROPS.forEach((prop) => {
    const screenX = prop.tileX * TILE_SIZE - cameraX + canvasWidth / 2;
    const screenY = prop.tileY * TILE_SIZE - cameraY + canvasHeight / 2;

    if (screenX < -40 || screenX > canvasWidth + 40 || screenY < -40 || screenY > canvasHeight + 40) {
      return;
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(screenX + 16, screenY + 28, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    if (prop.type === 'ATM') {
      // 24/7 ATM Kiosk
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(screenX + 6, screenY + 6, 20, 24);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(screenX + 9, screenY + 9, 14, 8); // screen
      ctx.fillStyle = '#64748b';
      ctx.fillRect(screenX + 9, screenY + 19, 14, 4); // keypad
      // Glowing green top light
      ctx.fillStyle = '#34d399';
      ctx.fillRect(screenX + 11, screenY + 3, 10, 3);
    } else if (prop.type === 'NEWS_KIOSK') {
      // Financial Newsstand
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(screenX + 4, screenY + 8, 24, 22);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(screenX + 2, screenY + 4, 28, 5); // roof
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(screenX + 8, screenY + 12, 16, 12); // papers
    } else if (prop.type === 'COFFEE_CART') {
      // Artisan Coffee Cart with striped canopy
      ctx.fillStyle = '#78350f';
      ctx.fillRect(screenX + 4, screenY + 14, 24, 16);
      // Striped awning
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(screenX + 2, screenY + 4, 28, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(screenX + 8, screenY + 4, 6, 6);
      ctx.fillRect(screenX + 20, screenY + 4, 6, 6);
    } else if (prop.type === 'BENCH') {
      // Wooden Park Bench
      ctx.fillStyle = '#92400e';
      ctx.fillRect(screenX + 4, screenY + 12, 24, 12);
      ctx.fillStyle = '#334155';
      ctx.fillRect(screenX + 2, screenY + 10, 3, 16);
      ctx.fillRect(screenX + 27, screenY + 10, 3, 16);
    } else if (prop.type === 'FOR_SALE_SIGN') {
      // Real Estate Yard Sign
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(screenX + 14, screenY + 6, 4, 24); // post
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(screenX + 6, screenY + 4, 20, 12); // sign board
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px sans-serif';
      ctx.fillText('FOR SALE', screenX + 7, screenY + 12);
    }
  });
}

function renderCityGreeneryAndProps(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number
) {
  // Tree coordinates across parks & sidewalks
  const trees = [
    { x: 38, y: 22 }, { x: 54, y: 22 }, { x: 38, y: 26 }, { x: 54, y: 26 },
    { x: 14, y: 18 }, { x: 26, y: 18 }, { x: 8, y: 46 }, { x: 20, y: 46 },
    { x: 48, y: 58 }, { x: 64, y: 58 }
  ];

  trees.forEach((t) => {
    const screenX = t.x * TILE_SIZE - cameraX + canvasWidth / 2;
    const screenY = t.y * TILE_SIZE - cameraY + canvasHeight / 2;

    if (screenX < -40 || screenX > canvasWidth + 40 || screenY < -40 || screenY > canvasHeight + 40) {
      return;
    }

    // Tree shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(screenX + 16, screenY + 28, 16, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Trunk
    ctx.fillStyle = '#78350f';
    ctx.fillRect(screenX + 13, screenY + 14, 6, 16);

    // Leaves crown
    ctx.fillStyle = '#065f46';
    ctx.beginPath();
    ctx.arc(screenX + 16, screenY + 8, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(screenX + 14, screenY + 6, 14, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderStreetlampsAndGlow(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number
) {
  const lamps = [
    { x: 18, y: 16 }, { x: 34, y: 16 }, { x: 46, y: 16 }, { x: 60, y: 16 }, { x: 76, y: 16 },
    { x: 18, y: 30 }, { x: 34, y: 30 }, { x: 46, y: 30 }, { x: 60, y: 30 }, { x: 76, y: 30 },
    { x: 18, y: 44 }, { x: 34, y: 44 }, { x: 46, y: 44 }, { x: 60, y: 44 }, { x: 76, y: 44 }
  ];

  lamps.forEach((lamp) => {
    const screenX = lamp.x * TILE_SIZE - cameraX + canvasWidth / 2;
    const screenY = lamp.y * TILE_SIZE - cameraY + canvasHeight / 2;

    if (screenX < -40 || screenX > canvasWidth + 40 || screenY < -40 || screenY > canvasHeight + 40) {
      return;
    }

    // Cast-iron pole
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(screenX + 15, screenY + 8, 3, 24);

    // Lamp head & radial glow
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(screenX + 16.5, screenY + 8, 4, 0, Math.PI * 2);
    ctx.fill();

    // Soft warm light halo
    const grad = ctx.createRadialGradient(screenX + 16.5, screenY + 8, 2, screenX + 16.5, screenY + 8, 24);
    grad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    grad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(screenX + 16.5, screenY + 8, 24, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderCleanEnergyWindmills(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number
) {
  // Eco-Park at west outskirts
  const windmills = [{ x: 8, y: 60 }, { x: 12, y: 64 }];
  const time = Date.now() / 1000;

  windmills.forEach((wm) => {
    const screenX = wm.x * TILE_SIZE - cameraX + canvasWidth / 2;
    const screenY = wm.y * TILE_SIZE - cameraY + canvasHeight / 2;

    if (screenX < -50 || screenX > canvasWidth + 50 || screenY < -50 || screenY > canvasHeight + 50) {
      return;
    }

    // Tower
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(screenX + 14, screenY + 6, 4, 28);

    // Rotating Blades
    const hubX = screenX + 16;
    const hubY = screenY + 6;
    const rot = time * 2;

    ctx.fillStyle = '#f8fafc';
    for (let i = 0; i < 3; i++) {
      const angle = rot + (i * Math.PI * 2) / 3;
      const bladeTipX = hubX + Math.cos(angle) * 18;
      const bladeTipY = hubY + Math.sin(angle) * 18;
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(hubX, hubY);
      ctx.lineTo(bladeTipX, bladeTipY);
      ctx.stroke();
    }
  });
}

/**
 * Specialized 2.5D Building Facade Dispatcher
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

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(topLeftX + bldgWidth / 2, topLeftY + bldgHeight - 5, 36, 12, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 2. Base Drop Shadow
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
    case 'BOND_PIT':
      renderBondPitFacade(ctx, topLeftX, topLeftY, bldgWidth, bldgHeight, bldg, isHighlighted);
      break;
    case 'TAX_OFFICE':
      renderTaxOfficeFacade(ctx, topLeftX, topLeftY, bldgWidth, bldgHeight, bldg, isHighlighted);
      break;
    case 'WEALTH_ADVISORY':
      renderWealthAdvisoryFacade(ctx, topLeftX, topLeftY, bldgWidth, bldgHeight, bldg, isHighlighted);
      break;
    case 'TECH_INCUBATOR':
      renderTechIncubatorFacade(ctx, topLeftX, topLeftY, bldgWidth, bldgHeight, bldg, isHighlighted);
      break;
    case 'UNIVERSITY':
      renderUniversityFacade(ctx, topLeftX, topLeftY, bldgWidth, bldgHeight, bldg, isHighlighted);
      break;
    case 'CLINIC':
      renderClinicFacade(ctx, topLeftX, topLeftY, bldgWidth, bldgHeight, bldg, isHighlighted);
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
    case 'SHADY_ALLEY':
      renderShadyAlleyFacade(ctx, topLeftX, topLeftY, bldgWidth, bldgHeight, bldg, isHighlighted);
      break;
    default:
      renderTownHallFacade(ctx, topLeftX, topLeftY, bldgWidth, bldgHeight, bldg, isHighlighted);
      break;
  }

  // 4. Floating Header Title Banner Above Building
  const bannerY = topLeftY - 14;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = isHighlighted ? '#10b981' : isQuestTarget ? '#f59e0b' : 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = isHighlighted || isQuestTarget ? 2 : 1;

  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  const titleText = `${bldg.icon} ${bldg.name}`;
  const textWidth = ctx.measureText(titleText).width;

  ctx.beginPath();
  ctx.roundRect(topLeftX + bldgWidth / 2 - textWidth / 2 - 12, bannerY - 14, textWidth + 24, 24, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isHighlighted ? '#34d399' : '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(titleText, topLeftX + bldgWidth / 2, bannerY + 2);
}

// ----------------------------------------------------
// BESPOKE 2.5D ARCHITECTURAL FACADES
// ----------------------------------------------------

function renderStockExchangeFacade(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  bldg: BuildingEntrance, isHighlighted: boolean
) {
  // Main Marble Body
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x, y + 20, w, h - 20);

  // Classical Triangular Pediment
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(x - 6, y + 20);
  ctx.lineTo(x + w / 2, y - 10);
  ctx.lineTo(x + w + 6, y + 20);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Columns (6 Corinthian Columns)
  for (let c = 0; c < 6; c++) {
    const colX = x + 18 + c * 29;
    ctx.fillStyle = '#334155';
    ctx.fillRect(colX, y + 22, 10, h - 50);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(colX - 2, y + 20, 14, 4);
    ctx.fillRect(colX - 2, y + h - 30, 14, 4);
  }

  // Scrolling LED Ticker Tape
  const time = Date.now() / 1000;
  ctx.fillStyle = '#000000';
  ctx.fillRect(x + 10, y + 32, w - 20, 16);
  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = '#22c55e';
  const tickerText = 'VOO ▲ 480.20  •  QQQ ▲ 440.15  •  BTC ▲ 65,400  •  BND ▲ 72.10';
  const offset = ((time * 30) % (w + 200)) - 100;
  ctx.fillText(tickerText, x + w - offset, y + 43);

  renderGrandDoorway(ctx, x + w / 2 - 16, y + h - 32, 32, 32, '#06b6d4');
}

function renderBankFacade(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  bldg: BuildingEntrance, isHighlighted: boolean
) {
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(x, y + 16, w, h - 16);

  // Emerald Cornice & Pillars
  ctx.fillStyle = '#047857';
  ctx.fillRect(x - 4, y + 12, w + 8, 8);
  for (let c = 0; c < 4; c++) {
    ctx.fillStyle = '#10b981';
    ctx.fillRect(x + 22 + c * 44, y + 20, 14, h - 48);
  }

  // Massive Vault Coin Relief
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(x + w / 2, y + 36, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('$', x + w / 2, y + 40);

  renderGrandDoorway(ctx, x + w / 2 - 18, y + h - 32, 36, 32, '#10b981');
}

function renderBondPitFacade(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  bldg: BuildingEntrance, isHighlighted: boolean
) {
  // Federal Reserve Colonnade
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x, y + 18, w, h - 18);

  ctx.fillStyle = '#334155';
  ctx.fillRect(x - 4, y + 14, w + 8, 8);

  // Treasury Eagle & Scales Relief
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + 34, 16, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 8px sans-serif';
  ctx.fillText('FED', x + w / 2, y + 37);

  // Live Treasury Yield Display
  ctx.fillStyle = '#022c22';
  ctx.fillRect(x + 14, y + 50, w - 28, 14);
  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 8px monospace';
  ctx.fillText('10Y: 4.25%  •  3M: 5.25% (INVERTED)', x + w / 2, y + 60);

  renderGrandDoorway(ctx, x + w / 2 - 16, y + h - 30, 32, 30, '#34d399');
}

function renderTaxOfficeFacade(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  bldg: BuildingEntrance, isHighlighted: boolean
) {
  // Classical Civic Red-Brick Treasury
  ctx.fillStyle = '#881337';
  ctx.fillRect(x, y + 16, w, h - 16);

  // Balanced Scales of Justice Pediment
  ctx.fillStyle = '#9f1239';
  ctx.beginPath();
  ctx.moveTo(x - 4, y + 16);
  ctx.lineTo(x + w / 2, y - 6);
  ctx.lineTo(x + w + 4, y + 16);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('⚖️', x + w / 2, y + 10);

  // Stone rustication stripes
  ctx.fillStyle = '#be123c';
  for (let r = y + 24; r < y + h - 30; r += 16) {
    ctx.fillRect(x + 8, r, w - 16, 2);
  }

  renderGrandDoorway(ctx, x + w / 2 - 16, y + h - 30, 32, 30, '#f43f5e');
}

function renderWealthAdvisoryFacade(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  bldg: BuildingEntrance, isHighlighted: boolean
) {
  // Sapphire Glass Skyscraper Tower
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x + 10, y - 20, w - 20, h + 20);

  // Glass grid mullions with golden accents
  ctx.fillStyle = '#0284c7';
  for (let c = 0; c < 5; c++) {
    for (let r = 0; r < 5; r++) {
      ctx.fillRect(x + 16 + c * 26, y - 14 + r * 24, 18, 16);
    }
  }

  // Golden Crown Penthouse Spire
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(x + w / 2 - 3, y - 36, 6, 16);
  ctx.beginPath();
  ctx.arc(x + w / 2, y - 38, 4, 0, Math.PI * 2);
  ctx.fill();

  renderGrandDoorway(ctx, x + w / 2 - 16, y + h - 30, 32, 30, '#38bdf8');
}

function renderTechIncubatorFacade(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  bldg: BuildingEntrance, isHighlighted: boolean
) {
  // Cyberpunk Glass Cube
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(x, y + 16, w, h - 16);

  // Glowing Purple Neon Server Racks inside glass
  const time = Date.now() / 1000;
  ctx.fillStyle = '#818cf8';
  for (let i = 0; i < 4; i++) {
    const blink = Math.sin(time * 3 + i) > 0 ? '#c084fc' : '#4f46e5';
    ctx.fillStyle = blink;
    ctx.fillRect(x + 16 + i * 42, y + 30, 26, 36);
  }

  // Roof Solar Array
  ctx.fillStyle = '#312e81';
  ctx.fillRect(x - 2, y + 12, w + 4, 6);
  ctx.fillStyle = '#a855f7';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('🚀 AI FORGE', x + w / 2, y + 24);

  renderGrandDoorway(ctx, x + w / 2 - 16, y + h - 30, 32, 30, '#818cf8');
}

function renderUniversityFacade(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  bldg: BuildingEntrance, isHighlighted: boolean
) {
  // Collegiate Gothic Brick Hall
  ctx.fillStyle = '#3b0764';
  ctx.fillRect(x, y + 16, w, h - 16);

  // Central Clock Bell Tower
  ctx.fillStyle = '#581c87';
  ctx.fillRect(x + w / 2 - 20, y - 24, 40, 40);

  // Clock Face
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(x + w / 2, y - 6, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x + w / 2 - 1, y - 10, 2, 5);

  // Lancet Arched Stained Glass Windows
  ctx.fillStyle = '#a855f7';
  for (let c = 0; c < 3; c++) {
    ctx.beginPath();
    ctx.roundRect(x + 14 + c * 58, y + 34, 20, 28, [10, 10, 0, 0]);
    ctx.fill();
  }

  renderGrandDoorway(ctx, x + w / 2 - 16, y + h - 30, 32, 30, '#8b5cf6');
}

function renderClinicFacade(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  bldg: BuildingEntrance, isHighlighted: boolean
) {
  // Modern Clean Wellness Pavilion
  ctx.fillStyle = '#042f2e';
  ctx.fillRect(x, y + 16, w, h - 16);

  ctx.fillStyle = '#115e59';
  ctx.fillRect(x - 2, y + 12, w + 4, 6);

  // Illuminated Cyan Medical Cross
  ctx.fillStyle = '#14b8a6';
  ctx.fillRect(x + w / 2 - 12, y + 30, 24, 8);
  ctx.fillRect(x + w / 2 - 4, y + 22, 8, 24);

  // Glass Atrium Windows
  ctx.fillStyle = '#2dd4bf';
  ctx.fillRect(x + 16, y + 46, 36, 18);
  ctx.fillRect(x + w - 52, y + 46, 36, 18);

  renderGrandDoorway(ctx, x + w / 2 - 16, y + h - 30, 32, 30, '#14b8a6');
}

function renderCareerSkyscraperFacade(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  bldg: BuildingEntrance, isHighlighted: boolean
) {
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(x + 8, y - 18, w - 16, h + 18);

  // Corporate Glass Grid
  ctx.fillStyle = '#60a5fa';
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 5; r++) {
      ctx.fillRect(x + 16 + c * 34, y - 10 + r * 22, 22, 14);
    }
  }

  renderGrandDoorway(ctx, x + w / 2 - 16, y + h - 30, 32, 30, '#3b82f6');
}

function renderAutoDealerFacade(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  bldg: BuildingEntrance, isHighlighted: boolean
) {
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(x, y + 20, w, h - 20);

  // Showroom Glass
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(x + 10, y + 28, w - 20, h - 50);

  // Parked cars on lot
  renderVectorCar(ctx, x + 16, y + 38, '#ef4444');
  renderVectorCar(ctx, x + w - 46, y + 38, '#3b82f6');

  renderGrandDoorway(ctx, x + w / 2 - 16, y + h - 30, 32, 30, '#ef4444');
}

function renderSupermarketFacade(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  bldg: BuildingEntrance, isHighlighted: boolean
) {
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x, y + 16, w, h - 16);

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(x + 10, y + 8, w - 20, 16);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 9px sans-serif';
  ctx.fillText('MEGAMART WHOLESALE', x + w / 2, y + 20);

  renderGrandDoorway(ctx, x + w / 2 - 18, y + h - 30, 36, 30, '#f59e0b');
}

function renderResidentialHomeFacade(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  bldg: BuildingEntrance, isHighlighted: boolean
) {
  // Brick House Base
  ctx.fillStyle = '#831843';
  ctx.fillRect(x + 14, y + 24, w - 28, h - 24);

  // Pitched Roof Gables
  ctx.fillStyle = '#9d174d';
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 24);
  ctx.lineTo(x + w / 2, y - 6);
  ctx.lineTo(x + w - 8, y + 24);
  ctx.closePath();
  ctx.fill();

  // Chimney & Animated Smoke
  const time = Date.now() / 1000;
  ctx.fillStyle = '#500724';
  ctx.fillRect(x + w - 36, y - 18, 10, 20);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  const smokePuff = (time * 10) % 20;
  ctx.beginPath();
  ctx.arc(x + w - 31, y - 24 - smokePuff, 5 + smokePuff * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Windows with warm light
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(x + 24, y + 36, 18, 18);
  ctx.fillRect(x + w - 42, y + 36, 18, 18);

  renderGrandDoorway(ctx, x + w / 2 - 12, y + h - 28, 24, 28, '#ec4899');
}

function renderCryptoArcadeFacade(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  bldg: BuildingEntrance, isHighlighted: boolean
) {
  ctx.fillStyle = '#18181b';
  ctx.fillRect(x, y + 16, w, h - 16);

  // Glowing Bitcoin Neon Sign
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(x + w / 2, y + 36, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('₿', x + w / 2, y + 42);

  // Purple Neon Arcade Lights
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 8, y + 24, w - 16, h - 36);

  renderGrandDoorway(ctx, x + w / 2 - 16, y + h - 30, 32, 30, '#f59e0b');
}

function renderCafeFacade(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  bldg: BuildingEntrance, isHighlighted: boolean
) {
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x, y + 20, w, h - 20);

  // Striped awning
  ctx.fillStyle = '#d97706';
  ctx.fillRect(x - 2, y + 16, w + 4, 14);
  ctx.fillStyle = '#fef3c7';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(x + 8 + i * 36, y + 16, 14, 14);
  }

  // Coffee Cup Logo
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('☕ THE DAILY GRIND', x + w / 2, y + 46);

  renderGrandDoorway(ctx, x + w / 2 - 14, y + h - 28, 28, 28, '#d97706');
}

function renderShadyAlleyFacade(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  bldg: BuildingEntrance, isHighlighted: boolean
) {
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(x, y + 16, w, h - 16);

  // Graffiti Tag
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('100x GAINS', x + 24, y + 40);

  ctx.fillStyle = '#52525b';
  ctx.fillRect(x + w - 36, y + h - 30, 20, 18); // dumpster

  renderGrandDoorway(ctx, x + w / 2 - 14, y + h - 28, 28, 28, '#71717a');
}

function renderTownHallFacade(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  bldg: BuildingEntrance, isHighlighted: boolean
) {
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x, y + 16, w, h - 16);

  // Grand Capitol Dome
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(x + w / 2, y + 16, 26, Math.PI, 0);
  ctx.fill();

  // City Flag
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + w / 2 - 1, y - 24, 2, 16);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(x + w / 2 + 1, y - 24, 12, 8);

  renderGrandDoorway(ctx, x + w / 2 - 18, y + h - 30, 36, 30, '#f59e0b');
}

function renderGrandDoorway(
  ctx: CanvasRenderingContext2D,
  doorX: number,
  doorY: number,
  doorW: number,
  doorH: number,
  accentColor: string
) {
  // Recessed entrance cavity
  ctx.fillStyle = '#050811';
  ctx.fillRect(doorX, doorY, doorW, doorH);

  // Double Glass Doors
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(doorX + 2, doorY + 2, doorW / 2 - 3, doorH - 2);
  ctx.fillRect(doorX + doorW / 2 + 1, doorY + 2, doorW / 2 - 3, doorH - 2);

  // Glowing handles
  ctx.fillStyle = accentColor;
  ctx.fillRect(doorX + doorW / 2 - 4, doorY + 12, 2, 6);
  ctx.fillRect(doorX + doorW / 2 + 2, doorY + 12, 2, 6);

  // Glowing Entry Carpet
  ctx.fillStyle = accentColor;
  ctx.globalAlpha = 0.45;
  ctx.fillRect(doorX - 4, doorY + doorH - 2, doorW + 8, 8);
  ctx.globalAlpha = 1.0;
}

function renderVectorCar(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, 28, 14, 3);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x + 6, y - 3, 14, 10);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(x + 26, y + 2, 2, 3);
  ctx.fillRect(x + 26, y + 9, 2, 3);
}
