import * as THREE from 'three';
import { PlayerEntity } from '../engine/entityRenderer';
import { NPC } from '../entities/NPC';
import { pedestrianEngine } from '../engine/pedestrianAI';
import { vehicleEngine } from '../engine/vehicleEngine';
import { pxTo3DX, pxTo3DZ } from './ThreeTerrainBuilder';

export class ThreeCharacterManager {
  public playerGroup: THREE.Group;
  private playerBody: THREE.Mesh;
  private playerHead: THREE.Mesh;
  private leftLeg: THREE.Mesh;
  private rightLeg: THREE.Mesh;
  private leftArm: THREE.Mesh;
  private rightArm: THREE.Mesh;
  private dogGroup: THREE.Group;
  private dogTail: THREE.Mesh;

  private npcMeshes: Map<string, THREE.Group> = new Map();
  private pedMeshes: Map<string, THREE.Group> = new Map();
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    // 1. Build 3D Player Character
    this.playerGroup = new THREE.Group();
    this.playerGroup.name = 'PlayerCharacter';

    // Shadow
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
    });
    const shadowGeo = new THREE.PlaneGeometry(1.6, 1.6);
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.05;
    this.playerGroup.add(shadow);

    // Torso (Shirt / Suit)
    const torsoGeo = new THREE.BoxGeometry(1.2, 1.4, 0.7);
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.6 });
    this.playerBody = new THREE.Mesh(torsoGeo, torsoMat);
    this.playerBody.position.y = 1.6;
    this.playerBody.castShadow = true;
    this.playerGroup.add(this.playerBody);

    // Head
    const headGeo = new THREE.SphereGeometry(0.55, 12, 12);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.5 });
    this.playerHead = new THREE.Mesh(headGeo, headMat);
    this.playerHead.position.y = 2.7;
    this.playerHead.castShadow = true;
    this.playerGroup.add(this.playerHead);

    // Hair / Cap
    const capGeo = new THREE.SphereGeometry(0.58, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 2.75;
    this.playerGroup.add(cap);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.42, 1.1, 0.45);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });

    this.leftLeg = new THREE.Mesh(legGeo, legMat);
    this.leftLeg.position.set(-0.32, 0.55, 0);
    this.leftLeg.castShadow = true;
    this.playerGroup.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(legGeo, legMat);
    this.rightLeg.position.set(0.32, 0.55, 0);
    this.rightLeg.castShadow = true;
    this.playerGroup.add(this.rightLeg);

    // Arms
    const armGeo = new THREE.BoxGeometry(0.32, 1.1, 0.35);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.6 });

    this.leftArm = new THREE.Mesh(armGeo, armMat);
    this.leftArm.position.set(-0.8, 1.5, 0);
    this.leftArm.castShadow = true;
    this.playerGroup.add(this.leftArm);

    this.rightArm = new THREE.Mesh(armGeo, armMat);
    this.rightArm.position.set(0.8, 1.5, 0);
    this.rightArm.castShadow = true;
    this.playerGroup.add(this.rightArm);

    // 2. Build 3D Compound Hound Pet Companion
    this.dogGroup = new THREE.Group();
    this.dogGroup.name = 'CompoundHound';

    const dogBodyMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
    const dogBody = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 1.2), dogBodyMat);
    dogBody.position.y = 0.5;
    dogBody.castShadow = true;
    this.dogGroup.add(dogBody);

    const dogHead = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.6), dogBodyMat);
    dogHead.position.set(0, 0.9, 0.6);
    dogHead.castShadow = true;
    this.dogGroup.add(dogHead);

    const tailGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.6, 6);
    this.dogTail = new THREE.Mesh(tailGeo, dogBodyMat);
    this.dogTail.rotation.x = Math.PI / 4;
    this.dogTail.position.set(0, 0.8, -0.6);
    this.dogGroup.add(this.dogTail);

    this.playerGroup.add(this.dogGroup);
    this.dogGroup.position.set(1.5, 0, -0.4);

    this.scene.add(this.playerGroup);
  }

  public update(player: PlayerEntity, npcs: NPC[], time: number) {
    const isDriving = vehicleEngine.playerVehicle !== null || player.vehicle === 'CAR';
    this.playerGroup.visible = !isDriving;

    if (!isDriving) {
      // Position Player in 3D
      const posX = pxTo3DX(player.x);
      const posZ = pxTo3DZ(player.y);
      this.playerGroup.position.set(posX, 0, posZ);

      // Rotation facing direction
      let targetRotY = 0;
      if (player.direction === 'down') targetRotY = 0;
      if (player.direction === 'up') targetRotY = Math.PI;
      if (player.direction === 'left') targetRotY = Math.PI / 2;
      if (player.direction === 'right') targetRotY = -Math.PI / 2;

      this.playerGroup.rotation.y = targetRotY;

      // Walking Animation
      if (player.isMoving) {
        const swing = Math.sin(player.walkFrame * 1.4) * 0.45;
        this.leftLeg.rotation.x = swing;
        this.rightLeg.rotation.x = -swing;
        this.leftArm.rotation.x = -swing;
        this.rightArm.rotation.x = swing;
        this.playerBody.position.y = 1.6 + Math.abs(Math.sin(player.walkFrame * 2.8)) * 0.08;
      } else {
        this.leftLeg.rotation.x = 0;
        this.rightLeg.rotation.x = 0;
        this.leftArm.rotation.x = 0;
        this.rightArm.rotation.x = 0;
        this.playerBody.position.y = 1.6;
      }

      // Wag Dog Tail
      this.dogTail.rotation.z = Math.sin(time * 12) * 0.45;
    }

    // Update NPCs
    npcs.forEach((npc) => {
      let npcMesh = this.npcMeshes.get(npc.id);
      if (!npcMesh) {
        npcMesh = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(npc.color).getHex() });

        const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 0.7), mat);
        body.position.y = 1.6;
        body.castShadow = true;
        npcMesh.add(body);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 10), new THREE.MeshStandardMaterial({ color: 0xfde047 }));
        head.position.y = 2.7;
        head.castShadow = true;
        npcMesh.add(head);

        this.scene.add(npcMesh);
        this.npcMeshes.set(npc.id, npcMesh);
      }

      npcMesh.position.set(pxTo3DX(npc.x), 0, pxTo3DZ(npc.y));
    });

    // Update Living Pedestrians
    pedestrianEngine.pedestrians.forEach((ped) => {
      let pedMesh = this.pedMeshes.get(ped.id);
      if (!pedMesh) {
        pedMesh = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(ped.outfitColor).getHex() });

        const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.3, 0.6), mat);
        body.position.y = 1.5;
        body.castShadow = true;
        pedMesh.add(body);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.48, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfed7aa }));
        head.position.y = 2.5;
        head.castShadow = true;
        pedMesh.add(head);

        this.scene.add(pedMesh);
        this.pedMeshes.set(ped.id, pedMesh);
      }

      pedMesh.position.set(pxTo3DX(ped.x), 0, pxTo3DZ(ped.y));
      if (ped.dirX !== 0) {
        pedMesh.rotation.y = ped.dirX > 0 ? -Math.PI / 2 : Math.PI / 2;
      }
    });
  }

  public dispose() {
    this.scene.remove(this.playerGroup);
    this.npcMeshes.forEach((mesh) => this.scene.remove(mesh));
    this.pedMeshes.forEach((mesh) => this.scene.remove(mesh));
    this.npcMeshes.clear();
    this.pedMeshes.clear();
  }
}
