import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, BUILDINGS, BuildingEntrance } from '../world/mapData';
import { STREET_PROPS, StreetProp } from '../world/streetProps';
import { vehicleEngine, Vehicle } from './vehicleEngine';
import { NPC } from '../entities/NPC';
import { Collectible } from '../entities/Collectible';
import {
  PlayerEntity,
  renderSinglePlayer,
  renderSingleNPC,
  renderSinglePedestrian,
  renderSingleCollectible,
} from './entityRenderer';
import { pedestrianEngine } from './pedestrianAI';

/**
 * High-End 2.5D Isometric / Oblique World Renderer for Prosperity City Metropolis.
 * 
 * Master Features:
 * 1. Unified Y-Sorting Pipeline (Painter's Algorithm):
 *    All 3D elements (Skyscrapers, Buildings, Vehicles, Player, Pedestrians, Trees, Street Props, Fountain)
 *    are sorted dynamically by ground contact Y, ensuring realistic occlusion (walking/driving behind buildings).
 * 2. True 2.5D Oblique Architectural Buildings:
 *    - Volumetric southeast ground shadows
 *    - Darkened ambient-occlusion 3D side walls
 *    - Vertical front facades with floor banding, recessed window bays with sky reflections, and entrance lobbies
 *    - Elevated 3D rooftops with raised parapets, mechanical HVAC chillers, solar arrays, helipads, and blinking spire beacons
 * 3. Elevated Sidewalk Curbs:
 *    +4px raised curb face with drop-shadow bevel separating sidewalks from asphalt.
 * 4. Realistic Terrain & Coastline:
 *    Multi-layered animated ocean waves, seafoam, wooden boardwalk pier, and sandy beach transitions.
 */

interface SortableSceneItem {
  sortY: number;
  render: (ctx: CanvasRenderingContext2D) => void;
}

// Fixed urban tree coordinates across parks, plazas & sidewalks
const CITY_TREES = [
  { x: 38, y: 22 }, { x: 54, y: 22 }, { x: 38, y: 26 }, { x: 54, y: 26 },
  { x: 14, y: 18 }, { x: 26, y: 18 }, { x: 8, y: 46 }, { x: 20, y: 46 },
  { x: 48, y: 58 }, { x: 64, y: 58 }, { x: 18, y: 8 }, { x: 42, y: 8 },
  { x: 82, y: 18 }, { x: 82, y: 34 }, { x: 30, y: 58 }, { x: 74, y: 58 }
];

// Fixed streetlamp coordinates along avenue sidewalks
const CITY_STREETLAMPS = [
  { x: 20, y: 13 }, { x: 36, y: 13 }, { x: 50, y: 13 }, { x: 66, y: 13 },
  { x: 20, y: 27 }, { x: 36, y: 27 }, { x: 56, y: 27 }, { x: 72, y: 27 },
  { x: 20, y: 41 }, { x: 36, y: 41 }, { x: 50, y: 41 }, { x: 66, y: 41 },
  { x: 20, y: 55 }, { x: 36, y: 55 }, { x: 50, y: 55 }, { x: 66, y: 55 }
];

// Windmill coordinates at southwest eco-park
const CITY_WINDMILLS = [
  { x: 8, y: 60 },
  { x: 12, y: 64 },
];

/**
 * Master World Renderer
 */
export function renderWorldMap(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number,
  activeBuildingId: string | null = null,
  questTargetBuildingId?: string | null,
  player?: PlayerEntity,
  npcs?: NPC[],
  collectibles?: Collectible[],
  focusedNpcId?: string | null
) {
  // Clear canvas
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // ----------------------------------------------------
  // PASS 1: Base Terrain, Roads, Curbs, Beach, Ocean, Boardwalk
  // ----------------------------------------------------
  renderBaseTerrain(ctx, cameraX, cameraY, canvasWidth, canvasHeight);

  // Road Ground Markings: Skid Marks & GPS Highway Route
  renderTireSkidMarks(ctx, cameraX, cameraY, canvasWidth, canvasHeight);
  renderGPSNavigationRoute(ctx, cameraX, cameraY, canvasWidth, canvasHeight, questTargetBuildingId || activeBuildingId);

  // ----------------------------------------------------
  // PASS 2: Unified Y-Sorted 3D Scene (The Painter's Algorithm)
  // ----------------------------------------------------
  const sceneItems: SortableSceneItem[] = [];

  // 1. All 20 2.5D Buildings
  BUILDINGS.forEach((bldg) => {
    const groundBaseY = (bldg.tileY + 0.3) * TILE_SIZE;
    const isHighlighted = bldg.id === activeBuildingId;
    const isQuestTarget = bldg.id === questTargetBuildingId;

    sceneItems.push({
      sortY: groundBaseY,
      render: (renderCtx) => {
        render2DArchitecturalBuilding(
          renderCtx,
          bldg,
          cameraX,
          cameraY,
          canvasWidth,
          canvasHeight,
          isHighlighted,
          isQuestTarget
        );
      },
    });
  });

  // 2. Driveable Vehicles & AI Traffic
  vehicleEngine.vehicles.forEach((veh) => {
    sceneItems.push({
      sortY: veh.y + 10,
      render: (renderCtx) => {
        renderSingleVehicle(renderCtx, veh, cameraX, cameraY, canvasWidth, canvasHeight);
      },
    });
  });

  // 3. Player Character (if on foot / bicycle)
  if (player && !vehicleEngine.playerVehicle && player.vehicle !== 'CAR') {
    sceneItems.push({
      sortY: player.y + 16,
      render: (renderCtx) => {
        renderSinglePlayer(renderCtx, player, cameraX, cameraY, canvasWidth, canvasHeight);
      },
    });
  }

  // 4. Wandering Quest NPCs & Mentors
  if (npcs) {
    npcs.forEach((npc) => {
      sceneItems.push({
        sortY: npc.y + 16,
        render: (renderCtx) => {
          renderSingleNPC(
            renderCtx,
            npc,
            cameraX,
            cameraY,
            canvasWidth,
            canvasHeight,
            npc.id === focusedNpcId
          );
        },
      });
    });
  }

  // 5. Living Pedestrian Crowd
  pedestrianEngine.pedestrians.forEach((ped) => {
    sceneItems.push({
      sortY: ped.y + 16,
      render: (renderCtx) => {
        renderSinglePedestrian(renderCtx, ped, cameraX, cameraY, canvasWidth, canvasHeight);
      },
    });
  });

  // 6. Floating Collectibles (Coins, Scrolls, Gift Boxes)
  if (collectibles) {
    collectibles.forEach((item) => {
      if (item.isCollected) return;
      sceneItems.push({
        sortY: item.y + 10,
        render: (renderCtx) => {
          renderSingleCollectible(renderCtx, item, cameraX, cameraY, canvasWidth, canvasHeight);
        },
      });
    });
  }

  // 7. Interactive Street Props (ATMs, News Kiosks, Coffee Carts, Benches, Yard Signs)
  STREET_PROPS.forEach((prop) => {
    sceneItems.push({
      sortY: prop.tileY * TILE_SIZE + 24,
      render: (renderCtx) => {
        renderSingleStreetProp(renderCtx, prop, cameraX, cameraY, canvasWidth, canvasHeight);
      },
    });
  });

  // 8. 3D Trees with Layered Foliage Crowns
  CITY_TREES.forEach((tree) => {
    sceneItems.push({
      sortY: tree.y * TILE_SIZE + 28,
      render: (renderCtx) => {
        renderSingleTree(renderCtx, tree, cameraX, cameraY, canvasWidth, canvasHeight);
      },
    });
  });

  // 9. Cast-Iron Streetlamps
  CITY_STREETLAMPS.forEach((lamp) => {
    sceneItems.push({
      sortY: lamp.y * TILE_SIZE + 26,
      render: (renderCtx) => {
        renderSingleStreetlamp(renderCtx, lamp, cameraX, cameraY, canvasWidth, canvasHeight);
      },
    });
  });

  // 10. Multi-Tiered Plaza Marble Fountain
  sceneItems.push({
    sortY: 24 * TILE_SIZE + 32,
    render: (renderCtx) => {
      renderPlazaFountain(renderCtx, cameraX, cameraY, canvasWidth, canvasHeight);
    },
  });

  // 11. Clean Energy Wind Turbines
  CITY_WINDMILLS.forEach((wm) => {
    sceneItems.push({
      sortY: wm.y * TILE_SIZE + 24,
      render: (renderCtx) => {
        renderSingleWindmill(renderCtx, wm, cameraX, cameraY, canvasWidth, canvasHeight);
      },
    });
  });

  // Sort ALL scene items strictly in ascending sortY order (Painter's Algorithm)
  sceneItems.sort((a, b) => a.sortY - b.sortY);

  // Render sorted elements
  for (let i = 0; i < sceneItems.length; i++) {
    sceneItems[i].render(ctx);
  }

  // ----------------------------------------------------
  // PASS 3: Overhead Gateway Arches (Spanning above street level)
  // ----------------------------------------------------
  renderDistrictGatewayArches(ctx, cameraX, cameraY, canvasWidth, canvasHeight);
}

