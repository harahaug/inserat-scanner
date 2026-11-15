---
description: Neue Artikel aus der Scanner-Warteschlange (GitHub-Issues) bearbeiten und Kleinanzeigen-Inserat vorbereiten
---

Arbeite die Warteschlange ab. Reihenfolge:

1. `git pull`, dann offene Issues mit Label `neu` holen (`gh issue list --label neu` bzw. GitHub-Seite im Browser). Pro Issue: EAN/Name, Zustand, Zubehör, Wunschpreis, Versand, Fotopfade unter `items/<id>/`.
2. **Artikel erkennen:** EAN per Google suchen; ohne EAN die Fotos ansehen (Read-Tool) und Modell bestimmen.
3. **Recherche in Chrome (Claude in Chrome, neuer Tab):**
   - Neupreis: Google Shopping, Idealo (günstigster + typischer Preis).
   - Gebraucht: eBay (Filter „Verkauft/Beendet"), Kleinanzeigen-Vergleichsinserate, ggf. weitere Plattformen.
   - Preisvorschlag ableiten: Schnellverkauf / Marktpreis / Verhandlungsbasis, mit kurzer Begründung und 3–5 Vergleichen (Plattform, Preis).
4. **Inserat schreiben:** Titel (max. 65 Zeichen, Marke + Modell + Kernmerkmal), Beschreibung (Zustand ehrlich, Zubehör, Maße/Daten, Versand/Abholung, „Privatverkauf, keine Garantie/Rücknahme"), Kategorie (passende Kleinanzeigen-Kategorie benennen), Preis + „VB" ja/nein.
5. **Formular füllen:** kleinanzeigen.de → „Anzeige aufgeben" im eingeloggten Chrome, Kategorie, Titel, Text, Preis, Versandoption eintragen. Fotos aus `items/<id>/` per Upload hinzufügen. **Nicht veröffentlichen.**
6. **Kommentar am Issue** (Deutsch, Datum Tag vor Monat): Titel, Text, Kategorie, Preis, Preisvergleich. Label `neu` → `wartet-auf-freigabe`.
7. **Freigabe:** Nur nach Kommentar des Nutzers:
   - `ok` → veröffentlichen, Issue mit Anzeigen-Link kommentieren, schließen, Label `online`.
   - `Preis 45` / `kürzer` / sonstige Änderung → anpassen, erneut kommentieren.
   - `nein` → Entwurf verwerfen, Issue schließen.

Regeln: CAPTCHA oder Login-Abfrage nie selbst lösen, stattdessen im Issue melden und warten. Nie ohne ausdrückliches „ok" veröffentlichen. Zugangsdaten nie eintippen.
