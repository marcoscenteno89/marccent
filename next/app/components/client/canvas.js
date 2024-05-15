'use client'
import React, { useState, useEffect, useMemo } from "react";
import { Ellipse, Line, setColor, linearGradient, Rect, Orbit } from "@marccent/util/canvas";
import { Blur } from "./component";
import { withCTRC } from "./hoc";

const Blob = (props) => {
  const { sketch, canvas: c, p } = props.sketch;
  const t = props.theme;
  useEffect(() => {
    props.cavasRef.current.style.filter = `url(#${props.id})`;
    sketch.setup = () => {
      for (let i = 0; i < 15; i++) {
        let width = p.random(c.avg * 0.1, c.avg * 0.25);
        let mass = p.createVector(width, width);
        let pos = p.createVector(
          p.random(width, p.width - width), p.random(width, p.height - width)
        );
        let vel = p.createVector(p.random(-1.5, 1.5), p.random(-1.5, 1.5));
        c.objects.push(new Ellipse(c, pos, vel, false, mass));
      }
    }
    sketch.setup();
  }, []);

  useEffect(() => {
    sketch.draw = () => {
      p.clear();
      const bg = setColor(p, [t.primary().hex, t.secondary().hex]);
      c.background = linearGradient(
        c.ctx, p, p.createVector(p.width, p.height), c.center, bg.fill, true
      );
      c.applyGradient();
      for (let item of c.objects) {
        item.bounceOfBorder();
        item.draw();
      }
    }
    sketch.draw();
  }, [props.theme])
  return <Blur id={props.id} />;
}

const Fire = (props) => {
  const { sketch, canvas: c, p, p5 } = props.sketch;
  const t = props.theme;
  const [ colorList, setColorList ] = useState([]);
  useEffect(() => {
    sketch.setup = () => {
      c.force = p.createVector(0, -0.2);
      c.ctx.globalCompositeOperation = "screen";
      p.blendMode(p.ADD);
      const x = c.avg * 0.0015;
      const y = c.avg * 0.001;
      setInterval(() => c.force.set(p.random(-x, x), p.random(0, -y)), 3000);
    }
    sketch.setup();
  }, []);

  useMemo(() => {
    const pp = t.primary();
    const s = t.secondary();
    const rgb = `rgba(${t.mode().rgb.r}, ${t.mode().rgb.g}, ${t.mode().rgb.b}, 0)`;
    const list = [[pp.hex, rgb], [s.hex, rgb]]; 
    const arrList = [pp.lighter, pp.darker, s.lighter, s.darker]
    for (let arr of arrList) {
      for (let color of arr) list.push([color.hex, rgb]);
    }
    setColorList(list);
  }, [props.theme]);

  useEffect(() => {
    sketch.draw = () => {
      p.clear();
      let color = setColor(p, colorList[Math.floor(Math.random() * colorList.length)]);
      for (let i = 0; i < 1; i++) {
        let width = p.random(c.avg * 0.05, c.avg * 0.20);
        let mass = p.createVector(width, width);
        let pos = p.createVector(
          p.random(p.width * 0.45, p.width * 0.55), p.random(p.height * 0.7, p.height * 0.85)
        );
        const vel = p5.Vector.random2D();
        let life = p.random(c.avg * 0.1, c.avg * 0.3);
        c.objects.push(new Ellipse(c, pos, vel, false, mass, color, [0], life));
      }
      for (let [i, item] of c.objects.entries()) {
        item.draw();
        item.applyForce(c.force);
        item.updateLife(i);
        item.sizeLife();
      }
    }
    sketch.draw();
  }, [props.theme]);
  return null;
}

const NetworkLoop = (props) => {
  const { sketch, canvas: c, p, p5} = props.sketch;
  const [ limit ] = useState(c.avg / 5);
  const primary = props.theme.primary().hex;
  useEffect(() => {
    sketch.setup = () => {
      for (let i = 0; i < 30; i++) {
        let mass = p.createVector(1, 1);
        let pos = p.createVector(p.random(10, p.width - 10), p.random(10, p.height - 10));
        let vel = p.createVector(p.random(-1, 1), p.random(-1, 1));
        c.objects.push(new Ellipse(c, pos, vel, false, mass));
      }
    }
    sketch.setup();
  }, []);

  useEffect(() => {
    sketch.draw = () => {
      p.clear();
      for( let i of c.objects) i.color = setColor(p, [primary], primary);
      for (let outer of c.objects) {
        outer.bounceOfBorder();
        let linesConnected = 0;
        for (let inner of c.objects) {
          if (outer !== inner) {
            let dist = p5.Vector.dist(outer.pos, inner.pos);
            if (dist < limit && dist > 1) {
              linesConnected++;
              let alpha = p.map(dist, limit, 0, 0, 1);
              outer.color.fill[0].setAlpha(p.map(alpha, 0, 1, 0, 255))
              outer.color.weight = alpha;
              new Line(c, outer.pos, inner.pos, false, outer.color);
            }
          }
          let newMass = p.map(linesConnected, 0, c.objects.length, 0, 7);
          outer.mass.set(p.createVector(newMass, newMass));
          outer.draw();
        }
      }
    }
    sketch.draw();
  }, [props.theme]);
  return null;
}

