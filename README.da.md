# Tesla Dashcam Viewer

En moderne webapplikation til at se og analysere Tesla dashcam optagelser med synkroniseret multi-kamera afspilning. Bygget med React, TypeScript og Vite.

![Tesla Dashcam Viewer Skærmbillede](images/screenshot.png)

## 🌐 Andre sprog
- [English](README.en.md) | [한국어](README.md) | [中文](README.zh.md) | [Deutsch](README.de.md) | [Norsk](README.nb.md) | [Nederlands](README.nl.md) | [Français](README.fr.md) | [Svenska](README.sv.md) | **Dansk** | [Español](README.es.md)

## 🚗 Funktioner

### Multi-kamera synkronisering
- **Fire-kamera support**: For-, bag-, venstre og højre repeater kameraer
- **Perfekt synkronisering**: Alle kameraer afspiller i perfekt synk
- **Enkelt tidslinje**: Naviger problemfrit gennem flere videoklip
- **Seks-kamera support**: HW4-køretøjer understøtter B-søjle venstre og højre kameraer (kommer snart)

### Avancerede afspilningskontrols
- **Tidslinje navigation**: Skrub gennem din hele dashcam session
- **Afspilningshastighed kontrol**: Juster hastighed fra 0.1x til 1x
- **Billede-for-billede trin**: Præcis navigation for detaljeret analyse
- **Tastatur genveje**: Hurtig adgang til alle funktioner

### Video forbedring
- **Nummerplade optimering**: Tryk `F` for at skifte forbedret kontrast og skarphed
- **Video filtre**: Lysstyrke, kontrast, mætning justeringer
- **Fuldskærm tilstand**: Klik på ethvert kamera eller brug nummer taster (1-4)

### Brugeroplevelse
- **Træk og slip**: Træk bare din Tesla optagelses mappe til browseren
- **10-sprog support**: Dansk, koreansk, engelsk og 7 andre sprog grænseflader
- **Mørkt tema**: Optimeret til video visning
- **Responsivt design**: Virker på alle skærmstørrelser

## 🎯 Hurtig start

### Brug online

**Besøg hjemmesiden**: https://geeksbaek.github.io/tesla-dashcam-viewer/

Ingen installation påkrævet, brug direkte i browseren!

## 📁 Tesla Dashcam fil struktur

Dine Tesla dashcam filer skal følge denne navngivningskonvention:
```
2024-01-15_14-30-25-front.mp4
2024-01-15_14-30-25-back.mp4
2024-01-15_14-30-25-left_repeater.mp4
2024-01-15_14-30-25-right_repeater.mp4
```

Appen grupperer automatisk filer efter tidsstempel og viser dem som synkroniserede klip.

## 🎮 Sådan bruger du

### Indlæs videoer
1. **Træk og slip**: Slip din hele Tesla dashcam mappe i browseren
2. **Gennemse filer**: Klik på "Gennemse filer" knappen for at vælge flere videofiler
3. **Automatisk gruppering**: Appen vil automatisk organisere filer efter tidsstempel

### Navigationskontrols
- **Tidslinje skyder**: Klik og træk for at springe til ethvert punkt i din optagelse
- **Video liste**: Klik på enhver video i sidebjælken for at springe til det klip
- **Afspil/Pause**: Klik på afspil knappen eller tryk `Mellemrum`

### Tastatur genveje

#### Afspilning
- `Mellemrum` - Afspil/Pause
- `←` `→` - Søg bagud/fremad (5 sekunder eller 1 billede)
- `↑` `↓` - Forrige/Næste videoklip

#### Kamera visninger
- `1` - Forkamera fuldskærm
- `2` - Bagkamera fuldskærm
- `3` - Højre repeater fuldskærm
- `4` - Venstre repeater fuldskærm

#### Video forbedring
- `F` - Skift nummerplade genkendelsesfilter (høj kontrast + gråtoner)

### Video analyse funktioner

#### Nummerplade tilstand (`F` tast)
Optimerede indstillinger til at læse nummerplader:
- Forbedret kontrast (150%)
- Gråtone konvertering
- Billede skarphed
- Normal lysstyrke

#### Billede-for-billede navigation
1. Skift til "Billede" tilstand i kontrolpanelet
2. Brug `←` `→` piletaster til at træde gennem individuelle billeder
3. Perfekt til at analysere hændelser eller fange specifikke øjeblikke

#### Multi-kamera analyse
- Se alle fire kamera vinkler samtidigt
- Klik på ethvert kamera for at se i fuldskærm
- Alle kameraer forbliver perfekt synkroniserede

## 🛠️ Tekniske detaljer

### Bygget med
- **React 19** - Moderne React med nyeste funktioner
- **TypeScript** - Type-sikker udvikling
- **Vite** - Hurtig build værktøj og dev server
- **Mantine** - UI komponent bibliotek
- **Tailwind CSS** - Utility-first styling
- **i18next** - Internationalisering

### Browser krav
- Moderne browsere der understøtter ES6+ og HTML5 video
- Chrome, Firefox, Safari, Edge (nyeste versioner)
- JavaScript aktiveret
- Tilstrækkelig RAM til flere video streams

### Performance noter
- Videoer indlæses som objekt URLs for optimal performance
- Hukommelse ryddes automatisk op når du skifter klip
- Anbefalet: 8GB+ RAM for glat 4-kamera afspilning

## 🐛 Fejlfinding

### Almindelige problemer

**Videoer indlæses ikke**
- Kontroller at fil navngivning matcher Tesla format: `YYYY-MM-DD_HH-MM-SS-[camera].mp4`
- Sørg for at filer er gyldige MP4 videoer
- Prøv med et mindre sæt filer først

**Dårlig performance**
- Luk andre browser faner
- Brug Chrome for bedste performance
- Reducer videokvalitet hvis tilgængelig
- Sørg for tilstrækkelig RAM (8GB+ anbefalet)

**Synkroniseringsproblemer**
- Alle videoer i en tidsstempel gruppe skal have samme varighed
- Kontroller at videofiler ikke er beskadigede
- Prøv at genindlæse siden

### Browser kompatibilitet
- **Chrome**: Fuld support (anbefalet)
- **Firefox**: Fuld support
- **Safari**: Fuld support
- **Edge**: Fuld support
- **Mobile browsere**: Begrænset support (performance)

## 📄 Licens

Dette projekt er open source. Venligst tjek LICENSE filen for detaljer.

## 🤝 Bidrag

Bidrag er velkomne! Tøv ikke med at indsende en Pull Request.

## 🙏 Anerkendelser

- Tesla for at skabe et fantastisk dashcam system
- Open source fællesskabet for de fremragende værktøjer og biblioteker
- Bidragydere der hjælper med at gøre dette projekt bedre

---

**Bemærk**: Denne applikation kører helt i din browser. Ingen videodata uploades eller deles eksternt. Dit privatliv og datasikkerhed opretholdes til enhver tid.