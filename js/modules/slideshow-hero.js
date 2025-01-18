// slideshow-hero.js

export function initHeroSlideshow() {
  const slideshowContainer = document.querySelector('.hero__slideshow-container');
  if (!slideshowContainer) {
    console.error('Slideshow container nicht gefunden');
    return;
  }

  let currentImageIndex = 0;
  let desktopImages = [];
  let mobileImages = [];
  const totalImages = 134;
  let activeImage = null;
  let nextImage = null;
  let isMobile = window.innerWidth <= 768;
  let isLoading = true;

  // Füge Loader hinzu
  const loader = document.createElement('div');
  loader.className = 'hero__slideshow-loader';
  loader.innerHTML = '<div class="spinner"></div>';
  slideshowContainer.appendChild(loader);

  // Prüft die Verfügbarkeit eines Bildes
  async function checkImageExists(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`Checking image: ${url}, Status: ${response.ok}`);
      return response.ok;
    } catch (e) {
      console.error(`Fehler beim Prüfen von ${url}:`, e);
      return false;
    }
  }

  // Preload Funktion für Bilder
  function preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        console.log(`Bild geladen: ${url}`);
        resolve(img);
      };
      img.onerror = (e) => {
        console.error(`Fehler beim Laden von ${url}:`, e);
        reject(e);
      };
      img.src = url;
    });
  }

  // Event Listener für Bildschirmgrößenänderungen
  window.addEventListener('resize', () => {
    const newIsMobile = window.innerWidth <= 768;
    if (newIsMobile !== isMobile) {
      console.log(`Viewport geändert: ${isMobile ? 'Desktop' : 'Mobile'} -> ${newIsMobile ? 'Mobile' : 'Desktop'}`);
      isMobile = newIsMobile;
      resetSlideshow();
    }
  });

  // Lädt die ersten drei Bilder vor
  async function preloadInitialImages(images) {
    console.log('Starte Preloading der ersten 3 Bilder:', images.slice(0, 3));
    const initialImages = images.slice(0, 3);
    try {
      await Promise.all(initialImages.map(url => preloadImage(url)));
      console.log('Erste 3 Bilder erfolgreich geladen');
      return true;
    } catch (error) {
      console.error('Fehler beim Vorladen der Bilder:', error);
      return false;
    }
  }

  // Lädt alle verfügbaren Bilder
  async function loadAvailableImages() {
    console.log('Starte Bilderladen...');
    isLoading = true;
    loader.style.display = 'flex';

    for (let i = 1; i <= totalImages; i++) {
      const index = i.toString().padStart(3, '0');
      const desktopUrl = `assets/images/slideshow-hero/hero-show_${index}.webp`;
      const mobileUrl = `assets/images/slideshow-hero-mobile/hero-show_${index}.webp`;

      console.log(`Prüfe Bilder ${i}/${totalImages}`);
      const [desktopExists, mobileExists] = await Promise.all([
        checkImageExists(desktopUrl),
        checkImageExists(mobileUrl)
      ]);

      if (desktopExists) desktopImages.push(desktopUrl);
      if (mobileExists) mobileImages.push(mobileUrl);

      // Starte Slideshow sobald die ersten drei Bilder verfügbar sind
      if ((desktopImages.length >= 3 || mobileImages.length >= 3) && isLoading) {
        console.log('Erste 3 Bilder gefunden, starte Slideshow');
        const images = isMobile ? mobileImages : desktopImages;
        if (await preloadInitialImages(images)) {
          startSlideshow();
          isLoading = false;
          loader.style.display = 'none';
        }
      }
    }

    console.log(`Gefundene Bilder: Desktop=${desktopImages.length}, Mobile=${mobileImages.length}`);

    // Lade den Rest der Bilder im Hintergrund
    const remainingImages = isMobile ? mobileImages.slice(3) : desktopImages.slice(3);
    remainingImages.forEach(url => {
      preloadImage(url).catch(error => console.error('Fehler beim Laden des Bildes:', error));
    });
  }

  function createSlideImage(imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.classList.add('hero__slideshow-image');
    img.alt = 'Hero Slideshow Bild';
    return img;
  }

  function resetSlideshow() {
    slideshowContainer.innerHTML = '';
    slideshowContainer.appendChild(loader);
    currentImageIndex = 0;
    isLoading = true;
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
      slideshowContainer.removeChild(activeImage);

      activeImage = nextImage;
      activeImage.classList.remove('next', 'slide-left');
      activeImage.classList.add('active');

      currentImageIndex = (currentImageIndex + 1) % images.length;
      nextImage = createSlideImage(images[currentImageIndex]);
      nextImage.classList.add('next');

      slideshowContainer.appendChild(nextImage);
    }, 500);
  }

  // Slideshow starten
  console.log('Initialisiere Hero Slideshow...');
  loadAvailableImages();
}
