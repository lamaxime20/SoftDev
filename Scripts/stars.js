(() => {
    const canvas = document.getElementById("stars");
    const ctx = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const depthLayers = 3;
    const starsPerLayer = [50, 75, 100];
    const starLayers = [];
    const speeds = [0.2, 0.4, 0.7];

    let mouse = { x: width / 2, y: height / 2 };

    // Créer les couches d’étoiles
    for (let l = 0; l < depthLayers; l++) {
        const stars = [];
        for (let i = 0; i < starsPerLayer[l]; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * (l + 1) + 0.5,
                twinkle: Math.random() * Math.PI * 2, // Pour l’effet scintillement
                vx: (Math.random() - 0.5) * speeds[l],
                vy: (Math.random() - 0.5) * speeds[l]
            });
        }
        starLayers.push(stars);
    }

    // Réagir au curseur
    document.body.addEventListener("mousemove", e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Animation continue
    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let l = 0; l < depthLayers; l++) {
            const stars = starLayers[l];
            for (let star of stars) {
                // Mouvement permanent
                star.x += star.vx;
                star.y += star.vy;

                // Repositionner si sort de l’écran
                if (star.x < 0) star.x = width;
                if (star.x > width) star.x = 0;
                if (star.y < 0) star.y = height;
                if (star.y > height) star.y = 0;

                // Position ajustée selon parallaxe (3D)
                const offsetX = (mouse.x - width / 2) * (speeds[l] / 10);
                const offsetY = (mouse.y - height / 2) * (speeds[l] / 10);

                const drawX = star.x + offsetX;
                const drawY = star.y + offsetY;

                // Scintillement
                star.twinkle += 0.05;
                const brightness = 0.7 + 0.3 * Math.sin(star.twinkle); // oscille entre 0.4 et 1

                ctx.beginPath();
                ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
                ctx.shadowBlur = 8;
                ctx.shadowColor = "white";
                ctx.fill();
            }
        }

        requestAnimationFrame(animate);
    }

    // Adapter taille si redimensionné
    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    animate();
})();
