import * as THREE from 'three';
import { Collectible } from '../entities/Collectible';

export class ThreeCollectibleManager {
  private group: THREE.Group;
  private meshes: Map<string, THREE.Group> = new Map();

  constructor(scene: THREE.Scene, initialCollectibles: Collectible[]) {
    this.group = new THREE.Group();
    scene.add(this.group);

    const coinGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.18, 16);
    coinGeo.rotateX(Math.PI / 2); // Face forward initially
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0xd97706,
      emissiveIntensity: 0.35,
    });

    const scrollGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.2, 12);
    const scrollMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.2,
      roughness: 0.6,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
    });

    const chestGeo = new THREE.BoxGeometry(1.2, 0.9, 1.0);
    const chestMat = new THREE.MeshStandardMaterial({
      color: 0x854d0e,
      roughness: 0.5,
      metalness: 0.3,
      emissive: 0xb45309,
      emissiveIntensity: 0.3,
    });

    for (const c of initialCollectibles) {
      const itemGroup = new THREE.Group();
      // Map world px to 3D units: px * 0.1
      const x3D = c.x * 0.1;
      const z3D = c.y * 0.1;
      itemGroup.position.set(x3D, 1.4, z3D);

      let mesh: THREE.Mesh;
      if (c.type === 'COIN') {
        mesh = new THREE.Mesh(coinGeo, coinMat);
      } else if (c.type === 'SCROLL') {
        mesh = new THREE.Mesh(scrollGeo, scrollMat);
      } else {
        mesh = new THREE.Mesh(chestGeo, chestMat);
      }
      mesh.castShadow = true;
      itemGroup.add(mesh);

      // Add a subtle glowing halo point light
      const light = new THREE.PointLight(
        c.type === 'COIN' ? 0xfbbf24 : c.type === 'SCROLL' ? 0x38bdf8 : 0xf59e0b,
        1.2,
        6
      );
      light.position.set(0, 0.3, 0);
      itemGroup.add(light);

      this.group.add(itemGroup);
      this.meshes.set(c.id, itemGroup);
    }
  }

  public update(collectibles: Collectible[], time: number) {
    for (const c of collectibles) {
      const grp = this.meshes.get(c.id);
      if (!grp) continue;

      if (c.isCollected) {
        grp.visible = false;
      } else {
        grp.visible = true;
        // Bob up and down
        grp.position.y = 1.4 + Math.sin(time * 3 + (c.pulseTimer || 0)) * 0.25;
        // Spin continuously
        grp.rotation.y = time * 2.5;
      }
    }
  }

  public dispose() {
    this.group.clear();
  }
}
