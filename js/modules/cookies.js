// modules/cookies.js

let analyticsInitialized = false;

export function initCookieConsent() {
  const cookieBanner = document.getElementById('cookieBanner');

  const bannerContent = `
    <div class="cookie-banner__content">
      <div class="cookie-banner__header">
        <h3>Cookie-Einstellungen</h3>
        <button class="cookie-banner__close" id="cookieClose">×</button>
      </div>
      <div class="cookie-banner__text">
        <p>Diese Website verwendet Cookies, um dir das bestmögliche Online-Erlebnis zu bieten.
        Entscheide selbst, welche Kategorien du zulassen möchtest. Weitere Informationen findest du in unserer
        <a href="datenschutz.html">Datenschutzerklärung</a>.</p>
      </div>

      <div class="cookie-banner__options">
        <div class="cookie-option">
          <div class="cookie-option__header">
            <label class="cookie-switch">
              <input type="checkbox" checked disabled>
              <span class="cookie-slider"></span>
            </label>
            <span class="cookie-option__title">Technisch notwendig</span>
          </div>
          <p class="cookie-option__description">Diese Cookies sind für die Grundfunktionen der Website erforderlich.</p>
        </div>

        <div class="cookie-option">
          <div class="cookie-option__header">
            <label class="cookie-switch">
              <input type="checkbox" id="analyticsConsent">
              <span class="cookie-slider"></span>
            </label>
            <span class="cookie-option__title">Analyse</span>
          </div>
          <p class="cookie-option__description">Diese Cookies helfen uns, die Website durch anonymisierte Nutzungsdaten zu verbessern (Google Analytics).</p>
        </div>
      </div>

      <div class="cookie-banner__buttons">
        <button class="cookie-banner__button cookie-banner__button--accept-all" id="cookieAcceptAll">
          Alle akzeptieren
        </button>
        <button class="cookie-banner__button cookie-banner__button--accept-selection" id="cookieAcceptSelection">
          Auswahl bestätigen
        </button>
        <button class="cookie-banner__button cookie-banner__button--reject-all" id="cookieRejectAll">
          Alle ablehnen
        </button>
      </div>
    </div>
  `;

  // Prüfe gespeicherte Einstellungen
  const cookieConsent = JSON.parse(localStorage.getItem('cookieConsent') || '{}');

  // Wenn noch keine Entscheidung getroffen wurde
  if (!cookieConsent.processed) {
    cookieBanner.innerHTML = bannerContent;
    setTimeout(() => {
      cookieBanner.classList.add('visible');
      disableScrolling(); // Scroll des Bodys deaktivieren
    }, 1000);

    // Event Listener für "Alle akzeptieren"
    document.getElementById('cookieAcceptAll')?.addEventListener('click', () => {
      setConsent({
        essential: true,
        analytics: true
      });
    });

    // Event Listener für "Nur notwendige"
    document.getElementById('cookieAcceptEssential')?.addEventListener('click', () => {
      setConsent({
        essential: true,
        analytics: false
      });
    });
  } else {
    // Wenn Analytics akzeptiert wurde, initialisieren
    if (cookieConsent.analytics) {
      initGoogleAnalytics();
    }
  }
}

function setConsent(settings) {
  localStorage.setItem('cookieConsent', JSON.stringify({
    processed: true,
    timestamp: new Date().toISOString(),
    ...settings
  }));

  const cookieBanner = document.getElementById('cookieBanner');
  cookieBanner.classList.remove('visible');
  enableScrolling(); // Scroll wieder aktivieren

  // Nach der Animation Banner entfernen
  setTimeout(() => {
    cookieBanner.style.display = 'none';
  }, 500);

  // Wenn Analytics akzeptiert wurde
  if (settings.analytics) {
    initGoogleAnalytics();
  }
}

function initGoogleAnalytics() {
  if (analyticsInitialized) return;

  // Google Analytics 4 Tracking Code
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-EWFCEK73YX'; // Tracking-ID
  document.head.appendChild(gtagScript);

  window.dataLayer = window.dataLayer || [];

  function gtag() {
    dataLayer.push(arguments);
  }

  gtag('js', new Date());

  // Konfiguration mit IP-Anonymisierung und zusätzlichen Datenschutzeinstellungen
  gtag('config', 'G-EWFCEK73YX', { // Tracking-ID
    'anonymize_ip': true,
    'allow_ad_personalization_signals': false,
    'restricted_data_processing': true
  });

  analyticsInitialized = true;

}

// Funktion zum Prüfen des Consent-Status
export function hasAnalyticsConsent() {
  const consent = JSON.parse(localStorage.getItem('cookieConsent') || '{}');
  return consent.analytics === true;
}

// Funktion zur Sperrung des Scrollens (für den Body im Hintergrund)
function disableScrolling() {
  document.body.style.overflow = 'hidden';
}

// Funktion zur Aktivierung des Scrollens
function enableScrolling() {
  document.body.style.overflow = '';
}

document.getElementById('changeCookieSettings')?.addEventListener('click', (e) => {
  e.preventDefault(); // Verhindert Standard-Anchor-Verhalten
  localStorage.removeItem('cookieConsent'); // Löscht vorherige Cookie-Zustimmung
  const cookieBanner = document.getElementById('cookieBanner');
  cookieBanner.style.display = 'block'; // Zeigt das Banner wieder an
  cookieBanner.classList.add('visible'); // Setzt die sichtbare Klasse
});
