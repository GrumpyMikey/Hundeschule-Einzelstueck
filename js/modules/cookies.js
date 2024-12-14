// modules/cookies.js

export function initCookieConsent() {
  const cookieBanner = document.getElementById('cookieBanner');

  // Banner HTML erstellen
  const bannerContent = `
    <div class="cookie-banner__content">
      <p class="cookie-banner__text">
        Diese Website verwendet nur technisch notwendige Cookies.
        Mehr Informationen findest du in unserer
        <a href="/datenschutz.html">Datenschutzerklärung</a>.
      </p>
      <div class="cookie-banner__buttons">
        <button class="cookie-banner__button cookie-banner__button--accept" id="cookieAccept">
          Verstanden
        </button>
      </div>
    </div>
  `;

  // Wenn noch keine Entscheidung getroffen wurde, zeige Banner
  if (!localStorage.getItem('cookieConsent')) {
    cookieBanner.innerHTML = bannerContent;
    setTimeout(() => {
      cookieBanner.classList.add('visible');
    }, 1000);

    // Event Listener für den Accept Button
    document.getElementById('cookieAccept')?.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('visible');

      // Nach der Animation Banner komplett entfernen
      setTimeout(() => {
        cookieBanner.style.display = 'none';
      }, 500);
    });
  }
}
