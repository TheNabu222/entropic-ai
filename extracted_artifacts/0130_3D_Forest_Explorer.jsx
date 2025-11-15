import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const TRANSLATIONS = {
  "en-US": {
    "forestExplorerControlsTitle": "Forest Explorer Controls",
    "moveControls": "W/↑/S/↓ or A/D/←/→ - Move",
    "lookControls": "Click and drag - Look around",
    "exploreMessage": "Explore the beautiful forest!"
  },
  /* LOCALE_PLACEHOLDER_START */
  "es-ES": {
    "forestExplorerControlsTitle": "Controles del Explorador del Bosque",
    "moveControls": "W/↑/S/↓ o A/D/←/→ - Mover",
    "lookControls": "Hacer clic y arrastrar - Mirar alrededor",
    "exploreMessage": "¡Explora el hermoso bosque!"
  }
  /* LOCALE_PLACEHOLDER_END */
};

const appLocale = '{{APP_LOCALE}}';
const browserLocale = navigator.languages?.[0] || navigator.language || 'en-US';
const findMatchingLocale = (locale) => {
  if (TRANSLATIONS[locale]) return locale;
  const lang = locale.split('-')[0];
  const match = Object.keys(TRANSLATIONS).find(key => key.startsWith(lang + '-'));
  return match || 'en-US';
};
const locale = (appLocale !== '{{APP_LOCALE}}') ? findMatchingLocale(appLocale) : findMatchingLocale(browserLocale);
const t = (key) => TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en-US'][key] || key;

const ForestExplorer = () => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Fog for atmosphere
    scene.fog = new THREE.Fog(0x004f00, 50, 200);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x87CEEB); // Sky blue
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xfff5c1, 0.8);
    directionalLight.position.set(50, 50, -50);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x567d46 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Trees
    const createTree = (x, z) => {
      const group = new THREE.Group();
      
      // Trunk
      const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 8);
      const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x3d2817 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      group.add(trunk);

      // Leaves
      const leavesColors = [0x0f5132, 0x146b44, 0x198754];
      for (let i = 0; i < 3; i++) {
        const leavesGeometry = new THREE.ConeGeometry(3 - i * 0.5, 6 - i * 1, 8);
        const leavesColor = leavesColors[i % leavesColors.length];
        const leavesMaterial = new THREE.MeshLambertMaterial({ color: leavesColor });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 4 + i * 3;
        leaves.castShadow = true;
        leaves.receiveShadow = true;
        group.add(leaves);
      }

      group.position.set(x, 4, z);
      return group;
    };

    // Create forest (random tree placement)
    for (let i = 0; i < 100; i++) {
      const x = (Math.random() - 0.5) * 400;
      const z = (Math.random() - 0.5) * 400;
      if (x < -10 || x > 10 || z < -10 || z > 10) { // Avoid initial player area
        const tree = createTree(x, z);
        scene.add(tree);
      }
    }

    // Grass
    const grassGeometry = new THREE.PlaneGeometry(0.5, 1);
    const grassMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x7cfc00,
      transparent: true,
      opacity: 0.8
    });

    for (let i = 0; i < 500; i++) {
      const grass = new THREE.Mesh(grassGeometry, grassMaterial);
      grass.position.set(
        (Math.random() - 0.5) * 200,
        0.5,
        (Math.random() - 0.5) * 200
      );
      grass.rotation.x = -Math.PI / 2;
      grass.rotation.z = Math.random() * Math.PI;
      scene.add(grass);
    }

    // Movement controls
    const keys = {};
    const moveSpeed = 0.5;
    
    document.addEventListener('keydown', (e) => {
      keys[e.code] = true;
    });
    
    document.addEventListener('keyup', (e) => {
      keys[e.code] = false;
    });

    const updateMovement = () => {
      if (keys['KeyW'] || keys['ArrowUp']) {
        camera.translateZ(-moveSpeed);
      }
      if (keys['KeyS'] || keys['ArrowDown']) {
        camera.translateZ(moveSpeed);
      }
      if (keys['KeyA'] || keys['ArrowLeft']) {
        camera.translateX(-moveSpeed);
      }
      if (keys['KeyD'] || keys['ArrowRight']) {
        camera.translateX(moveSpeed);
      }
      
      // Keep camera at eye level
      camera.position.y = 5;
    };

    // Mouse look controls
    let mouseX = 0;
    let onMouseDown = false;
    
    document.addEventListener('mousedown', () => {
      onMouseDown = true;
    });
    
    document.addEventListener('mouseup', () => {
      onMouseDown = false;
    });
    
    document.addEventListener('mousemove', (e) => {
      if (onMouseDown) {
        mouseX += e.movementX * 0.002;
        camera.rotation.y = -mouseX;
      }
    });

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      updateMovement();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', () => {});
      document.removeEventListener('keyup', () => {});
      document.removeEventListener('mousemove', () => {});
      document.removeEventListener('mousedown', () => {});
      document.removeEventListener('mouseup', () => {});
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-4 rounded max-w-sm">
        <h2 className="text-xl font-bold mb-2">{t('forestExplorerControlsTitle')}</h2>
        <ul className="text-sm">
          <li>{t('moveControls')}</li>
          <li>{t('lookControls')}</li>
          <li>{t('exploreMessage')}</li>
        </ul>
      </div>
    </div>
  );
};

export default ForestExplorer;