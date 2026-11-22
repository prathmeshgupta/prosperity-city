import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from '../world/mapData';
import { soundFx } from '../../audio/soundFx';

export type VehicleType = 'SUPERCAR' | 'SEDAN' | 'POLICE' | 'TAXI' | 'VAN';

export interface Vehicle {
  id: string;
  model: string;
  type: VehicleType;
  x: number;
  y: number;
  angle: number; // in radians, 0 = facing right (East)
  speed: number; // in px/s (-150 to +620)
  maxSpeed: number;
  acceleration: number;
  handling: number; // turn speed rad/s
  driftFactor: number;
  color: string;
  roofColor: string;
  accentColor: string;
  isPlayerOccupied: boolean;
  isParked: boolean;
  sirenActive: boolean;
  headlightsActive: boolean;
  brakeLightsActive: boolean;
  health: number;
  laneDir?: 1 | -1; // For cruising AI
  laneAxis?: 'H' | 'V';
}

export interface SkidMark {
  x: number;
  y: number;
  angle: number;
  opacity: number;
}

export interface VehicleSmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

// Initial Parked and Patrol Vehicles across Prosperity City
export const INITIAL_VEHICLES: Vehicle[] = [
  // 1. Executive GT outside Stock Exchange (Tile X: 22, Y: 16)
  {
    id: 'veh_apex_gt',
    model: 'Apex Electric GT',
    type: 'SUPERCAR',
    x: 22 * TILE_SIZE,
    y: 16.5 * TILE_SIZE,
    angle: 0,
    speed: 0,
    maxSpeed: 520,
    acceleration: 440,
    handling: 3.2,
    driftFactor: 1.6,
    color: '#ef4444',
    roofColor: '#991b1b',
    accentColor: '#facc15',
    isPlayerOccupied: false,
    isParked: true,
    sirenActive: false,
    headlightsActive: true,
    brakeLightsActive: false,
    health: 100,
  },
  // 2. High-Tech Long-Range EV outside Tech Incubator (Tile X: 48, Y: 16)
  {
    id: 'veh_aether_ev',
    model: 'Aether Long-Range EV',
    type: 'SUPERCAR',
    x: 48 * TILE_SIZE,
    y: 16.5 * TILE_SIZE,
    angle: 0,
    speed: 0,
    maxSpeed: 540,
    acceleration: 480,
    handling: 3.4,
    driftFactor: 1.4,
    color: '#06b6d4',
    roofColor: '#0891b2',
    accentColor: '#38bdf8',
    isPlayerOccupied: false,
    isParked: true,
    sirenActive: false,
    headlightsActive: true,
    brakeLightsActive: false,
    health: 100,
  },
  // 3. Executive Sedan outside Wealth Advisory (Tile X: 64, Y: 16)
  {
    id: 'veh_heritage_sedan',
    model: 'Heritage Executive Town Car',
    type: 'SEDAN',
    x: 64 * TILE_SIZE,
    y: 16.5 * TILE_SIZE,
    angle: 0,
    speed: 0,
    maxSpeed: 440,
    acceleration: 340,
    handling: 2.6,
    driftFactor: 1.2,
    color: '#0f172a',
    roofColor: '#1e293b',
    accentColor: '#e2e8f0',
    isPlayerOccupied: false,
    isParked: true,
    sirenActive: false,
    headlightsActive: true,
    brakeLightsActive: false,
    health: 100,
  },
  // 4. Municipal Transit Patrol outside City Hall (Tile X: 34, Y: 30)
  {
    id: 'veh_municipal_patrol',
    model: 'Municipal Transit Patrol',
    type: 'POLICE',
    x: 34 * TILE_SIZE,
    y: 30.5 * TILE_SIZE,
    angle: Math.PI,
    speed: 0,
    maxSpeed: 480,
    acceleration: 400,
    handling: 3.0,
    driftFactor: 1.3,
    color: '#1e293b',
    roofColor: '#ffffff',
    accentColor: '#38bdf8',
    isPlayerOccupied: false,
    isParked: true,
    sirenActive: false,
    headlightsActive: true,
    brakeLightsActive: false,
    health: 100,
  },
  // 5. Metro Yellow Cab in Civic Plaza (Tile X: 42, Y: 30)
  {
    id: 'veh_metro_cab',
    model: 'Metro Yellow Cab',
    type: 'TAXI',
    x: 42 * TILE_SIZE,
    y: 30.5 * TILE_SIZE,
    angle: 0,
    speed: 0,
    maxSpeed: 420,
    acceleration: 320,
    handling: 2.8,
    driftFactor: 1.2,
    color: '#facc15',
    roofColor: '#ca8a04',
    accentColor: '#18181b',
    isPlayerOccupied: false,
    isParked: true,
    sirenActive: false,
    headlightsActive: true,
    brakeLightsActive: false,
    health: 100,
  },
  // 6. Horizon Executive Coupe outside Residential Condos (Tile X: 64, Y: 44)
  {
    id: 'veh_horizon_coupe',
    model: 'Horizon Executive Coupe',
    type: 'SUPERCAR',
    x: 64 * TILE_SIZE,
    y: 44.5 * TILE_SIZE,
    angle: Math.PI,
    speed: 0,
    maxSpeed: 500,
    acceleration: 420,
    handling: 3.2,
    driftFactor: 1.5,
    color: '#8b5cf6',
    roofColor: '#6d28d9',
    accentColor: '#c084fc',
    isPlayerOccupied: false,
    isParked: true,
    sirenActive: false,
    headlightsActive: true,
    brakeLightsActive: false,
    health: 100,
  },
  // 7. Commercial Logistics Van outside Megamart (Tile X: 48, Y: 44)
  {
    id: 'veh_logistics_van',
    model: 'Commercial Logistics Van',
    type: 'VAN',
    x: 48 * TILE_SIZE,
    y: 44.5 * TILE_SIZE,
    angle: 0,
    speed: 0,
    maxSpeed: 360,
    acceleration: 260,
    handling: 2.2,
    driftFactor: 1.0,
    color: '#0284c7',
    roofColor: '#0369a1',
    accentColor: '#38bdf8',
    isPlayerOccupied: false,
    isParked: true,
    sirenActive: false,
    headlightsActive: true,
    brakeLightsActive: false,
    health: 100,
  },
];

