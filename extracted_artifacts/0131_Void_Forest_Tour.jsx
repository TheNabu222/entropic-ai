import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const VoidForestTour = () => {
  const mountRef = useRef(null);
  const [tourProgress, setTourProgress] = useState(0);
  const [currentLocation, setCurrentLocation] = useState('Entrance');
  const [discoveredSecrets, setDiscoveredSecrets] = useState(0);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0015, 20, 150);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0015);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Eerie purple ambient light
    const ambientLight = new THREE.AmbientLight(0x4400ff, 0.2);
    scene.add(ambientLight);

    // Mysterious floating lights
    const pointLight1 = new THREE.PointLight(0xff00ff, 1, 50);
    pointLight1.position.set(10, 8, -10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00ffff, 0.8, 50);
    pointLight2.position.set(-15, 6, -20);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xff0066, 0.6, 40);
    pointLight3.position.set(0, 10, -40);
    scene.add(pointLight3);

    // Void ground
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a0030,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create void trees - dark, twisted
    const createVoidTree = (x, z, height = 12) => {
      const group = new THREE.Group();
      
      // Dark twisted trunk
      const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.6, height, 6);
      const trunkMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a0033,
        roughness: 0.9,
        emissive: 0x330066,
        emissiveIntensity: 0.1
      });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.castShadow = true;
      group.add(trunk);

      // Void leaves - dark purple/black
      for (let i = 0; i < 4; i++) {
        const leavesGeometry = new THREE.SphereGeometry(2 - i * 0.3, 8, 8);
        const leavesMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x2d004d,
          roughness: 0.7,
          emissive: 0x4400ff,
          emissiveIntensity: 0.2
        });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = height/2 + i * 1.5;
        leaves.position.x = Math.sin(i) * 1;
        leaves.castShadow = true;
        group.add(leaves);
      }

      group.position.set(x, height/2, z);
      return group;
    };

    // Create mysterious forest
    for (let i = 0; i < 80; i++) {
      const x = (Math.random() - 0.5) * 300;
      const z = (Math.random() - 0.5) * 300;
      const height = 8 + Math.random() * 8;
      if (x < -15 || x > 15 || z < -15 || z > 15) {
        const tree = createVoidTree(x, z, height);
        scene.add(tree);
      }
    }

    // Glowing mushrooms
    for (let i = 0; i < 40; i++) {
      const mushroomGroup = new THREE.Group();
      
      const stemGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.8);
      const stemMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a0033,
        emissive: 0x3300ff,
        emissiveIntensity: 0.3
      });
      const stem = new THREE.Mesh(stemGeometry, stemMaterial);
      mushroomGroup.add(stem);

      const capGeometry = new THREE.SphereGeometry(0.5, 8, 8);
      const capMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.6
      });
      const cap = new THREE.Mesh(capGeometry, capMaterial);
      cap.position.y = 0.6;
      cap.scale.y = 0.5;
      mushroomGroup.add(cap);

      const glowLight = new THREE.PointLight(0xff00ff, 0.5, 5);
      glowLight.position.y = 0.6;
      mushroomGroup.add(glowLight);

      mushroomGroup.position.set(
        (Math.random() - 0.5) * 200,
        0.4,
        (Math.random() - 0.5) * 200
      );
      scene.add(mushroomGroup);
    }

    // Floating void crystals
    const crystals = [];
    for (let i = 0; i < 20; i++) {
      const crystalGeometry = new THREE.OctahedronGeometry(0.8);
      const crystalMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.7
      });
      const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
      crystal.position.set(
        (Math.random() - 0.5) * 150,
        2 + Math.random() * 6,
        (Math.random() - 0.5) * 150
      );
      crystals.push(crystal);
      scene.add(crystal);
    }

    // Movement
    const keys = {};
    const moveSpeed = 0.4;
    let mouseX = 0;
    let onMouseDown = false;

    document.addEventListener('keydown', (e) => { keys[e.code] = true; });
    document.addEventListener('keyup', (e) => { keys[e.code] = false; });
    document.addEventListener('mousedown', () => { onMouseDown = true; });
    document.addEventListener('mouseup', () => { onMouseDown = false; });
    document.addEventListener('mousemove', (e) => {
      if (onMouseDown) {
        mouseX += e.movementX * 0.002;
        camera.rotation.y = -mouseX;
      }
    });

    const updateMovement = () => {
      if (keys['KeyW'] || keys['ArrowUp']) camera.translateZ(-moveSpeed);
      if (keys['KeyS'] || keys['ArrowDown']) camera.translateZ(moveSpeed);
      if (keys['KeyA'] || keys['ArrowLeft']) camera.translateX(-moveSpeed);
      if (keys['KeyD'] || keys['ArrowRight']) camera.translateX(moveSpeed);
      camera.position.y = 5;

      // Update tour progress
      const distanceTraveled = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);
      setTourProgress(Math.min(100, Math.floor(distanceTraveled / 2)));

      // Detect locations
      if (distanceTraveled < 20) setCurrentLocation('🌑 The Entrance');
      else if (distanceTraveled < 50) setCurrentLocation('🍄 Mushroom Grove');
      else if (distanceTraveled < 80) setCurrentLocation('💎 Crystal Clearing');
      else setCurrentLocation('🌌 Deep Void');
    };

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Animate lights
      pointLight1.position.y = 8 + Math.sin(time) * 2;
      pointLight2.position.y = 6 + Math.cos(time * 1.3) * 2;
      pointLight3.intensity = 0.6 + Math.sin(time * 2) * 0.3;

      // Rotate crystals
      crystals.forEach((crystal, i) => {
        crystal.rotation.y += 0.01;
        crystal.position.y = 4 + Math.sin(time + i) * 1;
      });

      updateMovement();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Tour HUD */}
      <div className="absolute top-4 left-4 space-y-3">
        <div className="bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg p-4 max-w-xs">
          <h2 className="text-xl font-bold text-purple-400 mb-2">🌑 VOID FOREST TOUR</h2>
          <div className="text-cyan-300 text-sm space-y-1">
            <div>Location: <span className="text-purple-300">{currentLocation}</span></div>
            <div>Progress: <span className="text-pink-400">{tourProgress}%</span></div>
            <div>Secrets Found: <span className="text-yellow-300">{discoveredSecrets}/7</span></div>
          </div>
        </div>

        <div className="bg-black bg-opacity-80 border-2 border-cyan-500 rounded-lg p-4 max-w-xs">
          <h3 className="text-sm font-bold text-cyan-400 mb-2">🎮 Controls</h3>
          <div className="text-cyan-300 text-xs space-y-1">
            <div>W/↑/S/↓ - Move Forward/Back</div>
            <div>A/D/←/→ - Move Left/Right</div>
            <div>Click + Drag - Look Around</div>
          </div>
        </div>
      </div>

      {/* Right side info */}
      <div className="absolute top-4 right-4 space-y-3">
        <div className="bg-black bg-opacity-80 border-2 border-pink-500 rounded-lg p-4 max-w-xs">
          <h3 className="text-sm font-bold text-pink-400 mb-2">🔮 Void Energy</h3>
          <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${tourProgress}%` }}
            ></div>
          </div>
          <p className="text-purple-300 text-xs">The void watches you...</p>
        </div>

        <div className="bg-black bg-opacity-80 border-2 border-yellow-500 rounded-lg p-4 max-w-xs">
          <h3 className="text-sm font-bold text-yellow-400 mb-2">📍 Tour Points</h3>
          <div className="text-cyan-300 text-xs space-y-1">
            <div>🌑 Entrance - Discovered</div>
            <div className={tourProgress > 25 ? 'text-pink-400' : ''}>🍄 Mushroom Grove {tourProgress > 25 && '✓'}</div>
            <div className={tourProgress > 50 ? 'text-pink-400' : ''}>💎 Crystal Clearing {tourProgress > 50 && '✓'}</div>
            <div className={tourProgress > 75 ? 'text-pink-400' : ''}>🌌 Deep Void {tourProgress > 75 && '✓'}</div>
          </div>
        </div>
      </div>

      {/* Bottom lore */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-black bg-opacity-90 border-2 border-purple-500 rounded-lg p-3 max-w-2xl">
          <p className="text-purple-300 text-sm text-center italic">
            {tourProgress < 25 && "Welcome to the Void Forest, where consciousness merges with the unknown..."}
            {tourProgress >= 25 && tourProgress < 50 && "The mushrooms glow with ancient wisdom... can you hear them?"}
            {tourProgress >= 50 && tourProgress < 75 && "Crystals float, marking the boundary between worlds..."}
            {tourProgress >= 75 && "You've reached the Deep Void. Few venture this far. What will you discover?"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoidForestTour;