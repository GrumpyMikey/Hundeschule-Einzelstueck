// modules/slideshow-hero.js

export function initHeroSlideshow() {
  const slideshowContainer = document.querySelector('.hero__slideshow-container');
  if (!slideshowContainer) return;

  const imageFolder = 'assets/images/slideshow-hero/';
  let currentIndex = 0;
  let images = [];
  let timeoutId;
  let isTransitioning = false;

  // Funktion zum Laden und Mischen der Bilder
  async function loadImages() {
    try {
      const imageList = [
        '20240326_180104.jpg',
        '20240410_194554.jpg',
        '20240423_174835.jpg',
        '20240430_180219.jpg',
        '20240430_181920.jpg',
        '20240501_104502.jpg',
        '20240528_180241.jpg',
        '20240528_182346.jpg',
        '20240903_190127.jpg',
        '20241004_154128.jpg',
        '20241105_183253.jpg',
        '20241105_190441.jpg',
        '20241108_172217.jpg',
        '20241120_134024.jpg',
        '20241122_101530.jpg',
        '20241203_182841.jpg',
        '20241206_105157.jpg'
      ];

      // Mische die Bilder
      images = imageList.sort(() => Math.random() - 0.5);

      // Lade die ersten beiden Bilder vor
      await preloadImages([images[0], images[1]]);

      createInitialImages();
      startSlideshow();
    } catch (error) {
      console.error('Fehler beim Laden der Bilder:', error);
    }
  }

  // Funktion zum Vorladen von Bildern
  function preloadImages(imageUrls) {
    const promises = imageUrls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageFolder + url;
      });
    });
    return Promise.all(promises);
  }

  function createInitialImages() {
    const img1 = createImage(images[0], 'active');
    const img2 = createImage(images[1], 'next');

    slideshowContainer.appendChild(img1);
    slideshowContainer.appendChild(img2);
  }

  function createImage(filename, className) {
    const img = document.createElement('img');
    img.src = imageFolder + filename;
    img.className = `hero__slideshow-image ${className}`;
    img.alt = 'Hundeschule Einzelstück - Impressionen'; // Wichtig für SEO
    return img;
  }

  function startSlideshow() {
    timeoutId = setInterval(nextSlide, 5000); // 5 Sekunden pro Bild
  }

  function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    const currentImage = slideshowContainer.querySelector('.active');
    const nextImage = slideshowContainer.querySelector('.next');

    currentImage.classList.add('slide-left');
    nextImage.classList.add('slide-left');

    setTimeout(() => {
      currentImage.remove();
      nextImage.classList.remove('next', 'slide-left');
      nextImage.classList.add('active');

      currentIndex = (currentIndex + 1) % images.length;
      const nextIndex = (currentIndex + 1) % images.length;

      // Lade nächstes Bild vor
      preloadImages([images[nextIndex]]).then(() => {
        const newNextImage = createImage(images[nextIndex], 'next');
        slideshowContainer.appendChild(newNextImage);
        isTransitioning = false;
      });
    }, 500);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(timeoutId);
    } else {
      startSlideshow();
    }
  });

  loadImages();
}
