if (document.getElementById('tweenmax-header')) {

//FIRST TWEENMAX ANIMATION
(function() {
  var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;
  // Main
  initHeader();
  initAnimation();
  addListeners();
  
  function initHeader() {
    width = window.innerWidth;
    height = window.innerHeight;
    target = {x: width/2, y: height/2};

    largeHeader = document.getElementById('tweenmax-header');
    largeHeader.style.height = height+'px';
    var canv = document.createElement('canvas');
    canv.setAttribute("id", "tweenmax-canvas");
    largeHeader.prepend(canv);
    canvas = document.querySelector('#tweenmax-canvas');
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');

    // create points
    points = [];
    for(var x = 0; x < width; x = x + width/20) {
      for(var y = 0; y < height; y = y + height/20) {
        var px = x + Math.random()*width/20;
        var py = y + Math.random()*height/20;
        var p = {x: px, originX: px, y: py, originY: py };
        points.push(p);
      }
    }

    // for each point find the 5 closest points
    for( var i = 0; i < points.length; i++ ) {
      var closest = [];
      var p1 = points[i];
      for (var j = 0; j < points.length; j++) {
        var p2 = points[j];
        if(!(p1 == p2)) {
          var placed = false;
          for(var k = 0; k < 5; k++) {
            if(!placed) {
              if(closest[k] == undefined) {
                closest[k] = p2;
                placed = true;
              }
            }
          }

          for (var k = 0; k < 5; k++) {
            if(!placed) {
              if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                closest[k] = p2;
                placed = true;
              }
            }
          }
        }
      }
      p1.closest = closest;
    }

    // assign a circle to each point
    for (var i in points) {
      var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
      points[i].circle = c;
    }
  }

  // Event handling
  function addListeners() {
    if(!('ontouchstart' in window)) {
      window.addEventListener('mousemove', mouseMove);
    }
    window.addEventListener('scroll', scrollCheck);
    window.addEventListener('resize', resize);
  }

  function mouseMove(e) {
    var posx = posy = 0;
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    }
    else if (e.clientX || e.clientY)    {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    target.x = posx;
    target.y = posy;
  }

  function scrollCheck() {
    if(document.body.scrollTop > height) animateHeader = false;
    else animateHeader = true;
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    largeHeader.style.height = height+'px';
    canvas.width = width;
    canvas.height = height;
  }

  // animation
  function initAnimation() {
    animate();
    for(var i in points) {
      shiftPoint(points[i]);
    }
  }

  function animate() {
    if(animateHeader) {
      ctx.clearRect(0,0,width,height);
      for(var i in points) {
        // detect points in range
        if(Math.abs(getDistance(target, points[i])) < 4000) {
          points[i].active = 0.3;
          points[i].circle.active = 0.6;
        } else if(Math.abs(getDistance(target, points[i])) < 20000) {
          points[i].active = 0.1;
          points[i].circle.active = 0.3;
        } else if(Math.abs(getDistance(target, points[i])) < 40000) {
          points[i].active = 0.02;
          points[i].circle.active = 0.1;
        } else {
          points[i].active = 0;
          points[i].circle.active = 0;
        }

        drawLines(points[i]);
        points[i].circle.draw();
      }
    }
    requestAnimationFrame(animate);
  }

  function shiftPoint(p) {
    TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
      y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
      onComplete: function() {
        shiftPoint(p);
      }});
  }

  // Canvas manipulation
  function drawLines(p) {
    if(!p.active) return;
    for(var i in p.closest) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.closest[i].x, p.closest[i].y);
      ctx.strokeStyle = 'rgba(156,217,249,'+ p.active +')';
      ctx.stroke();
    }
  }

  function Circle(pos,rad,color) {
    var _this = this;

    // constructor
    (function() {
      _this.pos = pos || null;
      _this.radius = rad || null;
      _this.color = color || null;
    })();

    this.draw = function() {
      if(!_this.active) return;
      ctx.beginPath();
      ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'rgba(156,217,249,'+_this.active+')';
      ctx.fill();
    };
  }

  // Util
  function getDistance(p1, p2) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
  }

})();

