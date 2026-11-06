import React, { useEffect, useRef, useState } from 'react';
import { GameState } from '../../types/game';
import { BUILDINGS, BuildingEntrance, TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from '../world/mapData';
import { STREET_PROPS, StreetProp } from '../world/streetProps';
import { INITIAL_NPCS, NPC } from '../entities/NPC';
import { INITIAL_COLLECTIBLES, Collectible } from '../entities/Collectible';
import { renderWorldMap } from './tilesetRenderer';
import { renderEntities, PlayerEntity } from './entityRenderer';
import { RPGBuildingInterior } from '../ui/RPGBuildingInterior';
import { DialogueBox } from '../ui/DialogueBox';
import { WorldAtmosphere } from './timeAndWeather';
import { CAMPAIGN_CHAPTERS, ChapterQuest } from './quests';
import { INITIAL_INVENTORY, InventoryItem } from './inventory';
import { QuestTrackerHUD } from '../ui/QuestTrackerHUD';
import { InventoryModal } from '../ui/InventoryModal';
import { CampaignStoryModal } from '../ui/CampaignStoryModal';
import { FreedomBellModal } from '../ui/FreedomBellModal';
import { GuidedCompass } from '../ui/GuidedCompass';
import { MiniMapRadar } from '../ui/MiniMapRadar';
import { VaultSorterMinigame } from '../minigames/VaultSorterMinigame';
import { DCAWaveRiderMinigame } from '../minigames/DCAWaveRiderMinigame';
import { SupermarketBasketMinigame } from '../minigames/SupermarketBasketMinigame';
import { soundFx } from '../../audio/soundFx';
import { ambientMusic } from '../../audio/ambientMusic';
import { advanceTurn, getNetWorth } from '../../engine/gameEngine';
import { LifeFocusModal } from '../ui/LifeFocusModal';
import { GenerationalLegacyModal } from '../ui/GenerationalLegacyModal';
import { LifeStageHUD } from '../ui/LifeStageHUD';
import { INTERIOR_ROOMS } from '../world/interiorData';
import { WalkableInterior } from './WalkableInterior';
import confetti from 'canvas-confetti';
import { 
  Compass, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  Backpack,
  Sun,
  Moon,
  CloudRain,
  Trophy,
  Bell,
  Heart,
  Zap
} from 'lucide-react';

interface GameCanvasProps {
  state: GameState;
  onUpdateState: (newState: GameState) => void;
  onSwitchToExecutiveMode: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  state,
  onUpdateState,
  onSwitchToExecutiveMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Atmosphere engine instance (day/night cycle & weather)
  const atmosphereRef = useRef<WorldAtmosphere>(new WorldAtmosphere());

  // Player state in world px (Starts at Town Plaza at tileX 46, tileY 28)
  const [player, setPlayer] = useState<PlayerEntity>({
    x: 46 * TILE_SIZE,
    y: 28 * TILE_SIZE,
    direction: 'down',
    isMoving: false,
    walkFrame: 0,
    name: state.character.name,
    avatarEmoji: state.character.avatar,
    shirtColor: '#10b981',
    archetypeId: state.character.archetypeId,
    vehicle: 'FOOT',
    hasPet: false,
  });

  // Synchronize player entity immediately when character changes (avatar, name, archetype)
  useEffect(() => {
    setPlayer((prev) => ({
      ...prev,
      name: state.character.name,
      avatarEmoji: state.character.avatar,
      archetypeId: state.character.archetypeId,
    }));
  }, [state.character.name, state.character.avatar, state.character.archetypeId]);

  const [npcs, setNpcs] = useState<NPC[]>(INITIAL_NPCS);
  const [collectibles, setCollectibles] = useState<Collectible[]>(INITIAL_COLLECTIBLES);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [chapters, setChapters] = useState<ChapterQuest[]>(CAMPAIGN_CHAPTERS);
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);

  // Custom Waypoint override (if user selected one)
  const [customWaypoint, setCustomWaypoint] = useState<BuildingEntrance | null>(null);

  // Active overlays & Modals
  const [enteredBuilding, setEnteredBuilding] = useState<BuildingEntrance | null>(null);
  const [talkingNpc, setTalkingNpc] = useState<NPC | null>(null);
  const [nearbyBuilding, setNearbyBuilding] = useState<BuildingEntrance | null>(null);
  const [nearbyNpc, setNearbyNpc] = useState<NPC | null>(null);
  const [nearbyStreetProp, setNearbyStreetProp] = useState<StreetProp | null>(null);
  const [isNearFountain, setIsNearFountain] = useState<boolean>(false);
  const [bannerAlert, setBannerAlert] = useState<string | null>('Follow your Guided Compass at the top to reach your first goal!');

  // Street Prop Interaction Handler
  const handleInteractStreetProp = (prop: StreetProp) => {
    switch (prop.type) {
      case 'ATM':
        if (state.cash >= 250) {
          state.cash -= 250;
          state.emergencyFund += 250;
          state.totalXP += 15;
          soundFx.playCoin();
          setBannerAlert(`🏧 ATM: Deposited $250 into 4.5% High-Yield Vault! New Vault: $${state.emergencyFund.toLocaleString()}`);
        } else if (state.emergencyFund >= 200) {
          state.emergencyFund -= 200;
          state.cash += 200;
          soundFx.playCoin();
          setBannerAlert(`🏧 ATM: Withdrew $200 cash! Checking: $${state.cash.toLocaleString()}`);
        } else {
          setBannerAlert('🏧 ATM: Insufficient funds in checking or vault.');
        }
        break;
      case 'NEWS_KIOSK':
        soundFx.playClick();
        state.totalXP += 20;
        setBannerAlert(`📰 ${state.economicHeadline} (Fed Funds: ${(state.interestRate * 100).toFixed(2)}%, CPI: ${(state.inflationRate * 100).toFixed(1)}%) +20 XP!`);
        break;
      case 'COFFEE_CART':
        if (state.cash >= 6) {
          state.cash -= 6;
          state.character.happiness = Math.min(100, state.character.happiness + 10);
          state.character.health = Math.min(100, state.character.health + 5);
          state.burnout = 0;
          state.totalXP += 15;
          soundFx.playCoin();
          setBannerAlert('☕ Artisan Cold Brew! Burnout reset to 0%, Happiness +10!');
        } else {
          setBannerAlert('Need $6 cash for cold brew.');
        }
        break;
      case 'BENCH':
        soundFx.playClick();
        state.character.health = Math.min(100, state.character.health + 10);
        state.burnout = Math.max(0, (state.burnout || 0) - 25);
        state.character.happiness = Math.min(100, state.character.happiness + 5);
        setBannerAlert('🪑 Rested peacefully on park bench! Health +10%, Stress Relieved!');
        break;
      case 'FOR_SALE_SIGN':
        const duplex = BUILDINGS.find((b) => b.id === 'bldg_duplex_property');
        if (duplex) handleEnterBuilding(duplex);
        break;
    }
    onUpdateState({ ...state });
    setTimeout(() => setBannerAlert(null), 4000);
  };

  // Modals
  const [showInventory, setShowInventory] = useState<boolean>(false);
  const [showCampaignModal, setShowCampaignModal] = useState<boolean>(false);
  const [showFreedomBellModal, setShowFreedomBellModal] = useState<boolean>(false);
  const [showLifeFocusModal, setShowLifeFocusModal] = useState<boolean>(false);
  const [showLegacyModal, setShowLegacyModal] = useState<boolean>(false);
  const [activeMinigame, setActiveMinigame] = useState<'VAULT_SORTER' | 'DCA_WAVE' | 'GROCERY' | null>(null);

  // Interior View: WALKABLE 2.5D room vs full TERMINAL dashboard
  const [interiorView, setInteriorView] = useState<'WALKABLE' | 'TERMINAL'>('WALKABLE');

  const handleEnterBuilding = (bldg: BuildingEntrance) => {
    soundFx.playLevelUp();
    setEnteredBuilding(bldg);
    setInteriorView('WALKABLE');
  };

  // Period / Turn advance handler
  const handleAdvancePeriod = () => {
    soundFx.playLevelUp();
    const result = advanceTurn(state);
    onUpdateState(result.nextState);
    const speedLabel = state.progressionSpeed || (state.turnDurationMonths === 1 ? 'Month' : state.turnDurationMonths === 12 ? 'Year' : 'Quarter');
    setBannerAlert(`⏩ Lived Next ${speedLabel}: Net Cashflow ${result.quarterCashflow.netCashflow >= 0 ? '+' : ''}$${result.quarterCashflow.netCashflow.toLocaleString()}, Age ${result.nextState.character.age}!`);
    setTimeout(() => setBannerAlert(null), 5000);
  };

  // Input keys
  const keysPressed = useRef<Record<string, boolean>>({});

  // Compute Active Quest Destination Building
  const currentChapter = chapters[activeChapterIdx];
  const targetBuilding: BuildingEntrance | null = customWaypoint || (() => {
    if (!currentChapter) return null;
    switch (currentChapter.chapter) {
      case 1:
      case 2:
        return BUILDINGS.find((b) => b.id === 'bldg_bank') || null;
      case 3:
        return BUILDINGS.find((b) => b.id === 'bldg_superstore') || null;
      case 4:
        return BUILDINGS.find((b) => b.id === 'bldg_career_tower') || null;
      case 5:
      case 6:
        return BUILDINGS.find((b) => b.id === 'bldg_stock_exchange') || null;
      case 7:
        return BUILDINGS.find((b) => b.id === 'bldg_cafe') || null;
      case 8:
        return BUILDINGS.find((b) => b.id === 'bldg_duplex_property') || null;
      case 9:
        return BUILDINGS.find((b) => b.id === 'bldg_university') || null;
      case 10:
        return BUILDINGS.find((b) => b.id === 'bldg_wealth_advisory') || null;
      case 11:
      case 12:
        return BUILDINGS.find((b) => b.id === 'bldg_town_hall') || null;
      default:
        return BUILDINGS.find((b) => b.id === 'bldg_bank') || null;
    }
  })();

  // Check Quest Objectives on state changes
  useEffect(() => {
    const curChapter = chapters[activeChapterIdx];
    if (!curChapter) return;

    let allCompleted = true;
    for (const obj of curChapter.objectives) {
      if (!obj.isCompleted && obj.check(state)) {
        obj.isCompleted = true;
        soundFx.playCoin();
        setBannerAlert(`⭐ Objective Complete: ${obj.description}`);
        setTimeout(() => setBannerAlert(null), 4000);
      }
      if (!obj.isCompleted) {
        allCompleted = false;
      }
    }

    if (allCompleted && !curChapter.isCompleted) {
      curChapter.isCompleted = true;
      soundFx.playLevelUp();
      confetti({ particleCount: 90, spread: 70 });
      state.cash += curChapter.rewardCash;
      state.totalXP += curChapter.rewardXP;
      setBannerAlert(`🎉 Chapter ${curChapter.chapter} Complete: ${curChapter.title}! (+${curChapter.rewardCash} Cash)`);
      if (activeChapterIdx < chapters.length - 1) {
        setActiveChapterIdx((idx) => idx + 1);
      }
      onUpdateState({ ...state });
    }
  }, [state, activeChapterIdx, chapters]);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;

      // E or Space to interact
      if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
        if (nearbyStreetProp) {
          handleInteractStreetProp(nearbyStreetProp);
        } else if (isNearFountain) {
          setShowFreedomBellModal(true);
        } else if (nearbyBuilding && !enteredBuilding) {
          handleEnterBuilding(nearbyBuilding);
        } else if (nearbyNpc && !talkingNpc) {
          soundFx.playTwistAlert();
          setTalkingNpc(nearbyNpc);
        }
      }

      // I for Inventory
      if (e.key === 'i' || e.key === 'I') {
        soundFx.playClick();
        setShowInventory((v) => !v);
      }

      if (e.key === 'Escape') {
        if (enteredBuilding) setEnteredBuilding(null);
        if (talkingNpc) setTalkingNpc(null);
        if (showInventory) setShowInventory(false);
        if (showCampaignModal) setShowCampaignModal(false);
        if (showFreedomBellModal) setShowFreedomBellModal(false);
        if (showLifeFocusModal) setShowLifeFocusModal(false);
        if (showLegacyModal) setShowLegacyModal(false);
        if (activeMinigame) setActiveMinigame(null);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyBuilding, nearbyNpc, nearbyStreetProp, enteredBuilding, talkingNpc, isNearFountain, showInventory, showCampaignModal, showFreedomBellModal, showLifeFocusModal, showLegacyModal, activeMinigame]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Update atmosphere day/night cycle & weather
      atmosphereRef.current.update(dt);
      ambientMusic.setMode(atmosphereRef.current.timeOfDay === 'NIGHT' ? 'NIGHT' : 'DAY');

      // Only move if not inside a modal
      if (!enteredBuilding && !talkingNpc && !activeMinigame && !showInventory && !showCampaignModal && !showFreedomBellModal && !showLifeFocusModal && !showLegacyModal) {
        let dx = 0;
        let dy = 0;

        if (keysPressed.current['w'] || keysPressed.current['arrowup']) dy -= 1;
        if (keysPressed.current['s'] || keysPressed.current['arrowdown']) dy += 1;
        if (keysPressed.current['a'] || keysPressed.current['arrowleft']) dx -= 1;
        if (keysPressed.current['d'] || keysPressed.current['arrowright']) dx += 1;

        if (dx !== 0 && dy !== 0) {
          dx *= 0.7071;
          dy *= 0.7071;
        }

        // Speed modified by vehicle: Foot = 190, Bicycle = 280, Car = 410 px/s
        let speed = 190;
        if (player.vehicle === 'BICYCLE') speed = 280;
        if (player.vehicle === 'CAR') speed = 410;

        let nextX = player.x + dx * speed * dt;
        let nextY = player.y + dy * speed * dt;

        // Boundaries of 64x50 map
        nextX = Math.max(TILE_SIZE * 2, Math.min(MAP_WIDTH * TILE_SIZE - TILE_SIZE * 2, nextX));
        nextY = Math.max(TILE_SIZE * 2, Math.min(MAP_HEIGHT * TILE_SIZE - TILE_SIZE * 2, nextY));

        const isMoving = dx !== 0 || dy !== 0;
        let direction = player.direction;
        if (Math.abs(dx) > Math.abs(dy)) {
          direction = dx > 0 ? 'right' : 'left';
        } else if (dy !== 0) {
          direction = dy > 0 ? 'down' : 'up';
        }

        player.x = nextX;
        player.y = nextY;
        player.direction = direction;
        player.isMoving = isMoving;
        if (isMoving) {
          player.walkFrame += dt * (player.vehicle === 'CAR' ? 6 : 10);
        }

        // Check Plaza Fountain proximity for Freedom Bell (at tileX 46, tileY 24)
        const fountainX = 46 * TILE_SIZE;
        const fountainY = 24 * TILE_SIZE;
        const distFountain = Math.hypot(player.x - fountainX, player.y - fountainY);
        setIsNearFountain(distFountain < 75);

        // Check building proximity
        let foundBldg: BuildingEntrance | null = null;
        for (const bldg of BUILDINGS) {
          const doorWorldX = bldg.tileX * TILE_SIZE;
          const doorWorldY = bldg.tileY * TILE_SIZE;
          const dist = Math.hypot(player.x - doorWorldX, player.y - doorWorldY);
          if (dist < 65) {
            foundBldg = bldg;
            break;
          }
        }
        setNearbyBuilding(foundBldg);

        // Check NPC proximity
        let foundNpc: NPC | null = null;
        for (const npc of npcs) {
          const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
          if (dist < 55) {
            foundNpc = npc;
            break;
          }
        }
        setNearbyNpc(foundNpc);

        // Check Street Props proximity
        let foundProp: StreetProp | null = null;
        for (const prop of STREET_PROPS) {
          const propX = prop.tileX * TILE_SIZE;
          const propY = prop.tileY * TILE_SIZE;
          const dist = Math.hypot(player.x - propX, player.y - propY);
          if (dist < 55) {
            foundProp = prop;
            break;
          }
        }
        setNearbyStreetProp(foundProp);

        // Check Collectibles
        for (const item of collectibles) {
          if (!item.isCollected) {
            const dist = Math.hypot(player.x - item.x, player.y - item.y);
            if (dist < 32) {
              item.isCollected = true;
              soundFx.playCoin();
              confetti({ particleCount: 35, spread: 45, origin: { y: 0.8 } });
              state.cash += item.value;
              state.totalXP += 25;
              setBannerAlert(`🎉 ${item.title}: ${item.message}`);
              onUpdateState({ ...state });
              setTimeout(() => setBannerAlert(null), 4000);
            }
          }
        }

        // NPC gentle wandering AI
        for (const npc of npcs) {
          if (npc.isWandering) {
            if (Math.random() < 0.02) {
              const angle = Math.random() * Math.PI * 2;
              const wanderDist = Math.random() * npc.wanderRadius;
              npc.targetX = npc.originX + Math.cos(angle) * wanderDist;
              npc.targetY = npc.originY + Math.sin(angle) * wanderDist;
            }
            if (npc.targetX && npc.targetY) {
              const toX = npc.targetX - npc.x;
              const toY = npc.targetY - npc.y;
              const d = Math.hypot(toX, toY);
              if (d > 4) {
                npc.x += (toX / d) * 35 * dt;
                npc.y += (toY / d) * 35 * dt;
              }
            }
          }
        }
      }

      // Render World Map
      const w = canvas.width;
      const h = canvas.height;

      renderWorldMap(
        ctx,
        player.x,
        player.y,
        w,
        h,
        nearbyBuilding ? nearbyBuilding.id : null,
        targetBuilding ? targetBuilding.id : null
      );

      renderEntities(
        ctx,
        player,
        npcs,
        collectibles,
        player.x,
        player.y,
        w,
        h,
        nearbyNpc ? nearbyNpc.id : null
      );

      // Render Day/Night Atmosphere & Light Sources
      const lightSources = BUILDINGS.map((b) => ({
        x: b.tileX * TILE_SIZE - player.x + w / 2,
        y: b.tileY * TILE_SIZE - player.y + h / 2,
        radius: 120,
        color: b.color,
      }));

      atmosphereRef.current.renderLighting(
        ctx,
        w,
        h,
        w / 2,
        h / 2,
        lightSources
      );

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [enteredBuilding, talkingNpc, nearbyBuilding, nearbyNpc, npcs, collectibles, state, activeMinigame, showInventory, showCampaignModal, showFreedomBellModal, showLifeFocusModal, showLegacyModal, isNearFountain, targetBuilding]);

  // Click / Tap to walk on canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickScreenX = e.clientX - rect.left;
    const clickScreenY = e.clientY - rect.top;

    const worldClickX = clickScreenX - canvas.width / 2 + player.x;
    const worldClickY = clickScreenY - canvas.height / 2 + player.y;

    if (isNearFountain) {
      setShowFreedomBellModal(true);
      return;
    }
    if (nearbyBuilding) {
      handleEnterBuilding(nearbyBuilding);
      return;
    }
    if (nearbyNpc) {
      soundFx.playTwistAlert();
      setTalkingNpc(nearbyNpc);
      return;
    }

    const dx = worldClickX - player.x;
    const dy = worldClickY - player.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 10) {
      player.x += (dx / dist) * Math.min(dist, 100);
      player.y += (dy / dist) * Math.min(dist, 100);
      player.direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up';
    }
  };

  const netWorth = getNetWorth(state);

  return (
    <div className="relative w-full h-[88vh] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 flex flex-col select-none">
      
      {/* 1. Guided Objective Compass HUD (Top-Center Floating Bar) */}
      <GuidedCompass
        playerX={player.x}
        playerY={player.y}
        targetBuilding={targetBuilding}
        chapterTitle={`Ch. ${currentChapter?.chapter || 1}: ${currentChapter?.title || 'Prosperity'}`}
        objectiveText={currentChapter?.objectives[0]?.description || 'Explore the Metropolis'}
        onSelectWaypoint={(b) => setCustomWaypoint(b)}
      />

      {/* 2. Interactive Metropolis Mini-Map Radar (Top-Right HUD) */}
      <MiniMapRadar
        playerX={player.x}
        playerY={player.y}
        playerDirection={player.direction}
        targetBuilding={targetBuilding}
        onSelectWaypoint={(b) => setCustomWaypoint(b)}
      />

      {/* 3. Top-Left Player Vitals & Status */}
      <div className="absolute top-3 left-3 z-30 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3 bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/80 shadow-xl">
          <div className="text-2xl">{state.character.avatar}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs text-white">{state.character.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                {player.vehicle !== 'FOOT' ? `🚗 ${player.vehicle}` : '👟 Walking'}
              </span>
              {player.hasPet && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                  🐕 Hound
                </span>
              )}
            </div>
            <div className="flex items-center gap-2.5 text-xs mt-0.5 font-mono">
              <span className="text-emerald-400 font-bold">
                ${Math.round(state.cash).toLocaleString()}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-purple-300 font-bold">
                Net: ${netWorth.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Quest Tracker HUD (Left Middle) */}
      {chapters[activeChapterIdx] && (
        <QuestTrackerHUD
          currentChapter={chapters[activeChapterIdx]}
          onOpenCampaignModal={() => setShowCampaignModal(true)}
        />
      )}

      {/* Floating Banner Notification */}
      {bannerAlert && (
        <div className="absolute top-16 inset-x-6 z-30 max-w-lg mx-auto bg-slate-950/90 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 backdrop-blur-md animate-in slide-in-from-top duration-300">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{bannerAlert}</span>
        </div>
      )}

      {/* Main HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        width={1000}
        height={650}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair block"
      />

      {/* Floating Bottom Action Prompt Bar */}
      {(nearbyBuilding || nearbyNpc || isNearFountain || nearbyStreetProp) && !enteredBuilding && !talkingNpc && !activeMinigame && (
        <div className="absolute bottom-20 inset-x-6 z-30 max-w-md mx-auto animate-in slide-in-from-bottom duration-200">
          <button
            onClick={() => {
              if (nearbyStreetProp) {
                handleInteractStreetProp(nearbyStreetProp);
              } else if (isNearFountain) {
                setShowFreedomBellModal(true);
              } else if (nearbyBuilding) {
                handleEnterBuilding(nearbyBuilding);
              } else if (nearbyNpc) {
                soundFx.playTwistAlert();
                setTalkingNpc(nearbyNpc);
              }
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-2xl shadow-emerald-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>
              {nearbyStreetProp
                ? `${nearbyStreetProp.icon} ${nearbyStreetProp.name} [E]`
                : isNearFountain
                ? '🔔 Ring Freedom Bell (FIRE Summit) [E]'
                : nearbyBuilding
                ? `Enter ${nearbyBuilding.name} [E]`
                : `Talk to ${nearbyNpc?.name} [E]`}
            </span>
          </button>
        </div>
      )}

      {/* Floating Life Stage, Priorities & Progression HUD (Bottom Center) */}
      <LifeStageHUD
        state={state}
        onOpenFocusModal={() => setShowLifeFocusModal(true)}
        onOpenLegacyModal={() => setShowLegacyModal(true)}
        onAdvancePeriod={handleAdvancePeriod}
      />

      {/* Bottom Right Inventory & Campaign Quick Bar */}
      <div className="absolute bottom-20 right-6 z-20 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => {
            soundFx.playClick();
            setShowInventory(true);
          }}
          className="px-3.5 py-2.5 rounded-2xl bg-slate-950/85 backdrop-blur-md text-slate-200 hover:text-white border border-slate-700/80 text-xs font-bold shadow-xl flex items-center gap-2 cursor-pointer"
          title="Open Backpack [I]"
        >
          <Backpack className="w-4 h-4 text-emerald-400" />
          <span>Bag [I]</span>
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            setShowCampaignModal(true);
          }}
          className="px-3.5 py-2.5 rounded-2xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold shadow-xl flex items-center gap-2 cursor-pointer backdrop-blur-md"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Quests</span>
        </button>
      </div>

      {/* On-Screen Mobile Virtual D-Pad */}
      <div className="absolute bottom-6 left-6 z-20 sm:hidden flex flex-col items-center gap-1 opacity-80 pointer-events-auto">
        <button
          onTouchStart={() => { keysPressed.current['w'] = true; }}
          onTouchEnd={() => { keysPressed.current['w'] = false; }}
          className="w-11 h-11 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center text-white active:bg-emerald-500"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          <button
            onTouchStart={() => { keysPressed.current['a'] = true; }}
            onTouchEnd={() => { keysPressed.current['a'] = false; }}
            className="w-11 h-11 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center text-white active:bg-emerald-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onTouchStart={() => { keysPressed.current['s'] = true; }}
            onTouchEnd={() => { keysPressed.current['s'] = false; }}
            className="w-11 h-11 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center text-white active:bg-emerald-500"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            onTouchStart={() => { keysPressed.current['d'] = true; }}
            onTouchEnd={() => { keysPressed.current['d'] = false; }}
            className="w-11 h-11 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center text-white active:bg-emerald-500"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Building Interior Modal: Walkable 2.5D Room or Interactive Terminal */}
      {enteredBuilding && (() => {
        const room = INTERIOR_ROOMS[enteredBuilding.id];
        if (room && interiorView === 'WALKABLE') {
          return (
            <WalkableInterior
              room={room}
              playerEntity={player}
              onExit={() => setEnteredBuilding(null)}
              onSwitchToTerminal={() => setInteriorView('TERMINAL')}
              onTriggerStation={(station) => {
                if (station.actionType === 'BANK_VAULT') {
                  setActiveMinigame('VAULT_SORTER');
                } else if (station.actionType === 'STOCK_TERMINAL') {
                  setActiveMinigame('DCA_WAVE');
                } else if (station.actionType === 'CAFE_BAR') {
                  state.character.happiness = Math.min(100, state.character.happiness + 8);
                  state.character.health = Math.min(100, state.character.health + 4);
                  if (state.burnout) state.burnout = Math.max(0, state.burnout - 15);
                  onUpdateState({ ...state });
                  soundFx.playCoin();
                  setBannerAlert('☕ Fresh espresso enjoyed! Happiness +8%, Health +4%, Burnout reduced!');
                  setTimeout(() => setBannerAlert(null), 4000);
                } else if (station.actionType === 'HOME_BED') {
                  state.character.health = Math.min(100, state.character.health + 15);
                  state.character.happiness = Math.min(100, state.character.happiness + 15);
                  state.burnout = 0;
                  onUpdateState({ ...state });
                  soundFx.playLevelUp();
                  setBannerAlert('🛏️ Rested comfortably in your studio! Health & Happiness +15%, Burnout reset to 0%!');
                  setTimeout(() => setBannerAlert(null), 4000);
                } else {
                  // Bank Teller, Stock Broker, Cafe Table, Home Laptop -> Switch to Terminal view
                  setInteriorView('TERMINAL');
                }
              }}
            />
          );
        }

        return (
          <RPGBuildingInterior
            building={enteredBuilding}
            state={state}
            onExit={() => setEnteredBuilding(null)}
            onUpdateState={onUpdateState}
            onLaunchMinigame={(m) => setActiveMinigame(m)}
            onOpenLegacyModal={() => setShowLegacyModal(true)}
            onEquipVehicle={(v) => setPlayer((p) => ({ ...p, vehicle: v }))}
            onEquipPet={() => setPlayer((p) => ({ ...p, hasPet: true }))}
            currentVehicle={player.vehicle}
            hasPet={player.hasPet}
            onSwitchToWalkable={room ? () => setInteriorView('WALKABLE') : undefined}
          />
        );
      })()}

      {/* Active Mini-Games */}
      {activeMinigame === 'VAULT_SORTER' && (
        <VaultSorterMinigame
          onClose={() => setActiveMinigame(null)}
          onComplete={(score, cash, xp) => {
            state.cash += cash;
            state.totalXP += xp;
            onUpdateState({ ...state });
            setActiveMinigame(null);
            setBannerAlert(`🎉 Vault Sorting Complete! +$${cash} Cash, +${xp} XP.`);
          }}
        />
      )}

      {activeMinigame === 'DCA_WAVE' && (
        <DCAWaveRiderMinigame
          onClose={() => setActiveMinigame(null)}
          onComplete={(shares, profit, xp) => {
            state.cash += profit;
            state.totalXP += xp;
            onUpdateState({ ...state });
            setActiveMinigame(null);
            setBannerAlert(`📈 DCA Wave Completed: +$${profit} profit, +${xp} XP!`);
          }}
        />
      )}

      {activeMinigame === 'GROCERY' && (
        <SupermarketBasketMinigame
          onClose={() => setActiveMinigame(null)}
          onComplete={(savings, xp) => {
            state.cash += savings;
            state.totalXP += xp;
            onUpdateState({ ...state });
            setActiveMinigame(null);
            setBannerAlert(`🛒 Smart Grocery Completed: +$${savings} cash saved, +${xp} XP!`);
          }}
        />
      )}

      {/* NPC Dialogue Box */}
      {talkingNpc && (
        <DialogueBox
          npc={talkingNpc}
          state={state}
          onClose={() => setTalkingNpc(null)}
          onUpdateState={onUpdateState}
        />
      )}

      {/* Backpack Inventory Modal */}
      {showInventory && (
        <InventoryModal
          items={inventoryItems}
          onToggleEquip={(item) => {
            item.isEquipped = !item.isEquipped;
            setInventoryItems([...inventoryItems]);
          }}
          onClose={() => setShowInventory(false)}
        />
      )}

      {/* Campaign Story Modal */}
      {showCampaignModal && (
        <CampaignStoryModal
          chapters={chapters}
          activeChapterIdx={activeChapterIdx}
          onClose={() => setShowCampaignModal(false)}
        />
      )}

      {/* Freedom Bell FIRE Finale Modal */}
      {showFreedomBellModal && (
        <FreedomBellModal
          state={state}
          onClose={() => setShowFreedomBellModal(false)}
        />
      )}

      {/* Life Priorities & Progression Speed Modal */}
      {showLifeFocusModal && (
        <LifeFocusModal
          state={state}
          onUpdateState={onUpdateState}
          onAdvancePeriod={handleAdvancePeriod}
          onClose={() => setShowLifeFocusModal(false)}
        />
      )}

      {/* Generational Legacy & New Game+ Modal */}
      {showLegacyModal && (
        <GenerationalLegacyModal
          state={state}
          onSuccessorCreated={(nextState) => {
            onUpdateState(nextState);
            setShowLegacyModal(false);
            setBannerAlert(`👑 Generation ${nextState.generationalLegacy?.generation} has begun! Welcome, ${nextState.character.name}!`);
          }}
          onClose={() => setShowLegacyModal(false)}
        />
      )}

    </div>
  );
};
