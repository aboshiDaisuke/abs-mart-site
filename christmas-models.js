// Original toy models built entirely from geometry; no model service or remote assets.
export function createChristmasModels(T) {
  const palette = {
    red: 0xeb3151, darkRed: 0xb71f3b, cream: 0xfff9e5, snow: 0xf2fffc,
    green: 0x087b57, mint: 0x6ce3b2, gold: 0xffcf53, black: 0x172d37,
    skin: 0xffc696, brown: 0xac673d, tan: 0xeab77e, pink: 0xf68ba0,
  };
  const materials = new Map();
  const geometries = new Map();
  const mat = (color, glow = false) => {
    const hex = palette[color] ?? color;
    const key = `${hex}-${glow}`;
    if (!materials.has(key)) materials.set(key, new T.MeshStandardMaterial({
      color: hex, roughness: glow ? .3 : .66, metalness: color === 'gold' ? .28 : .02,
      emissive: glow ? hex : 0x000000, emissiveIntensity: glow ? .65 : 0,
    }));
    return materials.get(key);
  };
  const sphereGeo = new T.SphereGeometry(1, 20, 14);
  const boxGeo = new T.BoxGeometry(1, 1, 1);
  const mesh = (parent, geometry, color, x = 0, y = 0, z = 0, glow = false) => {
    const m = new T.Mesh(geometry, mat(color, glow));
    m.position.set(x, y, z); m.castShadow = !glow; m.receiveShadow = true;
    parent.add(m); return m;
  };
  const ball = (p, c, x, y, z, sx, sy = sx, sz = sx, glow = false) => {
    const m = mesh(p, sphereGeo, c, x, y, z, glow); m.scale.set(sx, sy, sz); return m;
  };
  const box = (p, c, x, y, z, sx, sy, sz) => {
    const m = mesh(p, boxGeo, c, x, y, z); m.scale.set(sx, sy, sz); return m;
  };
  const cylinder = (p, c, x, y, z, top, bottom, height, segments = 32) => {
    const key = `c-${top}-${bottom}-${height}-${segments}`;
    if (!geometries.has(key)) geometries.set(key, new T.CylinderGeometry(top, bottom, height, segments));
    return mesh(p, geometries.get(key), c, x, y, z);
  };
  const torus = (p, c, x, y, z, radius, tube) => {
    const key = `t-${radius}-${tube}`;
    if (!geometries.has(key)) geometries.set(key, new T.TorusGeometry(radius, tube, 8, 32));
    return mesh(p, geometries.get(key), c, x, y, z);
  };
  const limb = (p, c, from, to, radius) => {
    const a = new T.Vector3(...from), b = new T.Vector3(...to);
    const direction = b.clone().sub(a);
    const m = cylinder(p, c, 0, 0, 0, radius, radius * 1.08, direction.length(), 10);
    m.position.copy(a.add(b).multiplyScalar(.5));
    m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), direction.normalize());
    ball(p, c, ...to, radius); return m;
  };
  const group = (p, name) => { const g = new T.Group(); g.name = name; if (p) p.add(g); return g; };
  const eyes = (p, x, y, z, distance = .15, size = .047) => {
    for (const side of [-1, 1]) {
      ball(p, 'black', x + side * distance, y, z, size, size * 1.25, size * .65);
      ball(p, 'cream', x + side * distance - .012, y + .016, z + size * .6, size * .23);
    }
  };

  function gift(color = 'red', ribbon = 'gold', scale = 1) {
    const root = group(null, 'gift');
    box(root, color, 0, .42, 0, .92, .8, .85);
    box(root, ribbon, 0, .43, .001, .14, .82, .86);
    box(root, ribbon, 0, .43, 0, .93, .82, .14);
    const lid = group(root, 'gift-lid'); lid.position.y = .88;
    box(lid, color, 0, 0, 0, 1.02, .17, .94);
    box(lid, ribbon, 0, .006, 0, .15, .19, .96);
    box(lid, ribbon, 0, .006, 0, 1.04, .19, .14);
    for (const side of [-1, 1]) {
      const bow = torus(lid, ribbon, side * .16, .22, 0, .18, .045);
      bow.scale.set(1.2, .7, 1); bow.rotation.z = side * .45;
    }
    ball(lid, ribbon, 0, .15, .02, .09);
    const surprise = ball(root, 'gold', 0, 1, 0, .19, .19, .19, true); surprise.visible = false;
    root.userData.lid = lid; root.userData.surprise = surprise;
    root.scale.setScalar(scale); return root;
  }

  function santa() {
    const root = group(null, 'santa');
    for (const side of [-1, 1]) {
      ball(root, 'black', side * .23, .15, .13, .23, .16, .34);
      cylinder(root, 'red', side * .23, .38, 0, .17, .19, .45);
    }
    ball(root, 'red', 0, .98, 0, .66, .77, .5);
    const hem = torus(root, 'cream', 0, .56, 0, .5, .11); hem.rotation.x = Math.PI / 2; hem.scale.y = .79;
    const belt = cylinder(root, 'black', 0, .91, 0, .635, .635, .17); belt.scale.z = .77;
    box(root, 'gold', 0, .92, .51, .28, .23, .07); box(root, 'black', 0, .92, .556, .15, .12, .025);
    for (let i = 0; i < 2; i++) ball(root, 'gold', 0, 1.15 + i * .2, .48, .045);
    const head = group(root, 'santa-head'); head.position.y = 1.91;
    ball(head, 'skin', 0, 0, 0, .47, .48, .44);
    ball(head, 'cream', 0, -.25, .23, .48, .4, .31);
    for (let i = 0; i < 7; i++) {
      const a = Math.PI + i / 6 * Math.PI;
      ball(head, 'cream', Math.cos(a) * .33, -.23 + Math.sin(a) * .2, .33, .16, .2, .17);
    }
    eyes(head, 0, .08, .406, .17, .046);
    for (const side of [-1, 1]) {
      ball(head, 'pink', side * .31, -.03, .34, .1, .055, .04);
      const brow = ball(head, 'cream', side * .17, .19, .409, .12, .04, .04); brow.rotation.z = side * -.12;
      ball(head, 'cream', side * .13, -.09, .45, .18, .09, .09).rotation.z = side * -.25;
    }
    ball(head, 'skin', 0, -.01, .5, .115, .11, .12);
    const hat = group(head, 'santa-hat'); hat.position.y = .34;
    const cone = mesh(hat, new T.ConeGeometry(.47, .7, 28), 'red', -.04, .32, 0); cone.rotation.z = .18;
    const brim = torus(hat, 'cream', 0, 0, 0, .43, .11); brim.rotation.x = Math.PI / 2;
    ball(hat, 'red', -.22, .6, 0, .18, .16, .15);
    ball(hat, 'cream', -.34, .59, .01, .145);
    const wave = group(root, 'santa-wave'); wave.position.set(-.48, 1.35, 0);
    limb(wave, 'red', [0, 0, 0], [-.3, .4, .03], .17);
    ball(wave, 'cream', -.31, .42, .03, .18, .1, .18).rotation.z = .6;
    ball(wave, 'red', -.36, .57, .05, .18, .22, .15);
    ball(wave, 'red', -.18, .51, .1, .08, .12, .08);
    limb(root, 'red', [.48, 1.35, 0], [.72, .97, .1], .17);
    ball(root, 'cream', .73, .97, .1, .18, .11, .17);
    ball(root, 'red', .75, .81, .13, .18);
    const sack = ball(root, 'tan', .64, .6, -.38, .44, .54, .35); sack.rotation.z = -.25;
    root.userData.wave = wave; root.userData.head = head;
    return root;
  }

  function snowman() {
    const root = group(null, 'snowman');
    ball(root, 'snow', 0, .62, 0, .67, .66, .58);
    ball(root, 'snow', 0, 1.43, 0, .47, .47, .43);
    eyes(root, 0, 1.52, .394, .16, .045);
    const carrot = mesh(root, new T.ConeGeometry(.09, .38, 14), 0xff943b, 0, 1.4, .54); carrot.rotation.x = Math.PI / 2;
    for (let i = 0; i < 5; i++) { const a = Math.PI + .4 + i * .58; ball(root, 'black', Math.cos(a) * .19, 1.36 + Math.sin(a) * .11, .407, .022); }
    for (const side of [-1, 1]) ball(root, 'pink', side * .28, 1.39, .35, .085, .045, .035);
    cylinder(root, 'black', 0, 1.83, 0, .54, .54, .08);
    cylinder(root, 'black', 0, 2.06, 0, .31, .35, .43);
    cylinder(root, 'red', 0, 1.92, 0, .347, .35, .1);
    ball(root, 'green', .28, 1.96, .19, .13, .06, .05).rotation.z = .5;
    ball(root, 'red', .26, 1.95, .24, .045);
    const scarf = torus(root, 'red', 0, 1.15, 0, .39, .11); scarf.rotation.x = Math.PI / 2;
    box(root, 'red', .18, .94, .52, .19, .48, .08).rotation.z = -.12;
    for (let i = 0; i < 3; i++) box(root, 'gold', .19, .79 + i * .08, .572, .17, .025, .02);
    for (let i = 0; i < 3; i++) ball(root, 'black', -.06, .45 + i * .23, .57, .055);
    for (const side of [-1, 1]) {
      limb(root, 'brown', [side * .5, 1, 0], [side * .97, 1.32, 0], .043);
      limb(root, 'brown', [side * .78, 1.19, 0], [side * .85, 1.48, 0], .032);
      limb(root, 'brown', [side * .87, 1.25, 0], [side * 1.12, 1.24, 0], .03);
    }
    return root;
  }

  function reindeer() {
    const root = group(null, 'reindeer');
    ball(root, 'brown', 0, .87, 0, .57, .55, .82);
    ball(root, 'tan', 0, .84, .53, .35, .35, .25);
    for (const x of [-.34, .34]) for (const z of [-.45, .43]) {
      cylinder(root, 'brown', x, .35, z, .12, .1, .55, 14);
      ball(root, 'black', x, .11, z + .03, .15, .13, .18);
    }
    ball(root, 'brown', 0, 1.39, .34, .3, .55, .32);
    const head = group(root, 'reindeer-head'); head.position.set(0, 1.86, .46);
    ball(head, 'brown', 0, 0, 0, .48, .44, .43);
    ball(head, 'tan', 0, -.17, .33, .32, .23, .24);
    ball(head, 'red', 0, -.08, .56, .145, .13, .12, true);
    eyes(head, 0, .06, .375, .2, .06);
    for (const side of [-1, 1]) {
      const ear = ball(head, 'brown', side * .46, .26, -.02, .16, .31, .11); ear.rotation.z = side * -.7;
      const inner = ball(head, 'pink', side * .47, .27, .063, .08, .19, .03); inner.rotation.z = side * -.7;
      limb(head, 'tan', [side * .25, .29, -.06], [side * .37, .9, -.06], .055);
      limb(head, 'tan', [side * .34, .64, -.06], [side * .62, .84, -.06], .043);
      limb(head, 'tan', [side * .31, .55, -.06], [side * .13, .76, -.06], .04);
    }
    const collar = torus(root, 'green', 0, 1.39, .34, .31, .08); collar.rotation.x = Math.PI / 2;
    ball(root, 'gold', 0, 1.25, .69, .11);
    box(root, 'black', 0, 1.23, .795, .07, .025, .01);
    ball(root, 'cream', 0, 1.02, -.76, .15, .16, .22).rotation.x = -.6;
    root.userData.head = head; return root;
  }

  const starShape = new T.Shape();
  for (let i = 0; i < 10; i++) {
    const angle = Math.PI / 2 + i * Math.PI / 5;
    const r = i % 2 ? .21 : .48;
    const x = Math.cos(angle) * r, y = Math.sin(angle) * r;
    if (i === 0) starShape.moveTo(x, y); else starShape.lineTo(x, y);
  }
  starShape.closePath();
  const starGeo = new T.ExtrudeGeometry(starShape, { depth: .12, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .035, bevelThickness: .035 });

  function tree(small = false) {
    const root = group(null, small ? 'little-tree' : 'tree');
    cylinder(root, 'brown', 0, .3, 0, .19, .24, .6);
    const tiers = [[1.3, 1.7, 1.2], [1.05, 1.6, 2.14], [.76, 1.5, 3.04]];
    for (const [radius, height, y] of tiers) {
      mesh(root, new T.ConeGeometry(radius, height, 40), 'green', 0, y, 0);
      const rim = torus(root, 'snow', 0, y - height / 2 + .05, 0, radius * .97, .05); rim.rotation.x = Math.PI / 2;
    }
    if (!small) {
      const star = mesh(root, starGeo, 'gold', 0, 4.02, 0, true); root.userData.star = star;
      const cablePoints = [];
      const bulbs = [];
      for (let i = 0; i <= 150; i++) {
        const f = i / 150, angle = f * Math.PI * 9;
        const y = .7 + f * 2.88, radius = (1 - f) * 1.06 + .15;
        cablePoints.push(new T.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
        if (i % 5 === 0) bulbs.push(ball(root, ['gold', 'red', 'mint'][i % 3], Math.cos(angle) * (radius + .05), y, Math.sin(angle) * (radius + .05), .055, .055, .055, true));
      }
      mesh(root, new T.TubeGeometry(new T.CatmullRomCurve3(cablePoints), 150, .018, 5, false), 'gold');
      for (let level = 0; level < 3; level++) {
        for (let j = 0; j < 7 - level; j++) {
          const a = j / (7 - level) * Math.PI * 2 + level * .7;
          const r = 1.06 - level * .3;
          const ornament = ball(root, ['red', 'gold', 'mint', 'cream'][(j + level) % 4], Math.cos(a) * r, .8 + level * .94, Math.sin(a) * r, .11 - level * .015);
          cylinder(root, 'gold', ornament.position.x, ornament.position.y + .12, ornament.position.z, .035, .035, .05, 8);
        }
      }
      root.userData.bulbs = bulbs;
      for (let i = 0; i < 3; i++) { const g = gift(['red', 'mint', 'gold'][i], ['gold', 'red', 'red'][i], .55); g.position.set((i - 1) * .68, 0, .8 + (i % 2) * .15); g.rotation.y = (i - 1) * .3; root.add(g); }
    }
    return root;
  }

  const root = group(null, 'christmas-toyland');
  const actors = { santa: santa(), reindeer: reindeer(), tree: tree(), snowman: snowman(), gift: gift('red', 'gold', 1.16) };
  // Keep the star inside a compact stage while the other toys stay prominent.
  actors.tree.scale.setScalar(.86);
  for (const [id, actor] of Object.entries(actors)) {
    actor.userData.character = id; root.add(actor);
    // A soft contact shadow grounds each toy without a postprocessing pass.
    const shadow = new T.Mesh(new T.CircleGeometry(id === 'tree' ? 1.4 : .75, 32), new T.MeshBasicMaterial({ color: 0x4a9d95, transparent: true, opacity: .14, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = .012; shadow.name = 'contact-shadow'; actor.add(shadow);
  }
  const ground = cylinder(root, 0xe2f3ee, 0, -.25, 0, 10.5, 10.25, .48, 96); ground.scale.z = .43;
  const base = cylinder(root, 0xb9ded5, 0, -.53, 0, 10.22, 10.05, .15, 96); base.scale.z = .43;
  const scenery = group(root, 'scenery');
  for (const [x, z, scale] of [[-8.6, -1.4, .5], [8.6, -1.8, .68], [-7.3, -2.4, .65], [6.6, -2.5, .46]]) {
    const pine = tree(true); pine.position.set(x, 0, z); pine.scale.setScalar(scale); scenery.add(pine);
  }
  for (let i = 0; i < 15; i++) {
    const x = Math.sin(i * 4.1) * 9, z = Math.cos(i * 2.8) * 3;
    ball(scenery, 'snow', x, .035, z, .18 + (i % 3) * .06, .08, .16);
  }
  const extraGifts = group(scenery, 'extra-gifts');
  for (let i = 0; i < 3; i++) {
    const g = gift(['mint', 'gold', 'pink'][i], ['red', 'red', 'cream'][i], .55 + i * .1);
    g.position.set(5.3 + i * .8, 0, -.9); g.rotation.y = i * .4; extraGifts.add(g);
  }
  const positions = {
    wide: { santa: [-7.2, 0, .35], reindeer: [-3.5, 0, .25], tree: [.2, 0, -.4], snowman: [4, 0, .3], gift: [7.4, 0, .8] },
    narrow: { santa: [-3.3, 0, 0], reindeer: [-1.5, 0, 1.05], tree: [.1, 0, -.7], snowman: [2.3, 0, .1], gift: [3.7, 0, 1.1] },
  };
  function layout(narrow) {
    for (const [id, pos] of Object.entries(positions[narrow ? 'narrow' : 'wide'])) {
      actors[id].position.set(...pos);
      actors[id].rotation.y = id === 'reindeer' ? -.22 : id === 'gift' ? -.2 : 0;
      actors[id].userData.basePosition = new T.Vector3(...pos);
    }
    scenery.visible = !narrow;
    ground.scale.x = base.scale.x = narrow ? .46 : 1;
    ground.scale.z = base.scale.z = narrow ? .47 : .43;
  }
  layout(false);
  return { root, actors, layout, materials, geometries };
}
