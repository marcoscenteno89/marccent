// Canvas utility classes and functions to interact with canvas


const gradient = (canvas, color1, color2, x, y, radius) => {
  try {
    let grad = canvas.createRadialGradient(x, y, radius / 2, x, y, radius);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    return grad;
  } catch (error) {
    console.log(color1, color2, x, y, radius);
    console.log(error);
  }
}

const getAngle = (degree) => degree * Math.PI/360;

const getCordinatesDistance = (x1, y1, x2, y2) => {
  let x = Math.abs(x1 - x2);
  let y = Math.abs(y1 - y2);
  return Math.sqrt(x * x + y * y);
}

class Canvas {
  constructor(node) {
    this.node = node;
    this.node.width = node.offsetWidth;
    this.node.height = node.offsetHeight;
    this.ctx = node.getContext('2d');
    this.animationId = 0;
    this.children = [];
    this.callback = false;
  }
  async init() {
    if (this.node.height === 0) {
      return new Promise( async (resolve) => {
        window.requestAnimationFrame(() => {
          this.node.height = this.node.offsetHeight;
          resolve(true);
        });
      });
    }
  }
  observer() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.start(this.callback);
        } else {
          this.stop();
        }
       });
     });
    observer.observe(this.node);
  }
  registerCallback(callback) {
    this.callback = callback;
    this.observer();
  }
  start() {
    this.callback();
  }
  stop() {
    cancelAnimationFrame(this.animationId);
  }
  clear() {
    this.ctx.clearRect(0, 0, this.node.width, this.node.height);
  }
  bg(color1, color2) {
    if (color2) {
      let grad = this.ctx.createLinearGradient(0, 0, this.node.width, 0);
      grad.addColorStop(0, color1);
      grad.addColorStop(1, color2);
      this.ctx.fillStyle = grad;
    } else {
      this.ctx.fillStyle = color1;
    }
    this.ctx.fillRect(0, 0, this.node.width, this.node.height);
  }
}
class Shape {
  constructor(canvas, x, y, dx, dy, color, rotateSpeed, customData) {
    this.id = canvas.children.length;
    this.type = 
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.ctx = canvas.ctx;
    this.node = canvas.node;
    this.color = color;
    this.customData = customData;
    this.currentAngle = 0;
    this.rotateSpeed = rotateSpeed;
  }

  updateLocation(x, y) {
    this.x = x;
    this.y = y;
  }

  border(color) {
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }

  fill(color) {
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  rotate(callback) {
    let shapeHalf = this.width / 2;
    let angle = getAngle(this.rotateSpeed);
    this.currentAngle = this.currentAngle + angle;
    this.ctx.save();
    this.ctx.translate(this.x + shapeHalf, this.y + shapeHalf);
    this.ctx.rotate(this.currentAngle);
    this.ctx.beginPath();
    callback(shapeHalf, this);
    this.fill(this.color);
    this.ctx.closePath();
    this.ctx.restore();
  }
}
class Circle extends Shape {
  constructor(canvas, x, y, dx, dy, color, rotateSpeed, customData, radius) {
    super(canvas, x, y, dx, dy, color, rotateSpeed, customData);
    this.radius = radius;

    this.draw();
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    super.fill(this.color);
    this.ctx.closePath();
  }

  updateSize(radius) {
    this.radius = parseFloat(radius.toFixed(2));
  }

  bounce() {
    if (this.x + this.radius > this.node.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > this.node.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    } 
    super.updateLocation(this.x + this.dx, this.y + this.dy);
  }
}
class RoundRec extends Shape {
  constructor(canvas, x, y, dx, dy, color, rotateSpeed, customData, width, height, radius) {
    super(canvas, x, y, dx, dy, color, rotateSpeed, customData);
    this.width = width;
    this.height = height;
    this.radius = radius;
  }

  draw() {
    this.ctx.beginPath();
    this.canvas.ctx.roundRect(this.x, this.y, this.width, this.height, this.radius);
    super.fill(this.color);
    this.ctx.closePath();
  }
}
class Polygon extends Shape {
  constructor(sides) {
    this.sides = sides;
    
  }
}

class Lines {
  constructor(canvas, startX, startY, endX, endY, color, lineWidth) {
    this.ctx = canvas.ctx;
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.color = color;
    this.lineWidth = lineWidth;
    
    this.draw();
  }

  draw() {
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
    this.ctx.lineTo(this.endX, this.endY);
    this.ctx.stroke();
    this.ctx.closePath();
  }
}
export { Canvas, Circle, gradient, RoundRec, Lines, getCordinatesDistance }