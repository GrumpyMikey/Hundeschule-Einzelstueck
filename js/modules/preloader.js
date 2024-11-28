// modules/preloader.js
export function initPreloader() {
  const preloader = document.querySelector('.preloader');

  // Verstecke Preloader nach Laden der Seite
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      // Entferne Preloader nach Animation
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }, 500);
  });
}
