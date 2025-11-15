// Canvas Animation Configuration
// Customize the particle animation behavior and appearance

const CanvasConfig = {
    // Particle Settings
    particles: {
        maxCount: 800,                    // Maximum number of particles on screen
        baseSize: { min: 2, max: 8 },     // Particle size range (regular particles)
        spawnOnHover: true,               // Enable shape formation on hover
        avoidMouse: true,                 // Particles avoid mouse cursor
        mouseAvoidanceRadius: 120,        // Distance particles avoid mouse
    },
    
    // Rain Effect Settings
    rain: {
        enabled: true,                    // Rain effect on by default
        maxDrops: 120,                    // Maximum number of rain drops
        spawnRate: 0.4,                   // Rain spawn rate (lower = more consistent)
        dropSize: { min: 0.5, max: 5.5 }, // Rain drop size range
        fallSpeed: { min: 2, max: 5 },    // Rain drop falling speed range
        trailLength: { min: 3, max: 9 },  // Rain drop trail length range
        formShapeChance: 0.008,           // Probability of rain forming shapes (0-1)
        dissolveShapeChance: 0.005,       // Probability of dissolving rain formations (0-1)
    },
    
    // Shape Formation Settings
    shapes: {
        hoverThreshold: 3000,             // Milliseconds to hover before forming shape
        formationRadius: 1000,            // Radius to collect particles for shape
        minParticles: 10,                 // Minimum particles needed to form shape
        maxParticles: 40,                 // Maximum particles used in shape
        shapeRadius: 120,                 // Size of formed shapes
        lifetime: 45000,                  // Shape lifetime in milliseconds (45 seconds)
        types: [                          // Available shape types
            'circle', 'star', 'spiral', 'grid', 'hexagon', 'heart',
            'square', 'pentagon', 'triangle', 'diamond', 'wave', 'infinity'
        ],
    },
    
    // Implosion/Explosion Settings
    implosion: {
        defaultCount: 12,                 // Default particle count for click
        ctrlClickCount: 20,               // Particle count for Ctrl+click
        doubleClickCount: 25,             // Particle count for double-click
        spacebarCount: 15,                // Particle count for spacebar (per burst)
        spacebarBursts: 5,                // Number of bursts for spacebar
        defaultRadius: 200,               // Default implosion radius
        ctrlClickRadius: 300,             // Ctrl+click implosion radius
        defaultStrength: 4,               // Default implosion strength
        ctrlClickStrength: 6,             // Ctrl+click implosion strength
        damageRadius: 120,                // Radius that breaks formations
        particleSize: { min: 2, max: 6 }, // Implosion particle size range
    },
    
    // Color Schemes
    colors: {
        // Regular particle colors
        particles: [
            'rgba(255, 255, 255, ',      // White
            'rgba(59, 130, 246, ',       // Blue
            'rgba(34, 211, 238, ',       // Cyan
            'rgba(148, 163, 184, ',      // Slate
            'rgba(249, 115, 22, '        // Orange accent
        ],
        
        // Rain drop colors (light blue shades)
        rain: [
            'rgba(100, 200, 255, ',      // Light blue
            'rgba(120, 180, 255, ',      // Sky blue
            'rgba(80, 190, 255, ',       // Bright light blue
            'rgba(90, 210, 255, '        // Cyan-ish blue
        ],
        
        // Implosion particle colors (blue/white)
        implosion: [
            'rgba(100, 200, 255, ',      // Light blue
            'rgba(150, 220, 255, ',      // Bright blue
            'rgba(200, 230, 255, ',      // Very light blue
            'rgba(255, 255, 255, '       // White
        ],
        
        // Connection lines
        connectionLine: 'rgba(59, 130, 246, ',  // Blue (alpha added dynamically)
        hoverIndicator: 'rgba(59, 130, 246, ',  // Blue (alpha added dynamically)
        ripple: 'rgba(59, 130, 246, ',          // Blue (alpha added dynamically)
    },
    
    // Physics Settings
    physics: {
        gravity: 0.05,                    // Gravity strength for particles
        airResistance: 0.99,              // Air resistance (0.9 = 10% resistance)
        springForce: 0.05,                // Spring force for formations
        rainSpringForce: 0.03,            // Spring force for rain in formation
        damping: 0.85,                    // Velocity damping in formations
        rainDamping: 0.95,                // Velocity damping for rain
    },
    
    // Connection Lines
    connections: {
        enabled: true,                    // Draw lines between particles
        maxDistance: 100,                 // Maximum distance to draw connections
        formationMaxDistance: 150,        // Max distance when in formation
        opacity: 0.3,                     // Base connection opacity
        formationOpacity: 0.6,            // Opacity when in formation
        formationLineWidth: 2,            // Line width for formation connections
        regularLineWidth: 1,              // Line width for regular connections
    },
    
    // Canvas Settings
    canvas: {
        fadeTrailOpacity: 0.8,            // Background fade trail opacity (higher = faster fade)
        backgroundColor: 'rgba(15, 23, 42, ', // Background color (alpha added with fadeTrailOpacity)
        glowEnabled: true,                // Enable particle glow effects
        glowBlur: 15,                     // Glow blur amount
        rainGlowBlur: 20,                 // Rain glow blur amount
        heroHeight: '35vh',               // Hero section height (CSS value: '25vh', '600px', etc.)
        heroMinHeight: '200px',           // Minimum hero height
        heroMaxHeight: '420px',           // Maximum hero height (fixed cap for consistency)
    },
    
    // Keyboard Controls
    controls: {
        spacebarExplosion: true,          // Enable spacebar for multiple explosions
        clearAll: 'c',                    // Key to clear all particles
        dissolveShapes: 'd',              // Key to dissolve all shapes
        toggleRain: 'r',                  // Key to toggle rain effect
    },
    
    // Performance Settings
    performance: {
        optimizeConnections: true,        // Skip connections when too many particles
        connectionOptimizeThreshold: 200, // Particle count to start optimizing
        connectionSkipStep: 2,            // Check every Nth particle when optimizing
        hideConnectionsThreshold: 300,    // Hide connections above this particle count
    },
    
    // UI Element Settings (Non-Canvas)
    uiElements: {
        // Spinning logo shape (in front of "Developer Portfolio" text)
        spinningLogo: {
            enabled: true,                // Enable/disable spinning logo shape
            size: 40,                     // Size in pixels (width and height)
            offsetX: -65,                 // Horizontal offset from title (negative = left)
            offsetY: -20,                 // Vertical offset from title center
            rotationSpeed: 100,            // Rotation speed in seconds (higher = slower)
            morphInterval: { min: 8000, max: 15000 }, // Time between shape changes (ms)
            initialDelay: { min: 3000, max: 8000 },   // Initial delay before first morph (ms)
            glowOnMorph: true,            // Extra glow effect during morph
            glitchChance: 0.3,            // Chance of glitch effect (0-1)
        },
        
        // Large morphing background shapes
        backgroundShapes: {
            enabled: true,                // Enable/disable background shapes
            count: 4,                     // Number of shapes (1-2 supported)
            size: 1200,                   // Size in pixels
            positions: [                  // Positions for each shape (x, y as percentage of size)
                { x: -0.5, y: -0.5 },     // Top-left corner
                { x: 1.5, y: -0.5 },      // Top-right corner (uncomment to add)

            ],
            moveSpeed: { min: 0.05, max: 0.1 },       // Movement speed range (subtle)
            morphInterval: { min: 5000, max: 12000 }, // Time between shape changes (ms)
        }
    }
};

// Make config globally available
if (typeof window !== 'undefined') {
    window.CanvasConfig = CanvasConfig;
}

