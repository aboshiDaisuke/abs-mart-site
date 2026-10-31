// Christmas opening: falling snow gathers into a spiral light tree, the star ignites, then the page appears.
// Shown once per tab session (see the inline check in <head>). Add ?splash to the URL to replay it.
const splash = document.getElementById('splash');
const root = document.documentElement;

if (splash && root.classList.contains('splash-on')) runSplash();
else splash?.remove();

function runSplash() {
  let leaving = false, started = false;
  let cleanup = () => {};
  let onLeave = () => 0; // returns how long the scene animates before the overlay fades

  const skipKeys = (event) => { if (!event.metaKey && !event.ctrlKey && !event.altKey) leave(); };
  const leave = () => {
    if (leaving) return;
    leaving = true;
    root.classList.remove('splash-lock');
    window.removeEventListener('keydown', skipKeys);
    window.removeEventListener('wheel', leave);
    const scatter = onLeave();
    splash.classList.add('is-exiting');
    setTimeout(() => splash.classList.add('is-leaving'), scatter);
    setTimeout(() => {
      cleanup();
      splash.remove();
      root.classList.remove('splash-on');
    }, scatter + 950);
  };
  const showStatic = () => {
    if (started || leaving) return;
    started = true;
    splash.classList.add('is-static');
    setTimeout(leave, 1500);
  };

  splash.addEventListener('pointerdown', leave);
  window.addEventListener('keydown', skipKeys);
  window.addEventListener('wheel', leave, { passive: true });
  // A slow network should not hold the page behind an empty sky.
  const slowLoad = setTimeout(showStatic, 3500);

  import('./vendor/three/three.module.min.js')
    .then((T) => {
      clearTimeout(slowLoad);
      if (started || leaving) return;
      started = true;
      const scene = createScene(T, leave);
      cleanup = scene.dispose;
      onLeave = scene.exit;
    })
    .catch((error) => {
      console.warn('Christmas splash unavailable; showing the static title.', error);
      clearTimeout(slowLoad);
      started = false;
      showStatic();
    });
}

