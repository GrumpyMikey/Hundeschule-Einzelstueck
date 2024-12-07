// main.js
import { initNavigation } from './modules/navigation.js';
import { initPreloader } from './modules/preloader.js';
import { initScrollEffects } from './modules/scroll.js';
import { initVideo } from './modules/video.js';
import { initSlideshow } from './modules/slideshow.js';

// In main.js
document.addEventListener('DOMContentLoaded', () => {
  // Preloader zuerst initialisieren
  initPreloader();

  // Andere Module erst nach dem Preloader laden
  window.addEventListener('load', () => {
    initNavigation();
    initScrollEffects();
    initVideo();
    initSlideshow();
  });
});
