(() => {
  // 1. Scène verte sombre, style "ruine"
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#102a1d"); // vert sombre, glauque

  // 2. Caméra
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 10;

  // 3. Renderer
  const canvas = document.getElementById("cube");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // 4. Géométrie agrandie
  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5); // cubes plus gros

  // 5. Matériau semi-transparent
  const material = new THREE.MeshStandardMaterial({
    color: 0x115c3c,
    transparent: true,
    opacity: 0.15,
    roughness: 0.8,
    metalness: 0.2,
  });

  const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x2ecc71 }); // vert vif

  // Tableau d'effets d'éclairs
  const lightningBolts = [];

  // Créer un cube avec son wireframe
  function createCube() {
    const cube = new THREE.Mesh(geometry, material);
    const edges = new THREE.EdgesGeometry(geometry);
    const wireframe = new THREE.LineSegments(edges, edgeMaterial);

    const x = Math.random() * 10 - 5;
    const y = Math.random() * 6 - 3;
    cube.position.set(x, y, 0);
    wireframe.position.copy(cube.position);

    scene.add(cube);
    scene.add(wireframe);

    const angle = Math.random() * Math.PI * 2;
    const speed = 0.03;

    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    return { cube, wireframe, vx, vy };
  }

  // 6. Génère 8 cubes pour plus d'interactions
  const cubes = Array.from({ length: 8 }, () => createCube());

  // 7. Lumières
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);

  const pointLight = new THREE.PointLight(0x66ffcc, 1, 50);
  pointLight.position.set(5, 5, 10);
  scene.add(pointLight);

  // Crée un éclair entre 2 points
function createLightning(pos1, pos2) {
    const points = [];
    const segments = 10;
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = THREE.MathUtils.lerp(pos1.x, pos2.x, t) + (Math.random() - 0.5) * 0.2;
        const y = THREE.MathUtils.lerp(pos1.y, pos2.y, t) + (Math.random() - 0.5) * 0.2;
        const z = THREE.MathUtils.lerp(pos1.z, pos2.z, t) + (Math.random() - 0.5) * 0.2;
        points.push(new THREE.Vector3(x, y, z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: 0x88ff88,
        linewidth: 2,
        transparent: true,
        opacity: 0.8
    });

    const lightning = new THREE.Line(geometry, material);
    scene.add(lightning);

    // 💡 Petit flash
    const flash = new THREE.PointLight(0x88ff88, 2, 2);
    flash.position.copy(pos1.clone().lerp(pos2, 0.5));
    scene.add(flash);

    setTimeout(() => {
        scene.remove(lightning);
        scene.remove(flash);
    }, 200); // durée brève
}

  function boxesIntersect(a, b) {
    const box1 = new THREE.Box3().setFromObject(a);
    const box2 = new THREE.Box3().setFromObject(b);
    return box1.intersectsBox(box2);
  }

  function handleCollisions() {
  for (let i = 0; i < cubes.length; i++) {
    for (let j = i + 1; j < cubes.length; j++) {
      const a = cubes[i], b = cubes[j];

      if (boxesIntersect(a.cube, b.cube)) {
        // Inverser les vitesses
        a.vx *= -1; a.vy *= -1;
        b.vx *= -1; b.vy *= -1;

        // ⚡ Ajouter une légère séparation immédiate (repousse)
        const dx = b.cube.position.x - a.cube.position.x;
        const dy = b.cube.position.y - a.cube.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
        const pushAmount = 0.1;

        a.cube.position.x -= (dx / dist) * pushAmount;
        a.cube.position.y -= (dy / dist) * pushAmount;
        b.cube.position.x += (dx / dist) * pushAmount;
        b.cube.position.y += (dy / dist) * pushAmount;

        a.wireframe.position.copy(a.cube.position);
        b.wireframe.position.copy(b.cube.position);

        // ✨ Créer l’éclair
        createLightning(a.cube.position, b.cube.position);
      }
    }
  }
}


  function animate() {
    requestAnimationFrame(animate);

    const frustumHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    const frustumWidth = frustumHeight * camera.aspect;
    const halfWidth = frustumWidth / 2;
    const halfHeight = frustumHeight / 2;

    for (let obj of cubes) {
      obj.cube.rotation.x += 0.01;
      obj.cube.rotation.y += 0.01;
      obj.wireframe.rotation.x += 0.01;
      obj.wireframe.rotation.y += 0.01;

      obj.cube.position.x += obj.vx;
      obj.cube.position.y += obj.vy;
      obj.wireframe.position.x += obj.vx;
      obj.wireframe.position.y += obj.vy;

      // Rebond sur les bords
      if (obj.cube.position.x < -halfWidth || obj.cube.position.x > halfWidth)
        obj.vx *= -1;
      if (obj.cube.position.y < -halfHeight || obj.cube.position.y > halfHeight)
        obj.vy *= -1;

      obj.wireframe.position.copy(obj.cube.position);
    }

    handleCollisions();
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
