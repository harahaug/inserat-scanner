# Inserat-Scanner

Handy: Barcode scannen/Foto machen -> landet als GitHub-Issue im **privaten** Repo `inserat-queue`.
Mac: `/inserat` recherchiert Preise in Chrome, schreibt das Kleinanzeigen-Inserat, füllt das Formular aus.
Freigabe per Kommentar in der GitHub-App.

## Aufbau
- `inserat-scanner` (öffentlich, nur die App, keine Daten) -> GitHub Pages
- `inserat-queue` (privat) -> Artikel als Issues, Fotos unter `items/`

## Einrichtung
1. Beide Repos anlegen, Pages für `inserat-scanner` aktivieren (Branch main, Ordner /).
2. Fine-grained Token nur für `inserat-queue` (Contents + Issues: Read/Write).
3. Seite auf dem iPhone in Safari öffnen -> Teilen -> Zum Home-Bildschirm.
4. Unter Einstellungen Repo + Token eintragen.