//SECOND TWEENMAX ANIMATION
(function() {

  var header = document.getElementById('tweenmax-header');
  var createcanvas = document.createElement('canvas');
  createcanvas.setAttribute("id", "tweenmax-canvas-two");
  header.prepend(createcanvas);

  var canvas = document.getElementById('tweenmax-canvas-two'),
  can_w = parseInt(canvas.getAttribute('width')),
  can_h = parseInt(canvas.getAttribute('height')),
  ctx = canvas.getContext('2d');

  var linelength, ballsize;
  var query =  window.matchMedia("(max-width: 568px)");
  if (query.matches) {
    linelength = 50;
    ballsize = 1;
  } else {
    linelength = 320;
    ballsize = 3;
  }

  var ball = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    r: 0,
    alpha: 1,
    phase: 0
    },
    ball_color = {
      r: 156,
      g: 217,
      b: 249
    },
    R = ballsize,
    balls = [],
    alpha_f = 0.03,
    alpha_phase = 0,
    
  // Line
    link_line_width = 0.8,
    dis_limit = linelength,
    add_mouse_point = true,
    mouse_in = false,
    mouse_ball = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    r: 0,
    type: 'mouse'
    };
  
  // Random speed
  function getRandomSpeed(pos){
    var  min = -1,
      max = 1;
    switch(pos){
      case 'top':
        return [randomNumFrom(min, max), randomNumFrom(0.1, max)];
        break;
      case 'right':
        return [randomNumFrom(min, -0.1), randomNumFrom(min, max)];
        break;
      case 'bottom':
        return [randomNumFrom(min, max), randomNumFrom(min, -0.1)];
        break;
      case 'left':
        return [randomNumFrom(0.1, max), randomNumFrom(min, max)];
        break;
      default:
        return;
        break;
    }
  }
  function randomArrayItem(arr){
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function randomNumFrom(min, max){
    return Math.random()*(max - min) + min;
  }

  // Random Ball
  function getRandomBall(){
    var pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
    switch(pos){
      case 'top':
        return {
          x: randomSidePos(can_w),
          y: -R,
          vx: getRandomSpeed('top')[0],
          vy: getRandomSpeed('top')[1],
          r: R,
          alpha: 1,
          phase: randomNumFrom(0, 10)
        }
        break;
      case 'right':
        return {
          x: can_w + R,
          y: randomSidePos(can_h),
          vx: getRandomSpeed('right')[0],
          vy: getRandomSpeed('right')[1],
          r: R,
          alpha: 1,
          phase: randomNumFrom(0, 10)
        }
        break;
      case 'bottom':
        return {
          x: randomSidePos(can_w),
          y: can_h + R,
          vx: getRandomSpeed('bottom')[0],
          vy: getRandomSpeed('bottom')[1],
          r: R,
          alpha: 1,
          phase: randomNumFrom(0, 10)
        }
        break;
      case 'left':
        return {
          x: -R,
          y: randomSidePos(can_h),
          vx: getRandomSpeed('left')[0],
          vy: getRandomSpeed('left')[1],
          r: R,
          alpha: 1,
          phase: randomNumFrom(0, 10)
        }
        break;
    }
  }
  function randomSidePos(length){
    return Math.ceil(Math.random() * length);
  }
  
  // Draw Ball
  function renderBalls(){
    Array.prototype.forEach.call(balls, function(b){
      if(!b.hasOwnProperty('type')){
        ctx.fillStyle = 'rgba('+ball_color.r+','+ball_color.g+','+ball_color.b+','+b.alpha+')';
        ctx.beginPath();
        ctx.arc(b.x, b.y, R, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
      }
    });
  }
  
  // Update balls
  function updateBalls(){
    var new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
      b.x += b.vx;
      b.y += b.vy;
      
      if(b.x > -(50) && b.x < (can_w+50) && b.y > -(50) && b.y < (can_h+50)){
        new_balls.push(b);
      }
      
      // alpha change
      b.phase += alpha_f;
      b.alpha = Math.abs(Math.cos(b.phase));
      // console.log(b.alpha);
    });
    
    balls = new_balls.slice(0);
  }
  
  // loop alpha
  function loopAlphaInf(){
    
  }
  
  // Draw lines
  function renderLines(){
    var fraction, alpha;
    for (var i = 0; i < balls.length; i++) {
      for (var j = i + 1; j < balls.length; j++) {
        
        fraction = getDisOf(balls[i], balls[j]) / dis_limit;
        
        if(fraction < 1){
          alpha = (1 - fraction).toString();
  
          ctx.strokeStyle = 'rgba(156,217,249,'+alpha+')';
          ctx.lineWidth = link_line_width;
          
          ctx.beginPath();
          ctx.moveTo(balls[i].x, balls[i].y);
          ctx.lineTo(balls[j].x, balls[j].y);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
  }
  
  // calculate distance between two points
  function getDisOf(b1, b2){
    var  delta_x = Math.abs(b1.x - b2.x),
      delta_y = Math.abs(b1.y - b2.y);
    
    return Math.sqrt(delta_x*delta_x + delta_y*delta_y);
  }
  
  // add balls if there a little balls
  function addBallIfy(){
    if(balls.length < 20){
      balls.push(getRandomBall());
    }
  }
  
  // Render
  function render(){
    ctx.clearRect(0, 0, can_w, can_h);
    
    renderBalls();
    
    renderLines();
    
    updateBalls();
    
    addBallIfy();
    
    window.requestAnimationFrame(render);
  }
  
  // Init Balls
  function initBalls(num){
    for(var i = 1; i <= num; i++){
      balls.push({
        x: randomSidePos(can_w),
        y: randomSidePos(can_h),
        vx: getRandomSpeed('top')[0],
        vy: getRandomSpeed('top')[1],
        r: R,
        alpha: 1,
        phase: randomNumFrom(0, 10)
      });
    }
  }
  // Init Canvas
  function initCanvas(){
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    
    can_w = parseInt(canvas.getAttribute('width'));
    can_h = parseInt(canvas.getAttribute('height'));
  }
  window.addEventListener('resize', function(e){
    console.log('Window Resize...');
    initCanvas();
  });
  
  function goMovie(){
    initCanvas();
    initBalls(30);
    window.requestAnimationFrame(render);
  }
  goMovie();
  
  // Mouse effect
  canvas.addEventListener('mouseenter', function(){
    console.log('mouseenter');
    mouse_in = true;
    balls.push(mouse_ball);
  });
  canvas.addEventListener('mouseleave', function(){
    console.log('mouseleave');
    mouse_in = false;
    var new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
      if(!b.hasOwnProperty('type')){
        new_balls.push(b);
      }
    });
    balls = new_balls.slice(0);
  });
  canvas.addEventListener('mousemove', function(e){
    var e = e || window.event;
    mouse_ball.x = e.pageX;
    mouse_ball.y = e.pageY;
    // console.log(mouse_ball);
  });

})();

}