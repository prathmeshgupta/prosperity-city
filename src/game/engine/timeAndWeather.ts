/**
 * Day/Night Lighting and Dynamic Weather Engine for Prosperity City.
 * Creates atmospheric lighting cones around streetlamps, building windows, and players.
 */

export type TimeOfDay = 'MORNING' | 'DAY' | 'SUNSET' | 'NIGHT';
export type WeatherType = 'SUNNY' | 'RAINY' | 'PETAL_FALL';

export interface WeatherParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export class WorldAtmosphere {
  public timeOfDay: TimeOfDay = 'DAY';
  public timeProgress: number = 0.25; // 0.0 (Midnight) -> 0.25 (Morning) -> 0.5 (Noon) -> 0.75 (Sunset) -> 1.0 (Midnight)
  public weather: WeatherType = 'SUNNY';
  private particles: WeatherParticle[] = [];

  constructor() {
    this.initWeather('SUNNY');
  }

  public update(dt: number) {
    // 240 seconds (4 minutes) for a complete 24-hour day/night cycle
    this.timeProgress = (this.timeProgress + dt / 240) % 1.0;

    if (this.timeProgress >= 0.2 && this.timeProgress < 0.4) {
      this.timeOfDay = 'MORNING';
    } else if (this.timeProgress >= 0.4 && this.timeProgress < 0.7) {
      this.timeOfDay = 'DAY';
    } else if (this.timeProgress >= 0.7 && this.timeProgress < 0.82) {
      this.timeOfDay = 'SUNSET';
    } else {
      this.timeOfDay = 'NIGHT';
    }

    // Update weather particles
    for (const p of this.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.y > 800) {
        p.y = -20;
        p.x = Math.random() * 1200;
      }
    }
  }

  public setWeather(weather: WeatherType) {
    this.weather = weather;
    this.initWeather(weather);
  }

  private initWeather(weather: WeatherType) {
    this.particles = [];
    if (weather === 'RAINY') {
      for (let i = 0; i < 70; i++) {
        this.particles.push({
          x: Math.random() * 1200,
          y: Math.random() * 800,
          vx: -30,
          vy: 320 + Math.random() * 80,
          size: 1.5,
          alpha: 0.6,
          color: '#38bdf8',
        });
      }
    } else if (weather === 'PETAL_FALL') {
      for (let i = 0; i < 40; i++) {
        this.particles.push({
          x: Math.random() * 1200,
          y: Math.random() * 800,
          vx: Math.sin(i) * 15 + 10,
          vy: 40 + Math.random() * 30,
          size: 4,
          alpha: 0.7,
          color: '#f472b6', // pink cherry blossoms
        });
      }
    }
  }

  /**
   * Renders the ambient light overlay (warm sunsets, dark blue night)
   * and carves out glowing light cones around streetlamps and the player!
   */
  public renderLighting(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    playerScreenX: number,
    playerScreenY: number,
    lightSources: { x: number; y: number; radius: number; color: string }[]
  ) {
    // 1. Determine ambient dark overlay opacity and color
    let ambientColor = 'rgba(0, 0, 0, 0)';
    let darknessAlpha = 0;

    if (this.timeOfDay === 'MORNING') {
      ambientColor = 'rgba(254, 240, 138, 0.08)'; // soft warm golden morning tint
    } else if (this.timeOfDay === 'SUNSET') {
      ambientColor = 'rgba(249, 115, 22, 0.16)'; // rich sunset amber
    } else if (this.timeOfDay === 'NIGHT') {
      darknessAlpha = 0.72; // deep midnight blue
    }

    if (darknessAlpha > 0) {
      // Create off-screen / lighting mask
      ctx.save();

      // Draw darkness overlay
      ctx.fillStyle = `rgba(11, 15, 25, ${darknessAlpha})`;
      ctx.fillRect(0, 0, width, height);

      // Carve out lights with destination-out blending
      ctx.globalCompositeOperation = 'destination-out';

      // Player personal lantern / aura
      const playerGrad = ctx.createRadialGradient(
        playerScreenX, playerScreenY, 15,
        playerScreenX, playerScreenY, 85
      );
      playerGrad.addColorStop(0, 'rgba(0, 0, 0, 1.0)');
      playerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = playerGrad;
      ctx.beginPath();
      ctx.arc(playerScreenX, playerScreenY, 85, 0, Math.PI * 2);
      ctx.fill();

      // Carve out streetlamps and building lanterns
      for (const src of lightSources) {
        if (src.x >= -100 && src.x <= width + 100 && src.y >= -100 && src.y <= height + 100) {
          const lampGrad = ctx.createRadialGradient(src.x, src.y, 10, src.x, src.y, src.radius);
          lampGrad.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
          lampGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = lampGrad;
          ctx.beginPath();
          ctx.arc(src.x, src.y, src.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      // Warm glow halos over lamps
      ctx.save();
      for (const src of lightSources) {
        if (src.x >= -100 && src.x <= width + 100 && src.y >= -100 && src.y <= height + 100) {
          const warmGrad = ctx.createRadialGradient(src.x, src.y, 5, src.x, src.y, src.radius * 0.7);
          warmGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
          warmGrad.addColorStop(1, 'rgba(254, 240, 138, 0.0)');
          ctx.fillStyle = warmGrad;
          ctx.beginPath();
          ctx.arc(src.x, src.y, src.radius * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    } else if (ambientColor !== 'rgba(0, 0, 0, 0)') {
      ctx.fillStyle = ambientColor;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Render weather particles (rain streaks or falling petals)
    if (this.particles.length > 0) {
      ctx.save();
      for (const p of this.particles) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        if (this.weather === 'RAINY') {
          ctx.fillRect(p.x, p.y, p.size, 10);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }
  }
}
