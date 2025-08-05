# Tesla Dashcam Viewer

Eine moderne Webanwendung zum Anzeigen und Analysieren von Tesla Dashcam-Aufnahmen mit synchronisierter Multi-Kamera-Wiedergabe. Entwickelt mit React, TypeScript und Vite.

## 🌐 Weitere Sprachen
- [English](README.en.md) | [한국어](README.md) | [中文](README.zh.md) | **Deutsch** | [Norsk](README.nb.md) | [Nederlands](README.nl.md) | [Français](README.fr.md) | [Svenska](README.sv.md) | [Dansk](README.da.md) | [Español](README.es.md)

## 🚗 Funktionen

### Multi-Kamera-Synchronisation
- **Vier-Kamera-Unterstützung**: Vorder-, Rück-, linke und rechte Repeater-Kameras
- **Perfekte Synchronisation**: Alle Kameras werden perfekt synchron abgespielt
- **Einzige Timeline**: Nahtlose Navigation durch mehrere Videoclips
- **Sechs-Kamera-Unterstützung**: HW4-Fahrzeuge unterstützen B-Säulen-Kameras links und rechts (demnächst)

### Erweiterte Wiedergabesteuerung
- **Timeline-Navigation**: Scrubben durch Ihre gesamte Dashcam-Sitzung
- **Wiedergabegeschwindigkeitskontrolle**: Geschwindigkeit von 0,25x bis 2x anpassen
- **Frame-für-Frame-Stepping**: Präzise Navigation für detaillierte Analysen
- **Tastenkombinationen**: Schneller Zugriff auf alle Funktionen

### Video-Verbesserung
- **Kennzeichen-Optimierung**: Drücken Sie `F` um erweiterten Kontrast und Schärfung umzuschalten
- **Video-Filter**: Helligkeit, Kontrast, Sättigungsanpassungen
- **Vollbildmodus**: Klicken Sie auf eine beliebige Kamera oder verwenden Sie Zifferntasten (1-4)

### Benutzererfahrung
- **Drag & Drop**: Ziehen Sie einfach Ihren Tesla-Aufnahmenordner in den Browser
- **10-Sprachen-Unterstützung**: Deutsch, Koreanisch, Englisch und 7 weitere Sprachoberflächen
- **Dunkles Theme**: Optimiert für die Videowiedergabe
- **Responsive Design**: Funktioniert auf allen Bildschirmgrößen

## 🎯 Schnellstart

### Online nutzen

**Website besuchen**: https://geeksbaek.github.io/tesla-dashcam-viewer/

Keine Installation erforderlich, direkt im Browser verwenden!

## 📁 Tesla Dashcam Dateistruktur

Ihre Tesla Dashcam-Dateien sollten dieser Namenskonvention folgen:
```
2024-01-15_14-30-25-front.mp4
2024-01-15_14-30-25-back.mp4
2024-01-15_14-30-25-left_repeater.mp4
2024-01-15_14-30-25-right_repeater.mp4
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
- Alle vier Kamerawinkel gleichzeitig anzeigen
- Klicken Sie auf eine beliebige Kamera, um sie im Vollbild anzuzeigen
- Alle Kameras bleiben perfekt synchronisiert

## 🛠️ Technische Details

### Erstellt mit
- **React 19** - Modernes React mit neuesten Funktionen
- **TypeScript** - Typsichere Entwicklung
- **Vite** - Schnelles Build-Tool und Dev-Server
- **Mantine** - UI-Komponentenbibliothek
- **Tailwind CSS** - Utility-First-Styling
- **i18next** - Internationalisierung

### Browser-Anforderungen
- Moderne Browser mit ES6+ und HTML5-Video-Unterstützung
- Chrome, Firefox, Safari, Edge (neueste Versionen)
- JavaScript aktiviert
- Ausreichend RAM für mehrere Videostreams

### Leistungshinweise
- Videos werden als Objekt-URLs für optimale Leistung geladen
- Speicher wird automatisch beim Wechseln von Clips bereinigt
- Empfohlen: 8GB+ RAM für flüssige 4-Kamera-Wiedergabe

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