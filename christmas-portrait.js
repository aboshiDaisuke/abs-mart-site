// The Halloween depth-parallax treatment, adapted to a transparent portrait.
// Keep the original image as the fallback; the shader never changes the asset.
const art = document.querySelector('.santa-art');
const portrait = art?.querySelector('img');
const hero = document.getElementById('hero');
const tiltButton = document.querySelector('.tilt-toggle');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const coarsePointer = window.matchMedia('(pointer: coarse)');
const connection = navigator.connection;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uColor;
  uniform vec2 uScale;
  uniform vec2 uOffset;
  uniform vec2 uPointer;
  uniform float uIntro;
  varying vec2 vUv;

  float region(vec2 p, vec2 center, vec2 radius) {
    return 1.0 - smoothstep(0.55, 1.0, length((p - center) / radius));
  }

  // Smooth, portrait-specific depth regions keep the face and fingers coherent.
  // White fur and face sit forward of the hair; the raised hand is nearest.
  float portraitDepth(vec2 uv) {
    vec2 p = vec2(uv.x, 1.0 - uv.y);
    float d = 0.40;
    d = mix(d, 0.53, region(p, vec2(0.61, 0.88), vec2(0.43, 0.30)));
    d = mix(d, 0.58, region(p, vec2(0.62, 0.82), vec2(0.44, 0.16)));
    d = mix(d, 0.55, region(p, vec2(0.63, 0.13), vec2(0.35, 0.20)));
    d = mix(d, 0.74, region(p, vec2(0.59, 0.37), vec2(0.23, 0.25)));
    d += 0.035 * region(p, vec2(0.59, 0.38), vec2(0.07, 0.09));
    d = mix(d, 0.66, region(p, vec2(0.16, 0.70), vec2(0.20, 0.25)));
    d = mix(d, 0.84, region(p, vec2(0.255, 0.39), vec2(0.20, 0.36)));
    return d;
  }

  void main() {
    vec2 base = vUv * uScale + uOffset;
    vec2 shift = uPointer * vec2(0.036, 0.024) * uIntro;
    float depth = portraitDepth(base);
    vec2 uv = base + shift * (depth - 0.56);
    depth = portraitDepth(uv);
    uv = base + shift * (depth - 0.56);
    if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) {
      gl_FragColor = vec4(0.0);
      return;
    }
    // The texture and canvas both use premultiplied alpha: no double outline.
    gl_FragColor = texture2D(uColor, uv, -0.35);
  }
`;

if (art && portrait && hero) setupPortrait();

function setupPortrait() {
  let view = null, pending = false, destroyed = false, failed = false, visible = true;
  let sensorEnabled = false, neutral = null, lastPointerTime = -Infinity;
  const target = { x: 0, y: 0 };
  const listeners = [];
  const on = (node, type, handler, options) => {
    node?.addEventListener(type, handler, options);
    listeners.push(() => node?.removeEventListener(type, handler, options));
  };
  const permitted = () => !reduceMotion.matches && !connection?.saveData && hero.dataset.holidayPaused !== 'true';
  const active = () => permitted() && visible && !document.hidden && !destroyed;
  const hasTilt = () => coarsePointer.matches && window.isSecureContext && typeof window.DeviceOrientationEvent !== 'undefined';

  function resetSensor() { neutral = null; target.x = target.y = 0; }
  function readOrientation(event) {
    if (!sensorEnabled || !active() || !Number.isFinite(event.beta) || !Number.isFinite(event.gamma)) return;
    neutral ??= { beta: event.beta, gamma: event.gamma };
    const x = clamp((event.gamma - neutral.gamma) / 22, -1, 1);
    const y = clamp((event.beta - neutral.beta) / 22, -1, 1);
    const angle = (window.screen?.orientation?.angle ?? window.orientation ?? 0) * Math.PI / 180;
    target.x = clamp(x * Math.cos(angle) + y * Math.sin(angle), -1, 1);
    target.y = clamp(-y * Math.cos(angle) + x * Math.sin(angle), -1, 1);
  }

  async function toggleSensor() {
    if (sensorEnabled) {
      sensorEnabled = false; resetSensor(); sync(); return;
    }
    try {
      const orientation = window.DeviceOrientationEvent;
      if (typeof orientation?.requestPermission === 'function') {
        const result = await orientation.requestPermission();
        if (result !== 'granted') {
          tiltButton.textContent = '傾き操作は未許可'; return;
        }
      }
      if (destroyed) return;
      sensorEnabled = true; resetSensor(); sync();
    } catch {
      tiltButton.textContent = '傾き操作は利用できません';
    }
  }

  async function sync() {
    if (destroyed) return;
    if (tiltButton) {
      tiltButton.hidden = !hasTilt() || !permitted() || failed || !view;
      tiltButton.setAttribute('aria-pressed', String(sensorEnabled));
      tiltButton.textContent = sensorEnabled ? '傾き操作をやめる' : '傾きで動かす';
    }
    if (!active()) { view?.stop(); return; }
    if (view) { view.start(); return; }
    if (pending || failed || !portrait.complete || !portrait.naturalWidth) return;
    pending = true;
    try {
      const created = await createView(portrait, art, active, () => {
        if (sensorEnabled || performance.now() - lastPointerTime < 2600) return target;
        const t = performance.now() / 1000;
        return { x: Math.sin(t * .3) * .22, y: Math.sin(t * .2 + 1) * .1 };
      }, () => {
        failed = true; view?.dispose(); view = null; sync();
      });
      if (destroyed || failed) { created.dispose(); return; }
      view = created; sync();
    } catch (error) {
      failed = true; art.classList.remove('has-portrait-depth');
      console.warn('Portrait parallax unavailable; keeping the original illustration.', error);
    } finally { pending = false; }
  }

  on(window, 'pointermove', event => {
    if (event.pointerType === 'touch' || sensorEnabled || !active()) return;
    const r = art.getBoundingClientRect(); if (!r.width || !r.height) return;
    target.x = clamp((event.clientX - r.left) / r.width * 2 - 1, -1, 1);
    target.y = clamp(1 - (event.clientY - r.top) / r.height * 2, -1, 1);
    lastPointerTime = performance.now();
  }, { passive: true });
  on(window, 'deviceorientation', readOrientation, { passive: true });
  on(window.screen?.orientation, 'change', resetSensor);
  on(tiltButton, 'click', toggleSensor);
  on(window, 'holiday-motion-change', sync);
  on(document, 'visibilitychange', sync);
  on(reduceMotion, 'change', sync);
  on(coarsePointer, 'change', sync);
  on(connection, 'change', sync);
  on(portrait, 'load', () => { view?.refreshTexture(); sync(); });
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  observer.observe(art);
  on(window, 'pagehide', event => {
    if (event.persisted) { view?.stop(); return; }
    destroyed = true; observer.disconnect(); view?.dispose();
    for (const remove of listeners) remove();
  });
  on(window, 'pageshow', event => { if (event.persisted) sync(); });
  sync();
}

async function createView(image, parent, isActive, getTarget, onContextLost) {
  const T = await import('./vendor/three/three.module.min.js');
  const canvas = document.createElement('canvas'); canvas.className = 'portrait-depth'; canvas.setAttribute('aria-hidden', 'true');
  const renderer = new T.WebGLRenderer({ canvas, alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'low-power' });
  if (renderer.debug) renderer.debug.onShaderError = () => onContextLost();
  renderer.setClearColor(0x000000, 0); renderer.outputColorSpace = T.LinearSRGBColorSpace;
  const loader = new T.TextureLoader();
  let texture, source = '', destroyed = false, frame = 0, last = 0, elapsed = 0, ticket = 0;
  const uniforms = { uColor: { value: null }, uScale: { value: new T.Vector2(1, 1) }, uOffset: { value: new T.Vector2() }, uPointer: { value: new T.Vector2() }, uIntro: { value: 0 } };
  const material = new T.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true, blending: T.NoBlending, premultipliedAlpha: true, depthTest: false, depthWrite: false, toneMapped: false });
  const geometry = new T.PlaneGeometry(2, 2), scene = new T.Scene();
  scene.add(new T.Mesh(geometry, material));
  const camera = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  function layout() {
    if (destroyed || !texture) return;
    const { width, height } = parent.getBoundingClientRect(); if (!width || !height) return;
    const style = getComputedStyle(image), aspect = texture.image.width / texture.image.height;
    const scale = style.objectFit === 'contain' ? Math.min(width / aspect, height) : Math.max(width / aspect, height);
    const drawW = scale * aspect, drawH = scale;
    const position = style.objectPosition.split(/\s+/);
    // Computed CSS preserves a unitless zero as "0px", not "0%".
    const offset = (value, space) => {
      if (!value || value === 'center') return space * .5;
      if (value === 'left' || value === 'top') return 0;
      if (value === 'right' || value === 'bottom') return space;
      if (value.endsWith('%')) return space * parseFloat(value) / 100;
      return Number.parseFloat(value) || 0;
    };
    const left = offset(position[0], width - drawW), top = offset(position[1], height - drawH);
    uniforms.uScale.value.set(width / drawW, height / drawH);
    uniforms.uOffset.value.set(-left / drawW, 1 - (height - top) / drawH);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 3, Math.max(1, texture.image.width / drawW)));
    renderer.setSize(width, height, false);
    if (isActive()) renderer.render(scene, camera);
  }

  async function refreshTexture() {
    const nextSource = image.currentSrc || image.src;
    if (destroyed || source === nextSource) return;
    const version = ++ticket;
    const next = await loader.loadAsync(nextSource);
    if (destroyed || version !== ticket) { next.dispose(); return; }
    next.colorSpace = T.NoColorSpace; next.premultiplyAlpha = true;
    next.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
    texture?.dispose(); texture = next; source = nextSource;
    uniforms.uColor.value = next; layout();
  }

  function tick(now) {
    frame = 0;
    if (destroyed || !isActive()) { stop(); return; }
    const dt = last ? Math.min((now - last) / 1000, .05) : 0; last = now; elapsed += dt;
    const target = getTarget(), r = parent.getBoundingClientRect();
    const scroll = clamp(-r.top / Math.max(r.height, 1), 0, 1);
    const k = 1 - Math.exp(-dt * 6);
    uniforms.uPointer.value.x += (target.x - uniforms.uPointer.value.x) * k;
    uniforms.uPointer.value.y += (clamp(target.y - scroll * .25, -1, 1) - uniforms.uPointer.value.y) * k;
    uniforms.uIntro.value = Math.min(elapsed / .8, 1);
    renderer.render(scene, camera);
    if (destroyed) return;
    parent.classList.add('has-portrait-depth');
    frame = requestAnimationFrame(tick);
  }
  function start() { if (!destroyed && isActive() && !frame) { last = 0; frame = requestAnimationFrame(tick); } }
  function stop() {
    cancelAnimationFrame(frame); frame = 0; last = 0;
    parent.classList.remove('has-portrait-depth');
    uniforms.uPointer.value.set(0, 0); uniforms.uIntro.value = 0; elapsed = 0;
  }
  function dispose() {
    if (destroyed) return;
    destroyed = true; stop(); ticket++;
    resizeObserver.disconnect(); canvas.removeEventListener('webglcontextlost', lost);
    canvas.remove(); texture?.dispose(); geometry.dispose(); material.dispose(); renderer.dispose();
  }
  const lost = event => { event.preventDefault(); onContextLost(); };
  const resizeObserver = new ResizeObserver(layout);
  canvas.addEventListener('webglcontextlost', lost);
  try {
    await refreshTexture();
    parent.append(canvas); resizeObserver.observe(parent);
    return { start, stop, dispose, refreshTexture: () => refreshTexture().catch(onContextLost) };
  } catch (error) { dispose(); throw error; }
}

function clamp(value, min, max) { return Math.min(Math.max(value, min), max); }
