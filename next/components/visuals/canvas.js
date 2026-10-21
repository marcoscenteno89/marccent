'use client'
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Ellipse, Rect, createColor, linearGradient, randomPosition, metaballPath, glowSprite, randomWanderPath, wander
} from "@marccent/util/canvas";
import { withTRC } from "@/components/theme/hoc";
import { Grid } from "@/lib/grid_helper";

/*
 * Canvas animations on @marccent/util 2.x. props.sketch.canvas is a Scene (hoc.js withCanvas). Animations
 * with few objects use util Shapes (c.add(), c.run()); ones with hundreds (Fire, ParticleFlowfield, OrbitAnim) keep them
 * in a ParticlePool and draw straight to the 2D context, since a Shape per item costs too much per frame.
 * Each animation builds its objects once, then useDraw sets a new draw whenever the theme changes.
 */

/* ---------- helpers ---------- */

// Average of the canvas sides: sizes and counts scale with it.
const avgSide = (p) => (p.width + p.height) / 2;

/**
 * Sets sketch.draw to what makeDraw returns and draws one frame right away, so a paused canvas (off screen,
 * reduced motion) still shows the change. Runs again when deps change (usually the theme): put per-theme
 * setup (colors) in makeDraw, before the function it returns.
 */
const useDraw = (sketch, makeDraw, deps) => useEffect(() => {
  sketch.draw = makeDraw();
  sketch.draw();
}, deps);

/**
 * The theme's primary-to-secondary gradient across the canvas, from the bottom-right corner to the center.
 * Returns a function giving the gradient, rebuilt only when the canvas resizes. Call once per theme.
 */
const themeGradient = (c, theme) => {
  const colors = createColor(c.p, [theme.primary().hex, theme.secondary().hex]).fill;
  let gradient = null;
  let size = '';
  return () => {
    if (size !== `${c.width}x${c.height}`) {
      gradient = linearGradient(c.ctx, { x: c.width, y: c.height }, c.center, colors);
      size = `${c.width}x${c.height}`;
    }
    return gradient;
  };
}

/**
 * Many small moving things as numbers, not objects: each field is a Float32Array, particle i is x[i], y[i]…
 * Adding never allocates. When full, add() overwrites the oldest (as long as nothing was removed, which
 * reorders). remove(i) moves the last particle into slot i, so loop backwards when removing.
 * @param {number} max @param {string[]} fields - e.g. ['x', 'y', 'vx', 'vy']
 */
class ParticlePool {
  constructor(max, fields) {
    this.max = max;
    this.fields = fields;
    this.count = 0;
    this.next = 0; // slot add() overwrites once full
    for (const field of fields) this[field] = new Float32Array(max);
  }

  // Adds a particle from { field: value }; fields left out are 0. Returns its index.
  add(values) {
    let i = this.count;
    if (this.count < this.max) this.count++;
    else { i = this.next; this.next = (this.next + 1) % this.max; }
    for (const field of this.fields) this[field][i] = values[field] ?? 0;
    return i;
  }

  remove(i) {
    const last = --this.count;
    for (const field of this.fields) this[field][i] = this[field][last];
  }
}

/* ---------- animations ---------- */

// Blobs move as a few groups: each group's center wanders along its own smooth path, and its blobs circle
// that center at their own pace, so a group reads as one big blob slowly changing shape. Each blob also swings
// out from its group and back now and then, far enough to break off as a circle for a moment. Groups wander
// across each other, merging and splitting: one to BLOB_GROUPS big blobs on screen. Drawn as metaballs (util).
const BLOB_GROUPS = 3;
const BLOBS_PER_GROUP = 5;
// How fast group centers wander: path time per frame on a canvas whose sides equal their average. Each axis
// runs its path at avg / side times this, so a center moves about the same share of the average side per
// second on any canvas: a short preview isn't frantic vertically, a wide screen isn't sluggish across.
const BLOB_DRIFT = 0.002;

