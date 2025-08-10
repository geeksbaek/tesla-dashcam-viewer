# Tesla Dashcam Viewer

En modern webbapplikation för att visa och analysera Tesla dashcam-inspelningar med synkroniserad multi-kamera uppspelning. Byggd med React, TypeScript och Vite.

![Tesla Dashcam Viewer Huvudskärm](../images/screenshot-main.png)
![Tesla Dashcam Viewer Spelarskärm](../images/screenshot-player.png)

## 🌐 Andra språk
- [English](docs/README.en.md) | [한국어](../README.md) | [中文](docs/README.zh.md) | [Deutsch](docs/README.de.md) | [Norsk](docs/README.nb.md) | [Nederlands](docs/README.nl.md) | [Français](docs/README.fr.md) | **Svenska** | [Dansk](docs/README.da.md) | [Español](docs/README.es.md)

## 🚗 Funktioner

### Multi-kamera synkronisering
- **4-kanals/6-kanals kamera stöd**: Fram-, bak-, vänster och höger repeater-kameror + HW4 vänster/höger pelar-kameror
- **Perfekt synkronisering**: Alla kameror spelar i perfekt synk
- **Enskild tidslinje**: Navigera sömlöst genom flera videoklipp

### Avancerade uppspelningskontroller
- **Tidslinje navigering**: Skrubba genom din hela dashcam session
- **Uppspelningshastighet kontroll**: Justera hastighet från 0.1x till 1x
- **Bild-för-bild stegning**: Precis navigering för detaljerad analys
- **Tangentbordsgenvägar**: Snabb åtkomst till alla funktioner

### Video förbättring
- **Registreringsskylt optimering**: Tryck `F` för att växla förbättrad kontrast och skärpa
- **Video filter**: Ljusstyrka, kontrast, mättnad justeringar
- **Video anpassningslägen**: Cover/Contain läge val
- **Helskärm läge**: Klicka på vilken kamera som helst eller använd siffertangenter (1-6)

### Användarupplevelse
- **Dra och släpp**: Dra bara din Tesla inspelnings mapp till webbläsaren
- **10-språk stöd**: Svenska, koreanska, engelska och 7 andra språk gränssnitt
- **Mörkt tema**: Optimerat för video visning
- **Responsiv design**: Fungerar på alla skärmstorlekar
- **PWA stöd**: Offline kapabel, installerbar som app
- **Realtid tidsstämpel**: Visar exakt uppspelningstid

## 🎯 Snabb start

### Använd online

**Besök webbplatsen**: https://geeksbaek.github.io/tesla-dashcam-viewer/

Ingen installation krävs, använd direkt i webbläsaren!

## 📁 Tesla Dashcam filstruktur

Dina Tesla dashcam-filer bör följa denna namnkonvention:

### HW3 Fordon (4-kanals)
```
2024-01-15_14-30-25-front.mp4
2024-01-15_14-30-25-back.mp4
2024-01-15_14-30-25-left_repeater.mp4
2024-01-15_14-30-25-right_repeater.mp4
```

### HW4 Fordon (6-kanals)
```
2024-01-15_14-30-25-front.mp4
2024-01-15_14-30-25-back.mp4
2024-01-15_14-30-25-left_repeater.mp4
2024-01-15_14-30-25-right_repeater.mp4
2024-01-15_14-30-25-left_pillar.mp4    # HW4 extra kamera
2024-01-15_14-30-25-right_pillar.mp4   # HW4 extra kamera
```

Appen grupperar automatiskt filer efter tidsstämpel och visar dem som synkroniserade klipp.

## 🎮 Hur man använder

### Ladda videor
1. **Dra och släpp**: Släpp din hela Tesla dashcam mapp i webbläsaren
2. **Bläddra filer**: Klicka på "Bläddra filer" knappen för att välja flera videofiler
3. **Automatisk gruppering**: Appen kommer automatiskt organisera filer efter tidsstämpel

### Navigeringskontroller
- **Tidslinje skjutreglage**: Klicka och dra för att hoppa till vilken punkt som helst i din inspelning
- **Video lista**: Klicka på vilken video som helst i sidofältet för att hoppa till det klippet
- **Spela/Pausa**: Klicka på uppspelningsknappen eller tryck `Mellanslag`

