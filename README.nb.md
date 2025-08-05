# Tesla Dashcam Viewer

En moderne webapplikasjon for å se og analysere Tesla dashcam-opptak med synkronisert multi-kamera avspilling. Bygget med React, TypeScript og Vite.

![Tesla Dashcam Viewer Skjermbilde](images/screenshot.png)

## 🌐 Andre språk
- [English](README.en.md) | [한국어](README.md) | [中文](README.zh.md) | [Deutsch](README.de.md) | **Norsk** | [Nederlands](README.nl.md) | [Français](README.fr.md) | [Svenska](README.sv.md) | [Dansk](README.da.md) | [Español](README.es.md)

## 🚗 Funksjoner

### Multi-kamera synkronisering
- **Fire-kamera støtte**: Front-, bak-, venstre og høyre repeater-kameraer
- **Perfekt synkronisering**: Alle kameraer spiller i perfekt synkroni
- **Enkelt tidslinje**: Naviger sømløst gjennom flere videoklipp
- **Seks-kamera støtte**: HW4-kjøretøy støtter B-stolpe venstre og høyre kameraer (kommer snart)

### Avanserte avspillingskontroller
- **Tidslinje navigasjon**: Skrubb gjennom hele dashcam-økten din
- **Avspillingshastighet kontroll**: Juster hastighet fra 0.1x til 1x
- **Bilde-for-bilde stepping**: Presis navigasjon for detaljerte analyser
- **Tastatursnarveier**: Rask tilgang til alle funksjoner

### Video forbedring
- **Nummerskilt optimalisering**: Trykk `F` for å veksle forbedret kontrast og skarphet
- **Video filtre**: Lysstyrke, kontrast, metning justeringer
- **Fullskjerm modus**: Klikk på hvilket som helst kamera eller bruk nummer taster (1-4)

### Brukeropplevelse
- **Dra og slipp**: Bare dra Tesla opptak mappen inn i nettleseren
- **10-språk støtte**: Norsk, koreansk, engelsk og 7 andre språk grensesnitt
- **Mørkt tema**: Optimalisert for video visning
- **Responsivt design**: Fungerer på alle skjermstørrelser

## 🎯 Rask start

### Bruk online

**Besøk nettstedet**: https://geeksbaek.github.io/tesla-dashcam-viewer/

Ingen installasjon nødvendig, bruk direkte i nettleseren!

## 📁 Tesla Dashcam filstruktur

Tesla dashcam-filene dine bør følge denne navnekonvensjonen:
```
2024-01-15_14-30-25-front.mp4
2024-01-15_14-30-25-back.mp4
2024-01-15_14-30-25-left_repeater.mp4
2024-01-15_14-30-25-right_repeater.mp4
```

Appen grupperer automatisk filer etter tidsstempel og viser dem som synkroniserte klipp.

## 🎮 Hvordan bruke

### Laste videoer
1. **Dra og slipp**: Slipp hele Tesla dashcam-mappen din i nettleseren
2. **Bla gjennom filer**: Klikk "Bla gjennom filer" knappen for å velge flere videofiler
3. **Automatisk gruppering**: Appen vil automatisk organisere filer etter tidsstempel

### Navigasjonskontroller
- **Tidslinje slider**: Klikk og dra for å hoppe til et hvilket som helst punkt i opptaket ditt
- **Video liste**: Klikk på hvilken som helst video i sidelinjen for å hoppe til det klippet
- **Spill av/Pause**: Klikk avspillingsknappen eller trykk `Mellomrom`

### Tastatursnarveier

#### Avspilling
- `Mellomrom` - Spill av/Pause
- `←` `→` - Søk bakover/fremover (5 sekunder eller 1 bilde)
- `↑` `↓` - Forrige/Neste videoklipp

#### Kameravisninger
- `1` - Frontkamera fullskjerm
- `2` - Bakkamera fullskjerm
- `3` - Høyre repeater fullskjerm
- `4` - Venstre repeater fullskjerm

#### Video forbedring
- `F` - Veksle nummerskilt gjenkjenningsfilter (høy kontrast + gråtone)

### Video analysefunksjoner

#### Nummerskilt modus (`F` tast)
Optimaliserte innstillinger for å lese nummerskilt:
- Forbedret kontrast (150%)
- Gråtone konvertering
- Bilde skarphet
- Normal lysstyrke

#### Bilde-for-bilde navigasjon
1. Bytt til "Bilde" modus i kontrollpanelet
2. Bruk `←` `→` piltaster for å gå gjennom individuelle bilder
3. Perfekt for å analysere hendelser eller fange spesifikke øyeblikk

#### Multi-kamera analyse
- Se alle fire kamera vinkler samtidig
- Klikk på hvilket som helst kamera for å se i fullskjerm
- Alle kameraer forblir perfekt synkroniserte

## 🛠️ Tekniske detaljer

### Bygget med
- **React 19** - Moderne React med nyeste funksjoner
- **TypeScript** - Type-sikker utvikling
- **Vite** - Rask bygge verktøy og dev server
- **Mantine** - UI komponent bibliotek
- **Tailwind CSS** - Utility-first styling
- **i18next** - Internasjonalisering

### Nettleser krav
- Moderne nettlesere som støtter ES6+ og HTML5 video
- Chrome, Firefox, Safari, Edge (nyeste versjoner)
- JavaScript aktivert
- Tilstrekkelig RAM for flere video strømmer

### Ytelse merknader
- Videoer lastes som objekt URLer for optimal ytelse
- Minne ryddes automatisk opp når du bytter klipp
- Anbefalt: 8GB+ RAM for smidig 4-kamera avspilling

## 🐛 Feilsøking

### Vanlige problemer

**Videoer vil ikke laste**
- Sjekk at filnavngivning matcher Tesla format: `YYYY-MM-DD_HH-MM-SS-[camera].mp4`
- Forsikre deg om at filer er gyldige MP4 videoer
- Prøv med et mindre sett med filer først

**Dårlig ytelse**
- Lukk andre nettleser faner
- Bruk Chrome for beste ytelse
- Reduser videokvalitet hvis tilgjengelig
- Forsikre deg om tilstrekkelig RAM (8GB+ anbefalt)

**Synkroniseringsproblemer**
- Alle videoer i en tidsstempel gruppe bør ha samme varighet
- Sjekk at videofiler ikke er ødelagte
- Prøv å laste siden på nytt

### Nettleser kompatibilitet
- **Chrome**: Full støtte (anbefalt)
- **Firefox**: Full støtte
- **Safari**: Full støtte
- **Edge**: Full støtte
- **Mobile nettlesere**: Begrenset støtte (ytelse)

## 📄 Lisens

Dette prosjektet er åpen kildekode. Vennligst sjekk LICENSE filen for detaljer.

## 🤝 Bidra

Bidrag er velkomne! Vennligst føl deg fri til å sende inn en Pull Request.

## 🙏 Anerkjennelser

- Tesla for å lage et fantastisk dashcam system
- Åpen kildekode samfunnet for de utmerkede verktøyene og bibliotekene
- Bidragsytere som hjelper til med å gjøre dette prosjektet bedre

---

**Merk**: Denne applikasjonen kjører helt i din nettleser. Ingen videodata lastes opp eller deles eksternt. Din personvern og datasikkerhet opprettholdes til enhver tid.