const Wave = (props) => {
  const { sketch, canvas: c, p } = props.sketch;
  useEffect(() => {
    props.cavasRef.current.classList.add('linear-gradient');
    sketch.setup = () => {
      const circleSize = p.width * 2;
      const mass = p.createVector(circleSize, circleSize);
      const vel = p.createVector(0, 0);
      const pos = p.createVector(p.width / 2, (p.height / 2) - (circleSize / 2));
      const color1 = setColor(p, [props.theme.rgb('mode', 1)]);
      const color2 = setColor(p, [props.theme.rgb('mode', 0.5)]);
      c.objects.push(new Rect(
        c, pos, vel, false, mass, color1, [0, 0.01], false, circleSize * 0.45
      ));
      c.objects.push(new Rect(
        c, pos, vel, false, mass, color2, [0, 0.01], false, circleSize * 0.4
      ));
    }  
    sketch.setup();
  }, []);

  useEffect(() => {
    sketch.draw = () => {
      p.clear();
      c.objects[0].color = setColor(p, [props.theme.rgb('mode', 1)]);
      c.objects[1].color = setColor(p, [props.theme.rgb('mode', 0.5)]);
      for (let i of c.objects) i.rotate();
    }
    sketch.draw();
  }, [props.theme]);
  return null;
}

const ParticleFlowfield = (props) => {
  const { sketch, canvas: c, p } = props.sketch;
  const [ mass ] = useState(p.createVector(Math.ceil(c.avg * 0.002), Math.ceil(c.avg * 0.002)));
  const [ num ] = useState(2);
  useEffect(() => {
    sketch.setup = () => {
      c.setFlowfield(p.floor(p.width * 0.1), 0.1, 2);
      p.noiseDetail(1);
    }
    sketch.setup();
  }, []);

  useEffect(() => {
    sketch.draw = () => {
      p.blendMode(props.theme.is_dark ? p.ADD : p.DIFFERENCE);
      p.clear();
      const bg = setColor(p, [props.theme.primary().hex, props.theme.secondary().hex]);
      c.background = linearGradient(
        c.ctx, p, p.createVector(p.width, p.height), c.center, bg.fill, true
      );
      c.applyGradient();
      c.updateFlowfield();
      // c.drawFlowfield();
      for (let i = 0; i < num; i++) {
        let pos = p.createVector(
          p.random(mass.x, p.width - mass.x), p.random(mass.y, p.height - mass.y)
        );
        c.objects.push(new Ellipse(c, pos, false, false, mass, setColor(p, ['white'])));
      }
      for (let i of c.objects) {
        let zone = c.getFieldZone(i.pos);
        i.applyForce(zone.vel, 3);
        i.edges();
        i.draw();
      }
      if (c.objects.length > c.avg) c.objects.splice(0, num);
    }
    sketch.draw();
  }, [props.theme]);

  return null;
}

const OrbitAnim = (props) => {
  const { sketch, canvas: c, p } = props.sketch;
  const t = props.theme;
  const [ min ] = useState(c.avg * 0.1);
  const [ max ] = useState(c.avg * 1.3);
  useEffect(() => {
    sketch.setup = () => {
      let rev = setColor(p, [t.rev().hex], t.rev().hex);
      let pos = p.createVector(p.width / 2, p.height / 2);
      const objMass = p.createVector(c.avg * 0.001, c.avg * 0.001);
      const acc = p.createVector(0, 0);
      for (let i = 0; i < parseInt(c.avg * 0.05); i++) {
        let width = parseInt(p.random(min, max));
        let mass = p.createVector(width, width);
        let vel = p.createVector(p.random(1, 5), p.random(1,5));
        let orbitCircle = new Ellipse(c, pos, vel, acc, mass, false, [0,0.01]);
        let orbit = new Orbit(c, orbitCircle);
        let objPos = p.createVector(p.random(mass.x, p.width), p.random(mass.y, p.height));
        for (let i = 0; i < Math.ceil(width * 0.01); i++) {
          let angle = [p.random(1, 360), p.random(0.002, 0.005)]
          orbit.children.push(new Ellipse(c, objPos, vel, acc, objMass, rev, angle, false));
        }
        c.objects.push(orbit);
      }
    }
    sketch.setup();
  }, []);

  useEffect(() => {
    sketch.draw = () => {
      let rev = setColor(p, [t.rev().hex], t.rev().hex);
      for (let orbit of c.objects) {
        for( let children of orbit.children) children.color = rev;
      }
      p.background(t.mode().rgb.r, t.mode().rgb.g, t.mode().rgb.b, 60);
      let vel = p.random(-0.4, 0.4);
      for (let i of c.objects) {
        i.rotate();
        if (i.orbit.mass.x < min || i.orbit.mass.x > max) vel = -vel;
        i.orbit.mass.x += vel;
        i.orbit.mass.y += vel;
      }
    }
    sketch.draw();
  }, [props.theme]);
  return null;
}

const BlobWCTC = withCTRC(Blob);
const FireWCTC = withCTRC(Fire);
const WaveWCTC = withCTRC(Wave);
const NetworkLoopWCTC = withCTRC(NetworkLoop);
const ParticleFlowfieldWCTC = withCTRC(ParticleFlowfield);
const OrbitAnimWCTC = withCTRC(OrbitAnim);

export { ParticleFlowfieldWCTC, OrbitAnimWCTC, BlobWCTC, FireWCTC, NetworkLoopWCTC, WaveWCTC }  