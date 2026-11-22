import * as THREE from 'three';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from '../world/mapData';
import { STREET_PROPS } from '../world/streetProps';

export const TILE_3D = 4.0; // 1 map tile = 4.0 Three.js world units
export const MAP_W_3D = MAP_WIDTH * TILE_3D; // 384 units
export const MAP_H_3D = MAP_HEIGHT * TILE_3D; // 288 units

export function to3DX(tileX: number): number {
  return tileX * TILE_3D;
}

export function to3DZ(tileY: number): number {
  return tileY * TILE_3D;
}

export function pxTo3DX(px: number): number {
  return (px / TILE_SIZE) * TILE_3D;
}

export function pxTo3DZ(py: number): number {
  return (py / TILE_SIZE) * TILE_3D;
}

export interface AnimatedTerrainElements {
  fountainParticles: THREE.Points;
  waterMesh: THREE.Mesh;
  windmills: THREE.Group[];
  update: (dt: number, time: number) => void;
}

export function build3DTerrain(scene: THREE.Scene): AnimatedTerrainElements {
  const terrainGroup = new THREE.Group();
  terrainGroup.name = 'TerrainGroup';

  // 1. Base Ground Lawn / Parks
  const grassGeo = new THREE.PlaneGeometry(MAP_W_3D, MAP_H_3D);
  const grassMat = new THREE.MeshStandardMaterial({
    color: 0x064e3b,
    roughness: 0.85,
    metalness: 0.05,
  });
  const grassMesh = new THREE.Mesh(grassGeo, grassMat);
  grassMesh.rotation.x = -Math.PI / 2;
  grassMesh.position.set(MAP_W_3D / 2, -0.05, MAP_H_3D / 2);
  grassMesh.receiveShadow = true;
  terrainGroup.add(grassMesh);

  // 2. Asphalt Road Network
  const roadMat = new THREE.MeshStandardMaterial({
    color: 0x18202f,
    roughness: 0.9,
    metalness: 0.1,
  });

  const dividerMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
  const crosswalkMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });

  // Avenues (Horizontal Roads) - Avenues stop before beach (x <= 79.5 tiles = 318 units)
  const aveYIndices = [14, 28, 42, 56];
  aveYIndices.forEach((tileY) => {
    const roadW = 79.5 * TILE_3D;
    const roadD = 2.0 * TILE_3D; // 8 units wide
    const roadGeo = new THREE.PlaneGeometry(roadW, roadD);
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.set(roadW / 2, 0.02, (tileY + 1.0) * TILE_3D);
    roadMesh.receiveShadow = true;
    terrainGroup.add(roadMesh);

    // Double yellow center divider line
    const dividerGeo = new THREE.PlaneGeometry(roadW - 20, 0.25);
    const dividerMesh = new THREE.Mesh(dividerGeo, dividerMat);
    dividerMesh.rotation.x = -Math.PI / 2;
    dividerMesh.position.set(roadW / 2, 0.03, (tileY + 1.0) * TILE_3D);
    terrainGroup.add(dividerMesh);
  });

  // Streets (Vertical Roads)
  const streetXIndices = [16, 32, 44, 58, 68, 78];
  streetXIndices.forEach((tileX) => {
    const streetW = 2.0 * TILE_3D; // 8 units wide
    const streetD = MAP_H_3D;
    const streetGeo = new THREE.PlaneGeometry(streetW, streetD);
    const streetMesh = new THREE.Mesh(streetGeo, roadMat);
    streetMesh.rotation.x = -Math.PI / 2;
    streetMesh.position.set((tileX + 1.0) * TILE_3D, 0.015, streetD / 2);
    streetMesh.receiveShadow = true;
    terrainGroup.add(streetMesh);

    // Center divider
    const dividerGeo = new THREE.PlaneGeometry(0.25, streetD - 20);
    const dividerMesh = new THREE.Mesh(dividerGeo, dividerMat);
    dividerMesh.rotation.x = -Math.PI / 2;
    dividerMesh.position.set((tileX + 1.0) * TILE_3D, 0.025, streetD / 2);
    terrainGroup.add(dividerMesh);

    // Zebra Crosswalks at avenue intersections
    aveYIndices.forEach((tileY) => {
      for (let s = -3.2; s <= 3.2; s += 0.8) {
        const stripeGeo = new THREE.PlaneGeometry(0.35, 1.8);
        const stripe = new THREE.Mesh(stripeGeo, crosswalkMat);
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set((tileX + 1.0) * TILE_3D + s, 0.035, (tileY + 1.0) * TILE_3D - 4.2);
        terrainGroup.add(stripe);

        const stripeSouth = stripe.clone();
        stripeSouth.position.z = (tileY + 1.0) * TILE_3D + 4.2;
        terrainGroup.add(stripeSouth);
      }
    });
  });

  // 3. Elevated 3D Sidewalks (+0.35 units height with beveled curb edges)
  const sidewalkMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.7,
    metalness: 0.1,
  });

  const curbMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.6,
    metalness: 0.15,
  });

  // Sidewalk ribbons along horizontal avenues
  const sidewalkYIndices = [13, 16, 27, 30, 41, 44, 55, 58];
  sidewalkYIndices.forEach((tileY) => {
    const swW = 80.0 * TILE_3D;
    const swD = 1.0 * TILE_3D;
    const swGeo = new THREE.BoxGeometry(swW, 0.35, swD);
    const swMesh = new THREE.Mesh(swGeo, sidewalkMat);
    swMesh.position.set(swW / 2, 0.175, (tileY + 0.5) * TILE_3D);
    swMesh.receiveShadow = true;
    terrainGroup.add(swMesh);
  });

  // 4. Grand Central Civic Plaza
  const plazaMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.5,
    metalness: 0.2,
  });
  const plazaGeo = new THREE.BoxGeometry(13 * TILE_3D, 0.4, 9 * TILE_3D);
  const plazaMesh = new THREE.Mesh(plazaGeo, plazaMat);
  plazaMesh.position.set(46 * TILE_3D, 0.2, 24 * TILE_3D);
  plazaMesh.receiveShadow = true;
  terrainGroup.add(plazaMesh);

  // Ornamental gold trim inlay border
  const borderMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.7 });
  const borderGeo = new THREE.BoxGeometry(12.6 * TILE_3D, 0.42, 8.6 * TILE_3D);
  const borderMesh = new THREE.Mesh(borderGeo, borderMat);
  borderMesh.position.set(46 * TILE_3D, 0.2, 24 * TILE_3D);
  terrainGroup.add(borderMesh);

  const innerPlazaGeo = new THREE.BoxGeometry(12.2 * TILE_3D, 0.44, 8.2 * TILE_3D);
  const innerPlazaMesh = new THREE.Mesh(innerPlazaGeo, plazaMat);
  innerPlazaMesh.position.set(46 * TILE_3D, 0.2, 24 * TILE_3D);
  innerPlazaMesh.receiveShadow = true;
  terrainGroup.add(innerPlazaMesh);

  // 5. 3D Multi-Tiered Plaza Marble Fountain
  const fountainGroup = new THREE.Group();
  fountainGroup.position.set(46 * TILE_3D, 0.44, 24 * TILE_3D);

  const marbleMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.3,
    metalness: 0.1,
  });

  // Tier 1: Outer Basin (Radius 5.5 units)
  const tier1Geo = new THREE.CylinderGeometry(5.5, 6.0, 1.0, 32);
  const tier1 = new THREE.Mesh(tier1Geo, marbleMat);
  tier1.position.y = 0.5;
  tier1.castShadow = true;
  tier1.receiveShadow = true;
  fountainGroup.add(tier1);

  // Basin Water
  const basinWaterMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.1,
    metalness: 0.8,
    transparent: true,
    opacity: 0.85,
  });
  const basinWaterGeo = new THREE.CylinderGeometry(5.0, 5.0, 0.2, 32);
  const basinWater = new THREE.Mesh(basinWaterGeo, basinWaterMat);
  basinWater.position.y = 0.95;
  fountainGroup.add(basinWater);

  // Tier 2: Pedestal & Upper Basin (Radius 3.0 units)
  const pedestalGeo = new THREE.CylinderGeometry(1.2, 1.5, 1.6, 24);
  const pedestal = new THREE.Mesh(pedestalGeo, marbleMat);
  pedestal.position.y = 1.6;
  fountainGroup.add(pedestal);

  const tier2Geo = new THREE.CylinderGeometry(3.0, 3.4, 0.6, 24);
  const tier2 = new THREE.Mesh(tier2Geo, marbleMat);
  tier2.position.y = 2.4;
  tier2.castShadow = true;
  fountainGroup.add(tier2);

  // Tier 3: Golden Freedom Bell Monument & Spire
  const columnGeo = new THREE.CylinderGeometry(0.6, 0.8, 1.4, 16);
  const column = new THREE.Mesh(columnGeo, marbleMat);
  column.position.y = 3.3;
  fountainGroup.add(column);

  const bellMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.9 });
  const bellGeo = new THREE.SphereGeometry(0.8, 16, 16);
  const bell = new THREE.Mesh(bellGeo, bellMat);
  bell.position.y = 4.2;
  bell.castShadow = true;
  fountainGroup.add(bell);

  terrainGroup.add(fountainGroup);

  // Fountain Particle Spray System
  const particleCount = 120;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleVelocities: { x: number; y: number; z: number }[] = [];

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3 + 0] = 46 * TILE_3D;
    particlePositions[i * 3 + 1] = 4.8;
    particlePositions[i * 3 + 2] = 24 * TILE_3D;

    const angle = Math.random() * Math.PI * 2;
    const speed = 1.0 + Math.random() * 2.5;
    particleVelocities.push({
      x: Math.cos(angle) * speed,
      y: 2.5 + Math.random() * 3.0,
      z: Math.sin(angle) * speed,
    });
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.28,
    transparent: true,
    opacity: 0.85,
  });
  const fountainParticles = new THREE.Points(particleGeo, particleMat);
  terrainGroup.add(fountainParticles);

  // 6. Golden Sandy Beach Coastline
  const beachW = 3.5 * TILE_3D; // tiles 80.5 to 84 = 14 units
  const beachD = MAP_H_3D;
  const beachGeo = new THREE.PlaneGeometry(beachW, beachD);
  const beachMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.9,
    metalness: 0.05,
  });
  const beachMesh = new THREE.Mesh(beachGeo, beachMat);
  beachMesh.rotation.x = -Math.PI / 2;
  beachMesh.position.set((82.25) * TILE_3D, -0.02, beachD / 2);
  beachMesh.receiveShadow = true;
  terrainGroup.add(beachMesh);

  // 7. Expansive 3D Ocean Waterfront (x >= 84 tiles)
  const oceanW = (MAP_WIDTH - 84) * TILE_3D; // 48 units wide
  const oceanD = MAP_H_3D;
  const oceanGeo = new THREE.PlaneGeometry(oceanW, oceanD, 32, 32);
  const oceanMat = new THREE.MeshStandardMaterial({
    color: 0x0369a1,
    roughness: 0.15,
    metalness: 0.85,
    transparent: true,
    opacity: 0.92,
  });
  const oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
  oceanMesh.rotation.x = -Math.PI / 2;
  oceanMesh.position.set((84 + (MAP_WIDTH - 84) / 2) * TILE_3D, -0.2, oceanD / 2);
  terrainGroup.add(oceanMesh);

  // 8. 3D Wooden Boardwalk Pier
  const pierW = 12 * TILE_3D; // 48 units long
  const pierD = 4.5 * TILE_3D; // 18 units wide
  const pierGeo = new THREE.BoxGeometry(pierW, 0.6, pierD);
  const pierMat = new THREE.MeshStandardMaterial({
    color: 0x92400e,
    roughness: 0.8,
    metalness: 0.1,
  });
  const pierMesh = new THREE.Mesh(pierGeo, pierMat);
  pierMesh.position.set(86 * TILE_3D, 0.4, 26 * TILE_3D);
  pierMesh.castShadow = true;
  pierMesh.receiveShadow = true;
  terrainGroup.add(pierMesh);

  // Timber Pilings beneath the pier
  const pilingMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
  for (let px = 81 * TILE_3D; px <= 91 * TILE_3D; px += 2.5 * TILE_3D) {
    for (let pz = 24.5 * TILE_3D; pz <= 27.5 * TILE_3D; pz += 1.5 * TILE_3D) {
      const pilingGeo = new THREE.CylinderGeometry(0.3, 0.35, 3.0, 8);
      const piling = new THREE.Mesh(pilingGeo, pilingMat);
      piling.position.set(px, -0.8, pz);
      terrainGroup.add(piling);
    }
  }

  // 9. 3D Procedural Trees Across Parks & Plazas
  const treeCoords = [
    { x: 38, y: 22 }, { x: 54, y: 22 }, { x: 38, y: 26 }, { x: 54, y: 26 },
    { x: 14, y: 18 }, { x: 26, y: 18 }, { x: 8, y: 46 }, { x: 20, y: 46 },
    { x: 48, y: 58 }, { x: 64, y: 58 }, { x: 18, y: 8 }, { x: 42, y: 8 },
    { x: 82, y: 18 }, { x: 82, y: 34 }, { x: 30, y: 58 }, { x: 74, y: 58 }
  ];

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
  const foliageMat1 = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.7 });
  const foliageMat2 = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.7 });

  treeCoords.forEach((t) => {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(t.x * TILE_3D, 0, t.y * TILE_3D);

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.35, 0.45, 2.8, 8);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.4;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    treeGroup.add(trunk);

    // Lower Foliage Cone/Sphere
    const fol1Geo = new THREE.ConeGeometry(2.4, 3.2, 8);
    const fol1 = new THREE.Mesh(fol1Geo, foliageMat1);
    fol1.position.y = 3.6;
    fol1.castShadow = true;
    treeGroup.add(fol1);

    // Upper Foliage Cone
    const fol2Geo = new THREE.ConeGeometry(1.8, 2.6, 8);
    const fol2 = new THREE.Mesh(fol2Geo, foliageMat2);
    fol2.position.y = 5.2;
    fol2.castShadow = true;
    treeGroup.add(fol2);

    terrainGroup.add(treeGroup);
  });

  // 10. Cast-Iron Streetlamps with Glowing Lanterns
  const lampCoords = [
    { x: 20, y: 13 }, { x: 36, y: 13 }, { x: 50, y: 13 }, { x: 66, y: 13 },
    { x: 20, y: 27 }, { x: 36, y: 27 }, { x: 56, y: 27 }, { x: 72, y: 27 },
    { x: 20, y: 41 }, { x: 36, y: 41 }, { x: 50, y: 41 }, { x: 66, y: 41 },
    { x: 20, y: 55 }, { x: 36, y: 55 }, { x: 50, y: 55 }, { x: 66, y: 55 }
  ];

  const lampPostMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.8 });
  const bulbMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfde047, emissiveIntensity: 1.2 });

  lampCoords.forEach((l) => {
    const lamp = new THREE.Group();
    lamp.position.set(l.x * TILE_3D, 0.35, l.y * TILE_3D);

    // Post
    const postGeo = new THREE.CylinderGeometry(0.12, 0.18, 4.2, 8);
    const post = new THREE.Mesh(postGeo, lampPostMat);
    post.position.y = 2.1;
    post.castShadow = true;
    lamp.add(post);

    // Arm bracket
    const armGeo = new THREE.BoxGeometry(0.8, 0.1, 0.1);
    const arm = new THREE.Mesh(armGeo, lampPostMat);
    arm.position.set(0.3, 4.1, 0);
    lamp.add(arm);

    // Lantern Head
    const bulbGeo = new THREE.SphereGeometry(0.24, 8, 8);
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(0.65, 3.9, 0);
    lamp.add(bulb);

    terrainGroup.add(lamp);
  });

  // 11. Clean Energy Wind Turbines (Southwest Eco-Park)
  const windmills: THREE.Group[] = [];
  const windmillPositions = [
    { x: 8 * TILE_3D, z: 60 * TILE_3D },
    { x: 12 * TILE_3D, z: 64 * TILE_3D },
  ];

  windmillPositions.forEach((pos) => {
    const wmGroup = new THREE.Group();
    wmGroup.position.set(pos.x, 0, pos.z);

    // Tall Tapered Tower (24 units high)
    const towerGeo = new THREE.CylinderGeometry(0.5, 1.2, 24, 16);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.y = 12;
    tower.castShadow = true;
    wmGroup.add(tower);

    // Nacelle
    const nacelleGeo = new THREE.BoxGeometry(2.4, 1.2, 1.2);
    const nacelle = new THREE.Mesh(nacelleGeo, towerMat);
    nacelle.position.set(0, 24, 0);
    wmGroup.add(nacelle);

    // Hub & Rotor
    const rotorHub = new THREE.Group();
    rotorHub.name = 'RotorHub';
    rotorHub.position.set(1.2, 24, 0);

    const hubGeo = new THREE.SphereGeometry(0.6, 12, 12);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0x10b981 });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    rotorHub.add(hub);

    // 3 Aerodynamic Blades
    for (let b = 0; b < 3; b++) {
      const bladeAngle = (b * Math.PI * 2) / 3;
      const bladeGeo = new THREE.ConeGeometry(0.4, 9.5, 4);
      const blade = new THREE.Mesh(bladeGeo, towerMat);
      blade.rotation.z = bladeAngle;
      blade.position.set(0, Math.cos(bladeAngle) * 4.75, Math.sin(bladeAngle) * 4.75);
      rotorHub.add(blade);
    }

    wmGroup.add(rotorHub);
    terrainGroup.add(wmGroup);
    windmills.push(wmGroup);
  });

  // 12. 3D Interactive Street Props (ATMs, Coffee Carts, News Kiosks)
  STREET_PROPS.forEach((prop) => {
    const propGroup = new THREE.Group();
    propGroup.position.set(prop.tileX * TILE_3D, 0.35, prop.tileY * TILE_3D);

    if (prop.type === 'ATM') {
      const atmGeo = new THREE.BoxGeometry(1.4, 2.4, 1.2);
      const atmMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 });
      const atm = new THREE.Mesh(atmGeo, atmMat);
      atm.position.y = 1.2;
      atm.castShadow = true;
      propGroup.add(atm);

      // Glowing green screen
      const screenGeo = new THREE.PlaneGeometry(0.8, 0.6);
      const screenMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 1.5 });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.set(0, 1.4, 0.61);
      propGroup.add(screen);
    } else if (prop.type === 'COFFEE_CART') {
      const cartGeo = new THREE.BoxGeometry(2.2, 1.4, 1.6);
      const cartMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
      const cart = new THREE.Mesh(cartGeo, cartMat);
      cart.position.y = 0.7;
      cart.castShadow = true;
      propGroup.add(cart);

      // Striped Awning Canopy
      const awningGeo = new THREE.BoxGeometry(2.6, 0.2, 2.0);
      const awningMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
      const awning = new THREE.Mesh(awningGeo, awningMat);
      awning.position.y = 2.4;
      propGroup.add(awning);
    }

    terrainGroup.add(propGroup);
  });

  scene.add(terrainGroup);

  return {
    fountainParticles,
    waterMesh: oceanMesh,
    windmills,
    update: (dt: number, time: number) => {
      // 1. Animate Windmill Rotors
      windmills.forEach((wm, idx) => {
        const hub = wm.getObjectByName('RotorHub');
        if (hub) {
          hub.rotation.x += dt * (1.8 + idx * 0.4);
        }
      });

      // 2. Animate Fountain Water Particle System
      const posAttr = fountainParticles.geometry.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const vel = particleVelocities[i];
        positions[i * 3 + 0] += vel.x * dt;
        positions[i * 3 + 1] += vel.y * dt;
        positions[i * 3 + 2] += vel.z * dt;

        vel.y -= 9.8 * dt; // Gravity

        // Splash into basin
        if (positions[i * 3 + 1] <= 1.4) {
          positions[i * 3 + 0] = 46 * TILE_3D;
          positions[i * 3 + 1] = 4.8;
          positions[i * 3 + 2] = 24 * TILE_3D;

          const angle = Math.random() * Math.PI * 2;
          const speed = 1.0 + Math.random() * 2.2;
          vel.x = Math.cos(angle) * speed;
          vel.y = 2.0 + Math.random() * 3.0;
          vel.z = Math.sin(angle) * speed;
        }
      }
      posAttr.needsUpdate = true;

      // 3. Subtle Ocean Water Breathing
      oceanMesh.position.y = -0.2 + Math.sin(time * 1.5) * 0.08;
    },
  };
}
