import React, { useState } from 'react';
import { BuildingEntrance, BUILDINGS, TILE_SIZE } from '../world/mapData';
import { Compass, MapPin, ChevronDown, Sparkles, Navigation } from 'lucide-react';

interface GuidedCompassProps {
  playerX: number; // in world px
  playerY: number;
  targetBuilding: BuildingEntrance | null;
  chapterTitle: string;
  objectiveText: string;
  onSelectWaypoint: (bldg: BuildingEntrance) => void;
}

export const GuidedCompass: React.FC<GuidedCompassProps> = ({
  playerX,
  playerY,
  targetBuilding,
  chapterTitle,
  objectiveText,
  onSelectWaypoint,
}) => {
  const [showWaypointMenu, setShowWaypointMenu] = useState<boolean>(false);

  // Compute vector and distance
  let distanceMeters = 0;
  let angleDeg = 0;

  if (targetBuilding) {
    const targetX = targetBuilding.tileX * TILE_SIZE;
    const targetY = targetBuilding.tileY * TILE_SIZE;
    const dx = targetX - playerX;
    const dy = targetY - playerY;
    distanceMeters = Math.round(Math.hypot(dx, dy) / 10);
    // Math.atan2 returns angle where 0 is right, Math.PI/2 is down
    angleDeg = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
  }

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-auto">
      {/* Main Floating Capsule */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80 shadow-2xl text-white select-none">
        
        {/* Dynamic Rotating Compass Arrow */}
        <div className="relative w-8 h-8 rounded-full bg-slate-900 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-inner">
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-100 ease-linear"
            style={{ transform: `rotate(${angleDeg}deg)` }}
          >
            <Navigation className="w-5 h-5 text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
          </div>
        </div>

        {/* Quest / Destination Details */}
        <div className="text-left pr-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {chapterTitle}
            </span>
            {targetBuilding && (
              <span className="text-xs font-mono font-bold text-emerald-400">
                {distanceMeters}m away
              </span>
            )}
          </div>
          <div className="text-xs font-bold text-slate-100 truncate max-w-xs sm:max-w-md">
            {objectiveText}
          </div>
        </div>

        {/* Quick Waypoint Dropdown Trigger */}
        <div className="relative border-l border-slate-800 pl-2">
          <button
            onClick={() => setShowWaypointMenu((v) => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            title="Set Custom Waypoint"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline font-semibold text-[11px]">
              {targetBuilding ? targetBuilding.name.split(' ')[0] : 'Waypoints'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Waypoints Menu */}
          {showWaypointMenu && (
            <div className="absolute top-full mt-2 right-0 w-64 max-h-72 overflow-y-auto rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl p-2 space-y-1 z-50 backdrop-blur-xl animate-in fade-in">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select City Destination
              </div>
              {BUILDINGS.map((bldg) => (
                <button
                  key={bldg.id}
                  onClick={() => {
                    onSelectWaypoint(bldg);
                    setShowWaypointMenu(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                    targetBuilding?.id === bldg.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="text-base">{bldg.icon}</span>
                  <div className="truncate">
                    <div className="font-bold text-white text-[11px] truncate">{bldg.name}</div>
                    <div className="text-[9px] text-slate-400 truncate">{bldg.district}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
