import React, { useState } from 'react';
import { BUILDINGS, BuildingEntrance, MAP_WIDTH, MAP_HEIGHT, TILE_SIZE } from '../world/mapData';
import { Maximize2, Minimize2, MapPin, Navigation, Sparkles } from 'lucide-react';

interface MiniMapRadarProps {
  playerX: number; // in world px
  playerY: number;
  playerDirection: 'up' | 'down' | 'left' | 'right';
  targetBuilding: BuildingEntrance | null;
  onSelectWaypoint: (bldg: BuildingEntrance) => void;
}

export const MiniMapRadar: React.FC<MiniMapRadarProps> = ({
  playerX,
  playerY,
  playerDirection,
  targetBuilding,
  onSelectWaypoint,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Player position in tile units
  const playerTileX = playerX / TILE_SIZE;
  const playerTileY = playerY / TILE_SIZE;

  // Determine current district
  let currentDistrict = 'Central Town Plaza';
  if (playerTileY < 18) {
    if (playerTileX < 20) currentDistrict = 'University Campus';
    else if (playerTileX < 32) currentDistrict = 'Apex Business Zone';
    else currentDistrict = 'Wall St Financial District';
  } else if (playerTileY > 32) {
    if (playerTileX < 20) currentDistrict = 'Commercial Boulevard';
    else if (playerTileX < 50) currentDistrict = 'Residential Suburbs';
    else currentDistrict = 'Shady Back-Alley';
  } else {
    if (playerTileX < 20) currentDistrict = 'Commercial Boulevard';
    else if (playerTileX > 50) currentDistrict = 'Oceanfront Pier';
    else currentDistrict = 'Central Civic Plaza';
  }

  // Mini dimensions
  const miniW = 160;
  const miniH = 125;
  const scaleX = miniW / MAP_WIDTH;
  const scaleY = miniH / MAP_HEIGHT;

  return (
    <>
      {/* Compact Top-Right HUD Radar */}
      <div className="absolute top-3 right-3 z-30 select-none">
        <div className="p-2 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80 shadow-2xl space-y-1.5">
          {/* Header Bar */}
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-300 px-1">
            <span className="flex items-center gap-1 text-emerald-400 truncate max-w-[110px]">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{currentDistrict}</span>
            </span>
            <button
              onClick={() => setIsExpanded(true)}
              className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              title="Expand Metropolis Map"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>

          {/* Mini Canvas / Vector SVG Radar */}
          <div
            className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 cursor-pointer"
            style={{ width: `${miniW}px`, height: `${miniH}px` }}
            onClick={() => setIsExpanded(true)}
          >
            {/* Water zone on right */}
            <div
              className="absolute top-0 right-0 h-full bg-cyan-950/70 border-l border-cyan-800/40"
              style={{ width: `${(MAP_WIDTH - 52) * scaleX}px` }}
            />

            {/* Central Plaza rectangle */}
            <div
              className="absolute bg-emerald-950/40 border border-emerald-800/30 rounded-sm"
              style={{
                left: `${24 * scaleX}px`,
                top: `${16 * scaleY}px`,
                width: `${14 * scaleX}px`,
                height: `${12 * scaleY}px`,
              }}
            />

            {/* Road lines */}
            <div
              className="absolute bg-slate-700/60"
              style={{ left: 0, top: `${13 * scaleY}px`, width: '100%', height: `${2 * scaleY}px` }}
            />
            <div
              className="absolute bg-slate-700/60"
              style={{ left: 0, top: `${29 * scaleY}px`, width: '100%', height: `${2 * scaleY}px` }}
            />
            <div
              className="absolute bg-slate-700/60"
              style={{ left: `${15 * scaleX}px`, top: 0, width: `${2 * scaleX}px`, height: '100%' }}
            />
            <div
              className="absolute bg-slate-700/60"
              style={{ left: `${27 * scaleX}px`, top: 0, width: `${2 * scaleX}px`, height: '100%' }}
            />
            <div
              className="absolute bg-slate-700/60"
              style={{ left: `${41 * scaleX}px`, top: 0, width: `${2 * scaleX}px`, height: '100%' }}
            />

            {/* Building Pins */}
            {BUILDINGS.map((bldg) => {
              const bldgX = bldg.tileX * scaleX;
              const bldgY = bldg.tileY * scaleY;
              const isTarget = targetBuilding?.id === bldg.id;

              return (
                <div
                  key={bldg.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${bldgX}px`, top: `${bldgY}px` }}
                  title={bldg.name}
                >
                  {isTarget ? (
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-white flex items-center justify-center text-[8px] animate-bounce shadow-lg shadow-amber-500/50">
                      ★
                    </div>
                  ) : (
                    <div
                      className="w-2 h-2 rounded-full border border-slate-900"
                      style={{ backgroundColor: bldg.color }}
                    />
                  )}
                </div>
              );
            })}

            {/* Player Blinking Dot with Cone */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
              style={{ left: `${playerTileX * scaleX}px`, top: `${playerTileY * scaleY}px` }}
            >
              <div className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-white shadow-md shadow-emerald-400/80 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Full-Screen City Metropolis Map Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel max-w-4xl w-full rounded-3xl p-6 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
                  🗺️
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">Prosperity City Metropolis Map</h3>
                  <p className="text-xs text-slate-400">
                    64x50 Urban Grid • Click any building to set your Navigation Waypoint
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Buildings Directory Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {BUILDINGS.map((bldg) => {
                const isTarget = targetBuilding?.id === bldg.id;
                const dist = Math.round(
                  Math.hypot(bldg.tileX * TILE_SIZE - playerX, bldg.tileY * TILE_SIZE - playerY) / 10
                );

                return (
                  <button
                    key={bldg.id}
                    onClick={() => {
                      onSelectWaypoint(bldg);
                      setIsExpanded(false);
                    }}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isTarget
                        ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xl">{bldg.icon}</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {dist}m away
                      </span>
                    </div>

                    <div className="mt-2">
                      <div className="font-extrabold text-xs text-white truncate">{bldg.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{bldg.subtitle}</div>
                      <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase">
                        📍 {bldg.district}
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                      <span className="text-emerald-400 font-semibold">Click to Navigate</span>
                      {isTarget && (
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          ★ Active Waypoint
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>You are currently in: <strong className="text-white">{currentDistrict}</strong></span>
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
              >
                Close Map
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
