'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  type: string;
  rotation?: number;
  rotationSpeed?: number;
  char?: string;
}

interface Firework {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  exploded: boolean;
  particles: Particle[];
  trail: { x: number; y: number }[];
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const fireworksRef = useRef<Firework[]>([]);
  const matrixCharsRef = useRef<{ x: number; y: number; char: string; speed: number; opacity: number }[]>([]);
  const timeRef = useRef(0);
  const { customization } = useTheme();

  const hexToRgba = useCallback((hex: string, alpha: number): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return `rgba(124,58,237,${alpha})`;
    return `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},${alpha})`;
  }, []);

  const randomColor = useCallback((colors: string[]): string => {
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  const createParticle = useCallback((canvas: HTMLCanvasElement, type: string): Particle => {
    const colors = [customization.bgParticleColor, customization.bgSparkColor, customization.primaryColor, customization.accentColor];
    const color = randomColor(colors);
    const baseSpeed = customization.bgParticleSpeed;

    if (type === 'sparkle') {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5 * baseSpeed,
        vy: (Math.random() - 0.5) * 0.5 * baseSpeed,
        life: 0,
        maxLife: 60 + Math.random() * 120,
        size: customization.bgParticleSize * (0.5 + Math.random() * 1.5),
        color,
        alpha: 0,
        type: 'sparkle',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
      };
    }
    if (type === 'spark') {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 8 * baseSpeed,
        vy: (Math.random() - 0.5) * 8 * baseSpeed,
        life: 0,
        maxLife: 20 + Math.random() * 30,
        size: customization.bgParticleSize * (0.3 + Math.random()),
        color,
        alpha: 1,
        type: 'spark',
      };
    }
    if (type === 'bubble') {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 20,
        vx: (Math.random() - 0.5) * 1 * baseSpeed,
        vy: -(0.5 + Math.random() * 2) * baseSpeed,
        life: 0,
        maxLife: 200 + Math.random() * 200,
        size: 4 + Math.random() * 20,
        color,
        alpha: 0.3 + Math.random() * 0.4,
        type: 'bubble',
      };
    }
    if (type === 'snow') {
      return {
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 1 * baseSpeed,
        vy: (0.5 + Math.random() * 2) * baseSpeed,
        life: 0,
        maxLife: 300 + Math.random() * 200,
        size: 2 + Math.random() * 5,
        color: '#ffffff',
        alpha: 0.6 + Math.random() * 0.4,
        type: 'snow',
      };
    }
    if (type === 'confetti') {
      const confettiColors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bff', '#ff9f43'];
      return {
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 3 * baseSpeed,
        vy: (1 + Math.random() * 3) * baseSpeed,
        life: 0,
        maxLife: 200 + Math.random() * 200,
        size: 4 + Math.random() * 8,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        alpha: 0.8 + Math.random() * 0.2,
        type: 'confetti',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      };
    }
    // default particle
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5 * baseSpeed,
      vy: (Math.random() - 0.5) * 1.5 * baseSpeed,
      life: 0,
      maxLife: 150 + Math.random() * 150,
      size: customization.bgParticleSize * (0.5 + Math.random()),
      color,
      alpha: 0.3 + Math.random() * 0.5,
      type: 'particle',
    };
  }, [customization, hexToRgba, randomColor]);

  const createFirework = useCallback((canvas: HTMLCanvasElement): Firework => {
    const colors = [
      customization.bgParticleColor, customization.bgSparkColor,
      customization.primaryColor, customization.accentColor,
      '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bff',
    ];
    return {
      x: canvas.width * 0.1 + Math.random() * canvas.width * 0.8,
      y: canvas.height,
      targetY: canvas.height * 0.1 + Math.random() * canvas.height * 0.5,
      vx: (Math.random() - 0.5) * 2,
      vy: -(8 + Math.random() * 6),
      color: randomColor(colors),
      exploded: false,
      particles: [],
      trail: [],
    };
  }, [customization, randomColor]);

  const explodeFirework = useCallback((fw: Firework): Particle[] => {
    const count = 40 + Math.floor(Math.random() * 60);
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 5;
      particles.push({
        x: fw.x,
        y: fw.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 60 + Math.random() * 60,
        size: 1.5 + Math.random() * 2.5,
        color: fw.color,
        alpha: 1,
        type: 'firework-particle',
      });
    }
    return particles;
  }, []);

  const initMatrix = useCallback((canvas: HTMLCanvasElement) => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const cols = Math.floor(canvas.width / 16);
    matrixCharsRef.current = Array.from({ length: cols * 3 }, (_, i) => ({
      x: (i % cols) * 16,
      y: Math.random() * canvas.height,
      char: chars[Math.floor(Math.random() * chars.length)],
      speed: 1 + Math.random() * 3,
      opacity: Math.random(),
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (customization.bgAnimationType === 'matrix') {
        initMatrix(canvas);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const type = customization.bgAnimationType;
    const count = customization.bgParticleCount;

    // Initialize particles
    particlesRef.current = [];
    fireworksRef.current = [];

    if (['particles', 'sparkles', 'sparks', 'bubbles', 'snow', 'confetti'].includes(type)) {
      const pType = type === 'particles' ? 'particle' : type === 'sparkles' ? 'sparkle' : type === 'sparks' ? 'spark' : type === 'bubbles' ? 'bubble' : type === 'snow' ? 'snow' : 'confetti';
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(createParticle(canvas, pType));
      }
    }

    if (type === 'matrix') {
      initMatrix(canvas);
    }

    let fireworkTimer = 0;
    const fireworkInterval = Math.max(30, 180 / customization.bgFireworkFrequency);

    const animate = () => {
      timeRef.current++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (type === 'none') {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const opacity = customization.bgOpacity;
      const speed = customization.animationSpeed || 1;

      if (type === 'aurora') {
        drawAurora(ctx, canvas, timeRef.current, customization.primaryColor, customization.accentColor, opacity);
      } else if (type === 'lava') {
        drawLava(ctx, canvas, timeRef.current, customization.primaryColor, customization.accentColor, opacity);
      } else if (type === 'waves') {
        drawWaves(ctx, canvas, timeRef.current, customization.primaryColor, customization.accentColor, opacity);
      } else if (type === 'grid') {
        drawGrid(ctx, canvas, timeRef.current, customization.primaryColor, opacity);
      } else if (type === 'stars') {
        drawStars(ctx, canvas, timeRef.current, opacity);
      } else if (type === 'matrix') {
        drawMatrix(ctx, canvas, customization.primaryColor, opacity);
      } else if (type === 'fireworks') {
        fireworkTimer++;
        if (fireworkTimer >= fireworkInterval) {
          fireworkTimer = 0;
          fireworksRef.current.push(createFirework(canvas));
        }
        drawFireworks(ctx, canvas, opacity);
      } else {
        // particle-based
        const pType = type === 'particles' ? 'particle' : type === 'sparkles' ? 'sparkle' : type === 'sparks' ? 'spark' : type === 'bubbles' ? 'bubble' : type === 'snow' ? 'snow' : 'confetti';
        updateAndDrawParticles(ctx, canvas, pType, count, opacity);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [customization.bgAnimationType, customization.bgParticleCount, customization.bgParticleSize, customization.bgParticleSpeed, customization.bgParticleColor, customization.bgSparkColor, customization.bgGlowColor, customization.bgFireworkFrequency, customization.bgSparkleIntensity, customization.bgOpacity, customization.primaryColor, customization.accentColor, createParticle, createFirework, initMatrix]);

  const drawAurora = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, t: number, color1: string, color2: string, opacity: number) => {
    for (let i = 0; i < 5; i++) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, `transparent`);
      gradient.addColorStop(0.3 + Math.sin(t * 0.005 + i) * 0.2, hexToRgbaLocal(color1, opacity * 0.3));
      gradient.addColorStop(0.6 + Math.cos(t * 0.007 + i) * 0.2, hexToRgbaLocal(color2, opacity * 0.2));
      gradient.addColorStop(1, `transparent`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.3 + Math.sin(t * 0.003 + i * 1.2) * 80);
      for (let x = 0; x <= canvas.width; x += 20) {
        ctx.lineTo(x, canvas.height * 0.3 + Math.sin(t * 0.003 + i * 1.2 + x * 0.005) * 80 + i * 30);
      }
      ctx.lineTo(canvas.width, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
    }
  };

  const drawLava = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, t: number, color1: string, color2: string, opacity: number) => {
    for (let i = 0; i < 8; i++) {
      let x = (Math.sin(t * 0.002 + i * 0.8) * 0.5 + 0.5) * canvas.width;
      let y = (Math.cos(t * 0.003 + i * 0.6) * 0.5 + 0.5) * canvas.height;
      const r = 60 + Math.sin(t * 0.004 + i) * 40;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
      gradient.addColorStop(0, hexToRgbaLocal(i % 2 === 0 ? color1 : color2, opacity * 0.6));
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawWaves = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, t: number, color1: string, color2: string, opacity: number) => {
    for (let w = 0; w < 4; w++) {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 5) {
        let y = canvas.height * 0.6 + Math.sin(x * 0.01 + t * 0.02 + w * 0.8) * 40 + w * 20;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      const gradient = ctx.createLinearGradient(0, canvas.height * 0.4, 0, canvas.height);
      gradient.addColorStop(0, hexToRgbaLocal(w % 2 === 0 ? color1 : color2, opacity * 0.3));
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, t: number, color: string, opacity: number) => {
    const gridSize = 40;
    const offset = (t * 0.5) % gridSize;
    ctx.strokeStyle = hexToRgbaLocal(color, opacity * 0.15);
    ctx.lineWidth = 1;
    for (let x = -gridSize + offset; x < canvas.width + gridSize; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = -gridSize + offset; y < canvas.height + gridSize; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    // Glowing intersections
    for (let x = -gridSize + offset; x < canvas.width + gridSize; x += gridSize) {
      for (let y = -gridSize + offset; y < canvas.height + gridSize; y += gridSize) {
        const pulse = Math.sin(t * 0.05 + x * 0.01 + y * 0.01) * 0.5 + 0.5;
        ctx.fillStyle = hexToRgbaLocal(color, opacity * 0.4 * pulse);
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawStars = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, t: number, opacity: number) => {
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 200; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: 0,
          vy: 0,
          life: Math.random() * 200,
          maxLife: 200,
          size: 0.5 + Math.random() * 2,
          color: '#ffffff',
          alpha: Math.random(),
          type: 'star',
        });
      }
    }
    particlesRef.current.forEach((p) => {
      p.life = (p.life + 0.5) % p.maxLife;
      const twinkle = Math.sin((p.life / p.maxLife) * Math.PI * 4) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255,255,255,${opacity * twinkle * 0.8})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    // Shooting stars
    if (t % 120 < 2) {
      const sx = Math.random() * canvas.width;
      const sy = Math.random() * canvas.height * 0.5;
      ctx.strokeStyle = `rgba(255,255,255,${opacity * 0.8})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + 80, sy + 40);
      ctx.stroke();
    }
  };

  const drawMatrix = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, color: string, opacity: number) => {
    const chars = matrixCharsRef.current;
    const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';
    chars.forEach((c) => {
      c.y += c.speed;
      if (c.y > canvas.height) {
        c.y = -20;
        c.x = Math.floor(Math.random() * (canvas.width / 16)) * 16;
      }
      c.char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      ctx.fillStyle = hexToRgbaLocal(color, opacity * c.opacity);
      ctx.font = '14px "Share Tech Mono", monospace';
      ctx.fillText(c.char, c.x, c.y);
      // Bright head
      ctx.fillStyle = hexToRgbaLocal('#ffffff', opacity * 0.9);
      ctx.fillText(c.char, c.x, c.y);
    });
  };

  const drawFireworks = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, opacity: number) => {
    fireworksRef.current = fireworksRef.current.filter((fw) => {
      if (!fw.exploded) {
        fw.trail.push({ x: fw.x, y: fw.y });
        if (fw.trail.length > 8) fw.trail.shift();
        fw.x += fw.vx;
        fw.y += fw.vy;
        fw.vy += 0.15;
        // Draw trail
        fw.trail.forEach((pt, i) => {
          ctx.fillStyle = hexToRgbaLocal(fw.color, opacity * (i / fw.trail.length) * 0.8);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
          ctx.fill();
        });
        if (fw.y <= fw.targetY) {
          fw.exploded = true;
          fw.particles = explodeFirework(fw);
        }
        return true;
      } else {
        fw.particles = fw.particles.filter((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.08;
          p.vx *= 0.98;
          p.life++;
          const lifeRatio = p.life / p.maxLife;
          p.alpha = (1 - lifeRatio) * opacity;
          ctx.fillStyle = hexToRgbaLocal(p.color, p.alpha);
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          return p.life < p.maxLife;
        });
        return fw.particles.length > 0;
      }
    });
  };

  const updateAndDrawParticles = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    type: string,
    count: number,
    opacity: number
  ) => {
    // Replenish
    while (particlesRef.current.length < count) {
      particlesRef.current.push(createParticle(canvas, type));
    }

    particlesRef.current = particlesRef.current.filter((p) => {
      p.life++;
      p.x += p.vx;
      p.y += p.vy;

      if (type === 'particle') {
        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        const lifeRatio = p.life / p.maxLife;
        const alpha = lifeRatio < 0.2 ? lifeRatio / 0.2 : lifeRatio > 0.8 ? (1 - lifeRatio) / 0.2 : 1;
        ctx.fillStyle = hexToRgbaLocal(p.color, p.alpha * alpha * opacity);
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (type === 'sparkle') {
        const lifeRatio = p.life / p.maxLife;
        const alpha = lifeRatio < 0.3 ? lifeRatio / 0.3 : lifeRatio > 0.7 ? (1 - lifeRatio) / 0.3 : 1;
        p.rotation = (p.rotation || 0) + (p.rotationSpeed || 0);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation || 0);
        ctx.fillStyle = hexToRgbaLocal(p.color, alpha * opacity * customization.bgSparkleIntensity);
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        // Draw 4-pointed star
        const s = p.size;
        ctx.beginPath();
        ctx.moveTo(0, -s * 2);
        ctx.lineTo(s * 0.4, -s * 0.4);
        ctx.lineTo(s * 2, 0);
        ctx.lineTo(s * 0.4, s * 0.4);
        ctx.lineTo(0, s * 2);
        ctx.lineTo(-s * 0.4, s * 0.4);
        ctx.lineTo(-s * 2, 0);
        ctx.lineTo(-s * 0.4, -s * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      } else if (type === 'spark') {
        const lifeRatio = p.life / p.maxLife;
        p.alpha = (1 - lifeRatio) * opacity;
        p.vy += 0.1; // gravity
        ctx.strokeStyle = hexToRgbaLocal(p.color, p.alpha);
        ctx.lineWidth = p.size;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.moveTo(p.x - p.vx * 3, p.y - p.vy * 3);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (type === 'bubble') {
        const lifeRatio = p.life / p.maxLife;
        const alpha = lifeRatio > 0.9 ? (1 - lifeRatio) / 0.1 * p.alpha : p.alpha;
        ctx.strokeStyle = hexToRgbaLocal(p.color, alpha * opacity);
        ctx.lineWidth = 1;
        ctx.shadowBlur = 4;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.stroke();
        // Highlight
        ctx.fillStyle = hexToRgbaLocal('#ffffff', alpha * opacity * 0.3);
        ctx.beginPath();
        ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (type === 'snow') {
        ctx.fillStyle = hexToRgbaLocal('#ffffff', p.alpha * opacity);
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
          p.life = 0;
        }
      } else if (type === 'confetti') {
        p.rotation = (p.rotation || 0) + (p.rotationSpeed || 0);
        p.vy += 0.05;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation || 0);
        ctx.fillStyle = hexToRgbaLocal(p.color, p.alpha * opacity);
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
          p.life = 0;
        }
      }

      return p.life < p.maxLife;
    });
  };

  const hexToRgbaLocal = (hex: string, alpha: number): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return `rgba(124,58,237,${alpha})`;
    return `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},${Math.max(0, Math.min(1, alpha))})`;
  };

  if (customization.bgAnimationType === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        filter: customization.bgBlur > 0 ? `blur(${customization.bgBlur}px)` : undefined,
      }}
      aria-hidden="true"
    />
  );
}
