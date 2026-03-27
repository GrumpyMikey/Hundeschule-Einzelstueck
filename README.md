# Hundeschule Einzelstueck

Kurzanleitung fuer lokale Entwicklung, Build und GitHub Pages.

## Voraussetzungen

- Node.js und npm muessen installiert sein.
- Die Befehle werden im Projektordner ausgefuehrt.

## Wichtige Befehle

```bash
# Abhaengigkeiten installieren oder nach einem Pull aktualisieren
npm install

# Lokalen Entwicklungsserver starten
# Oeffnet standardmaessig einen Browser und baut die Seite fuer die lokale Vorschau
npm start

# Alternative ohne automatisches Browserfenster, fest auf Port 8080
npx webpack serve --config webpack.config.dev.js --no-open --port 8080

# Produktions-Build fuer GitHub Pages erzeugen
# Das Ergebnis liegt danach im Ordner docs/
npm run build
```

## Was die Befehle tun

- `npm install`
  Installiert alle benoetigten Pakete aus `package.json`.

- `npm start`
  Startet den Entwicklungsserver. Die Seite ist danach lokal im Browser verfuegbar. Diese Variante oeffnet den Browser automatisch.

- `npx webpack serve --config webpack.config.dev.js --no-open --port 8080`
  Startet ebenfalls den Entwicklungsserver, aber ohne automatisches Oeffnen des Browsers. Die Seite ist dann unter [http://localhost:8080](http://localhost:8080) erreichbar.

- `npm run build`
  Erzeugt den Build fuer die veroeffentlichte Website. GitHub Pages soll aus dem Ordner `docs/` ausliefern.

## Empfohlener Ablauf bei Aenderungen

1. In den Projektordner wechseln.
2. `npm install` ausfuehren, falls unklar ist, ob die Abhaengigkeiten aktuell sind.
3. `npm start` oder alternativ den `webpack serve`-Befehl verwenden.
4. Aenderungen lokal pruefen.
5. `npm run build` ausfuehren.
6. Pruefen, ob `docs/` neu erzeugt bzw. aktualisiert wurde.
7. Aenderungen committen und pushen.

## GitHub Pages

Die Seite soll in GitHub Pages mit folgenden Einstellungen veroeffentlicht werden:

- `Deploy from a branch`
- Branch: `main`
- Folder: `/docs`

## Cloudflare Pages

Fuer eine spaetere Umstellung auf Cloudflare Pages kann folgendes Setup verwendet werden:

- Production Branch: `main`
- Preview Branches: alle anderen Branches, zum Beispiel `develop`
- Build Command: `npm run build`
- Build Output Directory: `docs`

Cloudflare erstellt fuer Nicht-Production-Branches automatisch Preview-Deployments unter einer `pages.dev`-Adresse. Damit kann `develop` als Teststand genutzt werden, waehrend `main` live bleibt.

## Wichtige Ordner

- `js/`
  JavaScript-Quellcode

- `css/scss/`
  SCSS-Quellcode

- `assets/`
  Bilder, Videos und Favicons

- `docs/`
  Gebautes Ergebnis fuer GitHub Pages

## Hinweis

Wenn Inhalte oder Layout geaendert wurden, sollte vor dem Push immer `npm run build` ausgefuehrt werden, damit `docs/` zum aktuellen Stand passt.
