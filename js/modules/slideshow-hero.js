// slideshow-hero.js

export function initHeroSlideshow() {
  const slideshowContainer = document.querySelector('.hero__slideshow-container');
  if (!slideshowContainer) return;

  let currentImageIndex = 1;
  let desktopImages = [];
  let mobileImages = [];
  const totalImages = 134; // Maximale Anzahl der Desktop-Bilder
  let activeImage = null;
  let nextImage = null;
  let isMobile = window.innerWidth <= 768;

  // Prüft die Verfügbarkeit eines Bildes
  async function checkImageExists(url) {
    try {
      const response = await fetch(url, {method: 'HEAD'});
      return response.ok;
    } catch (e) {
      return false;
    }
  }

  // Event Listener für Bildschirmgrößenänderungen
  window.addEventListener('resize', () => {
    const newIsMobile = window.innerWidth <= 768;
    if (newIsMobile !== isMobile) {
      isMobile = newIsMobile;
      // Neu initialisieren mit korrekten Bildern
      resetSlideshow();
    }
  });

  // Lädt alle verfügbaren Bilder
  async function loadAvailableImages() {
    for (let i = 1; i <= totalImages; i++) {
      const index = i.toString().padStart(3, '0');
      const desktopUrl = `assets/images/slideshow-hero/hero-show_${index}.webp`;
      const mobileUrl = `assets/images/slideshow-hero-mobile/hero-show_${index}.webp`;

      const [desktopExists, mobileExists] = await Promise.all([
        checkImageExists(desktopUrl),
        checkImageExists(mobileUrl)
      ]);

      if (desktopExists) desktopImages.push(desktopUrl);
      if (mobileExists) mobileImages.push(mobileUrl);
    }

    if (desktopImages.length > 0 || mobileImages.length > 0) {
      startSlideshow();
    }
  }

  function createSlideImage(imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.classList.add('hero__slideshow-image');
    img.alt = 'Hero Slideshow Bild';
    return img;
  }

  function resetSlideshow() {
    // Bestehende Bilder entfernen
    slideshowContainer.innerHTML = '';
    currentImageIndex = 1;

    // Slideshow neu starten
    startSlideshow();
  }

  function startSlideshow() {
    const images = isMobile ? mobileImages : desktopImages;
    if (images.length < 2) return;

    // Initial erste zwei Bilder laden
    activeImage = createSlideImage(images[0]);
    nextImage = createSlideImage(images[1]);

    activeImage.classList.add('active');
    nextImage.classList.add('next');

    slideshowContainer.appendChild(activeImage);
    slideshowContainer.appendChild(nextImage);

    // Slideshow-Interval starten/neu starten
    if (window.slideshowInterval) {
      clearInterval(window.slideshowInterval);
    }
    window.slideshowInterval = setInterval(changeSlide, 5000);
  }

  function changeSlide() {
    const images = isMobile ? mobileImages : desktopImages;

    activeImage.classList.add('slide-left');
    nextImage.classList.add('slide-left');

    setTimeout(() => {
      // Altes aktives Bild entfernen
      slideshowContainer.removeChild(activeImage);

      // Nächstes Bild wird aktives Bild
      activeImage = nextImage;
      activeImage.classList.remove('next', 'slide-left');
      activeImage.classList.add('active');

      // Neues nächstes Bild vorbereiten
      currentImageIndex = (currentImageIndex + 1) % images.length;
      nextImage = createSlideImage(images[currentImageIndex]);
      nextImage.classList.add('next');

      slideshowContainer.appendChild(nextImage);
    }, 500);
  }

  // Slideshow starten
  loadAvailableImages();
}
