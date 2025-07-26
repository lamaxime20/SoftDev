(() => {
    const sections = [
      document.getElementById('acceuil'),
      document.getElementById('section2')
    ];

    // Initial state
    sections.forEach(section => {
      section.classList.add('hidden');
      section.classList.remove('visible');
    });
    sections[0].classList.remove('hidden');
    sections[0].classList.add('visible');

    function onScroll() {
      const viewportHeight = window.innerHeight;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        const visibleRatio = visibleHeight / rect.height;

        if (visibleRatio > 0.5) {
          section.classList.remove('hidden');
          section.classList.add('visible');
        } else {
          section.classList.add('hidden');
          section.classList.remove('visible');
        }
      });
    }

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    onScroll();

    document.getElementById("devis").addEventListener("click", function() {
        let element = document.getElementById("formulaire");
        element.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
})();