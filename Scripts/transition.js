document.addEventListener("DOMContentLoaded", () => {
    const acceuil = document.getElementById("acceuil");
    const section2 = document.getElementById("section2");

    let currentSection = 1; // 1 = acceuil, 2 = section2
    let scrollTriggered = false;

    section2.style.display = "none";
    document.body.style.overflow = "auto";

    window.addEventListener("wheel", (e) => {
        if (scrollTriggered) return;

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
        } else if (currentSection === 2) {
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