### Tangentbordsgenvägar

#### Uppspelning
- `Mellanslag` - Spela/Pausa
- `←` `→` - Sök bakåt/framåt (5 sekunder eller 1 bild)
- `↑` `↓` - Föregående/Nästa videoklipp

#### Kamera vyer
- `1` - Framkamera helskärm
- `2` - Bakkamera helskärm
- `3` - Höger repeater helskärm
- `4` - Vänster repeater helskärm
- `5` - Vänster pelar helskärm (endast HW4)
- `6` - Höger pelar helskärm (endast HW4)

#### Video förbättring
- `F` - Växla registreringsskylt igenkänningsfilter (hög kontrast + gråskala)

### Video analys funktioner

#### Registreringsskylt läge (`F` tangent)
Optimerade inställningar för att läsa registreringsskyltar:
- Förbättrad kontrast (150%)
- Gråskala konvertering
- Bild skärpa
- Normal ljusstyrka

#### Bild-för-bild navigering
1. Växla till "Bild" läge i kontrollpanelen
2. Använd `←` `→` piltangenter för att stega genom individuella bilder
3. Perfekt för att analysera incidenter eller fånga specifika ögonblick

#### Multi-kamera analys
- Se 4-6 kamera vinklar samtidigt (HW3: 4-kanals, HW4: 6-kanals)
- Klicka på vilken kamera som helst för att se i helskärm
- Alla kameror förblir perfekt synkroniserade
- Realtid tidsstämpel för exakta incident tider

## 🛠️ Tekniska detaljer

### Byggd med
- **React 19** - Modern React med senaste funktioner
- **TypeScript** - Typsäker utveckling
- **Vite** - Snabb byggverktyg och dev server
- **Mantine** - UI komponent bibliotek
- **Tailwind CSS** - Utility-first styling
- **i18next** - Internationalisering
- **PWA (Progressive Web App)** - Offline stöd och app installation

### Webbläsarkrav
- Moderna webbläsare som stöder ES6+ och HTML5 video
- Chrome, Firefox, Safari, Edge (senaste versioner)
- JavaScript aktiverat
- Tillräckligt RAM för flera video strömmar

### Prestanda anteckningar
- Videor laddas som objekt URLs för optimal prestanda
- Minne städas automatiskt upp när du byter klipp
- Rekommenderat:
  - HW3 (4-kamera): 8GB+ RAM
  - HW4 (6-kamera): 16GB+ RAM

## 🐛 Felsökning

### Vanliga problem

**Videor laddar inte**
- Kontrollera att filnamngivning matchar Tesla format: `YYYY-MM-DD_HH-MM-SS-[camera].mp4`
- Se till att filer är giltiga MP4 videor
- Prova med en mindre uppsättning filer först

**Dålig prestanda**
- Stäng andra webbläsarflikar
- Använd Chrome för bästa prestanda
- Minska videokvalitet om tillgängligt
- Se till att ha tillräckligt RAM (8GB+ rekommenderat)

**Synkroniseringsproblem**
- Alla videor i en tidsstämpel grupp bör ha samma varaktighet
- Kontrollera att videofiler inte är skadade
- Prova att ladda om sidan

### Webbläsarkompatibilitet
- **Chrome**: Fullt stöd (rekommenderat)
- **Firefox**: Fullt stöd
- **Safari**: Fullt stöd
- **Edge**: Fullt stöd
- **Mobila webbläsare**: Begränsat stöd (prestanda)

## 📄 Licens

Detta projekt är öppen källkod. Vänligen kontrollera LICENSE filen för detaljer.

## 🤝 Bidra

Bidrag är välkomna! Känn dig fri att skicka in en Pull Request.

## 🙏 Erkännanden

- Tesla för att skapa ett fantastiskt dashcam system
- Öppen källkods gemenskapen för de utmärkta verktygen och biblioteken
- Bidragsgivare som hjälper till att göra detta projekt bättre

---

**Notera**: Denna applikation körs helt i din webbläsare. Ingen videodata laddas upp eller delas externt. Din integritet och datasäkerhet upprätthålls hela tiden.