import * as THREE from 'three';
import { vehicleEngine, Vehicle } from '../engine/vehicleEngine';
import { pxTo3DX, pxTo3DZ } from './ThreeTerrainBuilder';

export class ThreeVehicleManager {
  private vehicleMeshes: Map<string, THREE.Group> = new Map();
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  private create3DVehicleMesh(veh: Vehicle): THREE.Group {
    const group = new THREE.Group();
    group.name = `Vehicle_${veh.id}`;

    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(veh.color).getHex(),
      roughness: 0.25,
      metalness: 0.8,
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.9,
    });
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.8,
    });
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.2,
    });

    if (veh.type === 'SUPERCAR') {
      // Aerodynamic Wedge Supercar
      const chassisGeo = new THREE.BoxGeometry(2.4, 0.65, 4.8);
      const chassis = new THREE.Mesh(chassisGeo, bodyMat);
      chassis.position.y = 0.55;
      chassis.castShadow = true;
      group.add(chassis);

      // Cockpit Greenhouse
      const roofGeo = new THREE.BoxGeometry(1.8, 0.55, 2.2);
      const roof = new THREE.Mesh(roofGeo, glassMat);
      roof.position.set(0, 1.05, -0.2);
      roof.castShadow = true;
      group.add(roof);

      // Rear Spoiler
      const spoilerWingGeo = new THREE.BoxGeometry(2.3, 0.1, 0.5);
      const spoilerWing = new THREE.Mesh(spoilerWingGeo, glassMat);
      spoilerWing.position.set(0, 1.25, -2.1);
      group.add(spoilerWing);
    } else if (veh.type === 'POLICE') {
      // Metropolitan Police Interceptor
      const chassisGeo = new THREE.BoxGeometry(2.2, 0.8, 4.6);
      const chassis = new THREE.Mesh(chassisGeo, bodyMat);
      chassis.position.y = 0.65;
      chassis.castShadow = true;
      group.add(chassis);

      // White Doors/Roof Accent
      const whiteDoors = new THREE.Mesh(
        new THREE.BoxGeometry(2.22, 0.7, 2.2),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
      );
      whiteDoors.position.set(0, 0.68, 0);
      group.add(whiteDoors);

      // Windshield & Cabin
      const cabinGeo = new THREE.BoxGeometry(1.8, 0.65, 2.4);
      const cabin = new THREE.Mesh(cabinGeo, glassMat);
      cabin.position.set(0, 1.25, 0.1);
      cabin.castShadow = true;
      group.add(cabin);

      // Emergency Lightbar (Red/Blue Strobe)
      const strobeGroup = new THREE.Group();
      strobeGroup.name = 'StrobeGroup';
      strobeGroup.position.set(0, 1.7, 0.1);

      const redLight = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.2, 0.3),
        new THREE.MeshBasicMaterial({ color: 0xef4444 })
      );
      redLight.position.x = -0.45;
      redLight.name = 'RedStrobe';
      strobeGroup.add(redLight);

      const blueLight = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.2, 0.3),
        new THREE.MeshBasicMaterial({ color: 0x3b82f6 })
      );
      blueLight.position.x = 0.45;
      blueLight.name = 'BlueStrobe';
      strobeGroup.add(blueLight);

      group.add(strobeGroup);
    } else {
      // Sedan / Taxi / Van
      const chassisGeo = new THREE.BoxGeometry(2.2, 0.75, 4.5);
      const chassis = new THREE.Mesh(chassisGeo, bodyMat);
      chassis.position.y = 0.65;
      chassis.castShadow = true;
      group.add(chassis);

      const cabinGeo = new THREE.BoxGeometry(1.8, 0.65, 2.4);
      const cabin = new THREE.Mesh(cabinGeo, glassMat);
      cabin.position.set(0, 1.25, 0);
      cabin.castShadow = true;
      group.add(cabin);
    }

    // 4 Wheels
    const wheelPositions = [
      { x: -1.2, z: 1.4 },
      { x: 1.2, z: 1.4 },
      { x: -1.2, z: -1.4 },
      { x: 1.2, z: -1.4 },
    ];
    wheelPositions.forEach((wp) => {
      const tireGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.35, 16);
      const tire = new THREE.Mesh(tireGeo, wheelMat);
      tire.rotation.z = Math.PI / 2;
      tire.position.set(wp.x, 0.42, wp.z);
      tire.castShadow = true;
      group.add(tire);

      const rimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.36, 12);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.z = Math.PI / 2;
      rim.position.set(wp.x, 0.42, wp.z);
      group.add(rim);
    });

    // Dual Headlights
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const hlLeft = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.1), headlightMat);
    hlLeft.position.set(-0.75, 0.65, 2.41);
    group.add(hlLeft);

    const hlRight = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.1), headlightMat);
    hlRight.position.set(0.75, 0.65, 2.41);
    group.add(hlRight);

    // Dynamic Headlight Spotlights (projected forward)
    const spotLeft = new THREE.SpotLight(0xfef08a, 2.5, 45, Math.PI / 6, 0.4);
    spotLeft.position.set(-0.75, 0.65, 2.4);
    const targetLeft = new THREE.Object3D();
    targetLeft.position.set(-0.75, 0.1, 24);
    group.add(spotLeft);
    group.add(targetLeft);
    spotLeft.target = targetLeft;

    const spotRight = new THREE.SpotLight(0xfef08a, 2.5, 45, Math.PI / 6, 0.4);
    spotRight.position.set(0.75, 0.65, 2.4);
    const targetRight = new THREE.Object3D();
    targetRight.position.set(0.75, 0.1, 24);
    group.add(spotRight);
    group.add(targetRight);
    spotRight.target = targetRight;

    // Dual Rear Taillights / Brake lights
    const taillightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const tlLeft = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.1), taillightMat);
    tlLeft.position.set(-0.75, 0.65, -2.41);
    group.add(tlLeft);

    const tlRight = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.1), taillightMat);
    tlRight.position.set(0.75, 0.65, -2.41);
    group.add(tlRight);

    // Neon Underglow for Supercars & Player Vehicle
    if (veh.type === 'SUPERCAR' || veh.isPlayerOccupied) {
      const underglowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(veh.accentColor || '#38bdf8'),
        transparent: true,
        opacity: 0.45,
      });
      const underglowGeo = new THREE.PlaneGeometry(2.6, 5.0);
      const underglow = new THREE.Mesh(underglowGeo, underglowMat);
      underglow.rotation.x = -Math.PI / 2;
      underglow.position.y = 0.08;
      group.add(underglow);
    }

    this.scene.add(group);
    return group;
  }

  public update(time: number) {
    vehicleEngine.vehicles.forEach((veh) => {
      let mesh = this.vehicleMeshes.get(veh.id);
      if (!mesh) {
        mesh = this.create3DVehicleMesh(veh);
        this.vehicleMeshes.set(veh.id, mesh);
      }

      // Convert 2D world px to Three.js 3D world units
      const posX = pxTo3DX(veh.x);
      const posZ = pxTo3DZ(veh.y);
      mesh.position.set(posX, 0.1, posZ);

      // 2D Canvas angle 0 = East (+X). In Three.js, +Z is forward, so rotation.y = -angle + Math.PI/2
      mesh.rotation.y = -veh.angle + Math.PI / 2;

      // Police Strobe Flash
      if (veh.type === 'POLICE' && veh.sirenActive) {
        const strobe = mesh.getObjectByName('StrobeGroup');
        if (strobe) {
          const redStrobe = strobe.getObjectByName('RedStrobe') as THREE.Mesh;
          const blueStrobe = strobe.getObjectByName('BlueStrobe') as THREE.Mesh;
          const flash = Math.floor(time * 12) % 2 === 0;
          if (redStrobe) redStrobe.visible = flash;
          if (blueStrobe) blueStrobe.visible = !flash;
        }
      }
    });
  }

  public dispose() {
    this.vehicleMeshes.forEach((mesh) => {
      this.scene.remove(mesh);
    });
    this.vehicleMeshes.clear();
  }
}
