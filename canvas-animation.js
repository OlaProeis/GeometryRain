// Canvas Particle Animation for Hero Banner
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('animationCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Load configuration (with fallback defaults if config not loaded)
    const config = window.CanvasConfig || {
        particles: { maxCount: 800, baseSize: { min: 2, max: 8 }, avoidMouse: true, mouseAvoidanceRadius: 120 },
        rain: { enabled: true, maxDrops: 120, spawnRate: 0.4, dropSize: { min: 0.5, max: 2.5 }, fallSpeed: { min: 2, max: 5 }, trailLength: { min: 3, max: 9 }, formShapeChance: 0.008, dissolveShapeChance: 0.005 },
        shapes: { hoverThreshold: 1500, formationRadius: 200, minParticles: 10, maxParticles: 40, shapeRadius: 120, lifetime: 45000, types: ['circle', 'star', 'spiral', 'grid', 'hexagon', 'heart', 'square', 'pentagon', 'triangle', 'diamond', 'wave', 'infinity'] },
        implosion: { defaultCount: 12, ctrlClickCount: 20, doubleClickCount: 25, spacebarCount: 15, spacebarBursts: 5, defaultRadius: 200, ctrlClickRadius: 300, defaultStrength: 4, ctrlClickStrength: 6, damageRadius: 120, particleSize: { min: 2, max: 6 } },
        colors: { particles: ['rgba(255, 255, 255, ', 'rgba(59, 130, 246, ', 'rgba(34, 211, 238, ', 'rgba(148, 163, 184, ', 'rgba(249, 115, 22, '], rain: ['rgba(100, 200, 255, ', 'rgba(120, 180, 255, ', 'rgba(80, 190, 255, ', 'rgba(90, 210, 255, '], implosion: ['rgba(100, 200, 255, ', 'rgba(150, 220, 255, ', 'rgba(200, 230, 255, ', 'rgba(255, 255, 255, '], connectionLine: 'rgba(59, 130, 246, ', hoverIndicator: 'rgba(59, 130, 246, ', ripple: 'rgba(59, 130, 246, ' },
        physics: { gravity: 0.05, airResistance: 0.99, springForce: 0.05, rainSpringForce: 0.03, damping: 0.85, rainDamping: 0.95 },
        connections: { enabled: true, maxDistance: 100, formationMaxDistance: 150, opacity: 0.3, formationOpacity: 0.6, formationLineWidth: 2, regularLineWidth: 1 },
        canvas: { fadeTrailOpacity: 0.8, backgroundColor: 'rgba(15, 23, 42, ', glowEnabled: true, glowBlur: 15, rainGlowBlur: 20, heroHeight: '25vh', heroMinHeight: '280px', heroMaxHeight: '320px' },
        controls: { spacebarExplosion: true, clearAll: 'c', dissolveShapes: 'd', toggleRain: 'r' },
        performance: { optimizeConnections: true, connectionOptimizeThreshold: 200, connectionSkipStep: 2, hideConnectionsThreshold: 300 }
    };

    // Apply hero height settings from config
    const hero = document.querySelector('.hero');
    if (hero && config.canvas) {
        if (config.canvas.heroHeight) hero.style.height = config.canvas.heroHeight;
        if (config.canvas.heroMinHeight) hero.style.minHeight = config.canvas.heroMinHeight;
        if (config.canvas.heroMaxHeight) hero.style.maxHeight = config.canvas.heroMaxHeight;
    }

    let mouse = {
        x: null,
        y: null,
        isOverCanvas: false,
        lastX: null,
        lastY: null,
        hoverTime: 0,
        isHovering: false
    };

    let shapeFormation = {
        active: false,
        particles: []
    };

    let rain = {
        active: config.rain.enabled,
        particles: [],
        maxDrops: config.rain.maxDrops,
        spawnAccumulator: 0,
        spawnRate: config.rain.spawnRate
    };

    const HOVER_THRESHOLD = config.shapes.hoverThreshold;
    const SHAPE_TYPES = config.shapes.types;
    const EXPLOSION_DAMAGE_RADIUS = config.implosion.damageRadius;
    const FORMATION_LIFETIME = config.shapes.lifetime;
    let lastFrameTime = Date.now();

    let keys = {
        shift: false,
        control: false
    };

    // Track keyboard state
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Shift') keys.shift = true;
        if (e.key === 'Control') keys.control = true;
        
        // Easter eggs!
        if (config.controls.spacebarExplosion && e.code === 'Space') {
            e.preventDefault();
            for (let i = 0; i < config.implosion.spacebarBursts; i++) {
                setTimeout(() => {
                    const x = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height;
                    createExplosion(x, y, config.implosion.spacebarCount, config.implosion.defaultRadius, config.implosion.defaultStrength);
                }, i * 100);
            }
        }
        
        if (e.key.toLowerCase() === config.controls.clearAll) {
            particlesArray.length = 0;
            shapeFormation.active = false;
            shapeFormation.particles = [];
        }
        
        if (e.key.toLowerCase() === config.controls.dissolveShapes) {
            dissolveAllShapes();
        }
        
        if (e.key.toLowerCase() === config.controls.toggleRain) {
            rain.active = !rain.active;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'Shift') keys.shift = false;
        if (e.key === 'Control') keys.control = false;
    });

    // Track mouse position relative to canvas
    document.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const moved = mouse.lastX === null || 
                         Math.abs(x - mouse.lastX) > 5 || 
                         Math.abs(y - mouse.lastY) > 5;
            
            if (moved) {
                mouse.hoverTime = 0;
                mouse.isHovering = false;
            }
            
            mouse.lastX = mouse.x;
            mouse.lastY = mouse.y;
            mouse.x = x;
            mouse.y = y;
            mouse.isOverCanvas = true;
        } else {
            mouse.isOverCanvas = false;
            mouse.hoverTime = 0;
            mouse.isHovering = false;
        }
    });

    // Implosion effect on click
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        
        const particleCount = keys.control ? config.implosion.ctrlClickCount : config.implosion.defaultCount;
        const radius = keys.control ? config.implosion.ctrlClickRadius : config.implosion.defaultRadius;
        const strength = keys.control ? config.implosion.ctrlClickStrength : config.implosion.defaultStrength;
        createExplosion(clickX, clickY, particleCount, radius, strength);
    });

    // Double click for bigger implosion
    canvas.addEventListener('dblclick', (event) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        createExplosion(clickX, clickY, config.implosion.doubleClickCount, 250, 5);
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createRipple(clickX, clickY);
            }, i * 150);
        }
    });

    function resizeCanvas() {
        const hero = document.querySelector('.hero');
        if (hero) {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor(x, y, isExplosion = false, isRain = false) {
            this.x = x;
            this.y = y;
            this.targetX = null;
            this.targetY = null;
            this.inFormation = false;
            this.formationTime = null;
            this.isRainDrop = isRain;
            
            if (isRain) {
                this.size = Math.random() * (config.rain.dropSize.max - config.rain.dropSize.min) + config.rain.dropSize.min;
                this.baseSize = this.size;
                this.speedX = 0;
                this.speedY = Math.random() * (config.rain.fallSpeed.max - config.rain.fallSpeed.min) + config.rain.fallSpeed.min;
                this.life = 1;
                this.decay = 0.002;
                this.trail = [];
                this.trailLength = Math.floor(Math.random() * (config.rain.trailLength.max - config.rain.trailLength.min)) + config.rain.trailLength.min;
                
                this.colorBase = config.colors.rain[Math.floor(Math.random() * config.colors.rain.length)];
            } else if (isExplosion) {
                this.size = Math.random() * (config.implosion.particleSize.max - config.implosion.particleSize.min) + config.implosion.particleSize.min;
                this.baseSize = this.size;
                const angle = Math.random() * Math.PI * 2;
                const spawnDistance = Math.random() * 80 + 40;
                this.x = x + Math.cos(angle) * spawnDistance;
                this.y = y + Math.sin(angle) * spawnDistance;
                const speed = Math.random() * 3 + 2;
                this.speedX = -Math.cos(angle) * speed;
                this.speedY = -Math.sin(angle) * speed;
                this.life = 1;
                this.decay = Math.random() * 0.02 + 0.015;
                
                this.colorBase = config.colors.implosion[Math.floor(Math.random() * config.colors.implosion.length)];
            } else {
                this.size = Math.random() * (config.particles.baseSize.max - config.particles.baseSize.min) + config.particles.baseSize.min;
                this.baseSize = this.size;
                this.speedX = (Math.random() - 0.5) * 3;
                this.speedY = (Math.random() - 0.5) * 3;
                this.life = 1;
                this.decay = Math.random() * 0.015 + 0.01;
                
                this.colorBase = config.colors.particles[Math.floor(Math.random() * config.colors.particles.length)];
            }
        }

        update() {
            if (this.isRainDrop && this.trail) {
                this.trail.unshift({ x: this.x, y: this.y, opacity: this.life });
                if (this.trail.length > this.trailLength) {
                    this.trail.pop();
                }
            }
            
            if (this.inFormation && this.targetX !== null && this.targetY !== null) {
                const currentTime = Date.now();
                if (this.formationTime && (currentTime - this.formationTime) > FORMATION_LIFETIME) {
                    this.inFormation = false;
                    this.targetX = null;
                    this.targetY = null;
                    this.decay = 0.01;
                    this.formationTime = null;
                    return;
                }
                
                const dx = this.targetX - this.x;
                const dy = this.targetY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (mouse.isOverCanvas && mouse.x !== null && mouse.y !== null) {
                    const mdx = this.x - mouse.x;
                    const mdy = this.y - mouse.y;
                    const mdistance = Math.sqrt(mdx * mdx + mdy * mdy);
                    const maxDistance = 100;
                    
                    if (mdistance < maxDistance && mdistance > 0) {
                        const force = (maxDistance - mdistance) / maxDistance;
                        const avoidanceStrength = keys.shift ? 0.5 : 0.25;
                        this.speedX += (mdx / mdistance) * force * avoidanceStrength;
                        this.speedY += (mdy / mdistance) * force * avoidanceStrength;
                    }
                }
                
                if (distance > 2) {
                    const springForce = this.isRainDrop ? 0.03 : 0.05;
                    this.speedX += dx * springForce;
                    this.speedY += dy * springForce;
                    
                    this.x += this.speedX;
                    this.y += this.speedY;
                    
                    if (this.isRainDrop) {
                        this.speedY += 0.1;
                    }
                    
                    this.speedX *= 0.85;
                    this.speedY *= this.isRainDrop ? 0.95 : 0.85;
                } else {
                    this.x += this.speedX;
                    this.y += this.speedY;
                    
                    if (this.isRainDrop) {
                        this.speedY += 0.1;
                    }
                    
                    this.speedX *= 0.9;
                    this.speedY *= this.isRainDrop ? 0.95 : 0.9;
                }
                
                if (this.isRainDrop && this.y > this.targetY + 100) {
                    this.inFormation = false;
                    this.targetX = null;
                    this.targetY = null;
                    this.decay = 0.008;
                }
                
                this.life = Math.min(1, this.life + 0.005);
                this.size = this.baseSize * Math.min(this.life, 1);
            } else {
                if (mouse.isOverCanvas && mouse.x !== null && mouse.y !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const maxDistance = 120;
                    
                    if (distance < maxDistance && distance > 0) {
                        const force = (maxDistance - distance) / maxDistance;
                        const avoidanceStrength = keys.shift ? 0.8 : 0.4;
                        this.speedX += (dx / distance) * force * avoidanceStrength;
                        this.speedY += (dy / distance) * force * avoidanceStrength;
                    }
                }
                
                this.x += this.speedX;
                this.y += this.speedY;
                this.life -= this.decay;
                
                if (!this.isRainDrop) {
                    this.speedY += 0.05;
                }
                
                this.speedX *= 0.99;
                this.speedY *= 0.99;
            }
            
            this.size = Math.max(0, this.baseSize * this.life);
        }

        draw() {
            if (this.size <= 0.1) return;
            
            if (this.isRainDrop && this.trail) {
                for (let i = 0; i < this.trail.length; i++) {
                    const t = this.trail[i];
                    const trailOpacity = (1 - i / this.trail.length) * t.opacity * 0.5;
                    ctx.fillStyle = this.colorBase + trailOpacity + ')';
                    ctx.fillRect(t.x - 1, t.y, 2, 4);
                }
            }
            
            ctx.fillStyle = this.colorBase + (this.life * 0.8) + ')';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            if (config.canvas.glowEnabled) {
                ctx.shadowBlur = this.isRainDrop ? config.canvas.rainGlowBlur : config.canvas.glowBlur;
                ctx.shadowColor = this.colorBase + '0.5)';
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }

    class Ripple {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = 0;
            this.maxRadius = 200;
            this.speed = 5;
            this.opacity = 1;
        }

        update() {
            this.radius += this.speed;
            this.opacity = 1 - (this.radius / this.maxRadius);
        }

        draw() {
            if (this.opacity <= 0) return;
            
            ctx.strokeStyle = config.colors.ripple + (this.opacity * 0.5) + ')';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.stroke();
        }

        isDead() {
            return this.radius >= this.maxRadius;
        }
    }

    const particlesArray = [];
    const ripplesArray = [];
    const explosionForces = [];

    function createExplosion(x, y, particleCount = 12, radius = 200, strength = 4) {
        for (let i = 0; i < particleCount; i++) {
            particlesArray.push(new Particle(x, y, true, false));
        }
        
        explosionForces.push({
            x: x,
            y: y,
            radius: radius,
            strength: -strength,
            life: 1,
            decay: 0.05
        });
        
        particlesArray.forEach(particle => {
            if (particle.inFormation) {
                const dx = particle.x - x;
                const dy = particle.y - y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < EXPLOSION_DAMAGE_RADIUS) {
                    particle.inFormation = false;
                    particle.targetX = null;
                    particle.targetY = null;
                    particle.decay = 0.015;
                    
                    const angle = Math.atan2(dy, dx);
                    const force = (1 - distance / EXPLOSION_DAMAGE_RADIUS) * 4;
                    particle.speedX += -Math.cos(angle) * force;
                    particle.speedY += -Math.sin(angle) * force;
                }
            }
        });
    }

    function applyExplosionForces() {
        for (let i = explosionForces.length - 1; i >= 0; i--) {
            const explosion = explosionForces[i];
            
            particlesArray.forEach(particle => {
                const dx = particle.x - explosion.x;
                const dy = particle.y - explosion.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < explosion.radius && distance > 0) {
                    const force = (1 - distance / explosion.radius) * explosion.strength * explosion.life;
                    particle.speedX += (dx / distance) * force;
                    particle.speedY += (dy / distance) * force;
                }
            });
            
            explosion.life -= explosion.decay;
            
            if (explosion.life <= 0) {
                explosionForces.splice(i, 1);
            }
        }
    }

    function handleRain() {
        if (!rain.active) return;
        
        rain.spawnAccumulator += rain.spawnRate;
        
        while (rain.spawnAccumulator >= 1 && rain.particles.length < rain.maxDrops) {
            const x = Math.random() * canvas.width;
            const raindrop = new Particle(x, -10, false, true);
            rain.particles.push(raindrop);
            particlesArray.push(raindrop);
            rain.spawnAccumulator -= 1;
        }
        
        if (Math.random() < config.rain.formShapeChance && rain.particles.length > 25) {
            const centerX = Math.random() * canvas.width;
            const centerY = Math.random() * (canvas.height * 0.6) + canvas.height * 0.2;
            
            const nearbyRain = rain.particles.filter(p => {
                const dx = p.x - centerX;
                const dy = p.y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance < 150 && !p.inFormation && particlesArray.includes(p);
            }).slice(0, 25);
            
            if (nearbyRain.length > 10) {
                const shapeType = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];
                const positions = getShapePositions(shapeType, centerX, centerY, nearbyRain.length);
                
                nearbyRain.forEach((particle, i) => {
                    particle.inFormation = true;
                    particle.formationTime = Date.now();
                    particle.targetX = positions[i].x;
                    particle.targetY = positions[i].y;
                    particle.decay = 0.002;
                    particle.life = 1;
                });
                
                createRipple(centerX, centerY);
            }
        }
        
        if (Math.random() < config.rain.dissolveShapeChance) {
            const formationDrops = rain.particles.filter(p => p.inFormation && particlesArray.includes(p));
            if (formationDrops.length > 5) {
                const randomDrop = formationDrops[Math.floor(Math.random() * formationDrops.length)];
                const dissolveRadius = 80;
                
                formationDrops.forEach(p => {
                    const dx = p.x - randomDrop.x;
                    const dy = p.y - randomDrop.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < dissolveRadius) {
                        p.inFormation = false;
                        p.targetX = null;
                        p.targetY = null;
                        p.decay = 0.008;
                        p.speedX = (Math.random() - 0.5) * 0.5;
                    }
                });
            }
        }
        
        for (let i = rain.particles.length - 1; i >= 0; i--) {
            const drop = rain.particles[i];
            if (!particlesArray.includes(drop) || drop.y > canvas.height + 50) {
                rain.particles.splice(i, 1);
            }
        }
    }

    function createRipple(x, y) {
        ripplesArray.push(new Ripple(x, y));
    }

    function getShapePositions(shapeType, centerX, centerY, numPoints) {
        const positions = [];
        const radius = 120;
        
        switch(shapeType) {
            case 'circle':
                for (let i = 0; i < numPoints; i++) {
                    const angle = (i / numPoints) * Math.PI * 2;
                    positions.push({
                        x: centerX + Math.cos(angle) * radius,
                        y: centerY + Math.sin(angle) * radius
                    });
                }
                break;
                
            case 'star':
                const innerRadius = radius * 0.4;
                for (let i = 0; i < numPoints; i++) {
                    const angle = (i / numPoints) * Math.PI * 2;
                    const isOuter = i % 2 === 0;
                    const r = isOuter ? radius : innerRadius;
                    positions.push({
                        x: centerX + Math.cos(angle - Math.PI / 2) * r,
                        y: centerY + Math.sin(angle - Math.PI / 2) * r
                    });
                }
                break;
                
            case 'spiral':
                for (let i = 0; i < numPoints; i++) {
                    const progress = i / numPoints;
                    const angle = progress * Math.PI * 4;
                    const r = radius * progress;
                    positions.push({
                        x: centerX + Math.cos(angle) * r,
                        y: centerY + Math.sin(angle) * r
                    });
                }
                break;
                
            case 'grid':
                const gridSize = Math.ceil(Math.sqrt(numPoints));
                const spacing = (radius * 2) / gridSize;
                for (let i = 0; i < numPoints; i++) {
                    const row = Math.floor(i / gridSize);
                    const col = i % gridSize;
                    positions.push({
                        x: centerX - radius + col * spacing + spacing / 2,
                        y: centerY - radius + row * spacing + spacing / 2
                    });
                }
                break;
                
            case 'hexagon':
                for (let i = 0; i < numPoints; i++) {
                    const angle = (i / numPoints) * Math.PI * 2;
                    positions.push({
                        x: centerX + Math.cos(angle) * radius,
                        y: centerY + Math.sin(angle) * radius * 0.866
                    });
                }
                break;
                
            case 'heart':
                for (let i = 0; i < numPoints; i++) {
                    const t = (i / numPoints) * Math.PI * 2;
                    const scale = radius / 16;
                    const x = scale * 16 * Math.pow(Math.sin(t), 3);
                    const y = -scale * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
                    positions.push({
                        x: centerX + x,
                        y: centerY + y
                    });
                }
                break;
                
            case 'square':
                const squarePoints = Math.ceil(numPoints / 4);
                const side = radius * 2;
                for (let i = 0; i < squarePoints; i++) {
                    positions.push({
                        x: centerX - radius + (i / squarePoints) * side,
                        y: centerY - radius
                    });
                }
                for (let i = 0; i < squarePoints; i++) {
                    positions.push({
                        x: centerX + radius,
                        y: centerY - radius + (i / squarePoints) * side
                    });
                }
                for (let i = 0; i < squarePoints; i++) {
                    positions.push({
                        x: centerX + radius - (i / squarePoints) * side,
                        y: centerY + radius
                    });
                }
                for (let i = 0; i < squarePoints; i++) {
                    positions.push({
                        x: centerX - radius,
                        y: centerY + radius - (i / squarePoints) * side
                    });
                }
                break;
                
            case 'pentagon':
                for (let i = 0; i < numPoints; i++) {
                    const angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
                    positions.push({
                        x: centerX + Math.cos(angle) * radius,
                        y: centerY + Math.sin(angle) * radius
                    });
                }
                break;
                
            case 'triangle':
                const trianglePoints = Math.ceil(numPoints / 3);
                for (let side = 0; side < 3; side++) {
                    const angle = (side * Math.PI * 2 / 3) - Math.PI / 2;
                    const nextAngle = ((side + 1) * Math.PI * 2 / 3) - Math.PI / 2;
                    const x1 = centerX + Math.cos(angle) * radius;
                    const y1 = centerY + Math.sin(angle) * radius;
                    const x2 = centerX + Math.cos(nextAngle) * radius;
                    const y2 = centerY + Math.sin(nextAngle) * radius;
                    
                    for (let i = 0; i < trianglePoints; i++) {
                        const t = i / trianglePoints;
                        positions.push({
                            x: x1 + (x2 - x1) * t,
                            y: y1 + (y2 - y1) * t
                        });
                    }
                }
                break;
                
            case 'diamond':
                const diamondPoints = Math.ceil(numPoints / 4);
                for (let i = 0; i < diamondPoints; i++) {
                    const t = i / diamondPoints;
                    positions.push({
                        x: centerX - radius + radius * t,
                        y: centerY - radius / 2 + (radius / 2) * t
                    });
                }
                for (let i = 0; i < diamondPoints; i++) {
                    const t = i / diamondPoints;
                    positions.push({
                        x: centerX + radius * (1 - t),
                        y: centerY + (radius / 2) * t
                    });
                }
                for (let i = 0; i < diamondPoints; i++) {
                    const t = i / diamondPoints;
                    positions.push({
                        x: centerX - radius * t,
                        y: centerY + radius / 2 - (radius / 2) * t
                    });
                }
                for (let i = 0; i < diamondPoints; i++) {
                    const t = i / diamondPoints;
                    positions.push({
                        x: centerX - radius + radius * t,
                        y: centerY - (radius / 2) * t
                    });
                }
                break;
                
            case 'wave':
                for (let i = 0; i < numPoints; i++) {
                    const x = (i / numPoints) * radius * 2 - radius;
                    const y = Math.sin((i / numPoints) * Math.PI * 4) * (radius / 3);
                    positions.push({
                        x: centerX + x,
                        y: centerY + y
                    });
                }
                break;
                
            case 'infinity':
                for (let i = 0; i < numPoints; i++) {
                    const t = (i / numPoints) * Math.PI * 2;
                    const scale = radius / 2;
                    positions.push({
                        x: centerX + scale * Math.sin(t) * 2,
                        y: centerY + scale * Math.sin(t) * Math.cos(t)
                    });
                }
                break;
        }
        
        return positions;
    }

    function formShape() {
        const nearbyParticles = particlesArray.filter(p => {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < config.shapes.formationRadius && !p.inFormation;
        }).slice(0, config.shapes.maxParticles);
        
        // If we don't have enough particles, create new ones to complete the shape
        const minParticles = config.shapes.minParticles;
        const particlesToCreate = Math.max(0, minParticles - nearbyParticles.length);
        
        // Create additional particles if needed
        for (let i = 0; i < particlesToCreate; i++) {
            const angle = (Math.PI * 2 * i) / particlesToCreate;
            const radius = Math.random() * (config.shapes.formationRadius * 0.5);
            const newParticle = new Particle(
                mouse.x + Math.cos(angle) * radius,
                mouse.y + Math.sin(angle) * radius
            );
            particlesArray.push(newParticle);
            nearbyParticles.push(newParticle);
        }
        
        if (!shapeFormation.active) {
            shapeFormation.active = true;
        }
        
        shapeFormation.particles.push(...nearbyParticles);
        
        const shapeType = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];
        const positions = getShapePositions(shapeType, mouse.x, mouse.y, nearbyParticles.length);
        
        nearbyParticles.forEach((particle, i) => {
            particle.inFormation = true;
            particle.formationTime = Date.now();
            particle.targetX = positions[i].x;
            particle.targetY = positions[i].y;
            particle.decay = 0.003;
            particle.life = 1;
        });
        
        createRipple(mouse.x, mouse.y);
    }

    function dissolveAllShapes() {
        particlesArray.forEach(particle => {
            if (particle.inFormation) {
                particle.inFormation = false;
                particle.targetX = null;
                particle.targetY = null;
                particle.speedX = (Math.random() - 0.5) * 1;
                particle.speedY = (Math.random() - 0.5) * 1;
                particle.decay = 0.008;
            }
        });
        
        shapeFormation.active = false;
        shapeFormation.particles = [];
    }

    function drawConnections() {
        const maxDistance = shapeFormation.active ? config.connections.formationMaxDistance : config.connections.maxDistance;
        const connectionOpacity = shapeFormation.active ? config.connections.formationOpacity : config.connections.opacity;
        const step = config.performance.optimizeConnections && particlesArray.length > config.performance.connectionOptimizeThreshold ? config.performance.connectionSkipStep : 1;
        
        for (let i = 0; i < particlesArray.length; i += step) {
            const p1 = particlesArray[i];
            
            for (let j = i + 1; j < particlesArray.length; j += step) {
                const p2 = particlesArray[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * connectionOpacity;
                    const lineOpacity = (p1.inFormation || p2.inFormation) ? opacity * 1.5 : opacity;
                    
                    ctx.strokeStyle = config.colors.connectionLine + Math.min(lineOpacity, 0.8) + ')';
                    ctx.lineWidth = (p1.inFormation && p2.inFormation) ? config.connections.formationLineWidth : config.connections.regularLineWidth;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }

    function handleParticles() {
        applyExplosionForces();
        handleRain();
        
        if (mouse.isOverCanvas && !keys.shift) {
            const currentTime = Date.now();
            const deltaTime = currentTime - lastFrameTime;
            lastFrameTime = currentTime;
            
            if (mouse.x !== null && mouse.y !== null) {
                mouse.hoverTime += deltaTime;
                
                if (mouse.hoverTime >= HOVER_THRESHOLD && !mouse.isHovering) {
                    mouse.isHovering = true;
                    formShape();
                }
            }
        }

        for (let i = particlesArray.length - 1; i >= 0; i--) {
            particlesArray[i].update();
            particlesArray[i].draw();

            if (!particlesArray[i].inFormation && 
                (particlesArray[i].life <= 0 || particlesArray[i].size <= 0.1)) {
                particlesArray.splice(i, 1);
            }
        }
    }

    function handleRipples() {
        for (let i = ripplesArray.length - 1; i >= 0; i--) {
            ripplesArray[i].update();
            ripplesArray[i].draw();
            
            if (ripplesArray[i].isDead()) {
                ripplesArray.splice(i, 1);
            }
        }
    }

    function animate() {
        ctx.fillStyle = config.canvas.backgroundColor + config.canvas.fadeTrailOpacity + ')';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (config.connections.enabled && particlesArray.length > 5 && particlesArray.length < config.performance.hideConnectionsThreshold) {
            drawConnections();
        }
        
        if (mouse.isOverCanvas && mouse.hoverTime > 500 && mouse.hoverTime < HOVER_THRESHOLD) {
            const progress = mouse.hoverTime / HOVER_THRESHOLD;
            const radius = 60 * progress;
            ctx.strokeStyle = config.colors.hoverIndicator + (0.3 * progress) + ')';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        handleRipples();
        handleParticles();
        
        requestAnimationFrame(animate);
    }

    animate();

    // === UI ELEMENT CREATION (Spinning Logo & Background Shapes) ===
    
    function createFloatingShapes() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        // Create background shapes if enabled
        if (config.uiElements.backgroundShapes.enabled) {
            const shapesContainer = document.createElement('div');
            shapesContainer.className = 'floating-shapes';
            hero.appendChild(shapesContainer);
            
            const shapeSize = config.uiElements.backgroundShapes.size;
            const shapeObjects = [];
        
        // Use configured positions and count
        const positions = config.uiElements.backgroundShapes.positions.slice(0, config.uiElements.backgroundShapes.count).map(pos => ({
            x: shapeSize * pos.x,
            y: shapeSize * pos.y
        }));
        
        positions.forEach((pos, i) => {
            const shape = document.createElement('div');
            shape.className = 'floating-shape';
            shape.style.left = `${pos.x}px`;
            shape.style.top = `${pos.y}px`;
            
            const allInitialShapes = ['50%', '0%', '30%', '20%', '40% 60%', '30% 70%'];
            shape.style.borderRadius = allInitialShapes[Math.floor(Math.random() * allInitialShapes.length)];
            
            shapesContainer.appendChild(shape);
            
            const shapeObj = {
                element: shape,
                x: pos.x,
                y: pos.y,
                baseX: pos.x,
                baseY: pos.y,
                vx: (Math.random() - 0.5) * (config.uiElements.backgroundShapes.moveSpeed.max - config.uiElements.backgroundShapes.moveSpeed.min) + config.uiElements.backgroundShapes.moveSpeed.min,
                vy: (Math.random() - 0.5) * (config.uiElements.backgroundShapes.moveSpeed.max - config.uiElements.backgroundShapes.moveSpeed.min) + config.uiElements.backgroundShapes.moveSpeed.min,
                size: shapeSize,
                corner: i
            };
            
            shapeObjects.push(shapeObj);
            startMorphing(shape);
        });
        
        // Always start movement system if there are shapes
        if (shapeObjects.length > 0) {
            startShapeMovement(shapeObjects, hero);
        }
    }
    
    // Always create spinning logo if enabled (independent of background shapes)
    if (config.uiElements.spinningLogo.enabled) {
        createSpinningShape(hero);
    }
}
    
    function createSpinningShape(hero) {
        const heroContent = hero.querySelector('.hero-content');
        const spinShape = document.createElement('div');
        spinShape.className = 'spinning-shape';
        
        // Apply configured size
        spinShape.style.width = `${config.uiElements.spinningLogo.size}px`;
        spinShape.style.height = `${config.uiElements.spinningLogo.size}px`;
        spinShape.style.animationDuration = `${config.uiElements.spinningLogo.rotationSpeed}s`;
        
        const allInitialShapes = ['50%', '0%', '30%', '20%', '40% 60%', '30% 70%'];
        spinShape.style.borderRadius = allInitialShapes[Math.floor(Math.random() * allInitialShapes.length)];
        
        let resizeTimeout;
        const updatePosition = () => {
            // Use requestAnimationFrame to ensure layout is complete
            requestAnimationFrame(() => {
                if (heroContent) {
                    const heroTitle = heroContent.querySelector('.hero-title');
                    if (heroTitle) {
                        const titleRect = heroTitle.getBoundingClientRect();
                        const heroRect = hero.getBoundingClientRect();
                        
                        const leftOffset = titleRect.left - heroRect.left + config.uiElements.spinningLogo.offsetX;
                        const topOffset = titleRect.top - heroRect.top + (titleRect.height / 2) - (config.uiElements.spinningLogo.size / 2) + config.uiElements.spinningLogo.offsetY;
                        
                        spinShape.style.left = `${leftOffset}px`;
                        spinShape.style.top = `${topOffset}px`;
                    }
                }
            });
        };
        
        // Debounced resize handler to prevent rapid recalculations
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updatePosition, 100);
        };
        
        updatePosition();
        window.addEventListener('resize', handleResize);
        
        // Also update when fonts load (can affect title size)
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(updatePosition);
        }
        
        hero.appendChild(spinShape);
        startEnhancedMorphing(spinShape);
    }
    
    function startEnhancedMorphing(shape) {
        const allShapes = [
            '50%', '30% 70% 70% 30% / 30% 30% 70% 70%', '40% 60% 60% 40% / 60% 40% 60% 40%',
            '40% 60%', '30% 70%',
            '0%', '10%', '5%', '20% 80%',
            '30%', '70% 30% 70% 30% / 30% 70% 30% 70%',
            '20% 80% 80% 20% / 80% 20% 80% 20%',
            '50% 50% 0% 50% / 50% 0% 50% 50%', '20%', '80% 20%',
            '60% 40% 30% 70% / 60% 30% 70% 40%', '40% 60% 70% 30% / 40% 70% 30% 60%',
            '70% 30% 30% 70% / 30% 70% 70% 30%', '30% 70% 70% 30% / 70% 30% 30% 70%',
            '20% 80% 80% 20%', '80% 20% 20% 80%',
            '10% 90% 10% 90% / 90% 10% 90% 10%',
            '0% 100% 100%', '100% 0% 100%',
            '20% 80% 60% 40% / 40% 60% 80% 20%', '80% 20% 40% 60% / 60% 40% 20% 80%',
            '0% 50% 100% 50%', '30% / 30%'
        ];
        
        const morph = () => {
            const nextShape = allShapes[Math.floor(Math.random() * allShapes.length)];
            
            shape.style.transition = 'border-radius 2s ease-in-out, box-shadow 2s ease-in-out, border-color 2s ease-in-out';
            shape.style.borderRadius = nextShape;
            
            if (config.uiElements.spinningLogo.glowOnMorph) {
                shape.style.boxShadow = `0 0 40px rgba(59, 130, 246, 0.8), 0 0 80px rgba(100, 200, 255, 0.5)`;
                shape.style.borderColor = 'rgba(100, 200, 255, 0.9)';
            }
            
            if (Math.random() < config.uiElements.spinningLogo.glitchChance) {
                applyGlitchEffect(shape);
            }
            
            if (config.uiElements.spinningLogo.glowOnMorph) {
                setTimeout(() => {
                    shape.style.boxShadow = `0 0 20px rgba(59, 130, 246, 0.4)`;
                    shape.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                }, 2000);
            }
            
            const nextMorphTime = config.uiElements.spinningLogo.morphInterval.min + 
                                 Math.random() * (config.uiElements.spinningLogo.morphInterval.max - config.uiElements.spinningLogo.morphInterval.min);
            setTimeout(morph, nextMorphTime);
        };
        
        const initialDelay = config.uiElements.spinningLogo.initialDelay.min + 
                           Math.random() * (config.uiElements.spinningLogo.initialDelay.max - config.uiElements.spinningLogo.initialDelay.min);
        setTimeout(morph, initialDelay);
    }
    
    function startShapeMovement(shapeObjects, container) {
        const updateInterval = 50;
        
        setInterval(() => {
            for (let i = 0; i < shapeObjects.length; i++) {
                const shape = shapeObjects[i];
                
                // Apply movement
                shape.x += shape.vx;
                shape.y += shape.vy;
                
                // Calculate distance from base position
                const dx = shape.x - shape.baseX;
                const dy = shape.y - shape.baseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Maximum drift distance is 10px
                const maxDrift = 10;
                
                if (distance > maxDrift) {
                    // If too far, pull back strongly
                    const angle = Math.atan2(dy, dx);
                    shape.x = shape.baseX + Math.cos(angle) * maxDrift;
                    shape.y = shape.baseY + Math.sin(angle) * maxDrift;
                    shape.vx *= -0.5;
                    shape.vy *= -0.5;
                } else {
                    // Gentle drift back toward base position
                    shape.vx -= dx * 0.01;
                    shape.vy -= dy * 0.01;
                }
                
                // Very subtle random nudges
                if (Math.random() < 0.01) {
                    shape.vx += (Math.random() - 0.5) * 0.05;
                    shape.vy += (Math.random() - 0.5) * 0.05;
                }
                
                // Strong damping to keep movement subtle
                shape.vx *= 0.98;
                shape.vy *= 0.98;
                
                // Update DOM position
                shape.element.style.left = `${shape.x}px`;
                shape.element.style.top = `${shape.y}px`;
            }
        }, updateInterval);
    }
    
    function startMorphing(shape) {
        const allShapes = [
            '50%', '30% 70% 70% 30% / 30% 30% 70% 70%', '40% 60% 60% 40% / 60% 40% 60% 40%',
            '40% 60%', '30% 70%',
            '0%', '10%', '5%', '20% 80%',
            '30%', '70% 30% 70% 30% / 30% 70% 30% 70%',
            '20% 80% 80% 20% / 80% 20% 80% 20%',
            '50% 50% 0% 50% / 50% 0% 50% 50%', '20%', '80% 20%',
            '60% 40% 30% 70% / 60% 30% 70% 40%', '40% 60% 70% 30% / 40% 70% 30% 60%',
            '70% 30% 30% 70% / 30% 70% 70% 30%', '30% 70% 70% 30% / 70% 30% 30% 70%',
            '20% 80% 80% 20%', '80% 20% 20% 80%',
            '10% 90% 10% 90% / 90% 10% 90% 10%',
            '0% 100% 100%', '100% 0% 100%',
            '20% 80% 60% 40% / 40% 60% 80% 20%', '80% 20% 40% 60% / 60% 40% 20% 80%',
            '0% 50% 100% 50%', '30% / 30%'
        ];
        
        const morph = () => {
            const nextShape = allShapes[Math.floor(Math.random() * allShapes.length)];
            
            shape.style.transition = 'border-radius 2s ease-in-out, box-shadow 2s ease-in-out, transform 2s ease-in-out';
            shape.style.borderRadius = nextShape;
            shape.style.boxShadow = `0 0 40px rgba(59, 130, 246, 0.6), 0 0 80px rgba(100, 200, 255, 0.4)`;
            
            if (Math.random() < 0.3) {
                applyGlitchEffect(shape);
            }
            
            setTimeout(() => {
                shape.style.boxShadow = `0 0 20px rgba(59, 130, 246, 0.3)`;
            }, 2000);
            
            const nextMorphTime = config.uiElements.backgroundShapes.morphInterval.min + 
                                 Math.random() * (config.uiElements.backgroundShapes.morphInterval.max - config.uiElements.backgroundShapes.morphInterval.min);
            setTimeout(morph, nextMorphTime);
        };
        
        setTimeout(morph, 3000 + Math.random() * 5000);
    }
    
    function applyGlitchEffect(shape) {
        const originalTransform = shape.style.transform || '';
        const glitchSteps = 8;
        let step = 0;
        
        const glitch = () => {
            if (step >= glitchSteps) {
                shape.style.transform = originalTransform;
                shape.style.filter = 'none';
                return;
            }
            
            const offsetX = (Math.random() - 0.5) * 10;
            const offsetY = (Math.random() - 0.5) * 10;
            const hueShift = Math.random() * 360;
            const opacity = 0.7 + Math.random() * 0.3;
            
            shape.style.transform = `${originalTransform} translate(${offsetX}px, ${offsetY}px)`;
            shape.style.filter = `hue-rotate(${hueShift}deg) opacity(${opacity})`;
            shape.style.transition = 'none';
            
            step++;
            setTimeout(glitch, 50);
        };
        
        glitch();
    }
    
    // Initialize UI elements
    createFloatingShapes();
});

