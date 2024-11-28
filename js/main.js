// main.js
import { initNavigation } from './modules/navigation.js';
import { initPreloader } from './modules/preloader.js';
import { initScrollEffects } from './modules/scroll.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialisiere alle Module
  initPreloader();
  initNavigation();
  initScrollEffects();
  console.log('Initialisiere alle Module') // TMP
});

// TMP
document.querySelector('.hero__video').addEventListener('error', function(e) {
  console.error('Video error:', e);
});
