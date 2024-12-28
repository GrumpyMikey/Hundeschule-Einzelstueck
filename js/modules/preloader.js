// modules/preloader.js

export function initPreloader() {
  const videoWrapper = document.querySelector('.hero__video-wrapper');
  if (!videoWrapper) return; // Return, wenn nicht auf der Hauptseite!

  const video = document.querySelector('.hero__video');
  const headerLogo = document.querySelector('.nav__logo');
  const heroContent = document.querySelector('.hero__content');

  // Anfangs alles ausblenden
  if (headerLogo) {
    headerLogo.style.opacity = '0';
  }
  if (heroContent) {
    heroContent.style.opacity = '0';
  }

  // Lade das SVG-Logo
  fetch('assets/images/logo.svg')
    .then(response => response.text())
    .then(svgContent => {
      // Füge das Logo direkt in den Video-Wrapper ein
      const logoContainer = document.createElement('div');
      logoContainer.className = 'hero__logo-placeholder';
      logoContainer.innerHTML = svgContent;
      const logoElement = logoContainer.querySelector('svg');
      logoElement.classList.add('hero__logo');

      // Füge das Logo vor dem Video ein
      videoWrapper.insertBefore(logoContainer, video);

      // Wenn das Video geladen ist
      video.addEventListener('loadeddata', () => {
        // Warte mindestens 2 Sekunden
        setTimeout(() => {
          // Fade-out für Logo-Placeholder
          logoContainer.classList.add('fade-out');

          // Fade-in für Header-Logo
          if (headerLogo) {
            headerLogo.style.opacity = '1';
            headerLogo.classList.add('nav__logo--transform');
          }

          // Fade-in für Hero-Content
          if (heroContent) {
            heroContent.classList.add('hero__content--visible');
          }

          // Entferne das Logo nach der Fade-Animation
          setTimeout(() => {
            logoContainer.remove();
          }, 1500);
        }, 2000);
      });
    })
    .catch(error => {
      console.error('Error loading logo:', error);
      // Bei Fehler alles einblenden
      if (headerLogo) {
        headerLogo.style.opacity = '1';
      }
      if (heroContent) {
        heroContent.classList.add('hero__content--visible');
      }
    });
}