function createScene(T, leave) {
  const stage = splash.querySelector('.splash-stage');
  const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  stage.append(renderer.domElement);

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(40, 1, .1, 80);
  const disposables = [];
  const keep = (...items) => { disposables.push(...items); return items[0]; };
  const glow = keep(glowTexture(T));

  // ---- Tree of lights: a tiered fir of green lights, snowy branch tips, three garlands,
  // baubles, a trunk and a snowy ground. Everything starts as falling snow.
  const TOP = 2.1, BASE = -2.3, HEIGHT = TOP - BASE, RADIUS = 1.85, TURNS = 4.25, TIERS = 5;
  const GROUND_Y = BASE - .55, STAR_Y = TOP + .32;
  const outline = (t) => RADIUS * Math.pow(1 - t, .92) * (.52 + .48 * Math.pow(1 - ((t * TIERS + .15) % 1), 1.6));
  const compact = Math.min(window.innerWidth, window.innerHeight) < 600;
  const strandCount = compact ? 170 : 230;
  const fillCount = compact ? 820 : 1150;
  const tipCount = compact ? 150 : 210;
  const baubleCount = 30, trunkCount = 70, groundCount = compact ? 180 : 240;
  const total = strandCount * 3 + fillCount + tipCount + baubleCount + trunkCount + groundCount;
  const target = new Float32Array(total * 3), start = new Float32Array(total * 3), color = new Float32Array(total * 3);
  const delay = new Float32Array(total), size = new Float32Array(total), phase = new Float32Array(total);
  const strandColors = [[1, .82, .42], [1, .3, .4], [.55, .9, 1]];
  const baubleColors = [[1, .22, .36], [1, .78, .3], [.7, .86, 1], [1, .22, .36]];
  const c = new T.Color();
  let n = 0;
  const put = (t, angle, radius, rgb, s, y = BASE + t * HEIGHT) => {
    target.set([Math.cos(angle) * radius, y, Math.sin(angle) * radius], n * 3);
    start.set([(Math.random() - .5) * 15, -4 + Math.random() * 10, -5 + Math.random() * 8], n * 3);
    color.set(rgb, n * 3);
    delay[n] = Math.max(t, 0) * .55 + Math.random() * .25;
    size[n] = s;
    phase[n] = Math.random();
    n++;
  };
  for (let i = 0; i < groundCount; i++) {
    put(-.12, Math.random() * Math.PI * 2, 2.1 * Math.sqrt(Math.random()), [.62, .78, .95], .09 + Math.random() * .05, GROUND_Y + Math.random() * .04);
  }
  for (let i = 0; i < trunkCount; i++) {
    const t = -.12 * Math.random();
    put(t, Math.random() * Math.PI * 2, .22 * Math.sqrt(Math.random()), [.62, .36, .17], .12 + Math.random() * .04);
  }
  for (let i = 0; i < fillCount; i++) {
    const t = 1 - Math.sqrt(Math.random()); // denser near the wide base
    const radius = outline(t) * (.5 + .5 * Math.sqrt(Math.random())); // most lights near the surface
    c.setHSL(.35 + Math.random() * .07, .78, .4 + Math.random() * .2);
    put(t, Math.random() * Math.PI * 2, radius, [c.r, c.g, c.b], .15 + Math.random() * .08, BASE + t * HEIGHT - radius / RADIUS * .12);
  }
  for (let i = 0; i < tipCount; i++) {
    const t = 1 - Math.sqrt(Math.random()), radius = outline(t) * (.94 + Math.random() * .08);
    put(t, Math.random() * Math.PI * 2, radius, [.86, .95, 1], .1 + Math.random() * .04, BASE + t * HEIGHT - radius / RADIUS * .12 + .03);
  }
  for (let s = 0; s < 3; s++) {
    for (let i = 0; i < strandCount; i++) {
      const t = (i + Math.random() * .6) / strandCount;
      const radius = RADIUS * (1 - t) * .82 + .05 + (Math.random() - .5) * .05;
      put(t, t * TURNS * Math.PI * 2 + s * Math.PI * 2 / 3, radius, strandColors[s], .17 + Math.random() * .05);
    }
  }
  for (let i = 0; i < baubleCount; i++) {
    const t = .04 + (i / baubleCount) * .82 + Math.random() * .03;
    put(t, i * 2.399 + Math.random() * .3, outline(t) * .9, baubleColors[i % baubleColors.length], .34 + Math.random() * .08);
  }
  const treeGeometry = keep(new T.BufferGeometry());
  treeGeometry.setAttribute('position', new T.BufferAttribute(target, 3));
  treeGeometry.setAttribute('aStart', new T.BufferAttribute(start, 3));
  treeGeometry.setAttribute('aColor', new T.BufferAttribute(color, 3));
  treeGeometry.setAttribute('aDelay', new T.BufferAttribute(delay, 1));
  treeGeometry.setAttribute('aSize', new T.BufferAttribute(size, 1));
  treeGeometry.setAttribute('aPhase', new T.BufferAttribute(phase, 1));
  const treeUniforms = {
    uTime: { value: 0 }, uGather: { value: 0 }, uWave: { value: -1 }, uScale: { value: 400 }, uFade: { value: 0 }, uScatter: { value: -1 },
  };
  const treeMaterial = keep(new T.ShaderMaterial({
    uniforms: treeUniforms,
    transparent: true, depthWrite: false, blending: T.AdditiveBlending,
    vertexShader: /* glsl */`
      uniform float uTime, uGather, uWave, uScale, uFade, uScatter;
      attribute vec3 aStart, aColor;
      attribute float aDelay, aSize, aPhase;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float k = clamp((uGather - aDelay) / .55, 0., 1.);
        k = k * k * k * (k * (k * 6. - 15.) + 10.);
        vec3 p = aStart;
        p.x += sin(uTime * .9 + aPhase * 6.28) * .25;
        p.y = mod(aStart.y - uTime * .35 + 6., 12.) - 6.;
        p = mix(p, position, k);
        float swirl = (1. - k) * 2.4;
        p.xz = mat2(cos(swirl), sin(swirl), -sin(swirl), cos(swirl)) * p.xz;
        p.y += sin(k * 3.14159) * .5;
        // Exit: each light floats up and outward in a loose spiral, like snow lifted by the wind.
        float sc = clamp((uScatter - aPhase * .35) / 1.4, 0., 1.);
        float se = sc * sc * (3. - 2. * sc);
        vec3 dir = normalize(vec3(p.x, 0., p.z) + (aStart - vec3(0., 1., -1.)) * .18 + vec3(.001, 0., 0.));
        p += dir * se * (1.8 + aPhase * 2.2);
        p.x += sin(uTime * 1.3 + aPhase * 12.) * .35 * se;
        p.y += se * (1.4 + aPhase * 2.4);
        float lift = se * 1.1;
        p.xz = mat2(cos(lift), sin(lift), -sin(lift), cos(lift)) * p.xz;
        float twinkle = .55 + .45 * sin(uTime * 3.2 + aPhase * 6.28);
        float w = uWave - (${TOP.toFixed(2)} - position.y) / ${HEIGHT.toFixed(2)};
        float wave = exp(-w * w * 42.) * step(0., uWave);
        vColor = mix(vec3(.82, .92, 1.), aColor, k) + wave * .35;
        vAlpha = (mix(.42, twinkle, k) + wave * .7) * uFade * (1. - sc * sc * .9);
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_PointSize = min(aSize * mix(.55, 1., k) * (1. + wave * .35) * uScale / -mv.z, 72.);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - .5) * 2.;
        if (d > 1.) discard;
        float halo = pow(1. - d, 2.6);
        float core = smoothstep(.34, 0., d);
        gl_FragColor = vec4(vColor * halo + core * .9, vAlpha * max(halo, core));
      }`,
  }));
  const tree = new T.Points(treeGeometry, treeMaterial);
  tree.frustumCulled = false;
  scene.add(tree);

  // ---- Background snow.
  const SNOW = compact ? 260 : 420;
  const snowPositions = new Float32Array(SNOW * 3), snowSpeed = new Float32Array(SNOW);
  for (let i = 0; i < SNOW; i++) {
    snowPositions.set([(Math.random() - .5) * 20, -6 + Math.random() * 13, -9 + Math.random() * 12], i * 3);
    snowSpeed[i] = .35 + Math.random() * .55;
  }
  const snowGeometry = keep(new T.BufferGeometry());
  snowGeometry.setAttribute('position', new T.BufferAttribute(snowPositions, 3));
  const snowMaterial = keep(new T.PointsMaterial({
    map: glow, color: 0xdcefff, size: .14, transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending,
  }));
  const snow = new T.Points(snowGeometry, snowMaterial);
  snow.frustumCulled = false;
  scene.add(snow);

  // ---- Star on top, with a halo and a spray of sparks.
  scene.add(new T.AmbientLight(0xffffff, .5));
  const keyLight = new T.DirectionalLight(0xfff1d0, 2.2);
  keyLight.position.set(2, 4, 6);
  scene.add(keyLight);
  const starLight = new T.PointLight(0xffc860, 0, 6);
  starLight.position.set(0, STAR_Y, .6);
  scene.add(starLight);

  const shape = new T.Shape();
  for (let i = 0; i <= 10; i++) {
    const r = i % 2 ? .17 : .42, a = i / 10 * Math.PI * 2 + Math.PI / 2;
    i ? shape.lineTo(Math.cos(a) * r, Math.sin(a) * r) : shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  const starGeometry = keep(new T.ExtrudeGeometry(shape, { depth: .1, bevelEnabled: true, bevelThickness: .06, bevelSize: .035, bevelSegments: 3 }));
  starGeometry.center();
  const starMaterial = keep(new T.MeshStandardMaterial({ color: 0xffd36b, emissive: 0xffa928, emissiveIntensity: 0, metalness: .55, roughness: .25 }));
  const star = new T.Mesh(starGeometry, starMaterial);
  star.position.y = STAR_Y;
  star.scale.setScalar(0);
  scene.add(star);

  const haloMaterial = keep(new T.SpriteMaterial({ map: glow, color: 0xffd27a, transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending }));
  const halo = new T.Sprite(haloMaterial);
  halo.position.set(0, STAR_Y, -.05);
  scene.add(halo);

  const SPARKS = 160;
  const sparkPositions = new Float32Array(SPARKS * 3), sparkVelocity = new Float32Array(SPARKS * 3), sparkColors = new Float32Array(SPARKS * 3);
  const sparkPalette = [[1, .86, .5], [1, .4, .48], [.6, 1, .8], [1, 1, 1]];
  for (let i = 0; i < SPARKS; i++) {
    const v = new T.Vector3().randomDirection().multiplyScalar(1.6 + Math.random() * 2.8);
    sparkVelocity.set([v.x, v.y + .8, v.z], i * 3);
    sparkColors.set(sparkPalette[i % sparkPalette.length], i * 3);
  }
  const sparkGeometry = keep(new T.BufferGeometry());
  sparkGeometry.setAttribute('position', new T.BufferAttribute(sparkPositions, 3));
  sparkGeometry.setAttribute('color', new T.BufferAttribute(sparkColors, 3));
  const sparkMaterial = keep(new T.PointsMaterial({
    map: glow, size: .22, vertexColors: true, transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending,
  }));
  const sparks = new T.Points(sparkGeometry, sparkMaterial);
  sparks.frustumCulled = false;
  sparks.visible = false;
  scene.add(sparks);

  // ---- Framing: keep the whole tree above the title on any screen shape.
  const lookAt = new T.Vector3(), basePosition = new T.Vector3();
  const resize = () => {
    const w = splash.clientWidth || window.innerWidth, h = splash.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const tan = Math.tan(T.MathUtils.degToRad(camera.fov / 2));
    // Fit the tree (snowy ground to star tip) into the band between the top edge and the title.
    const brandTop = splash.querySelector('.splash-brand').offsetTop || h * .72;
    const top = 1 - 2 * Math.min(48, h * .06) / h;
    const bottom = 1 - 2 * (brandTop - Math.max(28, Math.min(64, h * .08))) / h;
    const span = STAR_Y + .45 - GROUND_Y;
    const halfH = Math.max(span / (top - bottom), 2.45 / camera.aspect);
    const distance = halfH / tan;
    lookAt.set(0, (STAR_Y + .45 + GROUND_Y) / 2 - (top + bottom) / 2 * halfH, 0);
    basePosition.set(0, lookAt.y + distance * .05, distance); // a slight look-down shows the snowy ground
    camera.updateProjectionMatrix();
    treeUniforms.uScale.value = renderer.getDrawingBufferSize(new T.Vector2()).y / (2 * tan);
  };
  resize();
  window.addEventListener('resize', resize);

  // ---- Timeline (seconds). Any tap, key or wheel skips straight to the page.
  const GATHER = [1.2, 4.6], IGNITE = 4.55, TITLE = 5, HOLD_END = 9.6;
  const ease = (x) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);
  const smooth = (x) => { x = Math.min(Math.max(x, 0), 1); return x * x * (3 - 2 * x); };
  const elastic = (x) => x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, -9 * x) * Math.sin((x * 8 - .75) * (2 * Math.PI / 3)) + 1;
  let time = 0, last = performance.now(), raf = 0, exitAt = -1, titled = false, sparked = false;

  const frame = (now) => {
    const dt = Math.min((now - last) / 1000, 1 / 20);
    last = now;
    time += dt;

    treeUniforms.uTime.value = time;
    treeUniforms.uFade.value = ease(time / 1);
    treeUniforms.uGather.value = smooth((time - GATHER[0]) / (GATHER[1] - GATHER[0])) * 1.35;
    tree.rotation.y = time * .4;
    snowMaterial.opacity = .75 * ease(time / 1.2);

    for (let i = 0; i < SNOW; i++) {
      const y = i * 3 + 1;
      snowPositions[y] -= snowSpeed[i] * dt;
      snowPositions[y - 1] += Math.sin(time * .8 + i) * .12 * dt;
      if (snowPositions[y] < -6) snowPositions[y] = 7;
    }
    snowGeometry.attributes.position.needsUpdate = true;

    const s = time - IGNITE;
    if (s >= 0) {
      star.scale.setScalar(elastic(s / .7));
      star.rotation.y = Math.sin(time * 1.7) * .55;
      starMaterial.emissiveIntensity = 1.4 + Math.exp(-s * 3) * 3;
      starLight.intensity = 6 + Math.exp(-s * 3) * 14;
      halo.scale.setScalar(1.6 + Math.exp(-s * 2.2) * 4 + Math.sin(time * 3) * .12);
      haloMaterial.opacity = .55 + Math.exp(-s * 2.5) * .45;
      treeUniforms.uWave.value = s * .9;
      if (!sparked) {
        sparked = true;
        sparks.visible = true;
        for (let i = 0; i < SPARKS; i++) sparkPositions.set([0, STAR_Y, 0], i * 3);
      }
      const drag = Math.exp(-dt * 1.6);
      for (let i = 0; i < SPARKS * 3; i += 3) {
        sparkVelocity[i] *= drag; sparkVelocity[i + 1] = sparkVelocity[i + 1] * drag - 2.4 * dt; sparkVelocity[i + 2] *= drag;
        sparkPositions[i] += sparkVelocity[i] * dt;
        sparkPositions[i + 1] += sparkVelocity[i + 1] * dt;
        sparkPositions[i + 2] += sparkVelocity[i + 2] * dt;
      }
      sparkGeometry.attributes.position.needsUpdate = true;
      sparkMaterial.opacity = Math.max(0, 1 - s / 1.8) * (.75 + Math.random() * .25);
    }
    if (!titled && time >= TITLE) {
      titled = true;
      splash.classList.add('is-titled');
      splash.querySelector('.splash-skip').textContent = 'サイトへすすむ ›';
    }
    if (time >= HOLD_END && exitAt < 0) leave();

    // Exit: the tree drifts apart while the camera eases in a little, then the overlay fades.
    const e = exitAt < 0 ? 0 : ease((time - exitAt) / 1.6);
    treeUniforms.uScatter.value = exitAt < 0 ? -1 : time - exitAt;
    if (exitAt >= 0) {
      star.scale.multiplyScalar(1 - e);
      haloMaterial.opacity *= 1 - e;
      starLight.intensity *= 1 - e;
    }
    camera.position.set(basePosition.x, basePosition.y + e * .4, basePosition.z * (1 - e * .12));
    camera.lookAt(lookAt.x, lookAt.y + e * .6, 0);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return {
    exit() { exitAt = time; return 1100; },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}

function glowTexture(T) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(.18, '#ffffffcc');
  g.addColorStop(.45, '#ffffff33');
  g.addColorStop(1, '#ffffff00');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new T.CanvasTexture(canvas);
}