export class VehicleEngine {
  public vehicles: Vehicle[] = [...INITIAL_VEHICLES];
  public playerVehicle: Vehicle | null = null;
  public skidMarks: SkidMark[] = [];
  public smokeParticles: VehicleSmokeParticle[] = [];
  private lastTireScreechTime: number = 0;

  constructor() {
    this.initCruisingTraffic();
  }

  private initCruisingTraffic() {
    // Add active cruising NPC traffic along the avenues
    const cruising = [
      { id: 'ai_veh_1', model: 'Ubermacht Sentinel', type: 'SEDAN' as VehicleType, x: 24 * TILE_SIZE, y: 14.5 * TILE_SIZE, angle: 0, speed: 130, color: '#10b981', roofColor: '#047857', laneAxis: 'H' as const, laneDir: 1 as const },
      { id: 'ai_veh_2', model: 'Bravado Buffalo', type: 'SUPERCAR' as VehicleType, x: 60 * TILE_SIZE, y: 15.5 * TILE_SIZE, angle: Math.PI, speed: 140, color: '#f97316', roofColor: '#c2410c', laneAxis: 'H' as const, laneDir: -1 as const },
      { id: 'ai_veh_3', model: 'Vapid Minivan', type: 'VAN' as VehicleType, x: 30 * TILE_SIZE, y: 28.5 * TILE_SIZE, angle: 0, speed: 110, color: '#0ea5e9', roofColor: '#0284c7', laneAxis: 'H' as const, laneDir: 1 as const },
      { id: 'ai_veh_4', model: 'Police Interceptor Patrol', type: 'POLICE' as VehicleType, x: 70 * TILE_SIZE, y: 29.5 * TILE_SIZE, angle: Math.PI, speed: 160, color: '#0f172a', roofColor: '#ffffff', laneAxis: 'H' as const, laneDir: -1 as const, sirenActive: true },
      { id: 'ai_veh_5', model: 'Albany Primo', type: 'SEDAN' as VehicleType, x: 44.5 * TILE_SIZE, y: 35 * TILE_SIZE, angle: Math.PI / 2, speed: 120, color: '#ec4899', roofColor: '#be185d', laneAxis: 'V' as const, laneDir: 1 as const },
    ];

    cruising.forEach((c) => {
      this.vehicles.push({
        id: c.id,
        model: c.model,
        type: c.type,
        x: c.x,
        y: c.y,
        angle: c.angle,
        speed: c.speed,
        maxSpeed: 380,
        acceleration: 300,
        handling: 2.5,
        driftFactor: 1.2,
        color: c.color,
        roofColor: c.roofColor,
        accentColor: '#ffffff',
        isPlayerOccupied: false,
        isParked: false,
        sirenActive: c.sirenActive || false,
        headlightsActive: true,
        brakeLightsActive: false,
        health: 100,
        laneAxis: c.laneAxis,
        laneDir: c.laneDir,
      });
    });
  }

