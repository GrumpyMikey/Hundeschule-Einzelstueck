#!/bin/bash

# Verzeichnis mit den SCSS-Dateien
SCSS_DIR="scss"

# Pfad zum Sass-Kompilierer
SASS_COMPILER="/Users/michaelgabor/.nvm/versions/node/v22.5.1/bin/sass"

# Überprüfen, ob das Verzeichnis existiert
if [ -d "$SCSS_DIR" ]; then
  # Durchlaufe alle .scss-Dateien im Verzeichnis
  for scss_file in "$SCSS_DIR"/*.scss; do
    echo "-------------------------------------------"
    # Extrahiere den Basisnamen der Datei (ohne Verzeichnis und Erweiterung)
    base_name=$(basename "$scss_file" .scss)
    
    # Ziel-CSS-Datei
    css_file="$base_name.css"
    
    # Führe den Sass-Kompilierbefehl aus und überschreibe die CSS-Datei
    "$SASS_COMPILER" "$scss_file" "$css_file"
    
    echo "Kompiliert: $scss_file -> $css_file"
  done
else
  echo "Das Verzeichnis $SCSS_DIR existiert nicht."
fi

