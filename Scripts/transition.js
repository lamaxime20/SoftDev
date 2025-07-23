(() => {
  const sections = [
    document.getElementById('acceuil'),
    document.getElementById('section2')
  ];

  // Initial state : acceuil visible, section2 semi-transparent
  sections[0].classList.remove('hidden');
  sections[1].classList.add('hidden');

  function onScroll() {
    const viewportHeight = window.innerHeight;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
      const visibleRatio = visibleHeight / rect.height;

      if (visibleRatio > 0.5) {
        // Section visible, opacité à 1
        section.classList.remove('hidden');
      } else {
        // Section peu visible, opacité à 0
        section.classList.add('hidden');
      }
    });
  }

  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onScroll);
  onScroll();
})();