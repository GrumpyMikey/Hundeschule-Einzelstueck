// modules/scroll.js

export function initScrollEffects() {
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (!scrollTopBtn) return; // Return, wenn nicht auf Hauptseite!

  // Scroll-to-Top Button Sichtbarkeit
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  // Scroll-to-Top Funktionalität
  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Animations beim Scrollen
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return; // Return, wenn nicht auf Hauptseite!

    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 100) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };

  window.addEventListener('scroll', animateOnScroll);
  // Initial Check
  animateOnScroll();
}
