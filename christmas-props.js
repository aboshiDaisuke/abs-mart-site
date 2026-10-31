import { RoundedBoxGeometry } from './vendor/three/RoundedBoxGeometry.js';

// Crafted geometry and procedural materials, all bundled locally.
export function createHolidayProps(T) {
  const textures = new Set();
  const cache = new Map();
  const colors = { red: 0xb92540, mint: 0x19796b, gold: 0xe6bf67, cream: 0xfff2d2, pink: 0xc14b73 };
  const sphere = new T.SphereGeometry(1, 20, 12);
  const snowMaterial = new T.MeshStandardMaterial({ color: 0xf5fff9, roughness: .93 });
  const gold = new T.MeshPhysicalMaterial({ color: 0xffcb64, metalness: .85, roughness: .23, clearcoat: .4 });
  const group = (parent, name) => { const g = new T.Group(); g.name = name; parent?.add(g); return g; };
  const add = (parent, geometry, material, x = 0, y = 0, z = 0) => {
    const mesh = new T.Mesh(geometry, material); mesh.position.set(x, y, z);
    mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  };
  const rounded = (w, h, d, radius = .025) => {
    const key = `box-${w}-${h}-${d}-${radius}`;
    if (!cache.has(key)) cache.set(key, new RoundedBoxGeometry(w, h, d, 3, radius));
    return cache.get(key);
  };
  const cord = (parent, points, material, radius = .012, segments = 40) =>
    add(parent, new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p => new T.Vector3(...p))), segments, radius, 5, false), material);

  function paper(color) {
    const key = `paper-${color}`;
    if (cache.has(key)) return cache.get(key);
    const hex = colors[color] ?? colors.red;
    const rgb = [hex >> 16 & 255, hex >> 8 & 255, hex & 255];
    const pixels = new Uint8Array(256 * 256 * 4);
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      const dx = x % 64 - 32, dy = y % 64 - 32;
      const alternate = (Math.floor(x / 64) + Math.floor(y / 64)) % 2;
      let mark = alternate ? Math.abs(dx) + Math.abs(dy) < 3.5 : false;
      if (!alternate) for (const angle of [0, Math.PI / 3, Math.PI * 2 / 3]) {
        const u = dx * Math.cos(angle) + dy * Math.sin(angle), v = -dx * Math.sin(angle) + dy * Math.cos(angle);
        mark ||= Math.abs(u) < 11 && Math.abs(v) < .85;
        mark ||= Math.abs(Math.abs(u) - 6) < 3 && Math.abs(Math.abs(v) - (9 - Math.abs(u))) < .8;
      }
      const grain = .96 + ((x * 31 + y * 17) % 13) * .004;
      const i = (y * 256 + x) * 4;
      for (let k = 0; k < 3; k++) pixels[i + k] = mark ? [245, 211, 137][k] : Math.round(rgb[k] * grain);
      pixels[i + 3] = 255;
    }
    const texture = new T.DataTexture(pixels, 256, 256, T.RGBAFormat);
    texture.colorSpace = T.SRGBColorSpace; texture.wrapS = texture.wrapT = T.RepeatWrapping;
    texture.magFilter = T.LinearFilter; texture.minFilter = T.LinearMipmapLinearFilter;
    texture.generateMipmaps = true; texture.needsUpdate = true; textures.add(texture);
    const material = new T.MeshPhysicalMaterial({ map: texture, roughness: .42, metalness: .035, clearcoat: .24, clearcoatRoughness: .3 });
    cache.set(key, material); return material;
  }

  function satin(color) {
    const key = `satin-${color}`;
    if (!cache.has(key)) cache.set(key, new T.MeshPhysicalMaterial({
      color: colors[color] ?? colors.gold, metalness: .35, roughness: .27,
      sheen: .8, sheenColor: 0xffe6b1, sheenRoughness: .35, clearcoat: .25, side: T.DoubleSide,
    }));
    return cache.get(key);
  }

  // A wide, twisted ribbon surface with rolled edges, rather than a round tube.
  function ribbon(parent, points, width, material, twist = 0) {
    const curve = new T.CatmullRomCurve3(points.map(p => new T.Vector3(...p)));
    const positions = [], uvs = [], indices = [], steps = 40;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps, p = curve.getPoint(t), tangent = curve.getTangent(t);
      let side = new T.Vector3(0, 0, 1).cross(tangent).normalize();
      if (side.lengthSq() < .01) side.set(1, 0, 0);
      side.applyAxisAngle(tangent, twist * Math.sin(t * Math.PI * 2));
      const normal = tangent.clone().cross(side).normalize();
      for (let j = 0; j <= 4; j++) {
        const across = j / 4 - .5;
        const v = p.clone().addScaledVector(side, across * width).addScaledVector(normal, .014 * Math.cos(across * Math.PI));
        positions.push(v.x, v.y, v.z); uvs.push(j / 4, t);
      }
      if (i < steps) for (let j = 0; j < 4; j++) {
        const a = i * 5 + j; indices.push(a, a + 5, a + 1, a + 1, a + 5, a + 6);
      }
    }
    const geometry = new T.BufferGeometry();
    geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new T.Float32BufferAttribute(uvs, 2)); geometry.setIndex(indices); geometry.computeVertexNormals();
    return add(parent, geometry, material);
  }

  const starPositions = [];
  for (const side of [-1, 1]) for (let i = 0; i < 10; i++) {
    const a = Math.PI / 2 + i * Math.PI / 5, b = a + Math.PI / 5;
    const r1 = i % 2 ? .21 : .45, r2 = i % 2 ? .45 : .21;
    const p1 = [Math.cos(a) * r1, Math.sin(a) * r1, 0], p2 = [Math.cos(b) * r2, Math.sin(b) * r2, 0];
    starPositions.push(0, 0, side * .16, ...(side > 0 ? p1 : p2), ...(side > 0 ? p2 : p1));
  }
  const starGeometry = new T.BufferGeometry(); starGeometry.setAttribute('position', new T.Float32BufferAttribute(starPositions, 3)); starGeometry.computeVertexNormals();

  function gift(color = 'red', ribbonColor = 'gold', scale = 1) {
    const root = group(null, 'gift');
    const wrap = paper(color), fabric = satin(ribbonColor);
    const lining = new T.MeshStandardMaterial({ color: 0xe9c995, roughness: .9, side: T.DoubleSide });
    // Five separate walls leave an actual opening when the lid is lifted.
    add(root, rounded(.94, .055, .86, .018), wrap, 0, .045, 0);
    for (const side of [-1, 1]) {
      add(root, rounded(.94, .77, .055, .018), wrap, 0, .425, side * .403);
      add(root, rounded(.055, .77, .75, .018), wrap, side * .442, .425, 0);
      add(root, new T.PlaneGeometry(.82, .71), lining, 0, .425, side * .372).rotation.y = side > 0 ? Math.PI : 0;
      add(root, new T.PlaneGeometry(.74, .71), lining, side * .412, .425, 0).rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
    }
    const innerFloor = add(root, new T.PlaneGeometry(.82, .74), lining, 0, .076, 0); innerFloor.rotation.x = -Math.PI / 2;
    for (const side of [-1, 1]) {
      add(root, rounded(.125, .77, .012, .005), fabric, 0, .425, side * .438);
      add(root, rounded(.012, .77, .125, .005), fabric, side * .477, .425, 0);
    }
    const lid = group(root, 'gift-lid'); lid.position.y = .88;
    add(lid, rounded(1.02, .16, .94, .03), wrap);
    add(lid, rounded(.13, .018, .94, .006), fabric, 0, .089, 0);
    add(lid, rounded(1.02, .018, .13, .006), fabric, 0, .09, 0);
    for (const side of [-1, 1]) {
      ribbon(lid, [[0, .17, 0], [side * .24, .39, -.045], [side * .39, .27, .015], [side * .25, .14, .08], [0, .17, .025]], .11, fabric, side * .55);
      ribbon(lid, [[side * .04, .14, .03], [side * .15, .115, .25], [side * .23, .07, .48], [side * .2, -.18, .49]], .105, fabric, side * .28);
    }
    add(lid, rounded(.17, .12, .15, .045), fabric, 0, .18, .025).rotation.z = .13;
    const tag = group(root, 'gift-tag'); tag.position.set(.29, .58, .463); tag.rotation.z = -.18;
    add(tag, rounded(.21, .28, .018, .025), new T.MeshStandardMaterial({ color: 0xfff2d4, roughness: .8 }));
    const tagStar = add(tag, starGeometry, gold, 0, -.025, .015); tagStar.scale.setScalar(.13);
    cord(root, [[.17, .82, .46], [.32, .8, .47], [.3, .7, .48]], gold, .009, 12);
    const surprise = group(root, 'gift-surprise'); surprise.visible = false;
    const luckyStar = add(surprise, starGeometry, new T.MeshStandardMaterial({ color: 0xffdc8c, metalness: .55, roughness: .2, emissive: 0xffb834, emissiveIntensity: .7 }));
    luckyStar.scale.setScalar(.53);
    for (let i = 0; i < 8; i++) {
      const sparkle = add(surprise, new T.OctahedronGeometry(.025), gold, Math.sin(i * 2.4) * .29, Math.cos(i * 1.7) * .21, Math.cos(i * 2.4) * .2);
      sparkle.rotation.z = i;
    }
    root.userData.lid = lid; root.userData.surprise = surprise;
    root.scale.setScalar(scale); return root;
  }

  function foliageGeometry(radius, height, y, phase) {
    const positions = [], vertexColors = [], indices = [], around = 80, rings = 7;
    const dark = new T.Color(0x123e2a), light = new T.Color(0x377d46);
    for (let j = 0; j <= rings; j++) for (let i = 0; i <= around; i++) {
      const t = j / rings, angle = i / around * Math.PI * 2;
      const tip = Math.pow(.5 + .5 * Math.cos(angle * 10 + phase), 3);
      const r = radius * Math.pow(1 - t, .82) * (.88 + .12 * tip);
      positions.push(Math.cos(angle) * r, y + t * height - (1 - t) * .1 * tip, Math.sin(angle) * r);
      const tint = dark.clone().lerp(light, .2 + .5 * tip + .2 * (1 - t)); vertexColors.push(tint.r, tint.g, tint.b);
      if (j < rings && i < around) { const a = j * (around + 1) + i; indices.push(a, a + around + 1, a + 1, a + 1, a + around + 1, a + around + 2); }
    }
    const geometry = new T.BufferGeometry(); geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new T.Float32BufferAttribute(vertexColors, 3)); geometry.setIndex(indices); geometry.computeVertexNormals(); return geometry;
  }

  const leafMaterial = new T.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: .88, side: T.DoubleSide });
  const twigMaterial = new T.MeshStandardMaterial({ color: 0x286843, roughness: .82, side: T.DoubleSide });
  const twigPositions = [];
  for (const angle of [-.45, 0, .45]) {
    const x = Math.sin(angle) * .2, z = Math.cos(angle) * .26;
    twigPositions.push(-.035, 0, 0, x, .02, z, .035, 0, 0, .035, 0, 0, x, -.025, z, -.035, 0, 0);
  }
  const twigGeometry = new T.BufferGeometry(); twigGeometry.setAttribute('position', new T.Float32BufferAttribute(twigPositions, 3)); twigGeometry.computeVertexNormals();

  function tree(small = false) {
    const root = group(null, small ? 'little-tree' : 'tree');
    const trunk = new T.MeshStandardMaterial({ color: 0x694333, roughness: .95 });
    add(root, new T.CylinderGeometry(.12, .2, .7, 14), trunk, 0, .35, 0);
    const tiers = small ? 5 : 7;
    for (let i = 0; i < tiers; i++) {
      const f = i / (tiers - 1), radius = 1.27 - f * 1.06, y = .44 + f * 2.79;
      add(root, foliageGeometry(radius, .95 - f * .3, y, i * .9), leafMaterial);
    }
    const needleCount = small ? 50 : 630;
    const needles = new T.InstancedMesh(twigGeometry, twigMaterial, needleCount);
    const snowCount = small ? 15 : 48;
    const snow = new T.InstancedMesh(new T.SphereGeometry(1, 10, 6), snowMaterial, snowCount);
    const dummy = new T.Object3D();
    for (let i = 0; i < needleCount; i++) {
      const tier = i % tiers, f = tier / (tiers - 1), angle = i * 2.39996;
      const t = small ? .08 : .04 + Math.floor(i / tiers) % 5 * .12;
      const tip = Math.pow(.5 + .5 * Math.cos(angle * 10 + tier * .9), 3);
      const r = (1.27 - f * 1.06) * Math.pow(1 - t, .82) * (.88 + .12 * tip) * .96;
      const y = .44 + f * 2.79 + t * (.95 - f * .3) - (1 - t) * .1 * tip;
      dummy.position.set(Math.cos(angle) * r, y + .025, Math.sin(angle) * r);
      dummy.rotation.set(.18, Math.PI / 2 - angle, 0); dummy.scale.setScalar((.65 + (i % 4) * .1) * (1 - f * .35)); dummy.updateMatrix(); needles.setMatrixAt(i, dummy.matrix);
      needles.setColorAt(i, new T.Color().setHSL(.37 + (i % 5) * .006, .42, .2 + (i % 4) * .022));
    }
    for (let i = 0; i < snowCount; i++) {
      const tier = i % (tiers - 1), f = tier / (tiers - 1), angle = i * 2.39996 + .25;
      const radius = 1.27 - f * 1.06, height = .95 - f * .3, r = radius * .72;
      const tip = Math.pow(.5 + .5 * Math.cos(angle * 10 + tier * .9), 3);
      const t = 1 - Math.pow(.72 / (.88 + .12 * tip), 1 / .82);
      const y = .44 + f * 2.79 + t * height - (1 - t) * .1 * tip;
      dummy.position.set(Math.cos(angle) * r, y + .018, Math.sin(angle) * r);
      const normal = new T.Vector3(Math.cos(angle) * height / radius, 1, Math.sin(angle) * height / radius).normalize();
      dummy.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), normal);
      dummy.scale.set(.15 * (1 - f * .4), .028, .1); dummy.updateMatrix(); snow.setMatrixAt(i, dummy.matrix);
    }
    needles.castShadow = true; needles.receiveShadow = true; root.add(needles, snow);
    if (small) return root;

    const star = add(root, starGeometry, gold, 0, 4.02, 0); root.userData.star = star;
    add(root, new T.CylinderGeometry(.025, .04, .34, 10), gold, 0, 3.77, 0);
    const cablePoints = [], bulbPositions = [];
    const lightColor = [0xffd18a, 0xff5f68, 0x95f7d9];
    for (let i = 0; i <= 420; i++) {
      const f = i / 420, angle = f * Math.PI * 8.8 + .3;
      const y = .52 + f * 3.05, r = 1.29 * Math.pow(1 - f * .94, .88);
      const p = new T.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r); cablePoints.push(p);
      if (i % 7 === 0) bulbPositions.push({ position: p.clone(), material: { color: new T.Color(lightColor[bulbPositions.length % 3]) } });
    }
    add(root, new T.TubeGeometry(new T.CatmullRomCurve3(cablePoints), 420, .012, 5, false), new T.MeshStandardMaterial({ color: 0x24382b, roughness: .7 }));
    for (let c = 0; c < 3; c++) {
      const selected = bulbPositions.filter((_, i) => i % 3 === c);
      const material = new T.MeshStandardMaterial({ color: lightColor[c], emissive: lightColor[c], emissiveIntensity: 2.4, roughness: .15 });
      const bulbs = new T.InstancedMesh(new T.SphereGeometry(.038, 10, 8), material, selected.length);
      selected.forEach((bulb, i) => { dummy.position.copy(bulb.position); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1.3, 1); dummy.updateMatrix(); bulbs.setMatrixAt(i, dummy.matrix); }); root.add(bulbs);
    }
    root.userData.bulbs = bulbPositions;
    const baubleMaterials = [0xb61931, 0xffc85b, 0x226c63].map(color => new T.MeshPhysicalMaterial({ color, metalness: .72, roughness: .16, clearcoat: 1, clearcoatRoughness: .1 }));
    for (let i = 0; i < 17; i++) {
      const level = i % 4, tier = [1, 2, 4, 5][level], angle = i * 2.39996 + .6;
      const anchorY = .5 + tier / 6 * 2.79, y = anchorY - .24;
      const r = (1.27 - tier / 6 * 1.06) * .92 + .04, radius = .115 - level * .01;
      const x = Math.cos(angle) * r, z = Math.sin(angle) * r;
      const bauble = add(root, sphere, baubleMaterials[i % 3], x, y, z); bauble.scale.setScalar(radius);
      add(root, new T.CylinderGeometry(.035, .04, .055, 10), gold, x, y + radius + .02, z);
      add(root, new T.TorusGeometry(.032, .008, 5, 12), gold, x, y + radius + .065, z);
      cord(root, [[x, y + radius + .09, z], [x * .98, anchorY, z * .98]], gold, .006, 4);
      if (i % 3 === 0) add(root, new T.TorusGeometry(radius * .997, .008, 5, 24), gold, x, y, z).rotation.x = Math.PI / 2;
    }
    for (let i = 0; i < 3; i++) {
      const y = .95 + i * .7, angle = .5 + i * 1.7, r = 1.3 * (1 - (y - .45) / 3.7);
      const cane = group(root, 'candy-cane'); cane.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
      cane.rotation.z = (i - 1) * .2; cane.scale.setScalar(.65);
      const curve = new T.CatmullRomCurve3([[0, -.2, 0], [0, .22, 0], [.03, .36, 0], [.15, .4, 0], [.25, .32, 0], [.25, .22, 0]].map(p => new T.Vector3(...p)));
      const geometry = new T.TubeGeometry(curve, 44, .04, 8, false), tint = [];
      for (let j = 0; j < geometry.attributes.position.count; j++) {
        const c = new T.Color(Math.floor(j / 9 / 3) % 2 ? 0xfbf3db : 0xd72e49); tint.push(c.r, c.g, c.b);
      }
      geometry.setAttribute('color', new T.Float32BufferAttribute(tint, 3)); add(cane, geometry, new T.MeshStandardMaterial({ vertexColors: true, roughness: .3, metalness: .06 }));
    }
    return root;
  }

  // A tiny HDR studio environment gives metallic baubles and ribbon real reflections.
  function environment() {
    const w = 256, h = 128, data = new Float32Array(w * h * 4);
    const panels = [{ dir: new T.Vector3(-.7, .5, .5).normalize(), rgb: [5, 3.8, 2.2], sharpness: 40 }, { dir: new T.Vector3(.8, .25, .2).normalize(), rgb: [1.7, 2.6, 3.8], sharpness: 55 }, { dir: new T.Vector3(0, .8, -.4).normalize(), rgb: [3, 2.6, 1.8], sharpness: 25 }];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const phi = (y / (h - 1) - .5) * Math.PI, theta = (x / w - .5) * Math.PI * 2;
      const direction = new T.Vector3(Math.cos(phi) * Math.cos(theta), Math.sin(phi), Math.cos(phi) * Math.sin(theta));
      const rgb = [.08 + Math.max(direction.y, 0) * .18, .12 + Math.max(direction.y, 0) * .21, .16 + Math.max(direction.y, 0) * .24];
      for (const p of panels) { const strength = Math.pow(Math.max(0, direction.dot(p.dir)), p.sharpness); for (let k = 0; k < 3; k++) rgb[k] += p.rgb[k] * strength; }
      data.set([...rgb, 1], (y * w + x) * 4);
    }
    const texture = new T.DataTexture(data, w, h, T.RGBAFormat, T.FloatType); texture.mapping = T.EquirectangularReflectionMapping;
    texture.colorSpace = T.LinearSRGBColorSpace; texture.needsUpdate = true; textures.add(texture); return texture;
  }
  return { gift, tree, textures, environment };
}
