export function initHeroSlideshow() {
  const slideshowContainer = document.querySelector('.hero__slideshow-container');
  if (!slideshowContainer) return;

  const imageFolder = 'assets/images/slideshow-hero/';
  let currentIndex = 0;
  let images = [];
  let timeoutId;
  let isTransitioning = false;

  // Funktion zum Generieren und Laden der Bilder
  async function loadImages() {
    try {
      // Generiere Dateinamen hero-show_001.webp bis hero-show_134.webp
      const totalImages = 134;
      const imageList = Array.from({length: totalImages}, (_, i) =>
        `hero-show_${String(i + 1).padStart(3, '0')}.webp`
      );

      // Filtere die existierenden Bilder
      images = await filterExistingImages(imageList);

      // Mische die Bilder
      images = images.sort(() => Math.random() - 0.5);

      // Lade die ersten beiden Bilder vor
      if (images.length > 0) {
        await preloadImages([images[0], images[1]]);
        createInitialImages();
        startSlideshow();
      } else {
        console.warn('Keine gültigen Bilder gefunden.');
      }
    } catch (error) {
      console.error('Fehler beim Laden der Bilder:', error);
    }
  }

  // Funktion zum Überprüfen, ob Bilder existieren
  async function filterExistingImages(imageList) {
    const checkImageExists = (url) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => resolve(null);
        img.src = imageFolder + url;
      });

    const results = await Promise.all(imageList.map(checkImageExists));
    return results.filter(Boolean); // Entfernt null-Werte
  }

  // Funktion zum Vorladen von Bildern
  function preloadImages(imageUrls) {
    const promises = imageUrls.map((url) => {
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
