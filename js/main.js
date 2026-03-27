// main.js

import '../css/scss/main.scss';

import {initNavigation} from './modules/navigation.js';
import {initScrollEffects} from './modules/scroll.js';
import {initSlideshow} from './modules/slideshow.js';
import {initCookieConsent} from './modules/cookies.js';
import initModal from './modules/modal.js';
import {initNavigationButtons} from './modules/navigation-buttons.js';
import {initHeroSlideshow} from './modules/slideshow-hero.js';

document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('load', () => {
    initNavigation();
    initScrollEffects();
    initSlideshow();
    initModal();
    initCookieConsent();
    initNavigationButtons();
    initHeroSlideshow();
  });
});
