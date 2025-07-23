// Vérifie si on est en haut ou en bas
function isAtScrollExtremity() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const atTop = scrollY === 0;
    const atBottom = Math.abs(scrollY + windowHeight - documentHeight) < 1;

    return {
        atTop,
        atBottom,
        isAtExtremity: atTop || atBottom
    };
}

// Exécute une callback quand le scroll est terminé
function onScrollEnd(callback, delay = 200) {
    let isScrolling;

    // 🔁 Déclenche la callback immédiatement si pas de scroll possible
    if (document.documentElement.scrollHeight <= window.innerHeight) {
        callback({
            atTop: true,
            atBottom: true,
            isAtExtremity: true
        });
        return; // ⛔ Inutile d’écouter le scroll
    }

    window.addEventListener("scroll", () => {
        clearTimeout(isScrolling);

        isScrolling = setTimeout(() => {
            const position = isAtScrollExtremity();

            if (position.isAtExtremity) {
                callback(position); // callback reçoit { atTop, atBottom, isAtExtremity }
            }
        }, delay);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const acceuil = document.getElementById("acceuil");
    const section2 = document.getElementById("section2");

    let currentSection = 1; // 1 = acceuil, 2 = section2
    let scrollTriggered = false;

    section2.style.display = "none";
    document.body.style.overflow = "auto";

    window.addEventListener("wheel", (e) => {
        if (scrollTriggered) return;

        let VoirPosition;
        let transitionReady = false;

        onScrollEnd((position) => {
            if (position.atTop) {
                console.log("✅ Scroll terminé tout en haut !");
                VoirPosition = "top";
                transitionReady = true;
                // transition vers accueil
            } else if (position.atBottom) {
                console.log("✅ Scroll terminé tout en bas !");
                VoirPosition = "bottom";
                transitionReady = true;
                // transition vers section2
            }
        });

        if (currentSection === 1) {
            const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 1;

            if (scrollBottom && e.deltaY > 0) {
                // Fin de scroll vers le bas dans acceuil
                scrollTriggered = true;
                setTimeout(() => {
                    acceuil.style.display = "none";
                    section2.style.display = "block";
                    window.scrollTo(0, 0);
                    currentSection = 2;
                    scrollTriggered = false;
                }, 200);
            }
        } else if (currentSection === 2 && VoirPosition === "top" && transitionReady) {
            const isAtTop = window.scrollY === 0;

            if (isAtTop && e.deltaY < 0) {
                // Début de scroll vers le haut dans section2
                scrollTriggered = true;
                setTimeout(() => {
                    section2.style.display = "none";
                    acceuil.style.display = "block";
                    window.scrollTo(0, 0);
                    currentSection = 1;
                    scrollTriggered = false;
                }, 200);
            }
        }
    });
});