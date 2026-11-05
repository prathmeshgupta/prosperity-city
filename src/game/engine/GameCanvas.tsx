import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameState } from '../../types/game';
import { BUILDINGS, BuildingEntrance, TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from '../world/mapData';
import { INITIAL_NPCS, NPC } from '../entities/NPC';
import { INITIAL_COLLECTIBLES, Collectible } from '../entities/Collectible';
import { renderWorldMap } from './tilesetRenderer';
import { renderEntities, PlayerEntity } from './entityRenderer';
import { RPGBuildingInterior } from '../ui/RPGBuildingInterior';
import { DialogueBox } from '../ui/DialogueBox';
import { soundFx } from '../../audio/soundFx';
import { getNetWorth } from '../../engine/gameEngine';
import confetti from 'canvas-confetti';
import { 
  Compass, 
  MapPin, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  Award,
  Wallet,
  Smile,
  Heart
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

  // Player state in world px (Starts in Town Plaza)
  const [player, setPlayer] = useState<PlayerEntity>({
    x: 24 * TILE_SIZE,
    y: 17 * TILE_SIZE,
    direction: 'down',
    isMoving: false,
    walkFrame: 0,
    name: state.character.name,
    avatarEmoji: state.character.avatar,
    shirtColor: '#10b981',
  });

  const [npcs, setNpcs] = useState<NPC[]>(INITIAL_NPCS);
  const [collectibles, setCollectibles] = useState<Collectible[]>(INITIAL_COLLECTIBLES);

  // Active overlays
  const [enteredBuilding, setEnteredBuilding] = useState<BuildingEntrance | null>(null);
  const [talkingNpc, setTalkingNpc] = useState<NPC | null>(null);
  const [nearbyBuilding, setNearbyBuilding] = useState<BuildingEntrance | null>(null);
  const [nearbyNpc, setNearbyNpc] = useState<NPC | null>(null);
  const [bannerAlert, setBannerAlert] = useState<string | null>('Welcome to Prosperity City! Walk with WASD or Tap.');

  // Input keys
  const keysPressed = useRef<Record<string, boolean>>({});

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;

      // E or Space to interact
      if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
        if (nearbyBuilding && !enteredBuilding) {
          soundFx.playLevelUp();
          setEnteredBuilding(nearbyBuilding);
        } else if (nearbyNpc && !talkingNpc) {
          soundFx.playTwistAlert();
          setTalkingNpc(nearbyNpc);
        }
      }

      if (e.key === 'Escape') {
        if (enteredBuilding) setEnteredBuilding(null);
        if (talkingNpc) setTalkingNpc(null);
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
  }, [nearbyBuilding, nearbyNpc, enteredBuilding, talkingNpc]);

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

      // Only move if not in modal
      if (!enteredBuilding && !talkingNpc) {
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

        const speed = 180; // px per second
        let nextX = player.x + dx * speed * dt;
        let nextY = player.y + dy * speed * dt;

        // Boundaries
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
          player.walkFrame += dt * 10;
        }

        // Check building proximity
        let foundBldg: BuildingEntrance | null = null;
        for (const bldg of BUILDINGS) {
          const doorWorldX = bldg.tileX * TILE_SIZE;
          const doorWorldY = bldg.tileY * TILE_SIZE;
          const dist = Math.hypot(player.x - doorWorldX, player.y - doorWorldY);
          if (dist < 60) {
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

        // Check Collectibles
        for (const item of collectibles) {
          if (!item.isCollected) {
            const dist = Math.hypot(player.x - item.x, player.y - item.y);
            if (dist < 30) {
              item.isCollected = true;
              soundFx.playCoin();
              confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
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

      // Render Everything onto Canvas
      const w = canvas.width;
      const h = canvas.height;

      renderWorldMap(ctx, player.x, player.y, w, h, nearbyBuilding ? nearbyBuilding.id : null);
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

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [enteredBuilding, talkingNpc, nearbyBuilding, nearbyNpc, npcs, collectibles, state]);

  // Click / Tap to walk on canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickScreenX = e.clientX - rect.left;
    const clickScreenY = e.clientY - rect.top;

    // Convert screen coordinates to world
    const worldClickX = clickScreenX - canvas.width / 2 + player.x;
    const worldClickY = clickScreenY - canvas.height / 2 + player.y;

    // If clicked on nearby building or npc, interact!
    if (nearbyBuilding) {
      soundFx.playLevelUp();
      setEnteredBuilding(nearbyBuilding);
      return;
    }
    if (nearbyNpc) {
      soundFx.playTwistAlert();
      setTalkingNpc(nearbyNpc);
      return;
    }

    // Move player toward click point
    const dx = worldClickX - player.x;
    const dy = worldClickY - player.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 10) {
      player.x += (dx / dist) * Math.min(dist, 90);
      player.y += (dy / dist) * Math.min(dist, 90);
      player.direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up';
    }
  };

  const netWorth = getNetWorth(state);

  return (
    <div className="relative w-full h-[85vh] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 flex flex-col select-none">
      
      {/* Top Game HUD Bar */}
      <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between gap-3 pointer-events-none">
        
        {/* Left: Player Mini Vitals */}
        <div className="pointer-events-auto flex items-center gap-3 bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/80 shadow-xl">
          <div className="text-2xl">{state.character.avatar}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">{state.character.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                Age {state.character.age}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs mt-0.5 font-mono">
              <span className="text-emerald-400 font-bold">
                Cash: ${Math.round(state.cash).toLocaleString()}
              </span>
              <span className="text-purple-300 font-bold">
                Net Worth: ${netWorth.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Switch to Executive Simulator Mode */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700/80">
          <span className="text-[11px] text-slate-300 font-semibold">Mode:</span>
          <span className="text-xs font-bold text-emerald-400">🕹️ 2D City RPG</span>
          <button
            onClick={() => {
              soundFx.playClick();
              onSwitchToExecutiveMode();
            }}
            className="ml-2 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all border border-slate-700 cursor-pointer"
          >
            Switch to Executive Simulator ➔
          </button>
        </div>

        {/* Right: Quick Controls & Compass */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => {
              soundFx.playCoin();
              setBannerAlert('Walk to First Prosperity Bank, Stock Exchange, or talk to NPCs!');
            }}
            className="px-3.5 py-2 rounded-2xl bg-slate-950/85 backdrop-blur-md text-slate-300 hover:text-white border border-slate-700/80 text-xs font-bold shadow-xl flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Map Guide</span>
          </button>
        </div>

      </div>

      {/* Floating Banner Notification */}
      {bannerAlert && (
        <div className="absolute top-20 inset-x-6 z-30 max-w-lg mx-auto bg-slate-950/90 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 backdrop-blur-md animate-in slide-in-from-top duration-300">
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

      {/* Bottom Floating Interaction Prompt Bar */}
      {(nearbyBuilding || nearbyNpc) && !enteredBuilding && !talkingNpc && (
        <div className="absolute bottom-6 inset-x-6 z-30 max-w-md mx-auto animate-in slide-in-from-bottom duration-200">
          <button
            onClick={() => {
              if (nearbyBuilding) {
                soundFx.playLevelUp();
                setEnteredBuilding(nearbyBuilding);
              } else if (nearbyNpc) {
                soundFx.playTwistAlert();
                setTalkingNpc(nearbyNpc);
              }
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-2xl shadow-emerald-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>
              {nearbyBuilding ? `Enter ${nearbyBuilding.name} [E]` : `Talk to ${nearbyNpc?.name} [E]`}
            </span>
          </button>
        </div>
      )}

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

      {/* Building Interior Modal */}
      {enteredBuilding && (
        <RPGBuildingInterior
          building={enteredBuilding}
          state={state}
          onExit={() => setEnteredBuilding(null)}
          onUpdateState={onUpdateState}
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

    </div>
  );
};
