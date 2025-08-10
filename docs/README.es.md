# Tesla Dashcam Viewer

Una aplicación web moderna para ver y analizar grabaciones de dashcam Tesla con reproducción multi-cámara sincronizada. Construida con React, TypeScript y Vite.

![Tesla Dashcam Viewer Pantalla Principal](../images/screenshot-main.png)
![Tesla Dashcam Viewer Pantalla del Reproductor](../images/screenshot-player.png)

## 🌐 Otros idiomas
- [English](docs/README.en.md) | [한국어](../README.md) | [中文](docs/README.zh.md) | [Deutsch](docs/README.de.md) | [Norsk](docs/README.nb.md) | [Nederlands](docs/README.nl.md) | [Français](docs/README.fr.md) | [Svenska](docs/README.sv.md) | [Dansk](docs/README.da.md) | **Español**

## 🚗 Características

### Sincronización multi-cámara
- **Soporte de cámaras de 4 canales/6 canales**: Cámaras frontal, trasera, repetidor izquierdo y repetidor derecho + cámaras pilar izquierdo/derecho HW4
- **Sincronización perfecta**: Todas las cámaras reproducen en perfecta sincronía
- **Línea de tiempo única**: Navega sin problemas a través de múltiples clips de video

### Controles de reproducción avanzados
- **Navegación de línea de tiempo**: Desplázate por toda tu sesión de dashcam
- **Control de velocidad de reproducción**: Ajusta la velocidad de 0.1x a 1x
- **Navegación cuadro por cuadro**: Navegación precisa para análisis detallado
- **Atajos de teclado**: Acceso rápido a todas las funciones

### Mejora de video
- **Optimización de matrícula**: Presiona `F` para alternar contraste mejorado y nitidez
- **Filtros de video**: Ajustes de brillo, contraste, saturación
- **Modos de ajuste de video**: Selección de modo Cover/Contain
- **Modo pantalla completa**: Haz clic en cualquier cámara o usa teclas numéricas (1-6)

### Experiencia de usuario
- **Arrastrar y soltar**: Simplemente arrastra tu carpeta de grabaciones Tesla al navegador
- **Soporte de 10 idiomas**: Español, coreano, inglés y 7 interfaces de idiomas más
- **Tema oscuro**: Optimizado para visualización de video
- **Diseño responsivo**: Funciona en todos los tamaños de pantalla
- **Soporte PWA**: Capaz de funcionar sin conexión, instalable como aplicación
- **Marca de tiempo en tiempo real**: Muestra el tiempo de reproducción exacto

## 🎯 Inicio rápido

### Usar en línea

**Visita el sitio web**: https://geeksbaek.github.io/tesla-dashcam-viewer/

¡No se requiere instalación, úsalo directamente en el navegador!

## 📁 Estructura de archivos Tesla Dashcam

Tus archivos de dashcam Tesla deben seguir esta convención de nomenclatura:

### Vehículos HW3 (4 canales)
```
2024-01-15_14-30-25-front.mp4
2024-01-15_14-30-25-back.mp4
2024-01-15_14-30-25-left_repeater.mp4
2024-01-15_14-30-25-right_repeater.mp4
```

### Vehículos HW4 (6 canales)
```
2024-01-15_14-30-25-front.mp4
2024-01-15_14-30-25-back.mp4
2024-01-15_14-30-25-left_repeater.mp4
2024-01-15_14-30-25-right_repeater.mp4
2024-01-15_14-30-25-left_pillar.mp4    # Cámara adicional HW4
2024-01-15_14-30-25-right_pillar.mp4   # Cámara adicional HW4
```

La aplicación agrupa automáticamente los archivos por marca de tiempo y los muestra como clips sincronizados.

## 🎮 Cómo usar

### Cargar videos
1. **Arrastrar y soltar**: Suelta toda tu carpeta de dashcam Tesla en el navegador
2. **Examinar archivos**: Haz clic en el botón "Examinar archivos" para seleccionar múltiples archivos de video
3. **Agrupación automática**: La aplicación organizará automáticamente los archivos por marca de tiempo

### Controles de navegación
- **Deslizador de línea de tiempo**: Haz clic y arrastra para saltar a cualquier punto en tu grabación
- **Lista de videos**: Haz clic en cualquier video en la barra lateral para saltar a ese clip
- **Reproducir/Pausar**: Haz clic en el botón de reproducción o presiona `Espacio`

