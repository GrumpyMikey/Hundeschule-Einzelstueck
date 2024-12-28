// modules/cookies.js

let analyticsInitialized = false;

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

export function initCookieConsent() {
  const cookieBanner = document.getElementById('cookieBanner');

  // Prüfe gespeicherte Einstellungen
  const cookieConsent = JSON.parse(localStorage.getItem('cookieConsent') || '{}');

  // Wenn noch keine Entscheidung getroffen wurde
  if (!cookieConsent.processed) {
    cookieBanner.innerHTML = bannerContent;
    addCookieBannerListeners();
    setTimeout(() => {
      cookieBanner.classList.add('visible');
      disableScrolling(); // Scroll des Bodys deaktivieren
    }, 1000);

    // Event Listener für "Alle akzeptieren"
    document.getElementById('cookieAcceptAll')?.addEventListener('click', () => {
      saveCookieConsent({
        essential: true,
        analytics: true,
      });
    });

    // Für den "Auswahl bestätigen"-Button
    document.getElementById('cookieAcceptSelection')?.addEventListener('click', () => {
      const analyticsConsent = document.getElementById('analyticsConsent')?.checked || false;

      // Zustimmung speichern
      saveCookieConsent({
        essential: true, // Technisch notwendige Cookies sind immer aktiv
        analytics: analyticsConsent, // Übernehme die Auswahl des Nutzers
      });
    });

    // Für den "Alle ablehnen"-Button
    document.getElementById('cookieRejectAll')?.addEventListener('click', () => {
      // Nur technisch notwendige Cookies zulassen, keine Analyse
      saveCookieConsent({
        essential: true, // Technisch notwendige Cookies sind immer aktiv
        analytics: false, // Übernehme die Auswahl des Nutzers
      });
    });

  } else {
    // Wenn Analytics akzeptiert wurde, initialisieren
    if (cookieConsent.analytics) {
      initGoogleAnalytics();
    }
  }
}

// Funktion: Zustimmung speichern und Cookie-Banner ausblenden
function saveCookieConsent(consent) {
  // 1. Debugging: Logge die erhaltenen Zustimmungen in der Konsole
  console.log("Cookie consent saved:", consent);

  // 2. Update die lokale Speicherung
  localStorage.setItem(
    'cookieConsent',
    JSON.stringify({
      processed: true,
      timestamp: new Date().toISOString(),
      ...consent, // Fügt die aktuellen Zustimmungen hinzu
    })
  );

  // 3. Entferne das Cookie-Banner
  const cookieBanner = document.getElementById('cookieBanner');
  cookieBanner.classList.remove('visible');
  setTimeout(() => {
    cookieBanner.style.display = 'none';
  }, 500);

  // 4. Analytics initialisieren, wenn der Nutzer zugestimmt hat
  if (consent.analytics) {
    console.log("Analytics consent given. Initializing Google Analytics...");
    try {
      initGoogleAnalytics(); // Analytics initialisieren
    } catch (error) {
      console.error("Google Analytics konnte nicht initialisiert werden:", error);
    }
  } else {
    console.log("Analytics consent NOT given. Skipping Analytics...");
  }

  // 5. Scrolling für die Seite wieder aktivieren
  enableScrolling();
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

function showCookieBanner() {
  const cookieBanner = document.getElementById('cookieBanner');
  cookieBanner.innerHTML = bannerContent;
  addCookieBannerListeners(); // Hier auch hinzufügen
  cookieBanner.style.display = 'block';
  setTimeout(() => {
    cookieBanner.classList.add('visible');
    disableScrolling();
  }, 50);
}

// Funktion zum Hinzufügen der Event Listener
function addCookieBannerListeners() {
  // Event Listener für "Alle akzeptieren"
  document.getElementById('cookieAcceptAll')?.addEventListener('click', () => {
    saveCookieConsent({
      essential: true,
      analytics: true,
    });
  });

  // Für den "Auswahl bestätigen"-Button
  document.getElementById('cookieAcceptSelection')?.addEventListener('click', () => {
    const analyticsConsent = document.getElementById('analyticsConsent')?.checked || false;
    saveCookieConsent({
      essential: true,
      analytics: analyticsConsent,
    });
  });

  // Für den "Alle ablehnen"-Button
  document.getElementById('cookieRejectAll')?.addEventListener('click', () => {
    saveCookieConsent({
      essential: true,
      analytics: false,
    });
  });
}

// Event Listener für Cookie-Einstellungen ändern
document.addEventListener('DOMContentLoaded', () => {
  const changeCookieSettingsButtons = document.querySelectorAll('[id="changeCookieSettings"]');

  changeCookieSettingsButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('cookieConsent');
      if (analyticsInitialized) {
        // Google Analytics deaktivieren
        window['ga-disable-G-EWFCEK73YX'] = true;
        analyticsInitialized = false;
      }
      showCookieBanner();
    });
  });
});
