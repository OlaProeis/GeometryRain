# GeometryRain ✨

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.ecma-international.org/)
[![HTML5](https://img.shields.io/badge/HTML-5-orange.svg)](https://www.w3.org/html/)
[![CSS3](https://img.shields.io/badge/CSS-3-blue.svg)](https://www.w3.org/Style/CSS/)
[![Canvas](https://img.shields.io/badge/Canvas-API-green.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![Live Demo](https://img.shields.io/badge/demo-live-success.svg)](https://OlaProeis.github.io/GeometryRain/)

> **Where Particles Dance and Shapes Come Alive**

A mesmerizing, highly customizable interactive canvas animation featuring particle rain effects that dynamically form geometric shapes. Built with pure vanilla JavaScript and HTML5 Canvas.

## 🌟 [View Live Demo](https://OlaProeis.github.io/GeometryRain/)

![GeometryRain Demo](./demo.gif)
*Interactive particle animation with shape formations*

## ✨ Features

### 🌧️ Rain Effect System
- **Realistic Rain Particles**: Animated rain drops with trails and physics
- **Dynamic Rain Speed**: Variable fall speeds and trail lengths
- **Automatic Shape Formation**: Rain particles can spontaneously form geometric shapes
- **Shape Dissolution**: Formations dissolve naturally over time
- **Toggle Control**: Enable/disable rain effect on demand

### 🎨 Shape Formation System
- **12 Geometric Shapes**: Circle, Star, Spiral, Grid, Hexagon, Heart, Square, Pentagon, Triangle, Diamond, Wave, Infinity
- **Hover-to-Form**: Hold your mouse still to trigger shape formation
- **Smart Particle Collection**: Automatically gathers nearby particles
- **Formation Physics**: Smooth transitions with spring-based movement
- **Configurable Lifetime**: Shapes persist for a set duration before dissolving

### 💥 Interactive Effects
- **Click Implosion**: Create particle implosions with a single click
- **Double-Click Explosion**: Bigger burst with ripple effects
- **Ctrl+Click Enhancement**: Increased particle count and radius
- **Spacebar Fireworks**: Trigger multiple random explosions
- **Particle Avoidance**: Particles avoid your mouse cursor
- **Shift+Move Repulsion**: Enhanced particle repulsion when holding Shift

### 🎯 Dynamic UI Elements
- **Morphing Spinning Logo**: Animated shape that changes form periodically
- **Background Shapes**: Large floating shapes in the hero section
- **Glitch Effects**: Random visual glitches during shape transformations
- **Glow Effects**: Dynamic glow effects on particles and shapes

### 🔧 Extensive Configuration
- **150+ Configuration Options**: Fine-tune every aspect of the animation
- **Performance Controls**: Automatic optimization for different particle counts
- **Color Schemes**: Customizable color palettes for particles, rain, and effects
- **Physics Parameters**: Adjust gravity, air resistance, spring forces, and damping
- **Connection Lines**: Configurable particle connections with distance-based opacity

## 🚀 Quick Start

### Installation

1. Clone the repository:
```bash
git clone https://github.com/OlaProeis/GeometryRain.git
cd GeometryRain
```

2. Open `index.html` in your web browser or serve with a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

3. Open your browser to `http://localhost:8000`

### Basic Usage

Simply include the necessary files in your HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GeometryRain Demo</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="hero">
        <canvas id="animationCanvas"></canvas>
        <div class="hero-content">
            <h1 class="hero-title">Your Title</h1>
            <p class="hero-subtitle">Your Subtitle</p>
        </div>
    </header>

    <script src="canvas-config.js"></script>
    <script src="canvas-animation.js"></script>
</body>
</html>
```

## 🎮 Interactive Controls

| Action | Effect |
|--------|--------|
| **Click** | Create a small implosion effect |
| **Double-Click** | Create a larger explosion with ripples |
| **Ctrl+Click** | Enhanced implosion (more particles, larger radius) |
| **Spacebar** | Trigger 5 random firework bursts |
| **Hover (3s)** | Form a geometric shape from nearby particles |
| **C Key** | Clear all particles |
| **D Key** | Dissolve all formed shapes |
| **R Key** | Toggle rain effect on/off |

**Note:** The mouse cursor naturally repels particles as you move. Hold Shift while moving for stronger repulsion.

## ⚙️ Configuration

Edit `canvas-config.js` to customize the animation. Here are some key configuration sections:

### Particle Settings
```javascript
particles: {
    maxCount: 800,                    // Maximum particles on screen
    baseSize: { min: 2, max: 8 },     // Particle size range
    avoidMouse: true,                 // Particles avoid cursor
    mouseAvoidanceRadius: 120,        // Avoidance distance
}
```

### Rain Effect Settings
```javascript
rain: {
    enabled: true,                    // Enable rain effect
    maxDrops: 120,                    // Maximum rain drops
    spawnRate: 0.4,                   // Spawn rate (0-1)
    dropSize: { min: 0.5, max: 5.5 }, // Drop size range
    fallSpeed: { min: 2, max: 5 },    // Fall speed range
    formShapeChance: 0.008,           // Shape formation probability
}
```

### Shape Formation
```javascript
shapes: {
    hoverThreshold: 3000,             // MS to hover before shape forms
    formationRadius: 1000,            // Particle collection radius
    minParticles: 10,                 // Minimum particles for shape
    maxParticles: 40,                 // Maximum particles in shape
    shapeRadius: 120,                 // Size of formed shapes
    lifetime: 45000,                  // Shape duration (45 seconds)
    types: [                          // Available shape types
        'circle', 'star', 'spiral', 'grid', 'hexagon', 'heart',
        'square', 'pentagon', 'triangle', 'diamond', 'wave', 'infinity'
    ]
}
```

### Color Schemes
```javascript
colors: {
    particles: [
        'rgba(255, 255, 255, ',      // White
        'rgba(59, 130, 246, ',       // Blue
        'rgba(34, 211, 238, ',       // Cyan
        'rgba(148, 163, 184, ',      // Slate
        'rgba(249, 115, 22, '        // Orange
    ],
    rain: [
        'rgba(100, 200, 255, ',      // Light blue
        'rgba(120, 180, 255, ',      // Sky blue
        'rgba(80, 190, 255, ',       // Bright light blue
        'rgba(90, 210, 255, '        // Cyan-ish blue
    ]
}
```

### Performance Settings
```javascript
performance: {
    optimizeConnections: true,        // Auto-optimize connections
    connectionOptimizeThreshold: 200, // When to start optimizing
    connectionSkipStep: 2,            // Check every Nth particle
    hideConnectionsThreshold: 300,    // Hide above this count
}
```

## 🎨 Customization Examples

### Create a Calm, Minimalist Effect
```javascript
particles: {
    maxCount: 150,
    baseSize: { min: 1, max: 3 },
},
rain: {
    enabled: true,
    maxDrops: 30,
    spawnRate: 0.2,
}
```

### High-Energy Explosion Mode
```javascript
implosion: {
    defaultCount: 30,
    ctrlClickCount: 50,
    defaultRadius: 400,
    defaultStrength: 8,
}
```

### Disable Specific Features
```javascript
rain: {
    enabled: false,  // Turn off rain
},
connections: {
    enabled: false,  // Turn off connection lines
},
uiElements: {
    spinningLogo: {
        enabled: false,  // Disable spinning logo
    }
}
```

## 📁 Project Structure

```
GeometryRain/
├── index.html              # Main HTML file
├── styles.css              # Styling for hero section and UI elements
├── canvas-config.js        # Configuration file (150+ options)
├── canvas-animation.js     # Main animation engine
├── README.md               # This file
└── LICENSE                 # MIT License
```

## 🔍 How It Works

### Core Animation Loop
1. **Canvas Setup**: Creates a responsive canvas matching the hero section
2. **Particle Management**: Handles creation, updates, and removal of particles
3. **Rain System**: Spawns rain particles at the top, applies gravity and physics
4. **Shape Formation**: Detects hover events, collects particles, and forms shapes
5. **Physics Engine**: Applies forces (gravity, spring, damping) to all particles
6. **Connection System**: Draws lines between nearby particles
7. **Rendering**: Uses fade trails for smooth motion blur effect

### Shape Formation Algorithm
1. Detect mouse hover exceeding threshold (default: 1.5 seconds)
2. Find all particles within formation radius
3. Create additional particles if needed (minimum requirement)
4. Calculate target positions based on selected shape type
5. Assign each particle a target position
6. Apply spring physics to move particles to formation
7. Maintain formation for lifetime duration
8. Dissolve formation when lifetime expires

### Particle Physics
- **Gravity**: Constant downward force on particles
- **Air Resistance**: Velocity damping (99% of previous velocity)
- **Spring Force**: Pulls particles toward target positions in formations
- **Mouse Avoidance**: Repulsion force from cursor position
- **Collision Avoidance**: Particles maintain spacing through connections

## 🌟 Advanced Features

### Smart Performance Optimization
- Automatically reduces connection checks when particle count is high
- Hides connections entirely above threshold (300 particles)
- Uses step-based iteration to skip particle pairs

### Formation Lifetime Management
- Each formation tracks its creation time
- Automatically dissolves after configured lifetime
- Smooth transition from formation to free-floating state

### Interactive Explosions
- Damage radius breaks nearby formations
- Particles inherit momentum from explosion
- Multiple explosion forces can stack

## 🐛 Known Limitations

- Canvas size is tied to hero section dimensions
- Performance may degrade with 500+ particles on lower-end devices
- Shape formations require minimum particle count
- Mobile touch events not yet implemented

## 🚀 Deployment

### GitHub Pages (Recommended)

This project works perfectly with GitHub Pages for free hosting!

**Option 1: Automatic Deployment (Recommended)**

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Under "Build and deployment":
   - Source: Deploy from a branch
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`
4. Click Save
5. Your site will be live at: `https://OlaProeis.github.io/GeometryRain/`

**Option 2: Using gh-pages branch**

```bash
# Create and switch to gh-pages branch
git checkout -b gh-pages

# Push to GitHub
git push origin gh-pages

# Go to Settings → Pages and select gh-pages branch
```

**Option 3: Automated Deployment with GitHub Actions**

A workflow file is included in `.github/workflows/deploy.yml` for automatic deployment on every push.

### Other Hosting Options

- **Netlify**: Drag and drop the folder for instant deployment
- **Vercel**: Connect GitHub repo for automatic deployments
- **Cloudflare Pages**: Free hosting with excellent performance
- **Any Static Host**: Upload files via FTP/SFTP

## 🤝 Contributing

Contributions are welcome! Here are some ways you can help:

1. **Report Bugs**: Open an issue with reproduction steps
2. **Suggest Features**: Share ideas for new shapes or effects
3. **Submit PRs**: Add new features or fix bugs
4. **Improve Documentation**: Help make the docs clearer

### Development Setup
```bash
git clone https://github.com/OlaProeis/GeometryRain.git
cd GeometryRain
# Open index.html in your browser or use a local server
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by particle systems and generative art
- Built with vanilla JavaScript for maximum compatibility
- No external dependencies required

## 📧 Contact

Have questions or feedback? Feel free to open an issue or reach out!

---

**Made with ❤️ and JavaScript**

*Star ⭐ this repo if you found it helpful!*

