import * as THREE from 'three';
import { BUILDINGS, BuildingEntrance } from '../world/mapData';
import { TILE_3D } from './ThreeTerrainBuilder';

export interface AnimatedBuildingElements {
  spireBeacons: { light: THREE.Mesh; mat: THREE.MeshBasicMaterial }[];
  chimneys: { x: number; y: number; z: number }[];
  questBeacon: THREE.Group;
  update: (dt: number, time: number, targetBldgId?: string | null) => void;
}

export function build3DBuildings(scene: THREE.Scene): AnimatedBuildingElements {
  const buildingsGroup = new THREE.Group();
  buildingsGroup.name = 'BuildingsGroup';

  const spireBeacons: { light: THREE.Mesh; mat: THREE.MeshBasicMaterial }[] = [];
  const chimneys: { x: number; y: number; z: number }[] = [];

  BUILDINGS.forEach((bldg) => {
    const bldgGroup = new THREE.Group();
    bldgGroup.name = `Building_${bldg.id}`;
    bldgGroup.position.set(bldg.tileX * TILE_3D, 0, bldg.tileY * TILE_3D);

    const w = 4.6 * TILE_3D; // 18.4 units wide
    const d = 3.2 * TILE_3D; // 12.8 units deep

    switch (bldg.type) {
      case 'CAREER_TOWER': {
        // Apex Career Skyscraper (Tallest skyscraper in the city - 62 units tall)
        const glassMat = new THREE.MeshStandardMaterial({
          color: 0x1e3a8a,
          roughness: 0.15,
          metalness: 0.85,
        });
        const trimMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3 });

        // Tier 1: Base Tower (28 units high)
        const tier1Geo = new THREE.BoxGeometry(w, 28, d);
        const tier1 = new THREE.Mesh(tier1Geo, glassMat);
        tier1.position.y = 14;
        tier1.castShadow = true;
        tier1.receiveShadow = true;
        bldgGroup.add(tier1);

        // Tier 2: Mid Tower (20 units high, setback)
        const tier2Geo = new THREE.BoxGeometry(w * 0.8, 20, d * 0.8);
        const tier2 = new THREE.Mesh(tier2Geo, glassMat);
        tier2.position.y = 28 + 10;
        tier2.castShadow = true;
        bldgGroup.add(tier2);

        // Tier 3: Upper Executive Penthouse (14 units high)
        const tier3Geo = new THREE.BoxGeometry(w * 0.6, 14, d * 0.6);
        const tier3 = new THREE.Mesh(tier3Geo, glassMat);
        tier3.position.y = 48 + 7;
        tier3.castShadow = true;
        bldgGroup.add(tier3);

        // Golden Crown Trims
        const crownGeo = new THREE.BoxGeometry(w * 0.64, 1.2, d * 0.64);
        const crownMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
        const crown = new THREE.Mesh(crownGeo, crownMat);
        crown.position.y = 62.6;
        bldgGroup.add(crown);

        // Steel Communication Mast with Blinking Aircraft Warning Light
        const mastGeo = new THREE.CylinderGeometry(0.15, 0.35, 14, 8);
        const mastMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9 });
        const mast = new THREE.Mesh(mastGeo, mastMat);
        mast.position.y = 63 + 7;
        bldgGroup.add(mast);

        const beaconGeo = new THREE.SphereGeometry(0.5, 8, 8);
        const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        beacon.position.y = 63 + 14;
        bldgGroup.add(beacon);
        spireBeacons.push({ light: beacon, mat: beaconMat });

        // Ground Floor Grand Entrance Lobby
        const lobbyGeo = new THREE.BoxGeometry(5.0, 3.8, 1.6);
        const lobbyMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6, roughness: 0.2 });
        const lobby = new THREE.Mesh(lobbyGeo, lobbyMat);
        lobby.position.set(0, 1.9, d / 2 + 0.6);
        bldgGroup.add(lobby);

        break;
      }

      case 'STOCK_EXCHANGE': {
        // Wall Street Stock Exchange (Neoclassical Colonnade & Animated LED Ticker)
        const graniteMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.2 });
        const columnMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.3, metalness: 0.1 });

        // Main Hall
        const hallGeo = new THREE.BoxGeometry(w, 24, d);
        const hall = new THREE.Mesh(hallGeo, graniteMat);
        hall.position.y = 12;
        hall.castShadow = true;
        hall.receiveShadow = true;
        bldgGroup.add(hall);

        // Classical Triangular Pediment
        const pedimentGeo = new THREE.ConeGeometry(w * 0.65, 6, 4);
        const pediment = new THREE.Mesh(pedimentGeo, graniteMat);
        pediment.rotation.y = Math.PI / 4;
        pediment.position.set(0, 24 + 3, d / 2);
        pediment.castShadow = true;
        bldgGroup.add(pediment);

        // 6 Corinthian Fluted Columns along front portico
        for (let c = -2.5; c <= 2.5; c += 1.0) {
          const colGeo = new THREE.CylinderGeometry(0.6, 0.75, 18, 16);
          const col = new THREE.Mesh(colGeo, columnMat);
          col.position.set(c * (w / 6), 9, d / 2 + 1.4);
          col.castShadow = true;
          bldgGroup.add(col);
        }

        // Animated Glowing LED Ticker Tape on Facade
        const tickerGeo = new THREE.PlaneGeometry(w * 0.9, 1.6);
        const tickerMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
        const ticker = new THREE.Mesh(tickerGeo, tickerMat);
        ticker.position.set(0, 20, d / 2 + 0.05);
        bldgGroup.add(ticker);

        break;
      }

      case 'BANK': {
        // First Prosperity Bank & Vault (Emerald Granite Fortress with Golden Medallion)
        const bankMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.5, metalness: 0.3 });
        const brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });

        const bankBodyGeo = new THREE.BoxGeometry(w, 20, d);
        const bankBody = new THREE.Mesh(bankBodyGeo, bankMat);
        bankBody.position.y = 10;
        bankBody.castShadow = true;
        bankBody.receiveShadow = true;
        bldgGroup.add(bankBody);

        // Massive Vault Door Gold Medallion ($)
        const vaultGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.6, 24);
        const vault = new THREE.Mesh(vaultGeo, brassMat);
        vault.rotation.x = Math.PI / 2;
        vault.position.set(0, 14, d / 2 + 0.2);
        bldgGroup.add(vault);

        // 4 Imposing Columns
        for (let c = -1.5; c <= 1.5; c += 1.0) {
          const colGeo = new THREE.CylinderGeometry(0.8, 0.9, 14, 16);
          const col = new THREE.Mesh(colGeo, brassMat);
          col.position.set(c * (w / 3.8), 7, d / 2 + 1.2);
          col.castShadow = true;
          bldgGroup.add(col);
        }

        // Copper Dome on Roof
        const domeGeo = new THREE.SphereGeometry(4.5, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMat = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.4 });
        const dome = new THREE.Mesh(domeGeo, domeMat);
        dome.position.set(0, 20, 0);
        bldgGroup.add(dome);

        break;
      }

      case 'WEALTH_ADVISORY': {
        // Pinnacle Wealth Advisory (Sapphire Glass Tower with Rooftop Helipad)
        const wealthMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.8 });
        const towerGeo = new THREE.BoxGeometry(w, 38, d);
        const tower = new THREE.Mesh(towerGeo, wealthMat);
        tower.position.y = 19;
        tower.castShadow = true;
        tower.receiveShadow = true;
        bldgGroup.add(tower);

        // Golden Crown
        const crownGeo = new THREE.BoxGeometry(w + 0.8, 1.4, d + 0.8);
        const crownMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
        const crown = new THREE.Mesh(crownGeo, crownMat);
        crown.position.y = 38.7;
        bldgGroup.add(crown);

        // Rooftop Private Helipad
        const heliMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
        const heliGeo = new THREE.CylinderGeometry(4.0, 4.0, 0.4, 24);
        const helipad = new THREE.Mesh(heliGeo, heliMat);
        helipad.position.set(0, 39, 0);
        bldgGroup.add(helipad);

        // Painted H Ring
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
        const ringGeo = new THREE.RingGeometry(2.8, 3.2, 24);
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(0, 39.22, 0);
        bldgGroup.add(ring);

        break;
      }

      case 'TECH_INCUBATOR': {
        // Silicon Forge AI Incubator (Obsidian Glass Cube with Glowing Server Racks)
        const cubeMat = new THREE.MeshStandardMaterial({
          color: 0x1e1b4b,
          roughness: 0.1,
          metalness: 0.9,
          transparent: true,
          opacity: 0.9,
        });
        const cubeGeo = new THREE.BoxGeometry(w, 24, d);
        const cube = new THREE.Mesh(cubeGeo, cubeMat);
        cube.position.y = 12;
        cube.castShadow = true;
        cube.receiveShadow = true;
        bldgGroup.add(cube);

        // Glowing Server Chassis visible inside
        const rackMat1 = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
        const rackMat2 = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
        for (let r = -2; r <= 2; r++) {
          const rackGeo = new THREE.BoxGeometry(1.6, 14, 1.2);
          const rack = new THREE.Mesh(rackGeo, r % 2 === 0 ? rackMat1 : rackMat2);
          rack.position.set(r * 2.8, 8, 0);
          bldgGroup.add(rack);
        }

        // Rooftop Satellite Dishes
        const dishGeo = new THREE.SphereGeometry(1.8, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2.8);
        const dishMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.7 });
        const dish = new THREE.Mesh(dishGeo, dishMat);
        dish.rotation.x = -Math.PI / 3;
        dish.position.set(-3.5, 24.5, 0);
        bldgGroup.add(dish);

        break;
      }

      case 'UNIVERSITY': {
        // University & Library (Collegiate Brick Quad with Clock Bell Tower)
        const brickMat = new THREE.MeshStandardMaterial({ color: 0x581c87, roughness: 0.8 });
        const trimMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.4 });

        const quadGeo = new THREE.BoxGeometry(w, 20, d);
        const quad = new THREE.Mesh(quadGeo, brickMat);
        quad.position.y = 10;
        quad.castShadow = true;
        quad.receiveShadow = true;
        bldgGroup.add(quad);

        // Central Clock Tower (36 units tall)
        const towerGeo = new THREE.BoxGeometry(5.0, 18, 5.0);
        const tower = new THREE.Mesh(towerGeo, brickMat);
        tower.position.set(0, 20 + 9, d / 2 - 2.5);
        tower.castShadow = true;
        bldgGroup.add(tower);

        // Clock Face
        const clockGeo = new THREE.CircleGeometry(1.4, 24);
        const clockMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
        const clock = new THREE.Mesh(clockGeo, clockMat);
        clock.position.set(0, 33, d / 2 + 0.05);
        bldgGroup.add(clock);

        // Pyramidal Spire
        const spireGeo = new THREE.ConeGeometry(3.6, 6, 4);
        const spireMat = new THREE.MeshStandardMaterial({ color: 0x3b0764 });
        const spire = new THREE.Mesh(spireGeo, spireMat);
        spire.rotation.y = Math.PI / 4;
        spire.position.set(0, 38 + 3, d / 2 - 2.5);
        bldgGroup.add(spire);

        break;
      }

      case 'CLINIC': {
        // Guardian Health & Hospital (White Medical Pavilion with Glowing Red Cross & Helipad)
        const clinicMat = new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.2, metalness: 0.5 });
        const clinicGeo = new THREE.BoxGeometry(w, 22, d);
        const clinic = new THREE.Mesh(clinicGeo, clinicMat);
        clinic.position.y = 11;
        clinic.castShadow = true;
        clinic.receiveShadow = true;
        bldgGroup.add(clinic);

        // Glowing Medical Cross
        const crossMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
        const hCross = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.2), crossMat);
        hCross.position.set(0, 15, d / 2 + 0.05);
        bldgGroup.add(hCross);

        const vCross = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 3.6), crossMat);
        vCross.position.set(0, 15, d / 2 + 0.05);
        bldgGroup.add(vCross);

        // Emergency Helipad
        const heliMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
        const heli = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 0.4, 24), heliMat);
        heli.position.set(0, 22.2, 0);
        bldgGroup.add(heli);

        const ring = new THREE.Mesh(new THREE.RingGeometry(2.8, 3.2, 24), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(0, 22.42, 0);
        bldgGroup.add(ring);

        break;
      }

      case 'HOME':
      case 'RENTAL_PROPERTY': {
        if (bldg.id === 'bldg_luxury_penthouse') {
          // Billionaires Row Sky Penthouse Needle
          const needleMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, metalness: 0.9, roughness: 0.1 });
          const needleGeo = new THREE.BoxGeometry(w * 0.7, 56, d * 0.7);
          const needle = new THREE.Mesh(needleGeo, needleMat);
          needle.position.y = 28;
          needle.castShadow = true;
          bldgGroup.add(needle);

          // Cantilever Golden Sky Balcony
          const balcMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 });
          const balcGeo = new THREE.BoxGeometry(w * 0.9, 1.6, d * 0.9);
          const balc = new THREE.Mesh(balcGeo, balcMat);
          balc.position.y = 52;
          bldgGroup.add(balc);
        } else {
          // Turnkey Duplex & Residential Houses with 3D Pitched Roof and Chimney
          const houseMat = new THREE.MeshStandardMaterial({
            color: bldg.type === 'HOME' ? 0x831843 : 0x064e3b,
            roughness: 0.7,
          });
          const houseGeo = new THREE.BoxGeometry(w, 12, d);
          const house = new THREE.Mesh(houseGeo, houseMat);
          house.position.y = 6;
          house.castShadow = true;
          house.receiveShadow = true;
          bldgGroup.add(house);

          // 3D Pitched Gable Roof
          const roofGeo = new THREE.ConeGeometry(w * 0.72, 6, 4);
          const roofMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
          const roof = new THREE.Mesh(roofGeo, roofMat);
          roof.rotation.y = Math.PI / 4;
          roof.position.set(0, 12 + 3, 0);
          roof.castShadow = true;
          bldgGroup.add(roof);

          // Brick Chimney with Billowing Smoke Coordinates
          const chimGeo = new THREE.BoxGeometry(1.2, 4.5, 1.2);
          const chimMat = new THREE.MeshStandardMaterial({ color: 0x881337 });
          const chim = new THREE.Mesh(chimGeo, chimMat);
          chim.position.set(w / 2 - 2.0, 15, -d / 4);
          bldgGroup.add(chim);

          chimneys.push({
            x: bldg.tileX * TILE_3D + w / 2 - 2.0,
            y: 17.5,
            z: bldg.tileY * TILE_3D - d / 4,
          });
        }
        break;
      }

      default: {
        // Standard Metropolis Civic / Commercial Buildings (Town Hall, Superstore, Auto Dealer, etc.)
        const stdMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(bldg.color).getHex(),
          roughness: 0.4,
          metalness: 0.3,
        });
        const stdGeo = new THREE.BoxGeometry(w, 18, d);
        const stdMesh = new THREE.Mesh(stdGeo, stdMat);
        stdMesh.position.y = 9;
        stdMesh.castShadow = true;
        stdMesh.receiveShadow = true;
        bldgGroup.add(stdMesh);

        // Entrance Canopy
        const canopyGeo = new THREE.BoxGeometry(4.5, 0.4, 2.0);
        const canopyMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
        const canopy = new THREE.Mesh(canopyGeo, canopyMat);
        canopy.position.set(0, 3.8, d / 2 + 1.0);
        bldgGroup.add(canopy);
        break;
      }
    }

    // Windows Grid (Emissive warm glass glow)
    const winMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    for (let r = 0; r < 3; r++) {
      for (let c = -2; c <= 2; c++) {
        if (c === 0 && r === 0) continue; // Doorway opening
        const win = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.4), winMat);
        win.position.set(c * 3.0, 4.0 + r * 4.5, d / 2 + 0.05);
        bldgGroup.add(win);
      }
    }

    let bldgHeight = 16;
    if (bldg.type === 'CAREER_TOWER') bldgHeight = 63;
    else if (bldg.type === 'WEALTH_ADVISORY') bldgHeight = 39;
    else if (bldg.type === 'BANK') bldgHeight = 24;
    else if (bldg.type === 'STOCK_EXCHANGE') bldgHeight = 26;
    else if (bldg.type === 'TECH_INCUBATOR') bldgHeight = 24;
    else if (bldg.type === 'UNIVERSITY') bldgHeight = 28;
    else if (bldg.type === 'CLINIC') bldgHeight = 20;
    else if (bldg.type === 'TOWN_HALL') bldgHeight = 24;
    else if (bldg.type === 'HOME' || bldg.type === 'RENTAL_PROPERTY' || bldg.type === 'REAL_ESTATE') bldgHeight = 14;
    else if (bldg.type === 'CAFE' || bldg.type === 'SUPERSTORE' || bldg.type === 'AUTO_DEALER') bldgHeight = 14;

    // Floating 3D Title Plate Banner (Facing camera)
    const bannerCanvas = document.createElement('canvas');
    bannerCanvas.width = 512;
    bannerCanvas.height = 128;
    const bCtx = bannerCanvas.getContext('2d');
    if (bCtx) {
      bCtx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      bCtx.beginPath();
      bCtx.roundRect(8, 8, 496, 112, 16);
      bCtx.fill();
      bCtx.strokeStyle = bldg.color;
      bCtx.lineWidth = 6;
      bCtx.stroke();

      bCtx.font = 'bold 36px sans-serif';
      bCtx.fillStyle = '#ffffff';
      bCtx.textAlign = 'center';
      bCtx.fillText(`${bldg.icon} ${bldg.name}`, 256, 56);

      bCtx.font = 'bold 22px monospace';
      bCtx.fillStyle = '#94a3b8';
      bCtx.fillText(bldg.subtitle.slice(0, 38), 256, 96);
    }
    const bannerTexture = new THREE.CanvasTexture(bannerCanvas);
    const bannerSpriteMat = new THREE.SpriteMaterial({ map: bannerTexture, transparent: true, depthWrite: false });
    const bannerSprite = new THREE.Sprite(bannerSpriteMat);
    bannerSprite.scale.set(13, 3.25, 1);
    bannerSprite.position.set(0, bldgHeight + 3.0, 0);
    bldgGroup.add(bannerSprite);

    buildingsGroup.add(bldgGroup);
  });

  // Golden In-World Quest Waypoint Pillar of Light
  const questBeacon = new THREE.Group();
  questBeacon.name = 'QuestBeacon';

  const beamGeo = new THREE.CylinderGeometry(1.5, 2.5, 120, 16, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide,
  });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.position.y = 60;
  questBeacon.add(beam);

  const ringGeo = new THREE.RingGeometry(3.5, 4.5, 32);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide });
  const groundRing = new THREE.Mesh(ringGeo, ringMat);
  groundRing.rotation.x = -Math.PI / 2;
  groundRing.position.y = 0.2;
  questBeacon.add(groundRing);

  scene.add(questBeacon);
  scene.add(buildingsGroup);

  return {
    spireBeacons,
    chimneys,
    questBeacon,
    update: (dt: number, time: number, targetBldgId?: string | null) => {
      // 1. Blinking Red Aircraft Warning Beacons
      const flash = Math.sin(time * 6) > 0;
      spireBeacons.forEach((b) => {
        b.mat.color.setHex(flash ? 0xef4444 : 0x450a0a);
      });

      // 2. Position Golden In-World Quest Waypoint Beacon
      if (targetBldgId) {
        const target = BUILDINGS.find((b) => b.id === targetBldgId);
        if (target) {
          questBeacon.visible = true;
          questBeacon.position.set(target.tileX * TILE_3D, 0, target.tileY * TILE_3D);
          beamMat.opacity = 0.35 + Math.sin(time * 3) * 0.15;
          groundRing.rotation.z += dt * 1.5;
        } else {
          questBeacon.visible = false;
        }
      } else {
        questBeacon.visible = false;
      }
    },
  };
}
