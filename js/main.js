// main.js
import { initNavigation } from './modules/navigation.js';
import { initPreloader } from './modules/preloader.js';
import { initScrollEffects } from './modules/scroll.js';
import { initVideo } from './modules/video.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialisiere alle Module
  console.log('Initialisiere alle Module');
  initPreloader();
  initNavigation();
  initScrollEffects();
  initVideo();
});