const Blob = (props) => {
  const { sketch, canvas: c, p } = props.sketch;
  // Radii and distances are fractions of the canvas' average side, so everything follows resizes.
  const [ groups ] = useState(() => Array.from({ length: BLOB_GROUPS }, () => ({
    path: randomWanderPath(() => p.random()),
    members: Array.from({ length: BLOBS_PER_GROUP }, () => ({
      size: p.random(0.07, 0.12), // radius
      dist: p.random(0.02, 0.07), // from the group center, when tucked in
      reach: p.random(0.14, 0.24), // how much farther it swings out at most
      swing: p.random(p.TWO_PI), // where it is in its out-and-back cycle
      swingRate: p.random(0.004, 0.01), // radians per frame: one swing every 10-25s
      angle: p.random(p.TWO_PI),
      spin: p.random(0.004, 0.012) * p.random([ -1, 1 ]), // radians per frame
      pos: { x: 0, y: 0 }, // what metaballPath reads, with radius
      radius: 0
    }))
  })));
  const [ clock ] = useState({ x: 0, y: 0 }); // path time per axis

  useDraw(sketch, () => {
    const gradient = themeGradient(c, props.theme);
    const blobs = groups.flatMap((group) => group.members);
    return () => {
      p.clear();
      const avg = avgSide(p);
      const dt = c.dt;
      clock.x += BLOB_DRIFT * dt * avg / p.width;
      clock.y += BLOB_DRIFT * dt * avg / p.height;
      for (const group of groups) {
        const cx = wander(group.path.x, clock.x) * p.width;
        const cy = wander(group.path.y, clock.y) * p.height;
        for (const blob of group.members) {
          blob.angle += blob.spin * dt;
          blob.swing += blob.swingRate * dt;
          const out = Math.max(0, Math.sin(blob.swing)) ** 2; // 0 for half the cycle, then a smooth swing out
          const dist = (blob.dist + blob.reach * out) * avg;
          blob.pos.x = cx + Math.cos(blob.angle) * dist;
          blob.pos.y = cy + Math.sin(blob.angle) * dist;
          blob.radius = blob.size * avg;
        }
      }
      const ctx = c.ctx;
      ctx.beginPath();
      metaballPath(ctx, blobs, c.width, c.height);
      ctx.fillStyle = gradient(); // one gradient across all the blobs
      ctx.fill();
    };
  }, [props.theme]);
  return null;
}

// Flames are pool particles drawn as pre-drawn glow sprites (util glowSprite, one per theme shade, scaled
// with drawImage) under additive blending. As util Shapes, each shrinking flame rebuilt its radial gradient
// every frame (~300 gradients a frame), which was the lag.
const Fire = (props) => {
  const { sketch, canvas: c, p } = props.sketch;
  const t = props.theme;
  // Every theme shade as a glow sprite, fading into the page color.
  const sprites = useMemo(() => {
    const pp = t.primary();
    const s = t.secondary();
    const { r, g, b } = t.mode().rgb;
    const clear = `rgba(${r}, ${g}, ${b}, 0)`;
    return [pp, s, ...pp.lighter, ...pp.darker, ...s.lighter, ...s.darker].map((color) => glowSprite(color.hex, clear));
  }, [props.theme]);
  // A flame lives at most avg * 0.3 frames and one is added per frame, so this many is always enough.
  const [ flames ] = useState(() => new ParticlePool(Math.ceil(avgSide(p) * 0.3) + 2,
    [ 'x', 'y', 'vx', 'vy', 'size', 'life', 'total', 'sprite' ]));
  const [ wind ] = useState({ x: 0, y: -0.2 });

  // Wind: the upward pull drifts every 3s.
  useEffect(() => {
    // Soft glows lose nothing at half resolution, and the browser scales the canvas back up: 4x fewer pixels
    // to blend, which is most of Fire's cost.
    p.pixelDensity(0.5);
    const avg = avgSide(p);
    const x = avg * 0.0015;
    const y = avg * 0.001;
    const timer = setInterval(() => Object.assign(wind, { x: p.random(-x, x), y: p.random(0, -y) }), 3000);
    return () => clearInterval(timer);
  }, []);

  useDraw(sketch, () => () => {
    p.clear();
    const avg = avgSide(p);
    const dt = c.dt;
    // One new flame a frame, near the bottom middle, drifting off in a random direction.
    const life = p.random(avg * 0.1, avg * 0.3);
    const heading = p.random(p.TWO_PI);
    flames.add({
      x: p.random(p.width * 0.45, p.width * 0.55), y: p.random(p.height * 0.7, p.height * 0.85),
      vx: Math.cos(heading), vy: Math.sin(heading), size: p.random(avg * 0.05, avg * 0.20), life, total: life,
      sprite: Math.floor(p.random(sprites.length))
    });
    const { x, y, vx, vy, size } = flames;
    const ctx = c.ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter'; // overlapping flames add up to a brighter core
    for (let i = flames.count - 1; i >= 0; i--) {
      flames.life[i] -= dt;
      if (flames.life[i] <= 0) { flames.remove(i); continue; } // order doesn't matter under additive blending
      // The wind is a force: heavier (bigger) flames bend less. They shrink to nothing over their life.
      vx[i] += wind.x / size[i] * dt;
      vy[i] += wind.y / size[i] * dt;
      x[i] += vx[i] * dt;
      y[i] += vy[i] * dt;
      const s = size[i] * flames.life[i] / flames.total[i];
      ctx.drawImage(sprites[flames.sprite[i]], x[i] - s / 2, y[i] - s / 2, s, s);
    }
    ctx.restore();
  }, [sprites]);
  return null;
}

