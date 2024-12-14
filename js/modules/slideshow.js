// modules/slideshow.js

export function initSlideshow() {
  const slideshowContainer = document.querySelector('.slideshow');
  if (!slideshowContainer) return;

  // Erstelle Wrapper für Slideshow-Komponenten
  const createSlideshowStructure = () => {
    slideshowContainer.innerHTML = `
            <div class="slideshow__loader">
                <div class="spinner"></div>
            </div>
            <div class="slideshow__images"></div>
            <div class="slideshow__navigation">
                <button class="slideshow__nav-btn prev" aria-label="Vorheriges Bild">❮</button>
                <button class="slideshow__nav-btn next" aria-label="Nächstes Bild">❯</button>
            </div>
            <div class="slideshow__dots"></div>
            <div class="slideshow__error">Keine Bilder gefunden</div>
        `;
  };

  const createSlideshow = async () => {
    createSlideshowStructure();

    const imagesContainer = slideshowContainer.querySelector('.slideshow__images');
    const dotsContainer = slideshowContainer.querySelector('.slideshow__dots');
    const loader = slideshowContainer.querySelector('.slideshow__loader');
    const errorElement = slideshowContainer.querySelector('.slideshow__error');
    const prevButton = slideshowContainer.querySelector('.prev');
    const nextButton = slideshowContainer.querySelector('.next');

    let images = [];
    let currentIndex = 0;
    let slideInterval;

    // Prüfe verfügbare Bilder - Angepasster Pfad für den Unterordner
    try {
      let imageCount = 1;
      while (true) {
        const response = await fetch(`assets/images/slideshow-dogs/dogs-${imageCount}.jpeg`);
        if (!response.ok) break;
        images.push(`dogs-${imageCount}.jpeg`);
        imageCount++;
      }
    } catch (error) {
      console.error('Fehler beim Laden der Bilder:', error);
    }

    // Zeige Fehler, wenn keine Bilder gefunden
    if (images.length === 0) {
      loader.style.display = 'none';
      errorElement.style.display = 'block';
      return;
    }

    // Erstelle Image-Tags und Navigationspunkte
    images.forEach((image, index) => {
      // Erstelle Bild - Angepasster Pfad für den Unterordner
      const img = document.createElement('img');
      img.src = `assets/images/slideshow-dogs/${image}`;
      img.alt = `Meine Hunde ${index + 1}`;
      img.classList.toggle('active', index === 0);
      imagesContainer.appendChild(img);

      // Erstelle Navigationspunkt
      const dot = document.createElement('button');
      dot.classList.add('slideshow__dot');
      dot.classList.toggle('active', index === 0);
      dot.setAttribute('aria-label', `Bild ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    // Navigation Funktionen
    const updateSlide = (newIndex) => {
      const allImages = imagesContainer.querySelectorAll('img');
      const allDots = dotsContainer.querySelectorAll('.slideshow__dot');

      // Entferne alle prev-active Klassen
      allImages.forEach(img => img.classList.remove('prev-active'));

      // Setze das aktuelle Bild als prev-active
      allImages[currentIndex].classList.add('prev-active');
      allImages[currentIndex].classList.remove('active');
      allDots[currentIndex].classList.remove('active');

      currentIndex = newIndex;

      // Aktiviere das neue Bild
      allImages[currentIndex].classList.add('active');
      allDots[currentIndex].classList.add('active');

      // Entferne prev-active nach der Übergangszeit
      setTimeout(() => {
        allImages.forEach((img, idx) => {
          if (idx !== currentIndex) {
            img.classList.remove('prev-active');
          }
        });
      }, 2000); // Entspricht der Übergangszeit
    };

    const nextSlide = () => {
      const newIndex = (currentIndex + 1) % images.length;
      updateSlide(newIndex);
    };

    const prevSlide = () => {
      const newIndex = (currentIndex - 1 + images.length) % images.length;
      updateSlide(newIndex);
    };

    const goToSlide = (index) => {
      updateSlide(index);
      resetInterval();
    };

    const resetInterval = () => {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 3000);
    };

    // Event Listener
    prevButton.addEventListener('click', () => {
      prevSlide();
      resetInterval();
    });

    nextButton.addEventListener('click', () => {
      nextSlide();
      resetInterval();
    });

    // Touch/Swipe Support
    let touchStartX = 0;
    slideshowContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });

    slideshowContainer.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) { // Mindestens 50px swipe
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        resetInterval();
      }
    });

    // Starte Slideshow
    loader.style.display = 'none';
    imagesContainer.style.display = 'block';
    resetInterval();
  };

  createSlideshow();
}
