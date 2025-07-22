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



// 1. Vérifie si on est en haut ou en bas
function isAtScrollExtremity() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const atTop = scrollY === 0;
    const atBottom = Math.abs(scrollY + windowHeight - documentHeight) < 2;

    return {
        atTop,
        atBottom,
        isAtExtremity: atTop || atBottom
    };
}

// 2. Gère la détection de fin de scroll
function setupScrollEndListener(callback, delay = 200) {
    let isScrolling;

    function triggerCallback() {
        const position = isAtScrollExtremity();
        if (position.isAtExtremity) {
            callback(position);
        }
    }

    // Si la page ne défile pas, déclenche quand même
    if (document.body.scrollHeight <= window.innerHeight) {
        setTimeout(() => {
            callback({ atTop: true, atBottom: true, isAtExtremity: true });
        }, 50);
    }

    window.addEventListener("scroll", () => {
        clearTimeout(isScrolling);
        isScrolling = setTimeout(triggerCallback, delay);
    });
}

// 3. Transitions
document.addEventListener("DOMContentLoaded", () => {
    const acceuil = document.getElementById("acceuil");
    const section2 = document.getElementById("section2");

    let currentSection = 1;
    let scrollTriggered = false;
    let readyToTransition = false;

    section2.style.display = "none";
    acceuil.style.opacity = "1";
    section2.style.opacity = "0";

    acceuil.style.transition = "opacity 0.6s ease";
    section2.style.transition = "opacity 0.6s ease";

    setupScrollEndListener(() => {
        readyToTransition = true;
    });

    window.addEventListener("wheel", (e) => {
        if (scrollTriggered || !readyToTransition) return;

        const direction = e.deltaY > 0 ? "down" : "up";

        if (currentSection === 1 && direction === "down") {
            scrollTriggered = true;
            readyToTransition = false;

            acceuil.style.opacity = "0";

            setTimeout(() => {
                acceuil.style.display = "none";
                section2.style.display = "block";
                window.scrollTo(0, 0);
                void section2.offsetWidth;
                section2.style.opacity = "1";

                currentSection = 2;

                // Redémarre le listener
                setupScrollEndListener(() => {
                    readyToTransition = true;
                });

                setTimeout(() => scrollTriggered = false, 600);
            }, 600);
        }else if (currentSection === 2 && direction === "up") {
            scrollTriggered = true;
            readyToTransition = false;

            section2.style.opacity = "0";

            setTimeout(() => {
                section2.style.display = "none";
                acceuil.style.display = "block";
                window.scrollTo(0, 0);
                void acceuil.offsetWidth;
                acceuil.style.opacity = "1";

                currentSection = 1;

                setupScrollEndListener(() => {
                    readyToTransition = true;
                });

                setTimeout(() => scrollTriggered = false, 600);
            }, 600);
        }
    });
});
