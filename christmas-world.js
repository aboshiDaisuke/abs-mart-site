// One locally bundled Three.js scene. Motion stops when hidden, offscreen, or paused.
const stage = document.getElementById('world-stage');
const heroSection = document.getElementById('hero');
const controls = document.querySelector('.world-controls');
const message = document.querySelector('.world-message');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const connection = navigator.connection;

if (stage) initWorld().catch(showFallback);

function showFallback(error) {
  console.warn('Christmas scene unavailable; keeping the static Christmas scene.', error);
  stage.querySelector('canvas')?.remove();
  stage.querySelector('.world-fallback').hidden = false;
  stage.querySelector('.fallback-message').textContent = 'サンタの広場へようこそ！ゲームとツールも楽しんでね。';
  stage.dataset.state = 'fallback';
  controls.hidden = true;
}

async function initWorld() {
  const [T, { createChristmasModels }] = await Promise.all([
    import('./vendor/three/three.module.min.js'),
    import('./christmas-models.js?v=lights'),
  ]);
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.24;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  stage.append(canvas);

  const scene = new T.Scene();
  const camera = new T.OrthographicCamera(-11, 11, 3.5, -3.5, .1, 80);
  camera.position.set(0, 7.5, 17);
  camera.lookAt(0, 1.9, 0);
  scene.add(new T.HemisphereLight(0xc9f1ff, 0x7fafa1, 2.5));
  const key = new T.DirectionalLight(0xffe7c2, 3.5);
  key.position.set(-5, 10, 7); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -11, right: 11, top: 7, bottom: -7, near: .5, far: 35 });
  key.shadow.normalBias = .04;
  key.shadow.bias = -.0003;
  scene.add(key);
  const rim = new T.DirectionalLight(0x94ceff, 1.6); rim.position.set(6, 5, -5); scene.add(rim);

  const models = createChristmasModels(T);
  scene.add(models.root);
  const { actors } = models;
  const treeLight = new T.PointLight(0xffd369, 7, 7); treeLight.position.set(.45, 3.8, .4); scene.add(treeLight);
  const raycaster = new T.Raycaster();
  const pointer = new T.Vector2();
  const cameraTarget = new T.Vector2();
  let inView = true, destroyed = false, contextLost = false;
  let frame = 0, elapsed = 0, lastTime = 0, narrow = false;
  let activeCharacter = '', effectStarted = -10;
  let giftProgress = 0;
  const moving = () => heroSection?.dataset.holidayPaused !== 'true' && !reduceMotion.matches && !connection?.saveData;

  // Camera-facing optical halos: bright white cores, warm light falloff, one draw call.
  const glowCanvas = document.createElement('canvas'); glowCanvas.width = glowCanvas.height = 128;
  const glowContext = glowCanvas.getContext('2d');
  const glowGradient = glowContext.createRadialGradient(64, 64, 0, 64, 64, 64);
  glowGradient.addColorStop(0, '#ffffff');
  glowGradient.addColorStop(.06, '#fffffff0');
  glowGradient.addColorStop(.15, '#ffffffa0');
  glowGradient.addColorStop(.38, '#ffffff30');
  glowGradient.addColorStop(1, '#ffffff00');
  glowContext.fillStyle = glowGradient; glowContext.fillRect(0, 0, 128, 128);
  const glowTexture = new T.CanvasTexture(glowCanvas);
  const bulbs = actors.tree.userData.bulbs;
  const glowPositions = new Float32Array(bulbs.length * 3);
  const glowColors = new Float32Array(bulbs.length * 3);
  bulbs.forEach((bulb, i) => {
    bulb.position.toArray(glowPositions, i * 3);
    bulb.material.color.toArray(glowColors, i * 3);
  });
  const glowGeometry = new T.BufferGeometry();
  glowGeometry.setAttribute('position', new T.BufferAttribute(glowPositions, 3));
  glowGeometry.setAttribute('color', new T.BufferAttribute(glowColors, 3));
  const glowMaterial = new T.PointsMaterial({ map: glowTexture, vertexColors: true, size: 32, sizeAttenuation: false, transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: .9, toneMapped: false });
  const bulbGlows = new T.Points(glowGeometry, glowMaterial);
  bulbGlows.name = 'tree-light-halos'; bulbGlows.raycast = () => {};
  actors.tree.add(bulbGlows);
  const starGlowMaterial = new T.SpriteMaterial({ map: glowTexture, color: 0xffcf66, transparent: true, opacity: .7, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false });
  const starGlow = new T.Sprite(starGlowMaterial); starGlow.scale.set(1.8, 1.8, 1);
  starGlow.position.copy(actors.tree.userData.star.position); starGlow.position.z += .1;
  starGlow.raycast = () => {}; actors.tree.add(starGlow);

  // One particle draw call for the whole snowfield.
  const snowCount = 150;
  const snowPositions = new Float32Array(snowCount * 3);
  const snowSeeds = [];
  for (let i = 0; i < snowCount; i++) {
    snowSeeds.push({ x: Math.sin(i * 127.1) * 11, y: (i * 1.713) % 7, z: Math.cos(i * 93.7) * 4, speed: .18 + (i % 7) * .04 });
  }
  const snowGeometry = new T.BufferGeometry();
  snowGeometry.setAttribute('position', new T.BufferAttribute(snowPositions, 3));
  const dotCanvas = document.createElement('canvas'); dotCanvas.width = dotCanvas.height = 32;
  const ctx = dotCanvas.getContext('2d');
  const gradient = ctx.createRadialGradient(16, 16, 1, 16, 16, 15);
  gradient.addColorStop(0, '#ffffff'); gradient.addColorStop(.4, '#ffffffe6'); gradient.addColorStop(1, '#ffffff00');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 32, 32);
  const snowTexture = new T.CanvasTexture(dotCanvas);
  // Orthographic points use CSS pixels; sub-pixel world-unit sizes would vanish.
  const snowMaterial = new T.PointsMaterial({ color: 0xf5fffc, size: 2.6, sizeAttenuation: false, map: snowTexture, transparent: true, opacity: .85, depthWrite: false });
  const snow = new T.Points(snowGeometry, snowMaterial); scene.add(snow);

  function resize() {
    if (destroyed || contextLost) return;
    const { width, height } = stage.getBoundingClientRect();
    if (!width || !height) return;
    const nextNarrow = width / height < 2.4;
    narrow = nextNarrow;
    models.layout(narrow);
    glowMaterial.size = narrow ? 22 : 32;
    treeLight.position.set(narrow ? .1 : .2, 3.3, narrow ? -.3 : .4);
    const viewHeight = narrow
      ? Math.max(6.4, 10.4 / (width / height))
      : Math.max(5.6, 18.4 / (width / height));
    const halfWidth = viewHeight * width / height / 2;
    Object.assign(camera, { left: -halfWidth, right: halfWidth, top: viewHeight / 2, bottom: -viewHeight / 2 });
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    render();
  }

  function pose() {
    const animation = moving();
    const t = elapsed;
    const progress = Math.min((t - effectStarted) / 1.65, 1);
    const effect = progress < 1 ? Math.sin(progress * Math.PI) : 0;
    for (const [id, actor] of Object.entries(actors)) {
      actor.position.copy(actor.userData.basePosition);
      actor.rotation.z = 0;
      if (animation && activeCharacter === id) {
        actor.position.y += effect * (id === 'tree' ? .08 : .28);
        actor.rotation.z = Math.sin(progress * Math.PI * 4) * effect * .06;
      }
    }
    const wave = actors.santa.userData.wave;
    wave.rotation.z = animation ? Math.sin(t * 2.4) * .13 : -.18;
    if (activeCharacter === 'santa') wave.rotation.z += animation ? Math.sin(t * 14) * effect * .45 : -.45;
    actors.santa.userData.head.rotation.z = animation ? Math.sin(t * 1.3) * .025 : 0;
    actors.reindeer.userData.head.rotation.z = activeCharacter === 'reindeer' ? (animation ? Math.sin(t * 10) * effect * .18 : .15) : 0;
    actors.snowman.rotation.y = activeCharacter === 'snowman' && animation ? Math.sin(progress * Math.PI * 2) * effect * .6 : 0;
    const star = actors.tree.userData.star;
    star.rotation.y = animation ? Math.sin(t * .8) * .22 : 0;
    star.scale.setScalar(activeCharacter === 'tree' ? 1.18 + (animation ? effect * .15 : 0) : 1);
    const shimmer = animation ? .82 + Math.sin(t * 1.7) * .12 : .9;
    glowMaterial.opacity = activeCharacter === 'tree' ? 1 : shimmer;
    starGlowMaterial.opacity = activeCharacter === 'tree' ? .95 : shimmer * .8;
    treeLight.intensity = activeCharacter === 'tree' ? 18 : 10;
    const target = actors.gift.userData.open ? 1 : 0;
    giftProgress = animation ? T.MathUtils.lerp(giftProgress, target, .13) : target;
    actors.gift.userData.lid.position.y = .88 + giftProgress * .67;
    actors.gift.userData.lid.rotation.z = giftProgress * -.2;
    actors.gift.userData.surprise.visible = giftProgress > .25;
    actors.gift.userData.surprise.position.y = 1.15 + (animation ? Math.sin(t * 3) * .07 : 0);
    for (let i = 0; i < snowCount; i++) {
      const seed = snowSeeds[i];
      snowPositions[i * 3] = seed.x * (narrow ? .43 : 1) + Math.sin(t * .3 + i) * .12;
      snowPositions[i * 3 + 1] = ((seed.y - t * seed.speed) % 7 + 7) % 7;
      snowPositions[i * 3 + 2] = seed.z;
    }
    snow.visible = animation;
    snowGeometry.attributes.position.needsUpdate = true;
    models.root.rotation.y = animation ? T.MathUtils.lerp(models.root.rotation.y, cameraTarget.x * .06, .035) : 0;
  }

  function render() {
    if (destroyed || contextLost) return;
    pose(); renderer.render(scene, camera);
  }
  function tick(now) {
    frame = 0;
    if (destroyed || contextLost || !moving() || !inView || document.hidden) { lastTime = 0; return; }
    if (lastTime) elapsed += Math.min((now - lastTime) / 1000, .05);
    lastTime = now;
    render(); frame = requestAnimationFrame(tick);
  }
  function updateMotion() {
    cancelAnimationFrame(frame); frame = 0; lastTime = 0;
    render();
    if (!destroyed && !contextLost && moving() && inView && !document.hidden) frame = requestAnimationFrame(tick);
  }
  const responses = {
    santa: 'サンタ「メリークリスマス！今年もいっぱい遊ぼうね！」',
    reindeer: 'トナカイ「プレゼントのお届け、準備オッケー！」',
    tree: 'ツリーがキラキラ！てっぺんの星もごきげんです。',
    snowman: '雪だるま「寒い日も、ここならワクワクだね！」',
  };
  function interact(id) {
    if (!actors[id] || destroyed || contextLost) return;
    activeCharacter = id; effectStarted = elapsed;
    if (id === 'gift') {
      actors.gift.userData.open = !actors.gift.userData.open;
      message.textContent = actors.gift.userData.open ? 'プレゼントの中には、ワクワクする星！下のゲームも開けてみてね。' : 'もう一度リボンを結んだよ。また開けてみてね！';
    } else message.textContent = responses[id];
    document.querySelectorAll('[data-character]').forEach(button => {
      button.classList.toggle('is-active', button.dataset.character === id);
    });
    render();
  }
  document.querySelectorAll('[data-character]').forEach(button => button.addEventListener('click', () => interact(button.dataset.character)));
  let down = null;
  canvas.addEventListener('pointerdown', event => { down = { x: event.clientX, y: event.clientY }; });
  canvas.addEventListener('pointercancel', () => { down = null; });
  canvas.addEventListener('pointerup', event => {
    if (!down || Math.hypot(event.clientX - down.x, event.clientY - down.y) > 8) { down = null; return; }
    down = null;
    const bounds = canvas.getBoundingClientRect();
    pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    for (const hit of raycaster.intersectObjects(Object.values(actors), true)) {
      if (hit.object.name === 'contact-shadow') continue;
      let selected = hit.object;
      while (selected && !selected.userData.character) selected = selected.parent;
      if (selected) { interact(selected.userData.character); break; }
    }
  });
  canvas.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    const bounds = canvas.getBoundingClientRect();
    cameraTarget.x = (event.clientX - bounds.left) / bounds.width * 2 - 1;
  });
  canvas.addEventListener('pointerleave', () => { cameraTarget.set(0, 0); down = null; });

  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(stage);
  const visibilityObserver = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; updateMotion(); }, { rootMargin: '80px' });
  visibilityObserver.observe(stage);
  reduceMotion.addEventListener('change', updateMotion);
  connection?.addEventListener('change', updateMotion);
  window.addEventListener('holiday-motion-change', updateMotion);
  document.addEventListener('visibilitychange', updateMotion);
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault(); contextLost = true; cancelAnimationFrame(frame);
    stage.querySelector('.world-fallback').hidden = false; canvas.hidden = true; controls.hidden = true;
    stage.dataset.state = 'fallback';
  });
  canvas.addEventListener('webglcontextrestored', () => {
    contextLost = false; canvas.hidden = false; controls.hidden = false;
    resize(); stage.querySelector('.world-fallback').hidden = true; stage.dataset.state = 'ready'; updateMotion();
  });

  resize();
  stage.querySelector('.world-fallback').hidden = true;
  controls.hidden = false;
  stage.dataset.state = 'ready';
  updateMotion();

  function dispose(event) {
    if (event.persisted) return;
    destroyed = true; cancelAnimationFrame(frame);
    resizeObserver.disconnect(); visibilityObserver.disconnect();
    reduceMotion.removeEventListener('change', updateMotion);
    connection?.removeEventListener('change', updateMotion);
    window.removeEventListener('holiday-motion-change', updateMotion);
    document.removeEventListener('visibilitychange', updateMotion);
    const geometries = new Set(), materials = new Set();
    scene.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) for (const material of [].concat(object.material)) materials.add(material);
    });
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    snowTexture.dispose(); glowTexture.dispose(); renderer.dispose();
  }
  window.addEventListener('pagehide', dispose);
  window.addEventListener('pageshow', event => { if (event.persisted) updateMotion(); });
}
