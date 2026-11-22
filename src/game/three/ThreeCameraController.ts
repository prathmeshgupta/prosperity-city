import * as THREE from 'three';
import { PlayerEntity } from '../engine/entityRenderer';
import { vehicleEngine } from '../engine/vehicleEngine';
import { pxTo3DX, pxTo3DZ } from './ThreeTerrainBuilder';

export class ThreeCameraController {
  public camera: THREE.PerspectiveCamera;
  private currentTarget: THREE.Vector3 = new THREE.Vector3();
  private currentCamPos: THREE.Vector3 = new THREE.Vector3();

  // Orbital Camera Parameters
  public yaw: number = 0; // 0 = south looking north
  public pitch: number = 0.62; // ~35 degrees elevation
  public distance: number = 36.0; // Distance behind player
  public minDistance: number = 16.0;
  public maxDistance: number = 70.0;

  constructor(fov: number = 55, aspect: number = 1.6) {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.5, 1200);
    this.camera.position.set(46 * 4, 25, 28 * 4 + 32);
    this.currentTarget.set(46 * 4, 2.0, 28 * 4);
    this.currentCamPos.copy(this.camera.position);
  }

  public rotate(deltaYaw: number, deltaPitch: number) {
    this.yaw += deltaYaw;
    this.pitch = Math.max(0.18, Math.min(1.25, this.pitch + deltaPitch));
  }

  public zoom(deltaDistance: number) {
    this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, this.distance + deltaDistance));
  }

  public update(player: PlayerEntity, dt: number) {
    const isDriving = vehicleEngine.playerVehicle !== null || player.vehicle === 'CAR';
    const playerX3D = pxTo3DX(player.x);
    const playerZ3D = pxTo3DZ(player.y);

    if (isDriving && vehicleEngine.playerVehicle) {
      const v = vehicleEngine.playerVehicle;
      const speed = Math.abs(v.speed);
      const speedRatio = Math.min(1.0, speed / 380);

      // GTA Dynamic Pursuit Camera behind car
      // Align yaw to car's heading
      const carHeading = -v.angle + Math.PI / 2;
      // Smoothly rotate yaw toward car heading
      let diff = carHeading - this.yaw;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.yaw += diff * 0.12;

      const dynamicDist = 26 + speedRatio * 8;
      const dynamicHeight = 11 - speedRatio * 2;

      const behindAngle = this.yaw;
      const targetX = playerX3D - Math.sin(behindAngle) * dynamicDist;
      const targetZ = playerZ3D - Math.cos(behindAngle) * dynamicDist;
      const targetY = dynamicHeight;

      // Dynamic FOV speed boost
      const targetFov = 55 + speedRatio * 14;
      this.camera.fov += (targetFov - this.camera.fov) * 0.08;
      this.camera.updateProjectionMatrix();

      // Smooth camera position interpolation
      this.currentCamPos.x += (targetX - this.currentCamPos.x) * 0.14;
      this.currentCamPos.y += (targetY - this.currentCamPos.y) * 0.14;
      this.currentCamPos.z += (targetZ - this.currentCamPos.z) * 0.14;
      this.camera.position.copy(this.currentCamPos);

      // Look at car with lookahead forward
      const lookAhead = 12 + speedRatio * 16;
      const lookX = playerX3D + Math.sin(behindAngle) * lookAhead;
      const lookZ = playerZ3D + Math.cos(behindAngle) * lookAhead;
      this.currentTarget.x += (lookX - this.currentTarget.x) * 0.18;
      this.currentTarget.y = 1.4;
      this.currentTarget.z += (lookZ - this.currentTarget.z) * 0.18;
      this.camera.lookAt(this.currentTarget);
    } else {
      // On-Foot Third-Person Camera with Free Orbital Orbit & Smooth Tracking
      const defaultFov = 55;
      if (Math.abs(this.camera.fov - defaultFov) > 0.5) {
        this.camera.fov += (defaultFov - this.camera.fov) * 0.1;
        this.camera.updateProjectionMatrix();
      }

      const horizontalDist = this.distance * Math.cos(this.pitch);
      const verticalDist = this.distance * Math.sin(this.pitch);

      const camOffsetX = horizontalDist * Math.sin(this.yaw);
      const camOffsetZ = horizontalDist * Math.cos(this.yaw);

      const targetCamX = playerX3D + camOffsetX;
      const targetCamY = verticalDist;
      const targetCamZ = playerZ3D + camOffsetZ;

      this.currentCamPos.x += (targetCamX - this.currentCamPos.x) * 0.14;
      this.currentCamPos.y += (targetCamY - this.currentCamPos.y) * 0.14;
      this.currentCamPos.z += (targetCamZ - this.currentCamPos.z) * 0.14;
      this.camera.position.copy(this.currentCamPos);

      const lookTargetX = playerX3D;
      const lookTargetY = 2.0;
      const lookTargetZ = playerZ3D;

      this.currentTarget.x += (lookTargetX - this.currentTarget.x) * 0.18;
      this.currentTarget.y = lookTargetY;
      this.currentTarget.z += (lookTargetZ - this.currentTarget.z) * 0.18;
      this.camera.lookAt(this.currentTarget);
    }
  }

  public setAspect(aspect: number) {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }
}
