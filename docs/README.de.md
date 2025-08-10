# Tesla Dashcam Viewer

Eine moderne Webanwendung zum Anzeigen und Analysieren von Tesla Dashcam-Aufnahmen mit synchronisierter Multi-Kamera-Wiedergabe. Entwickelt mit React, TypeScript und Vite.

![Tesla Dashcam Viewer Hauptbildschirm](../images/screenshot-main.png)
![Tesla Dashcam Viewer Player-Bildschirm](../images/screenshot-player.png)

## 🌐 Weitere Sprachen
- [English](docs/README.en.md) | [한국어](../README.md) | [中文](docs/README.zh.md) | **Deutsch** | [Norsk](docs/README.nb.md) | [Nederlands](docs/README.nl.md) | [Français](docs/README.fr.md) | [Svenska](docs/README.sv.md) | [Dansk](docs/README.da.md) | [Español](docs/README.es.md)

## 🚗 Funktionen

### Multi-Kamera-Synchronisation
- **4-Kanal/6-Kanal-Kamera-Unterstützung**: Vorder-, Rück-, linke und rechte Repeater-Kameras + HW4 linke/rechte Säulen-Kameras
- **Perfekte Synchronisation**: Alle Kameras werden perfekt synchron abgespielt
- **Einzige Timeline**: Nahtlose Navigation durch mehrere Videoclips

### Erweiterte Wiedergabesteuerung
- **Timeline-Navigation**: Scrubben durch Ihre gesamte Dashcam-Sitzung
- **Wiedergabegeschwindigkeitskontrolle**: Geschwindigkeit von 0,1x bis 1x anpassen
- **Frame-für-Frame-Stepping**: Präzise Navigation für detaillierte Analysen
- **Tastenkombinationen**: Schneller Zugriff auf alle Funktionen

### Video-Verbesserung
- **Kennzeichen-Optimierung**: Drücken Sie `F` um erweiterten Kontrast und Schärfung umzuschalten
- **Video-Filter**: Helligkeit, Kontrast, Sättigungsanpassungen
- **Video-Anpassungsmodi**: Cover/Contain-Modus-Auswahl
- **Vollbildmodus**: Klicken Sie auf eine beliebige Kamera oder verwenden Sie Zifferntasten (1-6)

### Benutzererfahrung
- **Drag & Drop**: Ziehen Sie einfach Ihren Tesla-Aufnahmenordner in den Browser
- **10-Sprachen-Unterstützung**: Deutsch, Koreanisch, Englisch und 7 weitere Sprachoberflächen
- **Dunkles Theme**: Optimiert für die Videowiedergabe
- **Responsive Design**: Funktioniert auf allen Bildschirmgrößen
- **PWA-Unterstützung**: Offline-fähig, als App installierbar
- **Echtzeit-Zeitstempel**: Zeigt exakte Wiedergabezeit an

## 🎯 Schnellstart

### Online nutzen

**Website besuchen**: https://geeksbaek.github.io/tesla-dashcam-viewer/

Keine Installation erforderlich, direkt im Browser verwenden!

## 📁 Tesla Dashcam Dateistruktur

Ihre Tesla Dashcam-Dateien sollten dieser Namenskonvention folgen:

### HW3 Fahrzeuge (4-Kanal)
```
2024-01-15_14-30-25-front.mp4
2024-01-15_14-30-25-back.mp4
2024-01-15_14-30-25-left_repeater.mp4
2024-01-15_14-30-25-right_repeater.mp4
```

### HW4 Fahrzeuge (6-Kanal)
```
2024-01-15_14-30-25-front.mp4
2024-01-15_14-30-25-back.mp4
2024-01-15_14-30-25-left_repeater.mp4
2024-01-15_14-30-25-right_repeater.mp4
2024-01-15_14-30-25-left_pillar.mp4    # HW4 zusätzliche Kamera
2024-01-15_14-30-25-right_pillar.mp4   # HW4 zusätzliche Kamera
```

Die App gruppiert automatisch Dateien nach Zeitstempel und zeigt sie als synchronisierte Clips an.

## 🎮 Verwendung

### Videos laden
1. **Drag and Drop**: Ziehen Sie Ihren gesamten Tesla Dashcam-Ordner in den Browser
2. **Dateien durchsuchen**: Klicken Sie auf die Schaltfläche "Dateien durchsuchen", um mehrere Videodateien auszuwählen
3. **Automatische Gruppierung**: Die App organisiert Dateien automatisch nach Zeitstempel

### Navigationssteuerung
- **Timeline-Schieberegler**: Klicken und ziehen Sie, um zu einem beliebigen Punkt in Ihrer Aufnahme zu springen
- **Videoliste**: Klicken Sie auf ein Video in der Seitenleiste, um zu diesem Clip zu springen
- **Wiedergabe/Pause**: Klicken Sie auf die Wiedergabetaste oder drücken Sie `Leertaste`