const NetworkLoop = (props) => {
  const { sketch, canvas: c, p } = props.sketch;
  const [ limit ] = useState(() => avgSide(p) / 5);
  useEffect(() => {
    for (let i = 0; i < 30; i++) {
      const vel = { x: p.random(-1, 1), y: p.random(-1, 1) };
      c.add(new Ellipse(c, { pos: randomPosition(c, 10), size: 1, vel }));
    }
  }, []);

  useDraw(sketch, () => {
    const primary = props.theme.primary().hex;
    const line = p.color(primary);
    const dot = createColor(p, primary);
    for (const item of c.objects) item.color = dot;
    const lines = new Array(c.objects.length);
    return () => {
      p.clear();
      c.bounceEdges();
      // A line between every pair within limit (each pair once), thinner the farther; a dot grows with its
      // line count.
      const dots = c.objects;
      lines.fill(0);
      p.stroke(line);
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dist = dots[i].pos.dist(dots[j].pos);
          if (dist < limit && dist > 1) {
            lines[i]++;
            lines[j]++;
            p.strokeWeight(p.map(dist, limit, 0, 0, 1));
            p.line(dots[i].pos.x, dots[i].pos.y, dots[j].pos.x, dots[j].pos.y);
          }
        }
      }
      for (let i = 0; i < dots.length; i++) {
        const size = p.map(lines[i], 0, dots.length, 0, 7);
        dots[i].size.set(size, size);
      }
      c.run();
    };
  }, [props.theme]);
  return null;
}

const Wave = (props) => {
  const { sketch, canvas: c, p } = props.sketch;
  useEffect(() => {
    props.canvasRef.current.classList.add('bg-gradient');
    // Two huge rounded squares above the middle, turning: their bottom edges roll like a wave.
    const size = p.width * 2;
    const pos = { x: p.width / 2, y: (p.height / 2) - (size / 2) };
    c.add(new Rect(c, { pos, size, spin: 0.01, corner: size * 0.45 }));
    c.add(new Rect(c, { pos, size, spin: 0.01, corner: size * 0.4 }));
  }, []);

  useDraw(sketch, () => {
    c.objects[0].color = createColor(p, props.theme.rgb('mode', 1));
    c.objects[1].color = createColor(p, props.theme.rgb('mode', 0.5));
    return () => {
      p.clear();
      c.run();
    };
  }, [props.theme]);
  return null;
}

// Particles live in a ParticlePool (new ones overwrite the oldest once full) and are drawn with one fillRect
// each under a shared gradient fill. ~1000 Shape objects, each doing push / style / ellipse / pop, plus a
// full-canvas repaint for the gradient, every frame, was the lag. Each particle is its own fill (not one
// path) so piled-up particles blend: they add up to light in the dark theme ('lighter') and cancel to dark in
// the light theme ('difference').
const PARTICLES_PER_FRAME = 2;
const PARTICLE_MAX_SPEED = 3;