  public getNearestVehicle(playerX: number, playerY: number, maxDist: number = 75): Vehicle | null {
    let nearest: Vehicle | null = null;
    let minDist = maxDist;

    for (const v of this.vehicles) {
      if (v.isPlayerOccupied) continue;
      const dist = Math.hypot(v.x - playerX, v.y - playerY);
      if (dist < minDist) {
        minDist = dist;
        nearest = v;
      }
    }
    return nearest;
  }

  public enterVehicle(vehicle: Vehicle): Vehicle {
    vehicle.isPlayerOccupied = true;
    vehicle.isParked = false;
    vehicle.headlightsActive = true;
    this.playerVehicle = vehicle;
    soundFx.playCarEnter();
    soundFx.playCarIgnition();
    return vehicle;
  }

  public exitVehicle(): { x: number; y: number } {
    if (!this.playerVehicle) return { x: 0, y: 0 };
    const veh = this.playerVehicle;
    veh.isPlayerOccupied = false;
    veh.speed = 0;
    this.playerVehicle = null;
    soundFx.playCarEnter();

    // Spawn player to the left of driver door
    const exitAngle = veh.angle - Math.PI / 2;
    const exitX = veh.x + Math.cos(exitAngle) * 36;
    const exitY = veh.y + Math.sin(exitAngle) * 36;
    return { x: exitX, y: exitY };
  }

  public honk() {
    if (this.playerVehicle) {
      soundFx.playCarHorn();
    }
  }

  public toggleSiren() {
    if (this.playerVehicle && (this.playerVehicle.type === 'POLICE' || this.playerVehicle.type === 'SUPERCAR')) {
      this.playerVehicle.sirenActive = !this.playerVehicle.sirenActive;
      if (this.playerVehicle.sirenActive) {
        soundFx.playPoliceSiren();
      }
    }
  }

