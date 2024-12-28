// js/modules/navigation-buttons.js

export function initNavigationButtons() {
  const upButton = document.querySelector('.nav-button--up');
  const backButton = document.querySelector('.nav-button--back');
  const scrollTopButton = document.querySelector('.scroll-top');

  // Wenn wir auf einer Legal Page sind (Impressum/Datenschutz)
  if (upButton && backButton) {
    upButton.addEventListener('click', () => {
      window.scrollTo({top: 0, behavior: 'smooth'});
    });

    backButton.addEventListener('click', () => {
      history.back();
    });
  }

  // Wenn wir auf der Hauptseite sind
  if (scrollTopButton) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollTopButton.classList.add('visible');
      } else {
        scrollTopButton.classList.remove('visible');
      }
    });

    scrollTopButton.addEventListener('click', () => {
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
  }
}
