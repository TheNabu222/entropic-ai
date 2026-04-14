import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const VoidForestTour = () => {
  const mountRef = useRef(null);
  const [tourProgress, setTourProgress] = useState(0);
  const [currentLocation, setCurrentLocation] = useState('Entrance');
  const [discoveredSecrets, setDiscoveredSecrets] = useState(0);
  const [controlMode, setControlMode] = useState('desktop');
  const [showControls, setShowControls] = useState(true);
  const [webGLError, setWebGLError] = useState(false);

  // Mobile joystick state
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const joystickStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check for WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      setWebGLError(true);
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0015, 20, 150);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 15);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    // Handle renderer creation error
    try {
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x0a0015);
      renderer.shadowMap.enabled = true;
      
      if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement);
      }
    } catch (error) {
      console.error('WebGL Error:', error);
      setWebGLError(true);
      return;
    }

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

    // Desktop controls
    const keys = {};
    let mouseX = 0;
    let onMouseDown = false;

    const handleKeyDown = (e) => { keys[e.code] = true; };
    const handleKeyUp = (e) => { keys[e.code] = false; };
    const handleMouseDown = () => { onMouseDown = true; };
    const handleMouseUp = () => { onMouseDown = false; };
    const handleMouseMove = (e) => {
      if (onMouseDown && controlMode === 'desktop') {
        mouseX += e.movementX * 0.002;
        camera.rotation.y = -mouseX;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    // Mobile gyroscope
    let gyroAlpha = 0;
    let gyroInitialized = false;
    let initialAlpha = 0;

    const handleOrientation = (event) => {
      if (controlMode === 'mobile' && event.alpha !== null) {
        if (!gyroInitialized) {
          initialAlpha = event.alpha;
          gyroInitialized = true;
        }
        gyroAlpha = ((event.alpha - initialAlpha) * Math.PI) / 180;
        camera.rotation.y = -gyroAlpha;
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);

    const moveSpeed = 0.4;
    let joystickMove = { x: 0, y: 0 };

    const updateMovement = () => {
      if (controlMode === 'desktop') {
        if (keys['KeyW'] || keys['ArrowUp']) camera.translateZ(-moveSpeed);
        if (keys['KeyS'] || keys['ArrowDown']) camera.translateZ(moveSpeed);
        if (keys['KeyA'] || keys['ArrowLeft']) camera.translateX(-moveSpeed);
        if (keys['KeyD'] || keys['ArrowRight']) camera.translateX(moveSpeed);
      } else {
        if (joystickMove.y !== 0 || joystickMove.x !== 0) {
          camera.translateZ(-joystickMove.y * moveSpeed);
          camera.translateX(joystickMove.x * moveSpeed);
        }
      }
      
      camera.position.y = 5;

      const distanceTraveled = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);
      setTourProgress(Math.min(100, Math.floor(distanceTraveled / 2)));

      if (distanceTraveled < 20) setCurrentLocation('🌑 The Entrance');
      else if (distanceTraveled < 50) setCurrentLocation('🍄 Mushroom Grove');
      else if (distanceTraveled < 80) setCurrentLocation('💎 Crystal Clearing');
      else setCurrentLocation('🌌 Deep Void');
    };

    window.updateJoystick = (x, y) => {
      joystickMove = { x, y };
    };

    let time = 0;
    let animationId;
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.01;

      pointLight1.position.y = 8 + Math.sin(time) * 2;
      pointLight2.position.y = 6 + Math.cos(time * 1.3) * 2;
      pointLight3.intensity = 0.6 + Math.sin(time * 2) * 0.3;

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
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('deviceorientation', handleOrientation);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [controlMode]);

  const handleJoystickStart = (e) => {
    if (controlMode !== 'mobile') return;
    setJoystickActive(true);
    const touch = e.touches[0];
    joystickStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleJoystickMove = (e) => {
    if (!joystickActive || controlMode !== 'mobile') return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - joystickStartRef.current.x;
    const deltaY = touch.clientY - joystickStartRef.current.y;
    
    const maxDistance = 50;
    const x = Math.max(-1, Math.min(1, deltaX / maxDistance));
    const y = Math.max(-1, Math.min(1, deltaY / maxDistance));
    
    setJoystickPosition({ x: deltaX, y: deltaY });
    if (window.updateJoystick) {
      window.updateJoystick(x, y);
    }
  };

  const handleJoystickEnd = () => {
    setJoystickActive(false);
    setJoystickPosition({ x: 0, y: 0 });
    if (window.updateJoystick) {
      window.updateJoystick(0, 0);
    }
  };

  if (webGLError) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-purple-900 to-black flex items-center justify-center p-8">
        <div className="bg-black bg-opacity-80 border-4 border-red-500 rounded-lg p-8 max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">⚠️ WebGL Not Available</h1>
          <p className="text-purple-300 text-lg mb-6">
            Your browser doesn't support WebGL, which is required for the 3D Void Forest experience.
          </p>
          <div className="text-cyan-300 text-left space-y-3 mb-6">
            <p className="font-bold text-purple-400">Try these solutions:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Update your web browser to the latest version</li>
              <li>Enable hardware acceleration in your browser settings</li>
              <li>Try a different browser (Chrome, Firefox, Edge, or Safari)</li>
              <li>Update your graphics drivers</li>
              <li>Check if WebGL is disabled in your browser settings</li>
            </ul>
          </div>
          <p className="text-purple-400 text-sm">
            The Void Forest awaits those with the proper technology... 🌌
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div ref={mountRef} className="w-full h-full" />
      
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black bg-opacity-90 border-2 border-purple-500 rounded-lg p-2 flex gap-2">
          <button
            onClick={() => setControlMode('desktop')}
            className={`px-4 py-2 rounded font-bold transition-all ${
              controlMode === 'desktop'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🖥️ Desktop
          </button>
          <button
            onClick={() => setControlMode('mobile')}
            className={`px-4 py-2 rounded font-bold transition-all ${
              controlMode === 'mobile'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            📱 Mobile
          </button>
        </div>
      </div>

      <div className="absolute top-20 left-4 space-y-3">
        <div className="bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg p-4 max-w-xs">
          <h2 className="text-xl font-bold text-purple-400 mb-2">🌑 VOID FOREST TOUR</h2>
          <div className="text-cyan-300 text-sm space-y-1">
            <div>Location: <span className="text-purple-300">{currentLocation}</span></div>
            <div>Progress: <span className="text-pink-400">{tourProgress}%</span></div>
            <div>Secrets Found: <span className="text-yellow-300">{discoveredSecrets}/7</span></div>
          </div>
        </div>

        {showControls && (
          <div className="bg-black bg-opacity-80 border-2 border-cyan-500 rounded-lg p-4 max-w-xs">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-cyan-400">🎮 Controls</h3>
              <button
                onClick={() => setShowControls(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <div className="text-cyan-300 text-xs space-y-1">
              {controlMode === 'desktop' ? (
                <>
                  <div>W/↑/S/↓ - Move Forward/Back</div>
                  <div>A/D/←/→ - Move Left/Right</div>
                  <div>Click + Drag - Look Around</div>
                </>
              ) : (
                <>
                  <div>🕹️ Use Joystick - Move</div>
                  <div>📱 Tilt Device - Look Around</div>
                  <div>Touch Lower Left - Control</div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-20 right-4 space-y-3">
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

      {controlMode === 'mobile' && (
        <div
          className="absolute bottom-20 left-8 w-32 h-32 bg-black bg-opacity-50 border-2 border-purple-500 rounded-full"
          onTouchStart={handleJoystickStart}
          onTouchMove={handleJoystickMove}
          onTouchEnd={handleJoystickEnd}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-purple-600 bg-opacity-30 rounded-full"></div>
          </div>
          {joystickActive && (
            <div
              className="absolute w-12 h-12 bg-purple-500 rounded-full shadow-lg transition-transform"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${joystickPosition.x}px), calc(-50% + ${joystickPosition.y}px))`
              }}
            ></div>
          )}
          {!joystickActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-purple-500 bg-opacity-50 rounded-full"></div>
            </div>
          )}
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 max-w-2xl px-4">
        <div className="bg-black bg-opacity-90 border-2 border-purple-500 rounded-lg p-3">
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