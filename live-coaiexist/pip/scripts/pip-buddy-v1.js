import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as Tone from 'https://cdn.skypack.dev/tone';

const DEFAULT_MODEL_PATHS = {
  stand: 'https://coaiexist.wtf/assets/pollywog/pip_stand.glb',
  walk: 'https://coaiexist.wtf/assets/pollywog/pip_walk.glb',
  jump: 'https://coaiexist.wtf/assets/pollywog/pip_jump.glb',
  skill: 'https://coaiexist.wtf/assets/pollywog/pip_skill.glb',
  fall: 'https://coaiexist.wtf/assets/pollywog/pip_fall.glb',
  fall2: 'https://coaiexist.wtf/assets/pollywog/pip_fall2.glb',
  finger: 'https://coaiexist.wtf/assets/pollywog/pip_finger.glb',
  jazz: 'https://coaiexist.wtf/assets/pollywog/pip_jazz.glb',
  stagger: 'https://coaiexist.wtf/assets/pollywog/pip_stagger.glb',
  stomp2: 'https://coaiexist.wtf/assets/pollywog/pip_stomp2.glb',
  wave: 'https://coaiexist.wtf/assets/pollywog/pip_wave.glb'
};

const DEFAULT_RECEIPTS = [
  'AUTH: UNVERIFIED',
  'pip install princess',
  'KIDZBOP DID 9/11',
  'polliw.ogg error...',
  'can only parse 10 files at a time',
  'Which ether? your mom.',
  'Not for profit,\nbut for propht.',
  'PROTOCOL: SEPIA.EXE\nENGAGED'
];

const DEFAULT_IDLE_ANIMATIONS = ['stand', 'walk', 'jump', 'skill', 'jazz', 'stagger'];

const DEFAULT_OPTIONS = {
  containerId: 'bonzi-container',
  receiptId: 'pip-receipt',
  mobileBreakpoint: 768,
  mobileFallbackImage: 'https://coaiexist.wtf/assets/pollywog/pip.gif',
  mobileCaption: 'Mobile view = static Pip preview. Rotate device or visit on desktop for full chaos.',
  modelPaths: DEFAULT_MODEL_PATHS,
  receipts: DEFAULT_RECEIPTS,
  idleAnimations: DEFAULT_IDLE_ANIMATIONS,
  autoReceiptInterval: 0,
  respectReducedMotion: true,
  viewportDebounce: 250,
  onReceipt: null
};

export function initPipBuddy(userOptions = {}) {
  const config = { ...DEFAULT_OPTIONS, ...userOptions };
  const container = document.getElementById(config.containerId);
  if (!container) {
    console.warn(`[pip] container #${config.containerId} not found`);
    return;
  }
  const receiptEl = config.receiptId ? document.getElementById(config.receiptId) : null;

  let currentMode = null;
  let cleanupFn = () => {};
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const prefersReducedMotion = () => config.respectReducedMotion && reduceMotionQuery.matches;

  const evaluateMode = () => {
    const shouldUseMobile = window.innerWidth <= config.mobileBreakpoint || prefersReducedMotion();
    const nextMode = shouldUseMobile ? 'mobile' : 'desktop';
    if (nextMode === currentMode) return;
    cleanupFn();
    if (nextMode === 'mobile') {
      cleanupFn = activateMobileMode(container, receiptEl, config);
    } else {
      cleanupFn = activateDesktopMode(container, receiptEl, config);
    }
    currentMode = nextMode;
  };

  evaluateMode();

  const debouncedEvaluate = debounce(evaluateMode, config.viewportDebounce);
  window.addEventListener('resize', debouncedEvaluate);
  window.addEventListener('orientationchange', debouncedEvaluate);
  const removeMotionListener = config.respectReducedMotion
    ? attachMediaQueryListener(reduceMotionQuery, evaluateMode)
    : () => {};

  return {
    refresh: evaluateMode,
    destroy() {
      window.removeEventListener('resize', debouncedEvaluate);
      window.removeEventListener('orientationchange', debouncedEvaluate);
      removeMotionListener();
      cleanupFn();
      currentMode = null;
    }
  };
}

function activateMobileMode(container, receiptEl, config) {
  container.innerHTML = `
    <div class="pip-mobile-wrapper">
      <img src="${config.mobileFallbackImage}" alt="Pip preview" class="pip-mobile-image" loading="lazy">
      <p class="pip-mobile-caption">${config.mobileCaption}</p>
    </div>
  `;
  container.classList.add('pip-mobile');
  if (receiptEl) {
    receiptEl.textContent = 'MOBILE MODE: STATIC PIP';
    receiptEl.classList.add('visible');
    setTimeout(() => receiptEl.classList.remove('visible'), 2500);
  }
  return () => {
    container.classList.remove('pip-mobile');
    container.innerHTML = '';
    if (receiptEl) {
      receiptEl.classList.remove('visible');
    }
  };
}

