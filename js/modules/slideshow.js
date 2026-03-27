// modules/slideshow.js

export function initSlideshow() {
  const slideshowContainer = document.querySelector('.slideshow');
  if (!slideshowContainer) return;

  const images = [
    'assets/images/slideshow-dogs/dogs-1.jpeg',
    'assets/images/slideshow-dogs/dogs-2.jpeg',
    'assets/images/slideshow-dogs/dogs-3.jpeg',
    'assets/images/slideshow-dogs/dogs-4.jpeg',
  ];

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
    let currentIndex = 0;
    let slideInterval;

    if (images.length === 0) {
      loader.style.display = 'none';
      errorElement.style.display = 'block';
      return;
    }

    images.forEach((imagePath, index) => {
      const img = document.createElement('img');
      img.src = imagePath;
      img.alt = `Meine Hunde ${index + 1}`;
      img.classList.toggle('active', index === 0);
      imagesContainer.appendChild(img);

      const dot = document.createElement('button');
      dot.classList.add('slideshow__dot');
      dot.classList.toggle('active', index === 0);
      dot.setAttribute('aria-label', `Bild ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    const updateSlide = (newIndex) => {
      const allImages = imagesContainer.querySelectorAll('img');
      const allDots = dotsContainer.querySelectorAll('.slideshow__dot');

      allImages.forEach(img => img.classList.remove('prev-active'));
      allImages[currentIndex].classList.add('prev-active');
      allImages[currentIndex].classList.remove('active');
      allDots[currentIndex].classList.remove('active');

      currentIndex = newIndex;

      allImages[currentIndex].classList.add('active');
      allDots[currentIndex].classList.add('active');

      setTimeout(() => {
        allImages.forEach((img, idx) => {
          if (idx !== currentIndex) {
            img.classList.remove('prev-active');
          }
        });
      }, 2000);
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

    prevButton.addEventListener('click', () => {
      prevSlide();
      resetInterval();
    });

    nextButton.addEventListener('click', () => {
      nextSlide();
      resetInterval();
    });

    let touchStartX = 0;
    slideshowContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });

    slideshowContainer.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        resetInterval();
      }
    });

    loader.style.display = 'none';
    imagesContainer.style.display = 'block';
    resetInterval();
  };

  createSlideshow();
}