  public update(
    dt: number,
    keys: Record<string, boolean>,
    onPedestrianAlert?: (alertX: number, alertY: number) => void
  ) {
    const minRoadX = 16 * TILE_SIZE;
    const maxRoadX = 79 * TILE_SIZE; // Strictly before beach (81) and ocean (84)
    const minRoadY = 13 * TILE_SIZE;
    const maxRoadY = 60 * TILE_SIZE;

    // 1. Update Player Vehicle Driving Physics
    if (this.playerVehicle) {
      const v = this.playerVehicle;
      const isThrottling = keys['w'] || keys['arrowup'];
      const isBraking = keys['s'] || keys['arrowdown'];
      const isSteeringLeft = keys['a'] || keys['arrowleft'];
      const isSteeringRight = keys['d'] || keys['arrowright'];
      const isHandbrake = keys[' '] || keys['space'];

      // Acceleration / Reverse
      if (isThrottling) {
        v.speed = Math.min(v.maxSpeed, v.speed + v.acceleration * dt);
        v.brakeLightsActive = false;
      } else if (isBraking) {
        if (v.speed > 20) {
          // Hard brake
          v.speed = Math.max(0, v.speed - v.acceleration * 1.8 * dt);
          v.brakeLightsActive = true;
        } else {
          // Reverse
          v.speed = Math.max(-180, v.speed - v.acceleration * 0.7 * dt);
          v.brakeLightsActive = true;
        }
      } else {
        // Natural rolling friction deceleration
        v.brakeLightsActive = false;
        if (Math.abs(v.speed) < 15) {
          v.speed = 0;
        } else {
          v.speed -= Math.sign(v.speed) * 160 * dt;
        }
      }

      // Steering
      if (Math.abs(v.speed) > 5) {
        const speedRatio = Math.min(1.0, Math.abs(v.speed) / 250);
        const steerDir = Math.sign(v.speed) >= 0 ? 1 : -1;
        let turnRate = v.handling * speedRatio * steerDir * dt;

        if (isHandbrake) {
          turnRate *= v.driftFactor; // Power-slide drift!
        }

        if (isSteeringLeft) v.angle -= turnRate;
        if (isSteeringRight) v.angle += turnRate;
      }

      // Handbrake Drift effects & tire skid marks
      if (isHandbrake && Math.abs(v.speed) > 120) {
        v.speed = Math.max(0, v.speed - 320 * dt);
        const now = Date.now();
        if (now - this.lastTireScreechTime > 350) {
          soundFx.playTireScreech();
          this.lastTireScreechTime = now;
        }

        // Add skid marks behind rear wheels
        const rearX = v.x - Math.cos(v.angle) * 18;
        const rearY = v.y - Math.sin(v.angle) * 18;
        this.skidMarks.push({
          x: rearX,
          y: rearY,
          angle: v.angle,
          opacity: 0.8,
        });

        // Add tire smoke puff
        this.smokeParticles.push({
          x: rearX,
          y: rearY,
          vx: (Math.random() - 0.5) * 30,
          vy: (Math.random() - 0.5) * 30,
          size: 6,
          alpha: 0.7,
        });
      }

      // Apply velocity vector
      let nextX = v.x + Math.cos(v.angle) * v.speed * dt;
      let nextY = v.y + Math.sin(v.angle) * v.speed * dt;

      // Keep within city roads & boundaries
      nextX = Math.max(minRoadX, Math.min(maxRoadX, nextX));
      nextY = Math.max(minRoadY, Math.min(maxRoadY, nextY));

      v.x = nextX;
      v.y = nextY;

      // Alert pedestrians if speeding or honking
      if (Math.abs(v.speed) > 280 && onPedestrianAlert) {
        onPedestrianAlert(v.x, v.y);
      }
    }

    // 2. Update AI Cruising Traffic
    for (const v of this.vehicles) {
      if (v.isPlayerOccupied || v.isParked) continue;

      if (v.laneAxis === 'H') {
        v.x += (v.laneDir || 1) * v.speed * dt;
        v.angle = v.laneDir === 1 ? 0 : Math.PI;
        // Loop at road edges
        if (v.laneDir === 1 && v.x > maxRoadX) v.x = minRoadX;
        if (v.laneDir === -1 && v.x < minRoadX) v.x = maxRoadX;
      } else if (v.laneAxis === 'V') {
        v.y += (v.laneDir || 1) * v.speed * dt;
        v.angle = v.laneDir === 1 ? Math.PI / 2 : -Math.PI / 2;
        if (v.laneDir === 1 && v.y > maxRoadY) v.y = minRoadY;
        if (v.laneDir === -1 && v.y < minRoadY) v.y = maxRoadY;
      }
    }

    // 3. Update Skidmarks (slow fade over time)
    if (this.skidMarks.length > 200) {
      this.skidMarks.splice(0, this.skidMarks.length - 200);
    }
    for (const sm of this.skidMarks) {
      sm.opacity = Math.max(0.2, sm.opacity - dt * 0.01);
    }

    // 4. Update Smoke Particles
    for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
      const p = this.smokeParticles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.size += dt * 8;
      p.alpha -= dt * 1.2;
      if (p.alpha <= 0) {
        this.smokeParticles.splice(i, 1);
      }
    }
  }
}

export const vehicleEngine = new VehicleEngine();
