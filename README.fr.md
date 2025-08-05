# Tesla Dashcam Viewer

Une application web moderne pour visualiser et analyser les enregistrements de dashcam Tesla avec une lecture multi-caméra synchronisée. Construite avec React, TypeScript et Vite.

![Capture d'écran de Tesla Dashcam Viewer](images/screenshot.png)

## 🌐 Autres langues
- [English](README.en.md) | [한국어](README.md) | [中文](README.zh.md) | [Deutsch](README.de.md) | [Norsk](README.nb.md) | [Nederlands](README.nl.md) | **Français** | [Svenska](README.sv.md) | [Dansk](README.da.md) | [Español](README.es.md)

## 🚗 Fonctionnalités

### Synchronisation multi-caméra
- **Support quatre caméras**: Caméras avant, arrière, répéteur gauche et répéteur droit
- **Synchronisation parfaite**: Toutes les caméras jouent en parfaite synchronisation
- **Timeline unique**: Naviguez sans couture à travers plusieurs clips vidéo
- **Support six caméras**: Les véhicules HW4 supportent les caméras gauche et droite du pilier B (bientôt disponible)

### Contrôles de lecture avancés
- **Navigation timeline**: Parcourez votre session dashcam entière
- **Contrôle de vitesse de lecture**: Ajustez la vitesse de 0.1x à 1x
- **Navigation image par image**: Navigation précise pour une analyse détaillée
- **Raccourcis clavier**: Accès rapide à toutes les fonctions

### Amélioration vidéo
- **Optimisation plaque d'immatriculation**: Appuyez sur `F` pour basculer le contraste amélioré et la netteté
- **Filtres vidéo**: Ajustements de luminosité, contraste, saturation
- **Mode plein écran**: Cliquez sur n'importe quelle caméra ou utilisez les touches numériques (1-4)

### Expérience utilisateur
- **Glisser-déposer**: Glissez simplement votre dossier d'enregistrements Tesla dans le navigateur
- **Support 10 langues**: Français, coréen, anglais et 7 autres interfaces linguistiques
- **Thème sombre**: Optimisé pour le visionnage vidéo
- **Design réactif**: Fonctionne sur toutes les tailles d'écran

## 🎯 Démarrage rapide

### Utilisation en ligne

**Visitez le site web**: https://geeksbaek.github.io/tesla-dashcam-viewer/

Aucune installation requise, utilisez directement dans le navigateur!

## 📁 Structure des fichiers Tesla Dashcam

Vos fichiers dashcam Tesla doivent suivre cette convention de nommage:
```
2024-01-15_14-30-25-front.mp4
2024-01-15_14-30-25-back.mp4
2024-01-15_14-30-25-left_repeater.mp4
2024-01-15_14-30-25-right_repeater.mp4
```

L'application groupe automatiquement les fichiers par horodatage et les affiche comme des clips synchronisés.

## 🎮 Comment utiliser

### Charger des vidéos
1. **Glisser-déposer**: Déposez votre dossier dashcam Tesla entier dans le navigateur
2. **Parcourir les fichiers**: Cliquez sur le bouton "Parcourir les fichiers" pour sélectionner plusieurs fichiers vidéo
3. **Groupement automatique**: L'application organisera automatiquement les fichiers par horodatage

### Contrôles de navigation
- **Curseur timeline**: Cliquez et faites glisser pour sauter à n'importe quel point de votre enregistrement
- **Liste vidéo**: Cliquez sur n'importe quelle vidéo dans la barre latérale pour sauter à ce clip
- **Lecture/Pause**: Cliquez sur le bouton de lecture ou appuyez sur `Espace`

### Raccourcis clavier

#### Lecture
- `Espace` - Lecture/Pause
- `←` `→` - Recherche arrière/avant (5 secondes ou 1 image)
- `↑` `↓` - Clip vidéo précédent/suivant

#### Vues caméra
- `1` - Caméra avant plein écran
- `2` - Caméra arrière plein écran
- `3` - Répéteur droit plein écran
- `4` - Répéteur gauche plein écran

#### Amélioration vidéo
- `F` - Basculer le filtre de reconnaissance de plaque d'immatriculation (contraste élevé + niveaux de gris)

### Fonctions d'analyse vidéo

#### Mode plaque d'immatriculation (touche `F`)
Paramètres optimisés pour lire les plaques d'immatriculation:
- Contraste amélioré (150%)
- Conversion en niveaux de gris
- Netteté d'image
- Luminosité normale

#### Navigation image par image
1. Basculez vers le mode "Image" dans le panneau de contrôle
2. Utilisez les touches fléchées `←` `→` pour parcourir les images individuelles
3. Parfait pour analyser les incidents ou capturer des moments spécifiques

#### Analyse multi-caméra
- Voir les quatre angles de caméra simultanément
- Cliquez sur n'importe quelle caméra pour voir en plein écran
- Toutes les caméras restent parfaitement synchronisées

## 🛠️ Détails techniques

### Construit avec
- **React 19** - React moderne avec les dernières fonctionnalités
- **TypeScript** - Développement type-safe
- **Vite** - Outil de build rapide et serveur de dev
- **Mantine** - Bibliothèque de composants UI
- **Tailwind CSS** - Styling utility-first
- **i18next** - Internationalisation

### Exigences navigateur
- Navigateurs modernes supportant ES6+ et vidéo HTML5
- Chrome, Firefox, Safari, Edge (dernières versions)
- JavaScript activé
- RAM suffisante pour plusieurs flux vidéo

### Notes de performance
- Les vidéos sont chargées comme URLs d'objet pour une performance optimale
- La mémoire est automatiquement nettoyée lors du changement de clips
- Recommandé: 8GB+ RAM pour une lecture fluide 4-caméras

## 🐛 Dépannage

### Problèmes courants

**Les vidéos ne se chargent pas**
- Vérifiez que le nommage des fichiers correspond au format Tesla: `YYYY-MM-DD_HH-MM-SS-[camera].mp4`
- Assurez-vous que les fichiers sont des vidéos MP4 valides
- Essayez d'abord avec un ensemble de fichiers plus petit

**Performance médiocre**
- Fermez les autres onglets du navigateur
- Utilisez Chrome pour de meilleures performances
- Réduisez la qualité vidéo si disponible
- Assurez-vous d'avoir suffisamment de RAM (8GB+ recommandé)

**Problèmes de synchronisation**
- Toutes les vidéos dans un groupe d'horodatage doivent avoir la même durée
- Vérifiez que les fichiers vidéo ne sont pas corrompus
- Essayez de recharger la page

### Compatibilité navigateur
- **Chrome**: Support complet (recommandé)
- **Firefox**: Support complet
- **Safari**: Support complet
- **Edge**: Support complet
- **Navigateurs mobiles**: Support limité (performance)

## 📄 Licence

Ce projet est open source. Veuillez vérifier le fichier LICENSE pour les détails.

## 🤝 Contribuer

Les contributions sont les bienvenues! N'hésitez pas à soumettre une Pull Request.

## 🙏 Remerciements

- Tesla pour créer un système dashcam incroyable
- La communauté open source pour les excellents outils et bibliothèques
- Les contributeurs qui aident à améliorer ce projet

---

**Note**: Cette application fonctionne entièrement dans votre navigateur. Aucune donnée vidéo n'est téléchargée ou partagée extérieurement. Votre confidentialité et sécurité des données sont maintenues en tout temps.