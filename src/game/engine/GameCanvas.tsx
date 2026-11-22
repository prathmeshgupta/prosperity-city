import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GameState } from '../../types/game';
import { BUILDINGS, BuildingEntrance, TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from '../world/mapData';
import { STREET_PROPS, StreetProp } from '../world/streetProps';
import { INITIAL_NPCS, NPC } from '../entities/NPC';
import { INITIAL_COLLECTIBLES, Collectible } from '../entities/Collectible';
import { ThreeCityEngine } from '../three/ThreeCityEngine';
import { PlayerEntity } from './entityRenderer';
import { collisionEngine } from './collisionEngine';
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
import { vehicleEngine, Vehicle } from './vehicleEngine';
import { radioEngine, RadioStation } from './radioEngine';
import { wantedLevelEngine } from './wantedLevelEngine';
import { pedestrianEngine } from './pedestrianAI';
import { FinPhoneModal } from '../ui/FinPhoneModal';
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
  Zap,
  Smartphone,
  Radio as RadioIcon,
  Gauge,
  ShieldAlert
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
  const threeEngineRef = useRef<ThreeCityEngine | null>(null);

  // 3D Raycasting refs for click-to-move
  const raycasterRef = useRef(new THREE.Raycaster());
  const groundPlaneRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const mouseVecRef = useRef(new THREE.Vector2());
  const planeIntersectRef = useRef(new THREE.Vector3());

  // Camera Orbit Controls State
  const isDraggingCamera = useRef<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasDragged = useRef<boolean>(false);

  // Initialize Three.js Hardware-Accelerated 3D Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new ThreeCityEngine(canvas);
    threeEngineRef.current = engine;

    const handleResize = () => {
      if (canvas && threeEngineRef.current) {
        const width = canvas.clientWidth || window.innerWidth;
        const height = canvas.clientHeight || window.innerHeight;
        threeEngineRef.current.handleResize(width, height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.dispose();
      threeEngineRef.current = null;
    };
  }, []);

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
      netWorth: getNetWorth(state),
    }));
  }, [state.character.name, state.character.avatar, state.character.archetypeId, state.cash, state.emergencyFund, state.portfolio, state.debts]);

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
  const [nearbyVehicle, setNearbyVehicle] = useState<Vehicle | null>(null);
  const [showPhone, setShowPhone] = useState<boolean>(false);
  const [radioBanner, setRadioBanner] = useState<string | null>(null);
  const [wantedStars, setWantedStars] = useState<number>(wantedLevelEngine.getStars());
  const [vehicleSpeedMPH, setVehicleSpeedMPH] = useState<number>(0);
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

      // E or Space to interact (on foot)
      if (e.key === 'e' || e.key === 'E') {
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

      // F or Enter: Enter / Exit Vehicle (GTA mechanics!)
      if (e.key === 'f' || e.key === 'F' || (e.key === 'Enter' && nearbyVehicle)) {
        if (vehicleEngine.playerVehicle) {
          const exitPos = vehicleEngine.exitVehicle();
          setPlayer((prev) => ({
            ...prev,
            x: exitPos.x,
            y: exitPos.y,
            vehicle: 'FOOT',
          }));
          setBannerAlert('👟 Stepped out of vehicle.');
          setTimeout(() => setBannerAlert(null), 3000);
        } else if (nearbyVehicle) {
          vehicleEngine.enterVehicle(nearbyVehicle);
          setPlayer((prev) => ({
            ...prev,
            vehicle: 'CAR',
          }));
          radioEngine.start();
          const st = radioEngine.getCurrentStation();
          setRadioBanner(`📻 ${st.name} (${st.frequency}) • ${st.currentTrack}`);
          setBannerAlert(`🚗 Driving ${nearbyVehicle.model}! [W/S] Throttle/Brake, [A/D] Steer, [Space] Drift, [H] Horn, [R] Radio, [F] Exit`);
          setTimeout(() => {
            setBannerAlert(null);
            setRadioBanner(null);
          }, 4500);
        }
      }

      // H for Horn
      if (e.key === 'h' || e.key === 'H') {
        if (vehicleEngine.playerVehicle) {
          vehicleEngine.honk();
          pedestrianEngine.alertNearbyCar(player.x, player.y);
        }
      }

      // J for Siren
      if (e.key === 'j' || e.key === 'J') {
        vehicleEngine.toggleSiren();
      }

      // R for Radio Station Quick-Switch
      if (e.key === 'r' || e.key === 'R') {
        const nextSt = radioEngine.nextStation();
        setRadioBanner(`📻 ${nextSt.name} (${nextSt.frequency}) • ${nextSt.currentTrack}`);
        setTimeout(() => setRadioBanner(null), 4000);
      }

      // P for Smartphone (FinPhone 16 Pro)
      if (e.key === 'p' || e.key === 'P' || e.key === 'ArrowUp') {
        if (!vehicleEngine.playerVehicle && !enteredBuilding && !talkingNpc) {
          soundFx.playPhoneChime();
          setShowPhone((v) => !v);
        }
      }

      // I for Inventory
      if (e.key === 'i' || e.key === 'I') {
        soundFx.playClick();
        setShowInventory((v) => !v);
      }

      if (e.key === 'Escape') {
        if (showPhone) setShowPhone(false);
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
  }, [nearbyBuilding, nearbyNpc, nearbyStreetProp, nearbyVehicle, enteredBuilding, talkingNpc, isNearFountain, showInventory, showCampaignModal, showFreedomBellModal, showLifeFocusModal, showLegacyModal, activeMinigame, showPhone]);

  // Camera smooth tracking ref
  const cameraRef = useRef<{ x: number; y: number }>({
    x: 46 * TILE_SIZE,
    y: 28 * TILE_SIZE,
  });

  // Cached refs for proximity & transient HUD states to prevent 60 FPS re-render death spiral
  const nearbyBuildingRef = useRef<BuildingEntrance | null>(null);
  const nearbyNpcRef = useRef<NPC | null>(null);
  const nearbyVehicleRef = useRef<Vehicle | null>(null);
  const isNearFountainRef = useRef<boolean>(false);
  const nearbyPropRef = useRef<StreetProp | null>(null);
  const wantedStarsRef = useRef<number>(wantedLevelEngine.getStars());
  const lastMphRef = useRef<number>(0);

  // Synchronized refs for modals and game states inside the continuous RAF loop
  const stateRef = useRef<GameState>(state);
  stateRef.current = state;
  const npcsRef = useRef<NPC[]>(npcs);
  npcsRef.current = npcs;
  const collectiblesRef = useRef<Collectible[]>(collectibles);
  collectiblesRef.current = collectibles;
  const targetBuildingRef = useRef<BuildingEntrance | null>(targetBuilding);
  targetBuildingRef.current = targetBuilding;

  const enteredBuildingRef = useRef(enteredBuilding);
  enteredBuildingRef.current = enteredBuilding;
  const talkingNpcRef = useRef(talkingNpc);
  talkingNpcRef.current = talkingNpc;
  const activeMinigameRef = useRef(activeMinigame);
  activeMinigameRef.current = activeMinigame;
  const showInventoryRef = useRef(showInventory);
  showInventoryRef.current = showInventory;
  const showCampaignModalRef = useRef(showCampaignModal);
  showCampaignModalRef.current = showCampaignModal;
  const showFreedomBellModalRef = useRef(showFreedomBellModal);
  showFreedomBellModalRef.current = showFreedomBellModal;
  const showLifeFocusModalRef = useRef(showLifeFocusModal);
  showLifeFocusModalRef.current = showLifeFocusModal;
  const showLegacyModalRef = useRef(showLegacyModal);
  showLegacyModalRef.current = showLegacyModal;
  const showPhoneRef = useRef(showPhone);
  showPhoneRef.current = showPhone;

  // Main 60 FPS Continuous Game Loop
  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Update atmosphere day/night cycle & weather
      atmosphereRef.current.update(dt);
      ambientMusic.setMode(atmosphereRef.current.timeOfDay === 'NIGHT' ? 'NIGHT' : 'DAY');

      // Update Living Pedestrian Crowd & Regulatory Wanted Level
      pedestrianEngine.update(dt);
      wantedLevelEngine.update(dt);
      const curStars = wantedLevelEngine.getStars();
      if (curStars !== wantedStarsRef.current) {
        wantedStarsRef.current = curStars;
        setWantedStars(curStars);
      }

      // Only move if not inside a modal
      if (
        !enteredBuildingRef.current &&
        !talkingNpcRef.current &&
        !activeMinigameRef.current &&
        !showInventoryRef.current &&
        !showCampaignModalRef.current &&
        !showFreedomBellModalRef.current &&
        !showLifeFocusModalRef.current &&
        !showLegacyModalRef.current &&
        !showPhoneRef.current
      ) {
        // 1. VEHICLE DRIVING PHYSICS (GTA 6 Driving Mode!)
        if (vehicleEngine.playerVehicle) {
          vehicleEngine.update(dt, keysPressed.current, (alertX, alertY) => {
            pedestrianEngine.alertNearbyCar(alertX, alertY);
          });
          const v = vehicleEngine.playerVehicle;
          player.x = v.x;
          player.y = v.y;
          player.isMoving = Math.abs(v.speed) > 10;
          const curMph = Math.round(Math.abs(v.speed) / 3.8);
          if (Math.abs(curMph - lastMphRef.current) >= 2) {
            lastMphRef.current = curMph;
            setVehicleSpeedMPH(curMph);
          }

          // Sidewalk reckless driving detection
          const tileY = Math.floor(v.y / TILE_SIZE);
          const isSidewalk = (tileY === 13 || tileY === 16 || tileY === 27 || tileY === 30 || tileY === 41 || tileY === 44);
          if (isSidewalk && Math.abs(v.speed) > 280) {
            wantedLevelEngine.addHeat(0.004, 'Reckless Driving on Sidewalk');
          }
        } else {
          // 2. ON-FOOT WALKING MODE WITH SOLID COLLISION DETECTION
          vehicleEngine.update(dt, {}, (alertX, alertY) => {
            pedestrianEngine.alertNearbyCar(alertX, alertY);
          });
          if (lastMphRef.current !== 0) {
            lastMphRef.current = 0;
            setVehicleSpeedMPH(0);
          }

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

          let speed = 190;
          if (player.vehicle === 'BICYCLE') speed = 280;

          // Axis-separated solid collision resolution (Never walk into water or walls)
          const moveX = dx * speed * dt;
          const moveY = dy * speed * dt;
          const res = collisionEngine.resolveMovement(player.x, player.y, moveX, moveY, 12, false);

          const isMoving = dx !== 0 || dy !== 0;
          let direction = player.direction;
          if (Math.abs(dx) > Math.abs(dy)) {
            direction = dx > 0 ? 'right' : 'left';
          } else if (dy !== 0) {
            direction = dy > 0 ? 'down' : 'up';
          }

          player.x = res.x;
          player.y = res.y;
          player.direction = direction;
          player.isMoving = isMoving;
          if (isMoving) {
            player.walkFrame += dt * 10;
          }
        }

        // Check nearest vehicle proximity for [F] prompt
        const nearestVeh = vehicleEngine.getNearestVehicle(player.x, player.y, 65);
        if (nearestVeh?.id !== nearbyVehicleRef.current?.id) {
          nearbyVehicleRef.current = nearestVeh;
          setNearbyVehicle(nearestVeh);
        }

        // Check Plaza Fountain proximity for Freedom Bell (at tileX 46, tileY 24)
        const fountainX = 46 * TILE_SIZE;
        const fountainY = 24 * TILE_SIZE;
        const distFountain = Math.hypot(player.x - fountainX, player.y - fountainY);
        const nearFountain = distFountain < 75;
        if (nearFountain !== isNearFountainRef.current) {
          isNearFountainRef.current = nearFountain;
          setIsNearFountain(nearFountain);
        }

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
        if (foundBldg?.id !== nearbyBuildingRef.current?.id) {
          nearbyBuildingRef.current = foundBldg;
          setNearbyBuilding(foundBldg);
        }

        // Check NPC proximity
        let foundNpc: NPC | null = null;
        for (const npc of npcsRef.current) {
          const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
          if (dist < 55) {
            foundNpc = npc;
            break;
          }
        }
        if (foundNpc?.id !== nearbyNpcRef.current?.id) {
          nearbyNpcRef.current = foundNpc;
          setNearbyNpc(foundNpc);
        }

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
        if (foundProp?.id !== nearbyPropRef.current?.id) {
          nearbyPropRef.current = foundProp;
          setNearbyStreetProp(foundProp);
        }

        // Check Collectibles
        for (const item of collectiblesRef.current) {
          if (!item.isCollected) {
            const dist = Math.hypot(player.x - item.x, player.y - item.y);
            if (dist < 32) {
              item.isCollected = true;
              soundFx.playCoin();
              confetti({ particleCount: 35, spread: 45, origin: { y: 0.8 } });
              stateRef.current.cash += item.value;
              stateRef.current.totalXP += 25;
              setBannerAlert(`🎉 ${item.title}: ${item.message}`);
              onUpdateState({ ...stateRef.current });
              setTimeout(() => setBannerAlert(null), 4000);
            }
          }
        }

        // NPC gentle wandering AI
        for (const npc of npcsRef.current) {
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

      // Smooth Camera Lerp Tracking (with GTA driving lookahead)
      let targetCamX = player.x;
      let targetCamY = player.y;

      if (vehicleEngine.playerVehicle && Math.abs(vehicleEngine.playerVehicle.speed) > 100) {
        const v = vehicleEngine.playerVehicle;
        const lookAhead = Math.min(180, Math.abs(v.speed) * 0.35);
        targetCamX += Math.cos(v.angle) * lookAhead;
        targetCamY += Math.sin(v.angle) * lookAhead;
      }

      const lerpFactor = vehicleEngine.playerVehicle ? 0.08 : 0.14;
      cameraRef.current.x += (targetCamX - cameraRef.current.x) * lerpFactor;
      cameraRef.current.y += (targetCamY - cameraRef.current.y) * lerpFactor;

      // Master 3D WebGL Metropolis Renderer with Dynamic Shadows & Lighting
      if (threeEngineRef.current) {
        const isNight = atmosphereRef.current.timeOfDay === 'NIGHT';
        threeEngineRef.current.render(
          player,
          npcsRef.current,
          collectiblesRef.current,
          dt,
          time / 1000,
          targetBuildingRef.current ? targetBuildingRef.current.id : null,
          isNight
        );
      }

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [onUpdateState]);

  // 3D Camera Mouse Orbit & Zoom Controls
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Right click (2) or Left click (0) while holding Shift/Alt to orbit camera
    if (e.button === 2 || (e.button === 0 && (e.shiftKey || e.altKey))) {
      isDraggingCamera.current = true;
      hasDragged.current = false;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDraggingCamera.current && threeEngineRef.current) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasDragged.current = true;
      }
      threeEngineRef.current.cameraController.rotate(-dx * 0.006, -dy * 0.005);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    isDraggingCamera.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (threeEngineRef.current) {
      threeEngineRef.current.cameraController.zoom(e.deltaY * 0.03);
    }
  };

  // Click / Tap to walk on 3D canvas (via Raycasting onto ground plane)
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (hasDragged.current) {
      hasDragged.current = false;
      return;
    }

    if (isNearFountainRef.current) {
      setShowFreedomBellModal(true);
      return;
    }
    if (nearbyBuildingRef.current) {
      handleEnterBuilding(nearbyBuildingRef.current);
      return;
    }
    if (nearbyNpcRef.current) {
      soundFx.playTwistAlert();
      setTalkingNpc(nearbyNpcRef.current);
      return;
    }

    if (threeEngineRef.current) {
      const rect = canvas.getBoundingClientRect();
      mouseVecRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVecRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseVecRef.current, threeEngineRef.current.cameraController.camera);
      const hit = raycasterRef.current.ray.intersectPlane(groundPlaneRef.current, planeIntersectRef.current);
      if (hit) {
        // Map 3D coordinates back to collision world px (1 3D unit = 10 px)
        const targetWorldX = hit.x * 10;
        const targetWorldY = hit.z * 10;

        const dx = targetWorldX - player.x;
        const dy = targetWorldY - player.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 10) {
          const step = Math.min(dist, 120);
          const res = collisionEngine.resolveMovement(
            player.x,
            player.y,
            (dx / dist) * step,
            (dy / dist) * step,
            12,
            false
          );
          player.x = res.x;
          player.y = res.y;
          player.direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up';
          player.isMoving = true;
          player.walkFrame += 1;
        }
      }
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

      {/* Floating Radio Station Banner (GTA Radio Wheel HUD) */}
      {radioBanner && (
        <div className="absolute top-14 inset-x-0 mx-auto w-fit z-40 bg-slate-950/95 border border-pink-500/60 text-white px-5 py-2 rounded-2xl shadow-2xl flex items-center gap-2.5 backdrop-blur-md animate-in slide-in-from-top duration-300 pointer-events-none">
          <RadioIcon className="w-4 h-4 text-pink-400 animate-pulse" />
          <span className="font-mono text-xs font-black tracking-wide text-pink-200">{radioBanner}</span>
        </div>
      )}

      {/* Floating Regulatory Wanted Level Stars HUD (Top Right under Radar) */}
      {wantedStars > 0 && (
        <div className="absolute top-44 right-3 z-30 pointer-events-auto bg-slate-950/90 border border-red-500/60 px-3 py-1.5 rounded-2xl shadow-2xl flex flex-col items-end backdrop-blur-md animate-pulse">
          <div className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>SEC WANTED</span>
          </div>
          <div className="text-base text-amber-400 font-extrabold tracking-wider">
            {'⭐'.repeat(wantedStars)}
          </div>
        </div>
      )}

      {/* Emergency Police Pursuit Red & Blue Vignette Border (if 3+ Wanted Stars) */}
      {wantedStars >= 3 && (
        <div className="absolute inset-0 pointer-events-none z-20 border-[6px] border-red-500/40 animate-pulse" />
      )}

      {/* Floating Banner Notification */}
      {bannerAlert && (
        <div className="absolute top-16 inset-x-6 z-30 max-w-lg mx-auto bg-slate-950/90 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 backdrop-blur-md animate-in slide-in-from-top duration-300">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{bannerAlert}</span>
        </div>
      )}

      {/* Main 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        className="w-full h-full cursor-crosshair block"
      />

      {/* Vehicular In-Car Speedometer & Dashboard (Bottom Left when driving) */}
      {vehicleEngine.playerVehicle && (
        <div className="absolute bottom-20 left-6 z-30 pointer-events-auto bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-4 animate-in slide-in-from-left duration-200">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              {vehicleEngine.playerVehicle.model}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black font-mono text-white">
                {vehicleSpeedMPH}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">MPH</span>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-slate-800" />
          <div className="flex flex-col gap-0.5 text-[10px] font-mono">
            <span className="text-slate-300 font-bold">
              GEAR {vehicleSpeedMPH === 0 ? 'P' : vehicleEngine.playerVehicle.speed < 0 ? 'R' : Math.min(6, Math.max(1, Math.floor(vehicleSpeedMPH / 22) + 1))}
            </span>
            <span className="text-sky-400 font-bold">
              [Space] DRIFT • [H] HORN • [F] EXIT
            </span>
          </div>
        </div>
      )}

      {/* Floating Bottom Action Prompt Bar */}
      {(nearbyBuilding || nearbyNpc || isNearFountain || nearbyStreetProp || nearbyVehicle || vehicleEngine.playerVehicle) && !enteredBuilding && !talkingNpc && !activeMinigame && (
        <div className="absolute bottom-20 inset-x-6 z-30 max-w-md mx-auto animate-in slide-in-from-bottom duration-200">
          <button
            onClick={() => {
              if (vehicleEngine.playerVehicle) {
                const exitPos = vehicleEngine.exitVehicle();
                setPlayer((prev) => ({ ...prev, x: exitPos.x, y: exitPos.y, vehicle: 'FOOT' }));
                setBannerAlert('👟 Stepped out of vehicle.');
                setTimeout(() => setBannerAlert(null), 3000);
              } else if (nearbyVehicle) {
                vehicleEngine.enterVehicle(nearbyVehicle);
                setPlayer((prev) => ({ ...prev, vehicle: 'CAR' }));
                radioEngine.start();
                const st = radioEngine.getCurrentStation();
                setRadioBanner(`📻 ${st.name} (${st.frequency}) • ${st.currentTrack}`);
                setBannerAlert(`🚗 Driving ${nearbyVehicle.model}! [W/S] Throttle/Brake, [A/D] Steer, [Space] Drift, [H] Horn, [R] Radio, [F] Exit`);
                setTimeout(() => {
                  setBannerAlert(null);
                  setRadioBanner(null);
                }, 4500);
              } else if (nearbyStreetProp) {
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
              {vehicleEngine.playerVehicle
                ? `🚗 Exit ${vehicleEngine.playerVehicle.model} [F]`
                : nearbyVehicle
                ? `🚗 Drive ${nearbyVehicle.model} [F]`
                : nearbyStreetProp
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

      {/* Bottom Right Inventory & Phone Quick Bar */}
      <div className="absolute bottom-20 right-6 z-20 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => {
            soundFx.playPhoneChime();
            setShowPhone(true);
          }}
          className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600/40 to-blue-600/40 hover:from-indigo-600/60 hover:to-blue-600/60 text-indigo-300 hover:text-white border border-indigo-500/50 text-xs font-bold shadow-xl flex items-center gap-2 cursor-pointer backdrop-blur-md transition-all"
          title="Pull Up FinPhone [P]"
        >
          <Smartphone className="w-4 h-4 text-indigo-400" />
          <span>Phone [P]</span>
        </button>

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

      {/* GTA Smartphone (iFruit FinPhone 16 Pro) */}
      {showPhone && (
        <FinPhoneModal
          state={state}
          onUpdateState={onUpdateState}
          onClose={() => setShowPhone(false)}
          onAlert={(msg) => {
            setBannerAlert(msg);
            setTimeout(() => setBannerAlert(null), 4000);
          }}
        />
      )}

    </div>
  );
};