const ParticleFlowfield = (props) => {
  const { sketch, canvas: c, p } = props.sketch;
  // As many particles as the canvas' average side.
  const [ dots ] = useState(() => new ParticlePool(Math.ceil(avgSide(p)), [ 'x', 'y', 'vx', 'vy' ]));
  const [ size ] = useState(() => Math.ceil(avgSide(p) * 0.002));
  useEffect(() => {
    c.setFlowfield({ cellSize: Math.max(10, Math.floor(p.width * 0.1)), step: 2, offset: 0.1, speed: 0.001 });
    p.noiseDetail(1);
  }, []);

  useDraw(sketch, () => {
    const gradient = themeGradient(c, props.theme);
    const blend = props.theme.is_dark ? 'lighter' : 'difference';
    return () => {
      const field = c.flowfield;
      if (!field.cols) return; // canvas still 0 wide: the field rebuilds on the first resize
      const w = p.width;
      const h = p.height;
      const dt = c.dt;
      for (let n = 0; n < PARTICLES_PER_FRAME; n++) {
        dots.add({ x: p.random(size, w - size), y: p.random(size, h - size) });
      }
      field.update(dt);

      // Same motion as a Shape: the cell's direction is a force (÷ mass = size), speed capped, then wrap.
      const { x, y, vx, vy } = dots;
      const { cellSize, cols, rows } = field;
      const half = size / 2;
      p.clear();
      const ctx = c.ctx;
      ctx.save();
      ctx.globalCompositeOperation = blend;
      ctx.fillStyle = gradient();
      for (let i = 0; i < dots.count; i++) {
        const col = Math.min(cols - 1, Math.max(0, Math.floor(x[i] / cellSize)));
        const row = Math.min(rows - 1, Math.max(0, Math.floor(y[i] / cellSize)));
        const force = field.field[col][row].vel;
        vx[i] += force.x / size * dt;
        vy[i] += force.y / size * dt;
        const speed = Math.hypot(vx[i], vy[i]);
        if (speed > PARTICLE_MAX_SPEED) {
          vx[i] *= PARTICLE_MAX_SPEED / speed;
          vy[i] *= PARTICLE_MAX_SPEED / speed;
        }
        x[i] = (x[i] + vx[i] * dt + w) % w;
        y[i] = (y[i] + vy[i] * dt + h) % h;
        ctx.fillRect(x[i] - half, y[i] - half, size, size); // squares: at 1-2px they look the same as circles
      }
      ctx.restore();
    };
  }, [props.theme]);

  return null;
}

// Orbits are just radii around the canvas center, and their ~600 dots are pool particles (which orbit, where
// on it, how fast) drawn as one path with one fill. As util Orbits of Ellipses, every dot did push / style /
// ellipse / pop each frame.
const OrbitAnim = (props) => {
  const { sketch, canvas: c, p } = props.sketch;
  const t = props.theme;
  const [ orbits ] = useState(() => {
    const avg = avgSide(p);
    const min = avg * 0.1; // orbit widths (diameters) breathe between these
    const max = avg * 1.3;
    const radii = Array.from({ length: Math.floor(avg * 0.05) }, () => Math.floor(p.random(min, max)) / 2);
    const perOrbit = (radius) => Math.ceil(radius * 2 * 0.01); // wider orbits carry more dots
    const dots = new ParticlePool(radii.reduce((n, radius) => n + perOrbit(radius), 0), [ 'orbit', 'angle', 'speed' ]);
    radii.forEach((radius, orbit) => {
      for (let j = 0; j < perOrbit(radius); j++) dots.add({ orbit, angle: p.random(p.TWO_PI), speed: p.random(0.002, 0.005) });
    });
    return { min, max, radii, dots, size: avg * 0.001 + 2 }; // + 2: the 1px outline the dots used to have
  });

  useDraw(sketch, () => {
    const color = t.rev().hex;
    const { r, g, b } = t.mode().rgb;
    return () => {
      const { min, max, radii, dots, size } = orbits;
      const dt = c.dt;
      p.background(r, g, b, 60); // translucent: the dots leave trails
      // Orbits breathe: each frame they all grow or shrink together, reversing at min / max width.
      let vel = p.random(-0.4, 0.4);
      for (let i = 0; i < radii.length; i++) {
        if (radii[i] * 2 < min || radii[i] * 2 > max) vel = -vel;
        radii[i] += vel / 2;
      }
      const cx = p.width / 2;
      const cy = p.height / 2;
      const half = size / 2;
      const ctx = c.ctx;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < dots.count; i++) {
        dots.angle[i] += dots.speed[i] * dt;
        const radius = radii[dots.orbit[i]];
        ctx.rect(cx + Math.cos(dots.angle[i]) * radius - half, cy + Math.sin(dots.angle[i]) * radius - half, size, size);
      }
      ctx.fill();
    };
  }, [props.theme]);
  return null;
}

