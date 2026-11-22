import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, BUILDINGS } from '../world/mapData';

/**
 * Solid AABB and Circle Collision Engine for Prosperity City Metropolis.
 * Guarantees that:
 * 1. Vehicles and players CANNOT drive/walk into ocean water (x >= 84).
 * 2. Pedestrians can only traverse oceanfront via the wooden boardwalk pier.
 * 3. Vehicles are strictly barred from entering the boardwalk pier or beach (x >= 80).
 * 4. Solid building walls block both vehicles and characters, with smooth wall sliding.
 * 5. Pedestrians can walk directly into designated building doorways to trigger interiors.
 * 6. Central Plaza Fountain and city monuments are solid obstacles.
 */

export class CollisionEngine {
  /**
   * Check whether a bounding circle at (x, y) with given radius can traverse the terrain.
   */
  public canTraverse(
    x: number,
    y: number,
    radius: number = 10,
    isVehicle: boolean = false
  ): boolean {
    // 1. World map boundaries (margin of 1.5 tiles from absolute edge)
    const minBoundX = 1.8 * TILE_SIZE + radius;
    const maxBoundX = (MAP_WIDTH - 1.8) * TILE_SIZE - radius;
    const minBoundY = 1.8 * TILE_SIZE + radius;
    const maxBoundY = (MAP_HEIGHT - 1.8) * TILE_SIZE - radius;

    if (x < minBoundX || x > maxBoundX || y < minBoundY || y > maxBoundY) {
      return false;
    }

    // 2. Ocean Water & Beach Coastline Collisions
    // Water starts at tileX >= 84 (3,360px). Beach starts at tileX >= 81 (3,240px).
    const waterStartX = 84 * TILE_SIZE;
    const beachStartX = 80 * TILE_SIZE;

    // Boardwalk Pier runs from tileX 80 to 92, tileY 24 to 28.5
    const isBoardwalkPier =
      x >= 80 * TILE_SIZE &&
      x <= 92 * TILE_SIZE &&
      y >= 23.8 * TILE_SIZE &&
      y <= 28.8 * TILE_SIZE;

    if (isVehicle) {
      // Vehicles are strictly prohibited from beach and boardwalk pier!
      // Must stay strictly within the paved city streets (x < 80 * TILE_SIZE)
      if (x + radius >= beachStartX) {
        return false;
      }
    } else {
      // On foot: can walk on beach (81-83) and boardwalk pier (80-92 within Y 24-28.5)
      // Cannot walk into open ocean water (x >= 84 outside boardwalk pier or beyond pier end)
      if (x + radius >= waterStartX) {
        if (!isBoardwalkPier || x > 92.2 * TILE_SIZE) {
          return false; // Solid water barrier
        }
      }
    }

    // 3. Central Plaza Fountain (Solid circular marble basin)
    const fountainX = 46 * TILE_SIZE;
    const fountainY = 24 * TILE_SIZE;
    const fountainRadius = 46;
    if (Math.hypot(x - fountainX, y - fountainY) < fountainRadius + radius) {
      return false;
    }

    // 4. Clean Energy Wind Turbines (Southwest outskirts)
    const windmills = [
      { x: 8 * TILE_SIZE, y: 60 * TILE_SIZE },
      { x: 12 * TILE_SIZE, y: 64 * TILE_SIZE },
    ];
    for (const wm of windmills) {
      if (Math.hypot(x - wm.x, y - wm.y) < 22 + radius) {
        return false;
      }
    }

    // 5. Solid Building Footprint Collisions
    for (const bldg of BUILDINGS) {
      const bldgCenterX = bldg.tileX * TILE_SIZE;
      const bldgCenterY = bldg.tileY * TILE_SIZE;

      // Building footprint: 4.8 tiles wide (192px), 3.2 tiles deep (128px)
      const bldgMinX = bldgCenterX - 2.4 * TILE_SIZE;
      const bldgMaxX = bldgCenterX + 2.4 * TILE_SIZE;
      const bldgMinY = bldgCenterY - 2.6 * TILE_SIZE;
      const bldgMaxY = bldgCenterY + 0.3 * TILE_SIZE;

      if (
        x + radius > bldgMinX &&
        x - radius < bldgMaxX &&
        y + radius > bldgMinY &&
        y - radius < bldgMaxY
      ) {
        // Pedestrian Door Opening: Allow player on foot to walk right to the door steps
        if (!isVehicle) {
          const inDoorway =
            Math.abs(x - bldgCenterX) < 18 &&
            y >= bldgCenterY - 14 &&
            y <= bldgCenterY + 22;
          if (inDoorway) {
            continue; // Allowed to enter doorway threshold
          }
        }
        return false; // Solid exterior wall collision
      }
    }

    return true;
  }

  /**
   * Resolves movement using axis separation for smooth sliding along walls and barriers.
   */
  public resolveMovement(
    currentX: number,
    currentY: number,
    dx: number,
    dy: number,
    radius: number = 10,
    isVehicle: boolean = false
  ): { x: number; y: number; collided: boolean } {
    let newX = currentX;
    let newY = currentY;
    let collided = false;

    // Test X movement independently
    if (dx !== 0) {
      const targetX = currentX + dx;
      if (this.canTraverse(targetX, currentY, radius, isVehicle)) {
        newX = targetX;
      } else {
        collided = true;
      }
    }

    // Test Y movement independently
    if (dy !== 0) {
      const targetY = currentY + dy;
      if (this.canTraverse(newX, targetY, radius, isVehicle)) {
        newY = targetY;
      } else {
        collided = true;
      }
    }

    return { x: newX, y: newY, collided };
  }
}

export const collisionEngine = new CollisionEngine();
