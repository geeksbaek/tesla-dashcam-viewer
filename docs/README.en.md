# Tesla Dashcam Viewer

A modern web application for viewing and analyzing Tesla dashcam footage with synchronized multi-camera playback. Built with React, TypeScript, and Vite.

![Tesla Dashcam Viewer Main Screen](../images/screenshot-main.png)
![Tesla Dashcam Viewer Player Screen](../images/screenshot-player.png)

## 🌐 Other Languages
- **English** | [한국어](../README.md) | [中文](docs/README.zh.md) | [Deutsch](docs/README.de.md) | [Norsk](docs/README.nb.md) | [Nederlands](docs/README.nl.md) | [Français](docs/README.fr.md) | [Svenska](docs/README.sv.md) | [Dansk](docs/README.da.md) | [Español](docs/README.es.md)

## 🚗 Features

### Multi-Camera Synchronization
- **4-channel/6-channel camera support**: Front, back, left repeater, right repeater + HW4 left/right pillar cameras
- **Perfect synchronization**: All cameras play in perfect sync
- **Single timeline**: Navigate through multiple video clips seamlessly

### Advanced Playback Controls
- **Timeline navigation**: Scrub through your entire dashcam session
- **Playback speed control**: Adjust speed from 0.1x to 1x
- **Frame-by-frame stepping**: Precise navigation for detailed analysis
- **Keyboard shortcuts**: Quick access to all functions

### Video Enhancement
- **License plate optimization**: Press `F` to toggle enhanced contrast and sharpening
- **Video filters**: Brightness, contrast, saturation adjustments
- **Video fit modes**: Cover/Contain mode selection
- **Fullscreen mode**: Click any camera or use number keys (1-6)

### User Experience
- **Drag & drop**: Simply drag your Tesla footage folder into the browser
- **10-language support**: Korean, English, Chinese and 7 other language interfaces
- **Dark theme**: Optimized for video viewing
- **Responsive design**: Works on all screen sizes
- **PWA support**: Offline capable, installable as an app
- **Real-time timestamp**: Shows exact playback time

## 🎯 Online Usage

**Visit the website**: https://geeksbaek.github.io/tesla-dashcam-viewer/

No installation required, use directly in browser!

## 📁 Tesla Dashcam File Structure

Your Tesla dashcam files should follow this naming convention:

### HW3 Vehicles (4-channel)
```
2024-01-15_14-30-25-front.mp4
2024-01-15_14-30-25-back.mp4
2024-01-15_14-30-25-left_repeater.mp4
2024-01-15_14-30-25-right_repeater.mp4
```

### HW4 Vehicles (6-channel)
```
2024-01-15_14-30-25-front.mp4
2024-01-15_14-30-25-back.mp4
2024-01-15_14-30-25-left_repeater.mp4
2024-01-15_14-30-25-right_repeater.mp4
2024-01-15_14-30-25-left_pillar.mp4    # HW4 additional camera
2024-01-15_14-30-25-right_pillar.mp4   # HW4 additional camera
```

The app automatically groups files by timestamp and displays them as synchronized clips.

## 🎮 How to Use

### Loading Videos
1. **Drag and drop**: Drop your entire Tesla dashcam folder into the browser
2. **Browse files**: Click the "Browse Files" button to select multiple video files
3. **Automatic grouping**: The app will automatically organize files by timestamp

### Navigation Controls
- **Timeline slider**: Click and drag to jump to any point in your footage
- **Video list**: Click any video in the sidebar to jump to that clip
- **Play/Pause**: Click the play button or press `Space`

### Keyboard Shortcuts

#### Playback
- `Space` - Play/Pause
- `←` `→` - Seek backward/forward (5 seconds or 1 frame)
- `↑` `↓` - Previous/Next video clip

#### Camera Views
- `1` - Fullscreen front camera
- `2` - Fullscreen back camera  
- `3` - Fullscreen right repeater
- `4` - Fullscreen left repeater
- `5` - Fullscreen left pillar (HW4 only)
- `6` - Fullscreen right pillar (HW4 only)

#### Video Enhancement
- `F` - Toggle license plate recognition filter (high contrast + grayscale)

### Video Analysis Features

#### License Plate Mode (`F` key)
Optimized settings for reading license plates:
- Enhanced contrast (150%)
- Grayscale conversion
- Image sharpening
- Normal brightness

#### Frame-by-Frame Navigation
1. Switch to "Frame" mode in the control panel
2. Use `←` `→` arrow keys to step through individual frames
3. Perfect for analyzing incidents or capturing specific moments

#### Multi-Camera Analysis
- View 4-6 camera angles simultaneously (HW3: 4-channel, HW4: 6-channel)
- Click any camera to view in fullscreen
- All cameras remain perfectly synchronized
- Real-time timestamp for accurate incident timing

## 🛠️ Technical Details

### Built With
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Mantine** - UI component library
- **Tailwind CSS** - Utility-first styling
- **i18next** - Internationalization
- **PWA (Progressive Web App)** - Offline support and app installation

### Browser Requirements
- Modern browsers supporting ES6+ and HTML5 video
- Chrome, Firefox, Safari, Edge (latest versions)
- JavaScript enabled
- Sufficient RAM for multiple video streams

### Performance Notes
- Videos are loaded as object URLs for optimal performance
- Memory is automatically cleaned up when switching clips
- Recommended:
  - HW3 (4-camera): 8GB+ RAM
  - HW4 (6-camera): 16GB+ RAM


## 🐛 Troubleshooting

### Common Issues

**Videos won't load**
- Check file naming matches Tesla format: `YYYY-MM-DD_HH-MM-SS-[camera].mp4`
- Ensure files are valid MP4 videos
- Try with a smaller set of files first

**Poor performance**
- Close other browser tabs
- Use Chrome for best performance
- Reduce video quality if available
- Ensure sufficient RAM (8GB+ recommended)

**Synchronization issues**
- All videos in a timestamp group should have the same duration
- Check that video files aren't corrupted
- Try reloading the page

### Browser Compatibility
- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile browsers**: Limited support (performance)

## 📄 License

This project is open source. Please check the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Tesla for creating an amazing dashcam system
- The open source community for the excellent tools and libraries
- Contributors who help make this project better

---

**Note**: This application runs entirely in your browser. No video data is uploaded or shared externally. Your privacy and data security are maintained at all times.