import React, { useEffect, useRef, useState } from 'react';
import { InteriorRoom, InteriorStation } from '../world/interiorData';
import { PlayerEntity } from './entityRenderer';
import { renderWalkableInterior } from './interiorRenderer';
import { soundFx } from '../../audio/soundFx';
import { LogOut, Sliders, Sparkles, Navigation, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const TILE = 40;

interface WalkableInteriorProps {
  room: InteriorRoom;
  playerEntity: PlayerEntity;
  onExit: () => void;
  onTriggerStation: (station: InteriorStation) => void;
  onSwitchToTerminal: () => void;
}

export const WalkableInterior: React.FC<WalkableInteriorProps> = ({
  room,
  playerEntity,
  onExit,
  onTriggerStation,
  onSwitchToTerminal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Indoor player coordinates (relative to room origin 0..640, 0..480)
  const [inX, setInX] = useState<number>(room.playerSpawnX);
  const [inY, setInY] = useState<number>(room.playerSpawnY);
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('up');
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [walkFrame, setWalkFrame] = useState<number>(0);
  const [focusedStation, setFocusedStation] = useState<InteriorStation | null>(null);

  const keysPressed = useRef<Record<string, boolean>>({});

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;

      if (e.key === 'Escape') {
        soundFx.playClick();
        onExit();
      }

      if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
        if (focusedStation) {
          soundFx.playLevelUp();
          onTriggerStation(focusedStation);
        }
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
  }, [focusedStation, onExit, onTriggerStation]);

  // 60 FPS Animation & Movement Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

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

      const speed = 180; // px/sec
      let nextX = inX + dx * speed * dt;
      let nextY = inY + dy * speed * dt;

      // Clamp inside room walls (y=2..11 tiles, x=1..15 tiles)
      const minX = 1 * TILE;
      const maxX = (room.widthTiles - 1) * TILE;
      const minY = 2.5 * TILE;
      const maxY = (room.heightTiles - 1) * TILE;

      nextX = Math.max(minX, Math.min(maxX, nextX));
      nextY = Math.max(minY, Math.min(maxY, nextY));

      const moving = dx !== 0 || dy !== 0;
      let dir = direction;
      if (Math.abs(dx) > Math.abs(dy)) {
        dir = dx > 0 ? 'right' : 'left';
      } else if (dy !== 0) {
        dir = dy > 0 ? 'down' : 'up';
      }

      setInX(nextX);
      setInY(nextY);
      setDirection(dir);
      setIsMoving(moving);
      if (moving) setWalkFrame((f) => f + dt * 10);

      // Check door step-out exit
      const doorPxX = room.doorTileX * TILE + TILE / 2;
      const doorPxY = room.doorTileY * TILE + TILE / 2;
      if (Math.hypot(nextX - doorPxX, nextY - doorPxY) < 30) {
        soundFx.playClick();
        onExit();
        return;
      }

      // Check station proximity
      let foundStation: InteriorStation | null = null;
      for (const st of room.stations) {
        const stCenterX = (st.tileX + st.widthTiles / 2) * TILE;
        const stCenterY = (st.tileY + st.heightTiles / 2) * TILE;
        const dist = Math.hypot(nextX - stCenterX, nextY - stCenterY);
        if (dist < 75) {
          foundStation = st;
          break;
        }
      }
      setFocusedStation(foundStation);

      // Render
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          renderWalkableInterior(
            ctx,
            room,
            nextX,
            nextY,
            {
              ...playerEntity,
              direction: dir,
              isMoving: moving,
              walkFrame,
              vehicle: 'FOOT',
            },
            canvas.width,
            canvas.height,
            foundStation
          );
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [inX, inY, direction, walkFrame, room, playerEntity, onExit]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-4xl h-[90vh] rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-950 flex flex-col">
        
        {/* Top Interior Header Bar */}
        <div className="p-3.5 px-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-30">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                Walkable Interior
              </span>
              <h2 className="text-base font-extrabold text-white">{room.name}</h2>
            </div>
            <p className="text-[11px] text-slate-400">{room.subtitle}</p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Terminal Switch Button */}
            <button
              onClick={onSwitchToTerminal}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Switch to Full Operations Dashboard"
            >
              <span>📊 Terminal Dashboard</span>
            </button>

            {/* Exit to Street */}
            <button
              onClick={onExit}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 hover:text-white text-xs font-bold border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit [ESC]</span>
            </button>
          </div>
        </div>

        {/* 2.5D Room Canvas */}
        <div className="flex-1 relative overflow-hidden bg-slate-950 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={800}
            height={560}
            className="w-full h-full object-contain block"
          />

          {/* Bottom Interactive Station Prompt */}
          {focusedStation && (
            <div className="absolute bottom-6 inset-x-6 z-40 max-w-md mx-auto animate-in slide-in-from-bottom duration-200">
              <button
                onClick={() => {
                  soundFx.playLevelUp();
                  onTriggerStation(focusedStation);
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105"
              >
                <span>{focusedStation.icon}</span>
                <span>OPEN {focusedStation.actionLabel.toUpperCase()} [E]</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile D-Pad */}
        <div className="absolute bottom-6 left-6 z-30 sm:hidden flex flex-col items-center gap-1 opacity-80 pointer-events-auto">
          <button
            onTouchStart={() => { keysPressed.current['w'] = true; }}
            onTouchEnd={() => { keysPressed.current['w'] = false; }}
            className="w-10 h-10 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center text-white"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            <button
              onTouchStart={() => { keysPressed.current['a'] = true; }}
              onTouchEnd={() => { keysPressed.current['a'] = false; }}
              className="w-10 h-10 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onTouchStart={() => { keysPressed.current['s'] = true; }}
              onTouchEnd={() => { keysPressed.current['s'] = false; }}
              className="w-10 h-10 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center text-white"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onTouchStart={() => { keysPressed.current['d'] = true; }}
              onTouchEnd={() => { keysPressed.current['d'] = false; }}
              className="w-10 h-10 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center text-white"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
