import * as THREE from 'three';
import { PlayerEntity } from '../engine/entityRenderer';
import { NPC } from '../entities/NPC';
import { Collectible, INITIAL_COLLECTIBLES } from '../entities/Collectible';
import { build3DTerrain, AnimatedTerrainElements } from './ThreeTerrainBuilder';
import { build3DBuildings, AnimatedBuildingElements } from './ThreeBuildingBuilder';
import { ThreeVehicleManager } from './ThreeVehicleBuilder';
import { ThreeCharacterManager } from './ThreeCharacterBuilder';
import { ThreeCameraController } from './ThreeCameraController';
import { ThreeCollectibleManager } from './ThreeCollectibleManager';

export class ThreeCityEngine {
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public cameraController: ThreeCameraController;
  private terrain: AnimatedTerrainElements;
  private buildings: AnimatedBuildingElements;
  private vehicleManager: ThreeVehicleManager;
  private characterManager: ThreeCharacterManager;
  private collectibleManager: ThreeCollectibleManager;

  private dirLight: THREE.DirectionalLight;
  private ambientLight: THREE.AmbientLight;

  constructor(canvas: HTMLCanvasElement) {
    // 1. Setup WebGL Hardware-Accelerated Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(canvas.clientWidth || 1000, canvas.clientHeight || 650, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // 2. Setup Scene & Atmospheric Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0f1d);
    this.scene.fog = new THREE.FogExp2(0x0a0f1d, 0.0032);

    // 3. Setup Directional Sunlight & Shadows
    this.ambientLight = new THREE.AmbientLight(0x64748b, 0.9);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xfffbeb, 1.8);
    this.dirLight.position.set(160, 180, 120);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 10;
    this.dirLight.shadow.camera.far = 450;
    this.dirLight.shadow.camera.left = -160;
    this.dirLight.shadow.camera.right = 160;
    this.dirLight.shadow.camera.top = 160;
    this.dirLight.shadow.camera.bottom = -160;
    this.dirLight.shadow.bias = -0.0005;
    this.scene.add(this.dirLight);

    // 4. Setup Camera Controller
    const aspect = (canvas.clientWidth || 1000) / (canvas.clientHeight || 650);
    this.cameraController = new ThreeCameraController(55, aspect);

    // 5. Build City Subsystems
    this.terrain = build3DTerrain(this.scene);
    this.buildings = build3DBuildings(this.scene);
    this.vehicleManager = new ThreeVehicleManager(this.scene);
    this.characterManager = new ThreeCharacterManager(this.scene);
    this.collectibleManager = new ThreeCollectibleManager(this.scene, INITIAL_COLLECTIBLES);
  }

  public render(
    player: PlayerEntity,
    npcs: NPC[],
    collectibles: Collectible[],
    dt: number,
    time: number,
    targetBuildingId?: string | null,
    isNight: boolean = false
  ) {
    // 1. Day / Night Lighting Transition
    if (isNight) {
      this.ambientLight.intensity = 0.35;
      this.ambientLight.color.setHex(0x1e1b4b);
      this.dirLight.intensity = 0.5;
      this.dirLight.color.setHex(0x38bdf8);
      this.scene.background = new THREE.Color(0x030712);
      if (this.scene.fog) (this.scene.fog as THREE.FogExp2).color.setHex(0x030712);
    } else {
      this.ambientLight.intensity = 0.9;
      this.ambientLight.color.setHex(0x64748b);
      this.dirLight.intensity = 1.8;
      this.dirLight.color.setHex(0xfffbeb);
      this.scene.background = new THREE.Color(0x0a0f1d);
      if (this.scene.fog) (this.scene.fog as THREE.FogExp2).color.setHex(0x0a0f1d);
    }

    // Keep Directional Sunlight centered around player for optimal shadow maps
    this.dirLight.position.set(
      this.cameraController.camera.position.x + 80,
      180,
      this.cameraController.camera.position.z - 60
    );
    this.dirLight.target.position.set(
      this.cameraController.camera.position.x,
      0,
      this.cameraController.camera.position.z
    );
    this.dirLight.target.updateMatrixWorld();

    // 2. Update Subsystems
    this.cameraController.update(player, dt);
    this.terrain.update(dt, time);
    this.buildings.update(dt, time, targetBuildingId);
    this.vehicleManager.update(time);
    this.characterManager.update(player, npcs, time);
    this.collectibleManager.update(collectibles, time);

    // 3. Render 3D Frame
    this.renderer.render(this.scene, this.cameraController.camera);
  }

  public handleResize(width: number, height: number) {
    this.renderer.setSize(width, height, false);
    this.cameraController.setAspect(width / height);
  }

  public dispose() {
    this.collectibleManager.dispose();
    this.vehicleManager.dispose();
    this.characterManager.dispose();
    this.renderer.dispose();
  }
}