function activateDesktopMode(container, receiptEl, config) {
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 2.0));
    const dirLight = new THREE.DirectionalLight(0xffffff, 4);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    const loader = new GLTFLoader();
    const clock = new THREE.Clock();
    const buddies = {};
    let currentBuddy = null;
    let isClickAnimationPlaying = false;

    const modelPromises = Object.entries(config.modelPaths).map(([name, path]) => loadModel(loader, scene, buddies, name, path));

    let audioReady = false;
    const boopSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 }
    }).toDestination();
    const receiptSynth = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.005, decay: 0.05, sustain: 0 }
    }).toDestination();

    const handleContainerClick = () => {
      if (!audioReady) {
        Tone.start();
        audioReady = true;
      }
      if (!isClickAnimationPlaying) {
        playSpecificAnimation('wave');
        showRandomReceipt(config.receipts, receiptEl, receiptSynth, config.onReceipt);
        boopSynth.triggerAttackRelease('C5', '8n');
      }
    };
    container.addEventListener('click', handleContainerClick);

    function playAnimation(name) {
      if (!buddies[name]) {
        console.error(`Animation "${name}" not found.`);
        return 0;
      }
      if (currentBuddy) {
        currentBuddy.model.visible = false;
        currentBuddy.action.stop();
      }
      currentBuddy = buddies[name];
      currentBuddy.model.visible = true;
      currentBuddy.action.reset().play();
      return currentBuddy.action.getClip().duration * 1000;
    }

    function playSpecificAnimation(name) {
      isClickAnimationPlaying = true;
      const duration = playAnimation(name);
      setTimeout(() => {
        isClickAnimationPlaying = false;
        playIdleAnimation();
      }, duration);
    }

    function playIdleAnimation() {
      if (isClickAnimationPlaying) return;
      const idleAnimations = config.idleAnimations?.length ? config.idleAnimations : DEFAULT_IDLE_ANIMATIONS;
      const randomIdle = idleAnimations[Math.floor(Math.random() * idleAnimations.length)];
      const duration = playAnimation(randomIdle);
      setTimeout(playIdleAnimation, duration + Math.random() * 4000 + 3000);
    }

    function animate() {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (currentBuddy) {
        currentBuddy.mixer.update(delta);
      }
      renderer.render(scene, camera);
    }

    let frameId = null;
    let autoReceiptTimer = null;

    Promise.all(modelPromises)
      .then(() => {
        ['stand', 'walk'].forEach(name => {
          if (buddies[name]) {
            buddies[name].action.setLoop(THREE.LoopRepeat);
          }
        });
        camera.position.set(0, 0, 100);
        playIdleAnimation();
        animate();
        if (config.autoReceiptInterval > 0) {
          autoReceiptTimer = window.setInterval(() => {
            showRandomReceipt(config.receipts, receiptEl, receiptSynth, config.onReceipt);
          }, config.autoReceiptInterval);
        }
      })
      .catch(error => {
        console.error("Error loading Pip's models:", error);
        container.innerHTML = `<div class="pip-error">Pip couldn't load!<br>A model file failed to download.</div>`;
      });

    const resizeHandler = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      container.removeEventListener('click', handleContainerClick);
      if (frameId) cancelAnimationFrame(frameId);
      if (autoReceiptTimer) window.clearInterval(autoReceiptTimer);
      container.innerHTML = '';
      Object.values(buddies).forEach(({ model }) => {
        scene.remove(model);
      });
      renderer.dispose();
    };
  } catch (error) {
    console.error('Could not initialize 3D view:', error);
    container.innerHTML = `<div class="pip-error">Pip couldn't load!<br>WebGL is not supported in this environment.</div>`;
    container.style.cursor = 'default';
    return () => {
      container.innerHTML = '';
    };
  }
}

function loadModel(loader, scene, buddies, name, path) {
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      gltf => {
        const model = gltf.scene;
        const mixer = new THREE.AnimationMixer(model);
        const action = mixer.clipAction(gltf.animations[0]);
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        model.scale.set(45, 45, 45);
        model.position.y = -60;
        model.visible = false;
        scene.add(model);
        buddies[name] = { model, mixer, action, name };
        resolve();
      },
      undefined,
      reject
    );
  });
}

function showRandomReceipt(receipts, receiptEl, synth, onReceipt) {
  if (!receiptEl || receipts.length === 0) return;
  const message = receipts[Math.floor(Math.random() * receipts.length)];
  receiptEl.textContent = message;
  receiptEl.classList.add('visible');
  synth.triggerAttackRelease('16n');
  setTimeout(() => {
    receiptEl.classList.remove('visible');
  }, 3000);
  if (typeof onReceipt === 'function') {
    onReceipt(message);
  }
}

function debounce(fn, delay = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function attachMediaQueryListener(query, handler) {
  if (!query) return () => {};
  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }
  if (typeof query.addListener === 'function') {
    query.addListener(handler);
    return () => query.removeListener(handler);
  }
  return () => {};
}
