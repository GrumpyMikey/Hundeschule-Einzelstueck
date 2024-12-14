// modules/cookies.js

export function initCookieConsent() {
  const cookieBanner = document.querySelector('.cookie-banner');
  const acceptBtn = document.querySelector('.cookie-accept');
  const declineBtn = document.querySelector('.cookie-decline');

  // Prüfe ob bereits eine Entscheidung getroffen wurde
  if (!localStorage.getItem('cookieConsent')) {
    cookieBanner.style.display = 'block';
  }

  acceptBtn?.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieBanner.style.display = 'none';
    // Hier können weitere Cookies/Tracking aktiviert werden
    initGoogleAnalytics();
  });

  declineBtn?.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    cookieBanner.style.display = 'none';
  });
}

function initGoogleAnalytics() {
  // Google Analytics Code hier einfügen
  // Nur wenn Cookies akzeptiert wurden
}