// ====================================================
// PASS 1 IMPLEMENTATION: BASE TERRAIN & CURBS
// ====================================================

function renderBaseTerrain(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number
) {
  const startTileX = Math.max(0, Math.floor((cameraX - canvasWidth / 2) / TILE_SIZE) - 2);
  const endTileX = Math.min(MAP_WIDTH, Math.ceil((cameraX + canvasWidth / 2) / TILE_SIZE) + 2);
  const startTileY = Math.max(0, Math.floor((cameraY - canvasHeight / 2) / TILE_SIZE) - 2);
  const endTileY = Math.min(MAP_HEIGHT, Math.ceil((cameraY + canvasHeight / 2) / TILE_SIZE) + 2);

  const time = Date.now() / 1000;

  for (let y = startTileY; y < endTileY; y++) {
    for (let x = startTileX; x < endTileX; x++) {
      const screenX = x * TILE_SIZE - cameraX + canvasWidth / 2;
      const screenY = y * TILE_SIZE - cameraY + canvasHeight / 2;

      // Urban layout definitions on 96x72 grid:
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

      const isPlaza = x >= 40 && x <= 52 && y >= 20 && y <= 28;
      const isBeach = x >= 81 && x <= 83;
      const isWater = x >= 84;
      const isBoardwalk = x >= 80 && x <= 92 && y >= 24 && y <= 28;

      if (isWater) {
        // Deep Ocean with Multi-layered Wave Motion
        ctx.fillStyle = '#0369a1';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

        const waveOffset1 = Math.sin(time * 2.2 + x * 0.6 + y * 0.9) * 3;
        const waveOffset2 = Math.cos(time * 1.8 + x * 0.4 - y * 0.7) * 2.5;

        // Wave crests
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(screenX + 4, screenY + 10 + waveOffset1, 18, 2.5);
        ctx.fillRect(screenX + 20, screenY + 26 + waveOffset2, 14, 2);

        // White seafoam
        if ((x + y) % 3 === 0) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.fillRect(screenX + 12, screenY + 16 + waveOffset1, 10, 1.5);
        }

        // Wooden Boardwalk Pier
        if (isBoardwalk) {
          ctx.fillStyle = '#78350f';
          ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#92400e';
          ctx.fillRect(screenX + 2, screenY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          ctx.fillStyle = '#451a03';
          ctx.fillRect(screenX, screenY + 7, TILE_SIZE, 2);
          ctx.fillRect(screenX, screenY + 19, TILE_SIZE, 2);
          ctx.fillRect(screenX, screenY + 31, TILE_SIZE, 2);
          // Nail heads
          ctx.fillStyle = '#d97706';
          ctx.fillRect(screenX + 3, screenY + 4, 1.5, 1.5);
          ctx.fillRect(screenX + TILE_SIZE - 5, screenY + 4, 1.5, 1.5);
        }
      } else if (isBeach) {
        // Golden Sandy Beach Transition
        ctx.fillStyle = '#d97706';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(screenX + 2, screenY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(screenX + 8, screenY + 14, 12, 1.5);
        ctx.fillRect(screenX + 20, screenY + 28, 10, 1.5);
      } else if ((isRoadH || isRoadV) && x <= 79) {
        // Asphalt Road
        ctx.fillStyle = '#18202f';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

        ctx.fillStyle = '#1e293b';
        if ((x + y) % 2 === 0) {
          ctx.fillRect(screenX + 4, screenY + 6, 8, 2);
          ctx.fillRect(screenX + 24, screenY + 22, 10, 2);
        }

        const isIntersection = isRoadH && isRoadV;
        if (isIntersection) {
          // Zebra Crosswalks
          ctx.fillStyle = '#f8fafc';
          for (let i = 2; i < TILE_SIZE; i += 8) {
            ctx.fillRect(screenX + i, screenY + 4, 4, TILE_SIZE - 8);
          }
          // Stormwater drain grates
          if ((x === 16 || x === 32 || x === 44 || x === 58 || x === 68 || x === 78) &&
              (y === 14 || y === 28 || y === 42 || y === 56)) {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(screenX + 2, screenY + 2, 10, 10);
            ctx.fillStyle = '#475569';
            for (let g = 3; g < 11; g += 2.5) {
              ctx.fillRect(screenX + g, screenY + 3, 1, 8);
            }
          }
        } else {
          // Yellow double divider line
          ctx.fillStyle = '#facc15';
          if (isRoadH && (y === 14 || y === 28 || y === 42 || y === 56) && x % 2 === 0) {
            ctx.fillRect(screenX + 2, screenY + TILE_SIZE - 3, TILE_SIZE - 4, 3);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(screenX + TILE_SIZE / 2 - 1, screenY + TILE_SIZE - 4, 3, 4);
            ctx.fillStyle = '#facc15';
          }
          if (isRoadV && (x === 16 || x === 32 || x === 44 || x === 58 || x === 68 || x === 78) && y % 2 === 0) {
            ctx.fillRect(screenX + TILE_SIZE - 3, screenY + 2, 3, TILE_SIZE - 4);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(screenX + TILE_SIZE - 4, screenY + TILE_SIZE / 2 - 1, 4, 3);
            ctx.fillStyle = '#facc15';
          }
        }
      } else if ((isSidewalkH || isSidewalkV) && x <= 80) {
        // Sidewalk paving with +4px Raised 3D Granite Curb Bevel
        ctx.fillStyle = '#334155';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(screenX + 2, screenY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.strokeRect(screenX + 0.5, screenY + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);

        // 3D Raised Curb Drop-Shadow & Highlight
        if (isSidewalkH) {
          if (y === 13 || y === 27 || y === 41 || y === 55) {
            // South-facing curb: bright highlight top, dark drop shadow edge facing road
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(screenX, screenY + TILE_SIZE - 4, TILE_SIZE, 2);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(screenX, screenY + TILE_SIZE - 2, TILE_SIZE, 2);
          } else {
            // North-facing curb
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(screenX, screenY, TILE_SIZE, 2);
            ctx.fillStyle = '#64748b';
            ctx.fillRect(screenX, screenY + 2, TILE_SIZE, 2);
          }
        }
        if (isSidewalkV) {
          if (x === 15 || x === 31 || x === 43 || x === 57 || x === 67 || x === 77) {
            // East-facing curb: shadow into road
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(screenX + TILE_SIZE - 4, screenY, 2, TILE_SIZE);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(screenX + TILE_SIZE - 2, screenY, 2, TILE_SIZE);
          } else {
            // West-facing curb
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(screenX, screenY, 2, TILE_SIZE);
            ctx.fillStyle = '#64748b';
            ctx.fillRect(screenX + 2, screenY, 2, TILE_SIZE);
          }
        }
      } else if (isPlaza) {
        // Grand Central Plaza Herringbone Stone Brick
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#0d5952';
        ctx.fillRect(screenX + 2, screenY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        if ((x + y) % 3 === 0) {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(screenX + 16, screenY + 16, 8, 8);
        }
      } else {
        // Lush Parks & Lawns
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

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
}

// ====================================================
// TRUE 2.5D OBLIQUE ARCHITECTURAL ENGINE
// ====================================================

interface Architectural3DSpec {
  height: number; // Height Extrusion H in px
  facadeTop: string;
  facadeBottom: string;
  sideWallColor: string;
  roofColor: string;
  roofTrim: string;
  windowColor: string;
  windowFrame: string;
  hasHelipad?: boolean;
  hasSpire?: boolean;
  hasChimney?: boolean;
  hasClockTower?: boolean;
  hasColumns?: boolean;
  hasLedTicker?: boolean;
  hasServerRacks?: boolean;
  hasShowroom?: boolean;
  hasPitchedRoof?: boolean;
  customEmblem?: string;
}

function getBuilding3DSpec(bldg: BuildingEntrance): Architectural3DSpec {
  switch (bldg.type) {
    case 'CAREER_TOWER':
      return {
        height: 250,
        facadeTop: '#1e3a8a',
        facadeBottom: '#0f172a',
        sideWallColor: '#090d16',
        roofColor: '#1e293b',
        roofTrim: '#3b82f6',
        windowColor: '#60a5fa',
        windowFrame: '#1d4ed8',
        hasSpire: true,
      };
    case 'STOCK_EXCHANGE':
      return {
        height: 210,
        facadeTop: '#1e293b',
        facadeBottom: '#0f172a',
        sideWallColor: '#090d16',
        roofColor: '#334155',
        roofTrim: '#06b6d4',
        windowColor: '#38bdf8',
        windowFrame: '#0284c7',
        hasColumns: true,
        hasLedTicker: true,
      };
    case 'BANK':
      return {
        height: 175,
        facadeTop: '#064e3b',
        facadeBottom: '#022c22',
        sideWallColor: '#011c15',
        roofColor: '#065f46',
        roofTrim: '#10b981',
        windowColor: '#34d399',
        windowFrame: '#059669',
        hasColumns: true,
        customEmblem: '$',
      };
    case 'WEALTH_ADVISORY':
      return {
        height: 225,
        facadeTop: '#0284c7',
        facadeBottom: '#0f172a',
        sideWallColor: '#082f49',
        roofColor: '#1e293b',
        roofTrim: '#38bdf8',
        windowColor: '#7dd3fc',
        windowFrame: '#0369a1',
        hasHelipad: true,
        hasSpire: true,
      };
    case 'TECH_INCUBATOR':
      return {
        height: 165,
        facadeTop: '#2e1065',
        facadeBottom: '#0f172a',
        sideWallColor: '#1e1b4b',
        roofColor: '#312e81',
        roofTrim: '#818cf8',
        windowColor: '#c084fc',
        windowFrame: '#4f46e5',
        hasServerRacks: true,
      };
    case 'UNIVERSITY':
      return {
        height: 160,
        facadeTop: '#4c0519',
        facadeBottom: '#1e1b4b',
        sideWallColor: '#2e1065',
        roofColor: '#581c87',
        roofTrim: '#a855f7',
        windowColor: '#e9d5ff',
        windowFrame: '#7e22ce',
        hasClockTower: true,
      };
    case 'TOWN_HALL':
      return {
        height: 170,
        facadeTop: '#334155',
        facadeBottom: '#0f172a',
        sideWallColor: '#1e293b',
        roofColor: '#475569',
        roofTrim: '#f59e0b',
        windowColor: '#fef08a',
        windowFrame: '#d97706',
        hasColumns: true,
        customEmblem: '🔔',
      };
    case 'TAX_OFFICE':
      return {
        height: 150,
        facadeTop: '#881337',
        facadeBottom: '#4c0519',
        sideWallColor: '#3f0714',
        roofColor: '#9f1239',
        roofTrim: '#f43f5e',
        windowColor: '#fecdd3',
        windowFrame: '#be123c',
        customEmblem: '⚖️',
      };
    case 'CLINIC':
      return {
        height: 155,
        facadeTop: '#042f2e',
        facadeBottom: '#0f172a',
        sideWallColor: '#021e1d',
        roofColor: '#134e4a',
        roofTrim: '#14b8a6',
        windowColor: '#5eead4',
        windowFrame: '#0f766e',
        hasHelipad: true,
        customEmblem: '➕',
      };
    case 'SUPERSTORE':
      return {
        height: 110,
        facadeTop: '#78350f',
        facadeBottom: '#292524',
        sideWallColor: '#1c1917',
        roofColor: '#451a03',
        roofTrim: '#f59e0b',
        windowColor: '#fde68a',
        windowFrame: '#d97706',
      };
    case 'AUTO_DEALER':
      return {
        height: 110,
        facadeTop: '#7f1d1d',
        facadeBottom: '#18181b',
        sideWallColor: '#450a0a',
        roofColor: '#991b1b',
        roofTrim: '#ef4444',
        windowColor: '#fca5a5',
        windowFrame: '#b91c1c',
        hasShowroom: true,
      };
    case 'HOME':
      return {
        height: 95,
        facadeTop: '#701a75',
        facadeBottom: '#3b0764',
        sideWallColor: '#2e1065',
        roofColor: '#86198f',
        roofTrim: '#ec4899',
        windowColor: '#fef08a',
        windowFrame: '#a21caf',
        hasPitchedRoof: true,
        hasChimney: true,
      };
    case 'RENTAL_PROPERTY':
      if (bldg.id === 'bldg_luxury_penthouse') {
        return {
          height: 245,
          facadeTop: '#1e1b4b',
          facadeBottom: '#090d16',
          sideWallColor: '#0a0f1d',
          roofColor: '#1e293b',
          roofTrim: '#fbbf24',
          windowColor: '#fef08a',
          windowFrame: '#d97706',
          hasHelipad: true,
          hasSpire: true,
        };
      }
      return {
        height: 115,
        facadeTop: '#064e3b',
        facadeBottom: '#022c22',
        sideWallColor: '#021e17',
        roofColor: '#047857',
        roofTrim: '#10b981',
        windowColor: '#a7f3d0',
        windowFrame: '#059669',
        hasPitchedRoof: true,
        hasChimney: true,
      };
    case 'REAL_ESTATE':
      return {
        height: 135,
        facadeTop: '#312e81',
        facadeBottom: '#0f172a',
        sideWallColor: '#1e1b4b',
        roofColor: '#3730a3',
        roofTrim: '#6366f1',
        windowColor: '#c7d2fe',
        windowFrame: '#4338ca',
      };
    case 'CRYPTO_LOUNGE':
      return {
        height: 105,
        facadeTop: '#18181b',
        facadeBottom: '#090d16',
        sideWallColor: '#09090b',
        roofColor: '#27272a',
        roofTrim: '#f59e0b',
        windowColor: '#fde047',
        windowFrame: '#ca8a04',
        customEmblem: '₿',
      };
    case 'SHADY_ALLEY':
      return {
        height: 95,
        facadeTop: '#334155',
        facadeBottom: '#0f172a',
        sideWallColor: '#0f172a',
        roofColor: '#1e293b',
        roofTrim: '#64748b',
        windowColor: '#f87171',
        windowFrame: '#991b1b',
      };
    default:
      return {
        height: 130,
        facadeTop: '#334155',
        facadeBottom: '#0f172a',
        sideWallColor: '#1e293b',
        roofColor: '#475569',
        roofTrim: '#94a3b8',
        windowColor: '#e2e8f0',
        windowFrame: '#64748b',
      };
  }
}

/**
 * Render complete 2.5D architectural building with volumetric geometry
 */
function render2DArchitecturalBuilding(
  ctx: CanvasRenderingContext2D,
  bldg: BuildingEntrance,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number,
  isHighlighted: boolean,
  isQuestTarget: boolean
) {
  const spec = getBuilding3DSpec(bldg);
  const width = 4.8 * TILE_SIZE; // 192px wide
  const height = spec.height; // Height extrusion H in px

  // Base ground coordinates (where front facade meets sidewalk)
  const baseX = (bldg.tileX - 2.4) * TILE_SIZE - cameraX + canvasWidth / 2;
  const baseY = (bldg.tileY + 0.3) * TILE_SIZE - cameraY + canvasHeight / 2;

  // Frustum culling check
  if (
    baseX + width + 60 < -80 ||
    baseX > canvasWidth + 80 ||
    baseY < -100 ||
    baseY - height - 80 > canvasHeight + 100
  ) {
    return;
  }

  const obX = 20; // Oblique east wall offset
  const obY = -14; // Oblique north wall offset

  // 1. In-World Golden Quest Waypoint Pillar of Light
  if (isQuestTarget) {
    const pulse = Math.sin(Date.now() / 200) * 0.15 + 0.35;
    const beamGrad = ctx.createLinearGradient(0, baseY - height - 160, 0, baseY);
    beamGrad.addColorStop(0, 'rgba(245, 158, 11, 0)');
    beamGrad.addColorStop(0.5, `rgba(245, 158, 11, ${pulse})`);
    beamGrad.addColorStop(1, 'rgba(245, 158, 11, 0.7)');

    ctx.fillStyle = beamGrad;
    ctx.fillRect(baseX + width / 2 - 24, baseY - height - 160, 48, height + 160);

    // Glowing ground ring at entrance
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(baseX + width / 2, baseY - 4, 38, 14, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 2. Volumetric Directional Ground Shadow (angled southeast onto pavement)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.44)';
  ctx.beginPath();
  ctx.moveTo(baseX - 4, baseY);
  ctx.lineTo(baseX + width + 4, baseY);
  ctx.lineTo(baseX + width + 48, baseY + 26);
  ctx.lineTo(baseX + 32, baseY + 26);
  ctx.closePath();
  ctx.fill();

  // 3. Oblique 3D Side Wall (East Face with ambient occlusion shading)
  ctx.fillStyle = spec.sideWallColor;
  ctx.beginPath();
  ctx.moveTo(baseX + width, baseY);
  ctx.lineTo(baseX + width + obX, baseY + obY);
  ctx.lineTo(baseX + width + obX, baseY - height + obY);
  ctx.lineTo(baseX + width, baseY - height);
  ctx.closePath();
  ctx.fill();

  // Side wall architectural horizontal banding lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  const numBands = Math.floor(height / 28);
  for (let b = 1; b < numBands; b++) {
    const bandY = baseY - b * 28;
    ctx.beginPath();
    ctx.moveTo(baseX + width, bandY);
    ctx.lineTo(baseX + width + obX, bandY + obY);
    ctx.stroke();
  }

  // 4. Front Facade (South Face)
  const facadeGrad = ctx.createLinearGradient(0, baseY - height, 0, baseY);
  facadeGrad.addColorStop(0, spec.facadeTop);
  facadeGrad.addColorStop(1, spec.facadeBottom);
  ctx.fillStyle = facadeGrad;
  ctx.fillRect(baseX, baseY - height, width, height);

  // Facade Edge highlight & shadow
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(baseX, baseY - height, width, height);

  // 5. Floor-by-Floor Window Bays & Architectural Banding
  const floorHeight = 28;
  const numFloors = Math.floor((height - 36) / floorHeight);

  for (let f = 0; f < numFloors; f++) {
    const floorY = baseY - height + 18 + f * floorHeight;

    // Floor dividing spandrel beam
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(baseX, floorY - 2, width, 3);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(baseX, floorY + floorHeight - 4, width, 1.5);

    // Window bays across floor
    const numWindows = 5;
    const winW = (width - 32) / numWindows;
    for (let w = 0; w < numWindows; w++) {
      const winX = baseX + 16 + w * winW;

      // Window Frame
      ctx.fillStyle = spec.windowFrame;
      ctx.fillRect(winX + 2, floorY + 2, winW - 4, floorHeight - 8);

      // Glass pane with sky reflection gradient
      const glassGrad = ctx.createLinearGradient(winX, floorY, winX + winW, floorY + floorHeight);
      glassGrad.addColorStop(0, '#0f172a');
      glassGrad.addColorStop(0.5, spec.windowColor);
      glassGrad.addColorStop(1, '#ffffff');

      ctx.fillStyle = glassGrad;
      ctx.fillRect(winX + 4, floorY + 4, winW - 8, floorHeight - 12);

      // Diagonal reflection glare
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.beginPath();
      ctx.moveTo(winX + 4, floorY + 4);
      ctx.lineTo(winX + winW - 8, floorY + 4);
      ctx.lineTo(winX + 4, floorY + floorHeight - 8);
      ctx.closePath();
      ctx.fill();
    }
  }

  // 6. Bespoke Architectural Features
  if (spec.hasColumns) {
    // Corinthian Columns along facade
    for (let c = 0; c < 5; c++) {
      const colX = baseX + 18 + c * 38;
      ctx.fillStyle = '#64748b';
      ctx.fillRect(colX, baseY - height + 36, 12, height - 68);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(colX - 2, baseY - height + 32, 16, 5); // capital
      ctx.fillRect(colX - 2, baseY - 34, 16, 5); // base
    }
  }

  if (spec.hasLedTicker) {
    // Scrolling LED stock ticker tape
    const tickerY = baseY - height + 24;
    ctx.fillStyle = '#000000';
    ctx.fillRect(baseX + 10, tickerY, width - 20, 16);
    ctx.font = 'bold 8.5px monospace';
    ctx.fillStyle = '#22c55e';
    const tickerText = 'VOO ▲ 480.20  •  QQQ ▲ 440.15  •  BTC ▲ 68,900  •  BND ▲ 72.10';
    const time = Date.now() / 1000;
    const offset = ((time * 35) % (width + 180)) - 90;
    ctx.fillText(tickerText, baseX + width - offset, tickerY + 11);
  }

  if (spec.hasServerRacks) {
    // Glowing cyberpunk server racks
    const time = Date.now() / 1000;
    for (let r = 0; r < 4; r++) {
      const pulseColor = Math.sin(time * 3 + r) > 0 ? '#c084fc' : '#4f46e5';
      ctx.fillStyle = pulseColor;
      ctx.fillRect(baseX + 18 + r * 42, baseY - 80, 26, 42);
    }
  }

  if (spec.customEmblem) {
    // Custom Medallion Seal ($, 🔔, ⚖️, ➕, ₿)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(baseX + width / 2, baseY - height + 26, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(spec.customEmblem, baseX + width / 2, baseY - height + 30);
  }

  // 7. Ground Floor Grand Glass Entrance Lobby
  const doorW = 38;
  const doorH = 32;
  const doorX = baseX + width / 2 - doorW / 2;
  const doorY = baseY - doorH;

  // Entrance Marquee / Awning
  ctx.fillStyle = spec.roofTrim;
  ctx.fillRect(doorX - 6, doorY - 6, doorW + 12, 6);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(doorX - 4, doorY, doorW + 8, 3); // awning shadow

  // Glass Entrance Doors
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(doorX, doorY, doorW, doorH);

  // Interior warm entrance glow
  const lobbyGrad = ctx.createRadialGradient(doorX + doorW / 2, doorY + doorH / 2, 2, doorX + doorW / 2, doorY + doorH / 2, 24);
  lobbyGrad.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
  lobbyGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
  ctx.fillStyle = lobbyGrad;
  ctx.fillRect(doorX, doorY, doorW, doorH);

  // Double door mullions & chrome handles
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(doorX + 2, doorY + 2, doorW / 2 - 3, doorH - 3);
  ctx.strokeRect(doorX + doorW / 2 + 1, doorY + 2, doorW / 2 - 3, doorH - 3);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(doorX + doorW / 2 - 3, doorY + doorH / 2 - 2, 2, 6);
  ctx.fillRect(doorX + doorW / 2 + 1, doorY + doorH / 2 - 2, 2, 6);

  // Doorstep Welcome Mat
  ctx.fillStyle = isHighlighted ? '#10b981' : '#334155';
  ctx.fillRect(doorX - 4, baseY - 3, doorW + 8, 3);

  // 8. Elevated 3D Rooftop (at baseY - height)
  ctx.fillStyle = spec.roofColor;
  ctx.beginPath();
  ctx.moveTo(baseX, baseY - height);
  ctx.lineTo(baseX + obX, baseY - height + obY);
  ctx.lineTo(baseX + width + obX, baseY - height + obY);
  ctx.lineTo(baseX + width, baseY - height);
  ctx.closePath();
  ctx.fill();

  // Raised Parapet Coping Border
  ctx.strokeStyle = spec.roofTrim;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Rooftop 3D Props:
  // a. Mechanical HVAC Chiller
  const hvacX = baseX + 24;
  const hvacY = baseY - height - 8;
  ctx.fillStyle = '#475569';
  ctx.fillRect(hvacX, hvacY, 22, 14);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(hvacX + 2, hvacY - 3, 22, 3);
  // Fan grille
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  for (let l = 2; l < 12; l += 3) {
    ctx.beginPath();
    ctx.moveTo(hvacX + 4, hvacY + l);
    ctx.lineTo(hvacX + 18, hvacY + l);
    ctx.stroke();
  }

  // b. Elevator Penthouse
  const pentX = baseX + width - 46;
  const pentY = baseY - height - 12;
  ctx.fillStyle = '#334155';
  ctx.fillRect(pentX, pentY, 24, 16);
  ctx.fillStyle = '#475569';
  ctx.fillRect(pentX + 2, pentY - 4, 24, 4);

  // c. Helipad (for Medical Clinic, Wealth Advisory, Sky Penthouse)
  if (spec.hasHelipad) {
    const heliX = baseX + width / 2 + 8;
    const heliY = baseY - height - 6;
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(heliX, heliY, 20, 10, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('H', heliX, heliY + 4);
  }

  // d. Steel Antenna Spire with Blinking Red Warning Beacon
  if (spec.hasSpire) {
    const spireX = baseX + width / 2;
    const spireBaseY = baseY - height - 6;
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(spireX, spireBaseY);
    ctx.lineTo(spireX, spireBaseY - 36);
    ctx.stroke();

    // Blinking red beacon light at top
    const beaconOn = Math.floor(Date.now() / 450) % 2 === 0;
    if (beaconOn) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.beginPath();
      ctx.arc(spireX, spireBaseY - 36, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(spireX, spireBaseY - 36, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // e. Chimney with Billowing Animated Smoke (Homes & Duplexes)
  if (spec.hasChimney) {
    const chimX = baseX + width - 32;
    const chimY = baseY - height - 12;
    ctx.fillStyle = '#831843';
    ctx.fillRect(chimX, chimY, 10, 16);

    const time = Date.now() / 1000;
    for (let p = 0; p < 3; p++) {
      const puffTime = (time * 1.5 + p * 0.7) % 2;
      const puffY = chimY - puffTime * 22;
      const puffX = chimX + 5 + Math.sin(time * 2 + p) * 6;
      const puffAlpha = Math.max(0, 0.5 - puffTime * 0.25);
      ctx.fillStyle = `rgba(255, 255, 255, ${puffAlpha})`;
      ctx.beginPath();
      ctx.arc(puffX, puffY, 4 + puffTime * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 9. Floating Glass Header Title Banner Above Rooftop
  const bannerY = baseY - height - 28 - (spec.hasSpire ? 22 : 0);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.strokeStyle = isHighlighted ? '#10b981' : isQuestTarget ? '#f59e0b' : 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = isHighlighted || isQuestTarget ? 2 : 1;

  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  const titleText = `${bldg.icon} ${bldg.name}`;
  const textWidth = ctx.measureText(titleText).width;

  ctx.beginPath();
  ctx.roundRect(baseX + width / 2 - textWidth / 2 - 12, bannerY - 14, textWidth + 24, 24, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isHighlighted ? '#34d399' : '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(titleText, baseX + width / 2, bannerY + 2);
}

// ====================================================
// DRIVEABLE VEHICLES & AI TRAFFIC RENDERER
// ====================================================

function renderSingleVehicle(
  ctx: CanvasRenderingContext2D,
  veh: Vehicle,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number
) {
  const screenX = veh.x - cameraX + canvasWidth / 2;
  const screenY = veh.y - cameraY + canvasHeight / 2;

  if (screenX < -120 || screenX > canvasWidth + 120 || screenY < -120 || screenY > canvasHeight + 120) {
    return;
  }

  ctx.save();
  ctx.translate(screenX, screenY);
  ctx.rotate(veh.angle);

  // 1. Soft Oval Ground Drop Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.beginPath();
  ctx.ellipse(0, 2, 24, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Neon Underglow (Supercars & Occupied Vehicles)
  if (veh.type === 'SUPERCAR' || veh.isPlayerOccupied) {
    ctx.fillStyle = veh.accentColor || '#38bdf8';
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }

  // 3. Dynamic Headlight Beams (forward on road)
  if (veh.headlightsActive) {
    const grad = ctx.createRadialGradient(24, 0, 5, 80, 0, 65);
    grad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    grad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(18, -8);
    ctx.lineTo(85, -28);
    ctx.lineTo(85, 28);
    ctx.lineTo(18, 8);
    ctx.closePath();
    ctx.fill();
  }

  // 4. Vehicle Body Chassis by Type
  if (veh.type === 'SUPERCAR') {
    // Sleek Wedge Supercar
    ctx.fillStyle = veh.color;
    ctx.beginPath();
    ctx.roundRect(-20, -10, 40, 20, [3, 8, 8, 3]);
    ctx.fill();

    // Carbon Fiber Roof / Cockpit
    ctx.fillStyle = veh.roofColor;
    ctx.beginPath();
    ctx.roundRect(-8, -7, 20, 14, 4);
    ctx.fill();

    // Tinted Glass Canopy
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-2, -5, 12, 10);

    // Rear Spoiler
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-22, -11, 4, 22);

    // Exhaust Tips
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-21, -5, 2, 2);
    ctx.fillRect(-21, 3, 2, 2);
  } else if (veh.type === 'POLICE') {
    // Police Interceptor
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(-19, -9, 38, 18, 4);
    ctx.fill();

    // White Doors & Roof
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-8, -9, 16, 18);

    // Windshield
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-2, -6, 12, 12);

    // Emergency Flashing Strobe (Red & Blue)
    const strobe = Math.floor(Date.now() / 90) % 2;
    ctx.fillStyle = strobe === 0 ? '#ef4444' : '#3b82f6';
    ctx.fillRect(-4, -4, 8, 8);

    if (veh.sirenActive) {
      ctx.fillStyle = strobe === 0 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.4)';
      ctx.beginPath();
      ctx.arc(0, 0, 45, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (veh.type === 'TAXI') {
    // Yellow Taxi
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.roundRect(-18, -9, 36, 18, 4);
    ctx.fill();

    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.roundRect(-8, -7, 18, 14, 3);
    ctx.fill();

    // Rooftop Taxi Sign
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-3, -3, 8, 6);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 5px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TAXI', 1, 1.5);
  } else if (veh.type === 'VAN') {
    // Commercial Van
    ctx.fillStyle = veh.color;
    ctx.beginPath();
    ctx.roundRect(-20, -10, 40, 20, 3);
    ctx.fill();

    ctx.fillStyle = veh.roofColor;
    ctx.fillRect(-18, -8, 26, 16);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(8, -7, 6, 14); // front windshield
  } else {
    // Executive Sedan
    ctx.fillStyle = veh.color;
    ctx.beginPath();
    ctx.roundRect(-18, -9, 36, 18, 4);
    ctx.fill();

    ctx.fillStyle = veh.roofColor;
    ctx.beginPath();
    ctx.roundRect(-8, -7, 18, 14, 3);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-2, -5, 12, 10);
  }

  // 5. Chrome Rims / Wheels
  ctx.fillStyle = '#475569';
  ctx.fillRect(-14, -11, 8, 3);
  ctx.fillRect(8, -11, 8, 3);
  ctx.fillRect(-14, 8, 8, 3);
  ctx.fillRect(8, 8, 8, 3);

  // 6. Taillights & Glowing Brake Lights
  if (veh.brakeLightsActive) {
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-21, -8, 3, 4);
    ctx.fillRect(-21, 4, 3, 4);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.beginPath();
    ctx.arc(-22, -6, 7, 0, Math.PI * 2);
    ctx.arc(-22, 6, 7, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(-20, -7, 2, 3);
    ctx.fillRect(-20, 4, 2, 3);
  }

  // 7. Player Occupied Indicator
  if (veh.isPlayerOccupied) {
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// ====================================================
// ENVIRONMENT & PROPS IMPLEMENTATIONS
// ====================================================

function renderSingleStreetProp(
  ctx: CanvasRenderingContext2D,
  prop: StreetProp,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number
) {
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
    // 24/7 ATM Terminal
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(screenX + 6, screenY + 6, 20, 24);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(screenX + 9, screenY + 9, 14, 8); // screen
    ctx.fillStyle = '#64748b';
    ctx.fillRect(screenX + 9, screenY + 19, 14, 4); // keypad
    ctx.fillStyle = '#34d399';
    ctx.fillRect(screenX + 11, screenY + 3, 10, 3);
  } else if (prop.type === 'NEWS_KIOSK') {
    // Financial Newsstand
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(screenX + 4, screenY + 8, 24, 22);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(screenX + 2, screenY + 4, 28, 5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(screenX + 8, screenY + 12, 16, 12);
  } else if (prop.type === 'COFFEE_CART') {
    // Artisan Coffee Cart
    ctx.fillStyle = '#78350f';
    ctx.fillRect(screenX + 4, screenY + 14, 24, 16);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(screenX + 2, screenY + 4, 28, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(screenX + 8, screenY + 4, 6, 6);
    ctx.fillRect(screenX + 20, screenY + 4, 6, 6);
  } else if (prop.type === 'BENCH') {
    // Park Bench
    ctx.fillStyle = '#92400e';
    ctx.fillRect(screenX + 4, screenY + 12, 24, 12);
    ctx.fillStyle = '#334155';
    ctx.fillRect(screenX + 2, screenY + 10, 3, 16);
    ctx.fillRect(screenX + 27, screenY + 10, 3, 16);
  } else if (prop.type === 'FOR_SALE_SIGN') {
    // Yard Sign
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(screenX + 14, screenY + 6, 4, 24);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(screenX + 6, screenY + 4, 20, 12);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 7px sans-serif';
    ctx.fillText('FOR SALE', screenX + 7, screenY + 12);
  }
}

function renderSingleTree(
  ctx: CanvasRenderingContext2D,
  tree: { x: number; y: number },
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number
) {
  const screenX = tree.x * TILE_SIZE - cameraX + canvasWidth / 2;
  const screenY = tree.y * TILE_SIZE - cameraY + canvasHeight / 2;

  if (screenX < -40 || screenX > canvasWidth + 40 || screenY < -40 || screenY > canvasHeight + 40) {
    return;
  }

  // Soft ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(screenX + 16, screenY + 28, 16, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3D Trunk
  ctx.fillStyle = '#78350f';
  ctx.fillRect(screenX + 13, screenY + 14, 6, 16);

  // Layered foliage crowns
  ctx.fillStyle = '#065f46';
  ctx.beginPath();
  ctx.arc(screenX + 16, screenY + 8, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(screenX + 14, screenY + 6, 14, 0, Math.PI * 2);
  ctx.fill();
}

function renderSingleStreetlamp(
  ctx: CanvasRenderingContext2D,
  lamp: { x: number; y: number },
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number
) {
  const screenX = lamp.x * TILE_SIZE - cameraX + canvasWidth / 2;
  const screenY = lamp.y * TILE_SIZE - cameraY + canvasHeight / 2;

  if (screenX < -30 || screenX > canvasWidth + 30 || screenY < -30 || screenY > canvasHeight + 30) {
    return;
  }

  // Post shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(screenX + 16, screenY + 26, 6, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cast iron pole
  ctx.fillStyle = '#334155';
  ctx.fillRect(screenX + 15, screenY + 4, 3, 22);

  // Lamp bracket
  ctx.fillRect(screenX + 12, screenY + 2, 9, 3);

  // Glowing amber bulb
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(screenX + 16.5, screenY + 3, 3, 0, Math.PI * 2);
  ctx.fill();
}

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
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
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

  // Water ripples
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  const ripple1 = (time * 18) % 36;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + 10, ripple1, ripple1 * 0.4, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Tier 2: Pedestal & Upper Basin
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(centerX - 8, centerY - 12, 16, 16);

  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY - 12, 26, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tier 3: Golden Freedom Bell & Spire at Center
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

function renderSingleWindmill(
  ctx: CanvasRenderingContext2D,
  wm: { x: number; y: number },
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number
) {
  const screenX = wm.x * TILE_SIZE - cameraX + canvasWidth / 2;
  const screenY = wm.y * TILE_SIZE - cameraY + canvasHeight / 2;

  if (screenX < -50 || screenX > canvasWidth + 50 || screenY < -50 || screenY > canvasHeight + 50) {
    return;
  }

  const time = Date.now() / 1000;

  // Tower shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(screenX + 16, screenY + 28, 14, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tapered tower
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.moveTo(screenX + 13, screenY + 24);
  ctx.lineTo(screenX + 15, screenY - 28);
  ctx.lineTo(screenX + 17, screenY - 28);
  ctx.lineTo(screenX + 19, screenY + 24);
  ctx.closePath();
  ctx.fill();

  // Rotor Hub
  const hubX = screenX + 16;
  const hubY = screenY - 28;
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(hubX, hubY, 4, 0, Math.PI * 2);
  ctx.fill();

  // 3 Aerodynamic Spinning Blades
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 2.5;
  for (let b = 0; b < 3; b++) {
    const bladeAngle = (b * Math.PI * 2) / 3 + time * 2;
    ctx.beginPath();
    ctx.moveTo(hubX, hubY);
    ctx.lineTo(hubX + Math.cos(bladeAngle) * 26, hubY + Math.sin(bladeAngle) * 26);
    ctx.stroke();
  }
}

// ====================================================
// OVERHEAD STRUCTURES & GPS LINE
// ====================================================

const DISTRICT_ARCHES = [
  {
    name: 'FINANCIAL CANYON GATEWAY',
    subtitle: 'WALL STREET & BOND DESK',
    tileX: 62,
    tileY: 14,
    theme: {
      pylonPrimary: '#0f172a',
      pylonTrim: '#06b6d4',
      beamColor: '#1e293b',
      signBg: 'rgba(15, 23, 42, 0.95)',
      signBorder: '#06b6d4',
      textColor: '#22d3ee',
      lanternGlow: 'rgba(6, 182, 212, 0.45)',
    },
  },
  {
    name: 'CIVIC PLAZA PROMENADE ARCH',
    subtitle: 'MUNICIPAL HALL & FREEDOM BELL',
    tileX: 46,
    tileY: 28,
    theme: {
      pylonPrimary: '#1e293b',
      pylonTrim: '#f59e0b',
      beamColor: '#334155',
      signBg: 'rgba(15, 23, 42, 0.95)',
      signBorder: '#f59e0b',
      textColor: '#fbbf24',
      lanternGlow: 'rgba(245, 158, 11, 0.45)',
    },
  },
  {
    name: 'INNOVATION CORRIDOR PORTAL',
    subtitle: 'SILICON FORGE AI QUARTER',
    tileX: 34,
    tileY: 14,
    theme: {
      pylonPrimary: '#1e1b4b',
      pylonTrim: '#818cf8',
      beamColor: '#312e81',
      signBg: 'rgba(30, 27, 75, 0.95)',
      signBorder: '#818cf8',
      textColor: '#a5b4fc',
      lanternGlow: 'rgba(129, 140, 248, 0.45)',
    },
  },
];

function renderDistrictGatewayArches(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number
) {
  DISTRICT_ARCHES.forEach((arch) => {
    const archX = arch.tileX * TILE_SIZE - cameraX + canvasWidth / 2;
    const archY = arch.tileY * TILE_SIZE - cameraY + canvasHeight / 2;
    const roadHeight = 2 * TILE_SIZE; // 80px

    if (archX < -150 || archX > canvasWidth + 150 || archY < -150 || archY > canvasHeight + 150) {
      return;
    }

    const topPylonY = archY - 14;
    const botPylonY = archY + roadHeight + 8;

    // Overhead Span Gantry Beam
    ctx.fillStyle = arch.theme.beamColor;
    ctx.fillRect(archX - 6, topPylonY, 12, botPylonY - topPylonY);

    // North Pylon
    ctx.fillStyle = arch.theme.pylonPrimary;
    ctx.fillRect(archX - 10, topPylonY - 18, 20, 28);
    ctx.fillStyle = arch.theme.pylonTrim;
    ctx.fillRect(archX - 12, topPylonY + 6, 24, 4);

    // South Pylon
    ctx.fillStyle = arch.theme.pylonPrimary;
    ctx.fillRect(archX - 10, botPylonY - 10, 20, 28);
    ctx.fillStyle = arch.theme.pylonTrim;
    ctx.fillRect(archX - 12, botPylonY + 14, 24, 4);

    // Center Signboard
    const signW = 190;
    const signH = 32;
    const signX = archX - signW / 2;
    const signY = archY + roadHeight / 2 - signH / 2;

    ctx.fillStyle = arch.theme.signBg;
    ctx.beginPath();
    ctx.roundRect(signX, signY, signW, signH, 8);
    ctx.fill();
    ctx.strokeStyle = arch.theme.signBorder;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = arch.theme.textColor;
    ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(arch.name, archX, signY + 13);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.font = 'bold 6.5px monospace';
    ctx.fillText(arch.subtitle, archX, signY + 24);
  });
}

function renderGPSNavigationRoute(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number,
  targetBuildingId?: string | null
) {
  if (!targetBuildingId) return;
  const bldg = BUILDINGS.find((b) => b.id === targetBuildingId);
  if (!bldg) return;

  const targetWorldX = bldg.tileX * TILE_SIZE;
  const targetWorldY = bldg.tileY * TILE_SIZE;

  const startScreenX = canvasWidth / 2;
  const startScreenY = canvasHeight / 2;
  const endScreenX = targetWorldX - cameraX + canvasWidth / 2;
  const endScreenY = targetWorldY - cameraY + canvasHeight / 2;

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const midScreenX = endScreenX;
  const midScreenY = startScreenY;

  // Outer Neon Glow
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(startScreenX, startScreenY);
  ctx.lineTo(midScreenX, midScreenY);
  ctx.lineTo(endScreenX, endScreenY);
  ctx.stroke();

  // Core Animated Dashed GPS Line
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 4;
  ctx.setLineDash([14, 10]);
  ctx.lineDashOffset = -(Date.now() / 30);
  ctx.beginPath();
  ctx.moveTo(startScreenX, startScreenY);
  ctx.lineTo(midScreenX, midScreenY);
  ctx.lineTo(endScreenX, endScreenY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Destination Marker
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(endScreenX, endScreenY, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}

function renderTireSkidMarks(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number
) {
  vehicleEngine.skidMarks.forEach((sm) => {
    const screenX = sm.x - cameraX + canvasWidth / 2;
    const screenY = sm.y - cameraY + canvasHeight / 2;
    if (screenX < -50 || screenX > canvasWidth + 50 || screenY < -50 || screenY > canvasHeight + 50) return;

    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.rotate(sm.angle);
    ctx.fillStyle = `rgba(15, 23, 42, ${sm.opacity})`;
    ctx.fillRect(-7, -7, 14, 3);
    ctx.fillRect(-7, 4, 14, 3);
    ctx.restore();
  });

  vehicleEngine.smokeParticles.forEach((p) => {
    const screenX = p.x - cameraX + canvasWidth / 2;
    const screenY = p.y - cameraY + canvasHeight / 2;
    if (screenX < -30 || screenX > canvasWidth + 30 || screenY < -30 || screenY > canvasHeight + 30) return;
    ctx.fillStyle = `rgba(226, 232, 240, ${p.alpha})`;
    ctx.beginPath();
    ctx.arc(screenX, screenY, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
}
