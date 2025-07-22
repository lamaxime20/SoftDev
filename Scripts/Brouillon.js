function createLightning(pos1, pos2) {
    const points = [];
    const segments = 20; // Plus de segments = forme plus torturée
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = THREE.MathUtils.lerp(pos1.x, pos2.x, t) + (Math.random() - 0.5) * 2;  // x10
        const y = THREE.MathUtils.lerp(pos1.y, pos2.y, t) + (Math.random() - 0.5) * 2;
        const z = THREE.MathUtils.lerp(pos1.z, pos2.z, t) + (Math.random() - 0.5) * 2;
        points.push(new THREE.Vector3(x, y, z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: 0x11ff55,
        linewidth: 10, // épaisseur visuelle (limité par le GPU)
        transparent: true,
        opacity: 1
    });

    const lightning = new THREE.Line(geometry, material);
    scene.add(lightning);

    // 💥 Flash plus intense
    const flash = new THREE.PointLight(0x11ff55, 5, 20);
    flash.position.copy(pos1.clone().lerp(pos2, 0.5));
    scene.add(flash);

    // ⚡ Vibration de la caméra pour effet de tonnerre
    const originalZ = camera.position.z;
    let t = 0;
    const shake = () => {
        if (t < 5) {
            camera.position.z = originalZ + (Math.random() - 0.5) * 0.3;
            t++;
            requestAnimationFrame(shake);
        } else {
            camera.position.z = originalZ;
        }
    };
    shake();

    setTimeout(() => {
        scene.remove(lightning);
        scene.remove(flash);
    }, 300); // éclair plus long
}
