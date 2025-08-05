# Tesla Dashcam Viewer

Een moderne webapplicatie voor het bekijken en analyseren van Tesla dashcam beelden met gesynchroniseerde multi-camera weergave. Gebouwd met React, TypeScript en Vite.

## 🌐 Andere talen
- [English](README.en.md) | [한국어](README.md) | [中文](README.zh.md) | [Deutsch](README.de.md) | [Norsk](README.nb.md) | **Nederlands** | [Français](README.fr.md) | [Svenska](README.sv.md) | [Dansk](README.da.md) | [Español](README.es.md)

## 🚗 Functies

### Multi-camera synchronisatie
- **Vier-camera ondersteuning**: Voor-, achter-, linker en rechter repeater camera's
- **Perfecte synchronisatie**: Alle camera's spelen in perfecte sync
- **Enkele tijdlijn**: Navigeer naadloos door meerdere videoclips
- **Zes-camera ondersteuning**: HW4-voertuigen ondersteunen B-pilaar linker en rechter camera's (binnenkort beschikbaar)

### Geavanceerde afspeelbesturing
- **Tijdlijn navigatie**: Scrub door je hele dashcam sessie
- **Afspeelsnelheid besturing**: Pas snelheid aan van 0.1x tot 1x
- **Frame-voor-frame stappen**: Precieze navigatie voor gedetailleerde analyse
- **Toetsenbord sneltoetsen**: Snelle toegang tot alle functies

### Video verbetering
- **Nummerplaat optimalisatie**: Druk op `F` om verbeterd contrast en verscherping te schakelen
- **Video filters**: Helderheid, contrast, verzadiging aanpassingen
- **Volledig scherm modus**: Klik op elke camera of gebruik nummer toetsen (1-4)

### Gebruikerservaring
- **Slepen en neerzetten**: Sleep gewoon je Tesla opname map naar de browser
- **10-talen ondersteuning**: Nederlands, Koreaans, Engels en 7 andere taal interfaces
- **Donker thema**: Geoptimaliseerd voor video bekijken
- **Responsief ontwerp**: Werkt op alle schermformaten

## 🎯 Snel starten

### Online gebruiken

**Bezoek website**: https://geeksbaek.github.io/tesla-dashcam-viewer/

Geen installatie vereist, gebruik direct in de browser!

## 📁 Tesla Dashcam bestandsstructuur

Je Tesla dashcam bestanden moeten deze naamgevingsconventie volgen:
```
2024-01-15_14-30-25-front.mp4
2024-01-15_14-30-25-back.mp4
2024-01-15_14-30-25-left_repeater.mp4
2024-01-15_14-30-25-right_repeater.mp4
```

De app groepeert automatisch bestanden op tijdstempel en toont ze als gesynchroniseerde clips.

## 🎮 Hoe te gebruiken

### Video's laden
1. **Slepen en neerzetten**: Zet je hele Tesla dashcam map in de browser
2. **Bestanden bladeren**: Klik op de "Bestanden bladeren" knop om meerdere videobestanden te selecteren
3. **Automatische groepering**: De app organiseert automatisch bestanden op tijdstempel

### Navigatie besturing
- **Tijdlijn schuifregelaar**: Klik en sleep om naar elk punt in je opname te springen
- **Video lijst**: Klik op elke video in de zijbalk om naar die clip te springen
- **Afspelen/Pauzeren**: Klik op de afspeelknop of druk op `Spatiebalk`

### Toetsenbord sneltoetsen

#### Afspelen
- `Spatiebalk` - Afspelen/Pauzeren
- `←` `→` - Zoek achteruit/vooruit (5 seconden of 1 frame)
- `↑` `↓` - Vorige/Volgende videoclip

#### Camera weergaven
- `1` - Voorcamera volledig scherm
- `2` - Achtercamera volledig scherm
- `3` - Rechter repeater volledig scherm
- `4` - Linker repeater volledig scherm

#### Video verbetering
- `F` - Schakel nummerplaat herkenningsfilter (hoog contrast + grijstinten)

### Video analyse functies

#### Nummerplaat modus (`F` toets)
Geoptimaliseerde instellingen voor het lezen van nummerplaten:
- Verbeterd contrast (150%)
- Grijstinten conversie
- Beeld verscherping
- Normale helderheid

#### Frame-voor-frame navigatie
1. Schakel naar "Frame" modus in het bedieningspaneel
2. Gebruik `←` `→` pijltoetsen om door individuele frames te stappen
3. Perfect voor het analyseren van incidenten of het vastleggen van specifieke momenten

#### Multi-camera analyse
- Bekijk alle vier camera hoeken tegelijkertijd
- Klik op elke camera om in volledig scherm te bekijken
- Alle camera's blijven perfect gesynchroniseerd

## 🛠️ Technische details

### Gebouwd met
- **React 19** - Moderne React met nieuwste functies
- **TypeScript** - Type-veilige ontwikkeling
- **Vite** - Snelle build tool en dev server
- **Mantine** - UI component bibliotheek
- **Tailwind CSS** - Utility-first styling
- **i18next** - Internationalisatie

### Browser vereisten
- Moderne browsers die ES6+ en HTML5 video ondersteunen
- Chrome, Firefox, Safari, Edge (nieuwste versies)
- JavaScript ingeschakeld
- Voldoende RAM voor meerdere video streams

### Prestatie opmerkingen
- Video's worden geladen als object URL's voor optimale prestaties
- Geheugen wordt automatisch opgeruimd bij het wisselen van clips
- Aanbevolen: 8GB+ RAM voor soepele 4-camera weergave

## 🐛 Probleemoplossing

### Veelvoorkomende problemen

**Video's laden niet**
- Controleer of bestandsnaamgeving overeenkomt met Tesla formaat: `YYYY-MM-DD_HH-MM-SS-[camera].mp4`
- Zorg ervoor dat bestanden geldige MP4 video's zijn
- Probeer eerst met een kleinere set bestanden

**Slechte prestaties**
- Sluit andere browser tabbladen
- Gebruik Chrome voor beste prestaties
- Verlaag videokwaliteit indien beschikbaar
- Zorg voor voldoende RAM (8GB+ aanbevolen)

**Synchronisatie problemen**
- Alle video's in een tijdstempel groep moeten dezelfde duur hebben
- Controleer of videobestanden niet beschadigd zijn
- Probeer de pagina opnieuw te laden

### Browser compatibiliteit
- **Chrome**: Volledige ondersteuning (aanbevolen)
- **Firefox**: Volledige ondersteuning
- **Safari**: Volledige ondersteuning
- **Edge**: Volledige ondersteuning
- **Mobiele browsers**: Beperkte ondersteuning (prestaties)

## 📄 Licentie

Dit project is open source. Controleer het LICENSE bestand voor details.

## 🤝 Bijdragen

Bijdragen zijn welkom! Voel je vrij om een Pull Request in te dienen.

## 🙏 Erkenningen

- Tesla voor het creëren van een geweldig dashcam systeem
- De open source gemeenschap voor de uitstekende tools en bibliotheken
- Bijdragers die helpen om dit project beter te maken

---

**Opmerking**: Deze applicatie draait volledig in je browser. Geen videogegevens worden geüpload of extern gedeeld. Je privacy en gegevensbeveiliging worden te allen tijde gehandhaafd.