### Tastenkombinationen

#### Wiedergabe
- `Leertaste` - Wiedergabe/Pause
- `←` `→` - Rückwärts/Vorwärts suchen (5 Sekunden oder 1 Frame)
- `↑` `↓` - Vorheriger/Nächster Videoclip

#### Kameraansichten
- `1` - Frontkamera Vollbild
- `2` - Rückkamera Vollbild
- `3` - Rechter Repeater Vollbild
- `4` - Linker Repeater Vollbild
- `5` - Linke Säule Vollbild (nur HW4)
- `6` - Rechte Säule Vollbild (nur HW4)

#### Video-Verbesserung
- `F` - Kennzeichenerkennungsfilter umschalten (hoher Kontrast + Graustufen)

### Video-Analysefunktionen

#### Kennzeichen-Modus (`F`-Taste)
Optimierte Einstellungen zum Lesen von Kennzeichen:
- Verbesserter Kontrast (150%)
- Graustufen-Konvertierung
- Bildschärfung
- Normale Helligkeit

#### Frame-für-Frame-Navigation
1. Wechseln Sie im Kontrollpanel zum "Frame"-Modus
2. Verwenden Sie `←` `→` Pfeiltasten, um einzelne Frames durchzugehen
3. Perfekt für die Analyse von Vorfällen oder das Aufnehmen bestimmter Momente

#### Multi-Kamera-Analyse
- 4-6 Kamerawinkel gleichzeitig anzeigen (HW3: 4-Kanal, HW4: 6-Kanal)
- Klicken Sie auf eine beliebige Kamera, um sie im Vollbild anzuzeigen
- Alle Kameras bleiben perfekt synchronisiert
- Echtzeit-Zeitstempel für genaue Ereigniszeiten

## 🛠️ Technische Details

### Erstellt mit
- **React 19** - Modernes React mit neuesten Funktionen
- **TypeScript** - Typsichere Entwicklung
- **Vite** - Schnelles Build-Tool und Dev-Server
- **Mantine** - UI-Komponentenbibliothek
- **Tailwind CSS** - Utility-First-Styling
- **i18next** - Internationalisierung
- **PWA (Progressive Web App)** - Offline-Unterstützung und App-Installation

### Browser-Anforderungen
- Moderne Browser mit ES6+ und HTML5-Video-Unterstützung
- Chrome, Firefox, Safari, Edge (neueste Versionen)
- JavaScript aktiviert
- Ausreichend RAM für mehrere Videostreams

### Leistungshinweise
- Videos werden als Objekt-URLs für optimale Leistung geladen
- Speicher wird automatisch beim Wechseln von Clips bereinigt
- Empfohlen:
  - HW3 (4-Kamera): 8GB+ RAM
  - HW4 (6-Kamera): 16GB+ RAM

## 🐛 Fehlerbehebung

### Häufige Probleme

**Videos werden nicht geladen**
- Überprüfen Sie, ob die Dateibenennung dem Tesla-Format entspricht: `YYYY-MM-DD_HH-MM-SS-[camera].mp4`
- Stellen Sie sicher, dass die Dateien gültige MP4-Videos sind
- Versuchen Sie es zuerst mit einem kleineren Dateisatz

**Schlechte Leistung**
- Schließen Sie andere Browser-Tabs
- Verwenden Sie Chrome für beste Leistung
- Reduzieren Sie die Videoqualität, falls verfügbar
- Stellen Sie sicher, dass ausreichend RAM vorhanden ist (8GB+ empfohlen)

**Synchronisationsprobleme**
- Alle Videos in einer Zeitstempelgruppe sollten die gleiche Dauer haben
- Überprüfen Sie, ob Videodateien nicht beschädigt sind
- Versuchen Sie, die Seite neu zu laden

### Browser-Kompatibilität
- **Chrome**: Vollständige Unterstützung (empfohlen)
- **Firefox**: Vollständige Unterstützung
- **Safari**: Vollständige Unterstützung
- **Edge**: Vollständige Unterstützung
- **Mobile Browser**: Eingeschränkte Unterstützung (Leistung)

## 📄 Lizenz

Dieses Projekt ist Open Source. Bitte überprüfen Sie die LICENSE-Datei für Details.

## 🤝 Mitwirken

Beiträge sind willkommen! Reichen Sie gerne einen Pull Request ein.

## 🙏 Danksagungen

- Tesla für die Entwicklung eines großartigen Dashcam-Systems
- Die Open-Source-Community für die hervorragenden Tools und Bibliotheken
- Mitwirkende, die helfen, dieses Projekt zu verbessern

---

**Hinweis**: Diese Anwendung läuft vollständig in Ihrem Browser. Keine Videodaten werden hochgeladen oder extern geteilt. Ihre Privatsphäre und Datensicherheit werden jederzeit gewährleistet.