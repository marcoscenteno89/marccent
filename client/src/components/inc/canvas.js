import React, { Component, Fragment } from 'react';
import { ThemeContext } from '../var';
import { Blur, RandomInt, GetMode, RevColor, GetRgb } from './inc';
import { random } from 'lodash';
import { Canvas, Circle, gradient, RoundRec, Lines, getCordinatesDistance } from '../util/canvas';

class Blob extends Component {
  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  async componentDidMount() {
    const canvas = new Canvas(this.ref.current);
    await canvas.init();
    let color = this.props.color;
    for (let i = 0; i < this.props.count; i++) {
      let radius = random(canvas.node.width / 80, canvas.node.width / 10);
      let x = random(radius, canvas.node.width - radius);
      let y = random(radius, canvas.node.height - radius);
      let dx = RandomInt(0.5, 1.5);
      let dy = RandomInt(0.5, 1.5);
      canvas.children.push(new Circle(canvas, x, y, dx, dy, color, 0, {}, radius));
    }

    const callback = () => {
      canvas.clear();
      for (let i of canvas.children) {
        i.bounce(); 
        i.draw();
      }
      canvas.animationId = requestAnimationFrame(callback);
    }
    canvas.registerCallback(callback);
  }

  render() {
    return (
      <Fragment>
        <canvas className={`blob`.concat(' ', this.props.className)} ref={this.ref} />
        <Blur />
      </Fragment>
    )
  }
}

class Fire extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  async componentDidMount() {
    const canvas = new Canvas(this.ref.current);
    await canvas.init();
    let radius = canvas.node.width / 5;
    for (let i = 0; i < this.props.count; i++) {
      let x = random(radius * 1.8, canvas.node.width - radius * 1.8);
      let y = random(canvas.node.height - (radius / 1.5), canvas.node.height - (radius * 1.5));
      let dy = random(0.1, 4);
      canvas.ctx.globalCompositeOperation = 'screen';
      let customData = {
        originalY: y,
        originalRadius: radius,
        originalColor: this.props.color
      }
      let color = gradient(canvas.ctx, this.props.color, 'rgba(0, 0, 0, 0)', x, y, radius);
      canvas.children.push(new Circle(canvas, x, y, 0, dy, color, 0, customData, radius));
    }
    const callback = () => {
      canvas.clear();
      for (let i of canvas.children) {
        if (i.radius < 6) {
          i.radius = i.customData.originalRadius;
          i.y = i.customData.originalY;
        }
        i.updateSize(i.radius - i.dy);
        i.updateLocation(i.x, i.y - (i.dy * 3));
        i.ctx.globalCompositeOperation = 'screen';
        i.color = gradient(
          i.ctx, i.customData.originalColor,'rgba(0, 0, 0, 0)', i.x, i.y, i.radius
        );
        i.draw();
      }   
      canvas.animationId = requestAnimationFrame(callback);
    }
    canvas.registerCallback(callback);
  }

  render() {
    return (
      <Fragment>
        <canvas className={`fire`.concat(' ',this.props.className)} ref={this.ref} />
      </Fragment>
    )
  }
}

class Liquid extends Component {

  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    // this.state = {
    //   theme: false
    // }
    this.ref = React.createRef();
  }

  async componentDidMount() { 
    const a = this.context.theme
    const canvas = new Canvas(this.ref.current);
    await canvas.init();
    canvas.bg(a.hex.primary, a.hex.secondary);
    let size = canvas.node.width * 2;
    let x = -(canvas.node.width / 2);
    let y = -(size - (canvas.node.height / 2));
    canvas.children.push(
      new RoundRec(canvas, x, y, 0, 0, GetMode(a, 0.5), 3, {}, size, size, size / 2.5, 1)
    );
    canvas.children.push(
      new RoundRec(canvas, x, y, 0, 0, GetMode(a, 1), 3, {}, size, size, size / 2.2, 1)
    );

    const callback = () => {
      canvas.clear();
      canvas.bg(a.hex.primary, a.hex.secondary);
      const rotateCallback = (shapeHalf, shape) => {
        canvas.ctx.roundRect(-shapeHalf, -shapeHalf, shape.width, shape.height, shape.radius);
      }
      for (let i of canvas.children) {
        i.rotate(rotateCallback);
      }   
      canvas.animationId = requestAnimationFrame(callback);
    }
    canvas.registerCallback(callback);
  }

  render() {
    return (
      <Fragment>
        <canvas 
          key="temp-liquid" 
          className={`liquid`.concat(' ', this.props.className)} 
          ref={this.ref} />
      </Fragment>
    )
  }
}

class LinesCircles extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    const canvas = new Canvas(this.ref.current);
    let rgb = GetRgb(this.props.color);
    canvas.init();
    let limit = canvas.node.width / 3;
    for (let i = 0; i < this.props.count; i++) {
      let x = random(10, canvas.node.width - 10);
      let y = random(10, canvas.node.height - 10);
      let dx = RandomInt(0.1, 0.5);
      let dy = RandomInt(0.1, 0.5);
      canvas.children.push(new Circle(canvas, x, y, dx, dy, this.props.color, 0, {}, 2));
    }

    const callback = () => {
      canvas.clear();
      for (let i of canvas.children) {
        let linesConnected = 0;
        for (let e of canvas.children) {
          let distance = getCordinatesDistance(i.x, i.y, e.x, e.y);
          if (distance < limit && distance > 1 ) {
            linesConnected++;
            let lineWidth = ((limit - distance) / limit).toFixed(1);
            let color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${lineWidth})`;
            new Lines(canvas, i.x, i.y, e.x, e.y, color, lineWidth);
          }
        }
        i.bounce();
        i.updateSize(linesConnected / 2);
        let newColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${linesConnected / 100})`;
        i.fill(newColor);
        i.draw();
      }
      canvas.animationId = requestAnimationFrame(callback);
    }
    canvas.registerCallback(callback);
  }

  render() {
    return (
      <Fragment>
        <canvas className={`linescircles`.concat(' ', this.props.className)} ref={this.ref} />
      </Fragment>
    )
  }
}

export { Blob, Fire, LinesCircles, Liquid }