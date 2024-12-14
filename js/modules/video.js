// modules/video.js

export function initVideo() {

  const video = document.querySelector('.hero__video');
  const source = video.querySelector('source');

  if (!video || !source) {
    console.error('Video oder Source-Element nicht gefunden!');
    return;
  }

  video.setAttribute('loading', 'lazy');

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Video-Quelle setzen und laden
        source.src = source.dataset.src;
        video.load();

        video.addEventListener('loadeddata', () => {
          console.log('Video erfolgreich geladen');
          video.classList.add('loaded');
        });

        observer.unobserve(video);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.1
  });

  observer.observe(video);

}