### Atajos de teclado

#### Reproducción
- `Espacio` - Reproducir/Pausar
- `←` `→` - Buscar hacia atrás/adelante (5 segundos o 1 cuadro)
- `↑` `↓` - Clip de video anterior/siguiente

#### Vistas de cámara
- `1` - Cámara frontal pantalla completa
- `2` - Cámara trasera pantalla completa
- `3` - Repetidor derecho pantalla completa
- `4` - Repetidor izquierdo pantalla completa
- `5` - Pilar izquierdo pantalla completa (solo HW4)
- `6` - Pilar derecho pantalla completa (solo HW4)

#### Mejora de video
- `F` - Alternar filtro de reconocimiento de matrícula (alto contraste + escala de grises)

### Funciones de análisis de video

#### Modo matrícula (tecla `F`)
Configuraciones optimizadas para leer matrículas:
- Contraste mejorado (150%)
- Conversión a escala de grises
- Nitidez de imagen
- Brillo normal

#### Navegación cuadro por cuadro
1. Cambia al modo "Cuadro" en el panel de control
2. Usa las teclas de flecha `←` `→` para avanzar por cuadros individuales
3. Perfecto para analizar incidentes o capturar momentos específicos

#### Análisis multi-cámara
- Ver 4-6 ángulos de cámara simultáneamente (HW3: 4 canales, HW4: 6 canales)
- Haz clic en cualquier cámara para ver en pantalla completa
- Todas las cámaras se mantienen perfectamente sincronizadas
- Marca de tiempo en tiempo real para tiempos de incidente precisos

## 🛠️ Detalles técnicos

### Construido con
- **React 19** - React moderno con las últimas características
- **TypeScript** - Desarrollo type-safe
- **Vite** - Herramienta de construcción rápida y servidor de dev
- **Mantine** - Biblioteca de componentes UI
- **Tailwind CSS** - Estilizado utility-first
- **i18next** - Internacionalización
- **PWA (Progressive Web App)** - Soporte sin conexión e instalación de aplicación

### Requisitos del navegador
- Navegadores modernos que soporten ES6+ y video HTML5
- Chrome, Firefox, Safari, Edge (últimas versiones)
- JavaScript habilitado
- RAM suficiente para múltiples streams de video

### Notas de rendimiento
- Los videos se cargan como URLs de objeto para rendimiento óptimo
- La memoria se limpia automáticamente al cambiar clips
- Recomendado:
  - HW3 (4 cámaras): 8GB+ RAM
  - HW4 (6 cámaras): 16GB+ RAM

## 🐛 Solución de problemas

### Problemas comunes

**Los videos no cargan**
- Verifica que la nomenclatura de archivos coincida con el formato Tesla: `YYYY-MM-DD_HH-MM-SS-[camera].mp4`
- Asegúrate de que los archivos sean videos MP4 válidos
- Prueba primero con un conjunto de archivos más pequeño

**Rendimiento pobre**
- Cierra otras pestañas del navegador
- Usa Chrome para mejor rendimiento
- Reduce la calidad del video si está disponible
- Asegúrate de tener RAM suficiente (8GB+ recomendado)

**Problemas de sincronización**
- Todos los videos en un grupo de marca de tiempo deben tener la misma duración
- Verifica que los archivos de video no estén corruptos
- Intenta recargar la página

### Compatibilidad del navegador
- **Chrome**: Soporte completo (recomendado)
- **Firefox**: Soporte completo
- **Safari**: Soporte completo
- **Edge**: Soporte completo
- **Navegadores móviles**: Soporte limitado (rendimiento)

## 📄 Licencia

Este proyecto es de código abierto. Por favor verifica el archivo LICENSE para detalles.

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Siéntete libre de enviar un Pull Request.

## 🙏 Agradecimientos

- Tesla por crear un sistema de dashcam increíble
- La comunidad de código abierto por las excelentes herramientas y bibliotecas
- Los contribuidores que ayudan a hacer este proyecto mejor

---

**Nota**: Esta aplicación funciona completamente en tu navegador. No se suben ni comparten datos de video externamente. Tu privacidad y seguridad de datos se mantienen en todo momento.