/* ---------- chart ---------- */

const Graph = (props) => {
  const { base, pts, obj } = props;
  const { data, min, max } = obj;
  const { sketch, p } = props.sketch;
  const rgb = props.theme.rev().rgb;
  const [ grid, setGrid ] = useState(null);
  const [ selected, setSelected ] = useState(null);
  const hovered = useRef(null); // last cell sent to setSelected, so draw only updates state when it changes

  // Set canvas properties, only runs once
  useEffect(() => {
    sketch.setup = () => {
      p.frameRate(30);
      p.textSize(10);
      p.fill(255);
      p.strokeWeight(1);
      p.stroke(255);
    }
    sketch.setup();
  }, []);

  // Hover grid (grid_helper Grid): a column per day, a row per price step from max down. Rebuilt when obj
  // (the ticker) changes.
  useEffect(() => {
    const grid = new Grid(base, data.length, (row, col) => ({ date: data[col].Date, price: max - row * pts }));
    setGrid(grid);
    hovered.current = grid.get(0, 0);
    setSelected(hovered.current);
  }, [obj]);

  // draw runs every frame: only touch React state when the hovered cell changes.
  const select = (cell) => {
    if (cell === hovered.current) return;
    hovered.current = cell;
    setSelected(cell);
  };

  useEffect(() => {
    
    sketch.draw = () => {
      p.clear();
      p.noFill();
      p.beginShape();
      p.stroke(rgb.r, rgb.g, rgb.b);
      for (let i = 0; i < data.length; i++) {
        const x = p.map(i, 0, data.length, 0, p.width);
        const y = p.map(data[i].Close, min, max, p.height, 0);
        p.vertex(x, y);
      }
      p.endShape();
      
      if (grid) { // Make sure grid exists befor running calculations
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          p.line(0, p.mouseY, p.width, p.mouseY); // crosshair, in the stroke set above
          p.line(p.mouseX, 0, p.mouseX, p.height);
          const { row, col } = grid.cellAt(p.mouseX, p.mouseY, p.width, p.height);
          select(grid.get(row, col));
        } else {
          select(null);
        }
      }
      
    }
  
    sketch.draw();
  }, [grid, props.theme]);

  return (
    <div className="selected order-first">
      {selected && (`${selected.date.format('dddd, DD MMMM YYYY')} ${selected.price.toFixed(4)}`)}
    </div>
  );
}

const GraphWTRC = withTRC(Graph, { decorative: false }); // a chart people read: full sharpness, no pausing
const BlobWTRC = withTRC(Blob);
const FireWTRC = withTRC(Fire);
const WaveWTRC = withTRC(Wave);
const NetworkLoopWTRC = withTRC(NetworkLoop);
const ParticleFlowfieldWTRC = withTRC(ParticleFlowfield);
const OrbitAnimWTRC = withTRC(OrbitAnim);

export { 
  ParticleFlowfieldWTRC, OrbitAnimWTRC, BlobWTRC, FireWTRC, NetworkLoopWTRC, WaveWTRC,
  GraphWTRC
}  
