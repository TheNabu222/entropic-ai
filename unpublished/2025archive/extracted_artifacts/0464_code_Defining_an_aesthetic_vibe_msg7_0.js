// Instead of importing a .obj file:
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshStandardMaterial({ 
    color: 0x00ffff,
    roughness: 0.8,  // ← MATTE not glossy!
    metalness: 0.1
});
