let colors = [
  {
    r: 106,
    g: 4,
    b: 15,
  },
  {
    r: 157,
    g: 2,
    b: 8,
  },
  {
    r: 208,
    g: 0,
    b: 0,
  },
  {
    r: 220,
    g: 47,
    b: 2,
  },
  {
    r: 232,
    g: 93,
    b: 4,
  },
  {
    r: 244,
    g: 140,
    b: 6,
  },
  {
    r: 250,
    g: 163,
    b: 7,
  },
  {
    r: 255,
    g: 186,
    b: 8,
  },
];
class expandingCirle {
  constructor() {
    this.r = random(100, 200);
    this.state = true;
    this.opacity = 255;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.x = random(50, width - 50);
    this.y = random(50, height - 50);
    this.weight = random(1, 3);
  }
  play() {
    strokeWeight(this.weight);
    fill(this.color.r, this.color.g, this.color.b, this.opacity);
    stroke(3,7,30,this.opacity)
    circle(this.x, this.y, this.r);
    this.r += 3;
    this.opacity -= 2;
    if (this.opacity <= 0) {
      this.state = false;
    }
  }
}

class fourCircle {
  constructor() {
    this.d = random(50, 100);
    this.n = 8;
    this.x = (window.innerWidth - (2*this.n - 1)*this.d) /2
    this.y = random(50, height - 50);
    this.cnt = 0;
    this.opacity = 250;
    this.time = 1;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  play() {
    if (this.cnt < this.n) {
      fill(this.color.r, this.color.g, this.color.b, this.opacity);
      noStroke();
      circle(this.x, this.y, this.d);
      if (this.time % 10 == 0) {
        this.x += 2 * this.d;
        // this.wait(1000);
        this.cnt++;
        this.opacity = this.opacity - 20;
      }
      this.time++;
    }
  }
}

class fourPararellLines {
  constructor() {
    this.i = 0;
    this.h = 100;
    this.s = 50;
    this.posx = 100;
    this.w_max = window.innerWidth - 200;
    this.n = 4;
    this.w = window.innerWidth / 8;
    this.wdif = 0;
    this.easing = 0.01;
    this.posy = (window.innerHeight - (this.n*this.h) - ((this.n-1)*this.s))/2;
    this.opacity = 250;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  play() {
    if (this.w < this.w_max) {
      for (let c = 0; c <= (this.n-1); c++) {
        noStroke();
        fill(this.color.r, this.color.g, this.color.b, this.opacity);
        rect(this.posx, this.posy + (this.h + this.s) * c, this.w, this.h);
        this.wdif = this.w_max - this.w;
        this.w = this.w + this.wdif * this.easing;
        this.i++;
        this.opacity = this.opacity -2;
      }
    }
  }
}

class dynamicBackgroundChange {
  constructor() {
    this.i = 100;
    this.t = 0;
    this.cnt = 0;
  }

  play() {
    if (this.cnt < 50) {
      if (this.t < 100) {
        background(3, 7, 30, this.t);
        this.t = this.t + 10;
      }
      if (this.t == 100) {
        background(220);
        this.t = 0;
      }
    }
    this.cnt ++;
  }
}

class smoothTransition {
  constructor() {
    this.y = 0;
    this.x = 0;
    this.w = window.innerWidth / 8;
    this.h = window.innerHeight;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.cnt = 0;
  }

  play() {
    fill(this.color.r, this.color.g, this.color.b);
    rect(this.x, this.y, this.w, this.h);
    this.w += 55;
    this.cnt++;
    if (this.cnt > 20) {
      this.x += 35;
    }
  }
}

class expandingPolygon {
  constructor(n) {
    this.n = n;
    this.a = random(100, 200);
    this.x = random(50, width - 50);
    this.y = random(50, height - 50);
    this.opacity = 255;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.weight = random(1, 3);
  }
  play() {
    strokeWeight(this.weight);
    stroke(3,7,30,this.opacity)
    fill(this.color.r, this.color.g, this.color.b, this.opacity);
    // noFill();
    this.regularPolygon(this.x, this.y, this.n, this.a);
    this.a += 2;
    this.opacity -= 2;
  }
  regularPolygon(x, y, n, radius) {
    beginShape();
    for (let i = 0; i < n; i++) {
      vertex(x + cos((i * TAU) / n) * radius, y + sin((i * TAU) / n) * radius);
    }
    endShape(CLOSE);
  }
}

class sineWave {
  constructor() {
    this.xspacing = 5; // Distance between each horizontal location
    this.w = window.innerWidth + 16; // Width of entire wave
    this.theta = 0.0; // Start angle at 0
    this.amplitude = 400; // Height of wave
    this.period = random(30,100); // How many pixels before the wave repeats
    this.dx = (TWO_PI / this.period) * this.xspacing; // Value for incrementing x
    this.yvalues = new Array(floor(this.w / this.xspacing)); // Using an array to store height values for the wave
    this.cnt = 0;
    this.opacity = 255;
    this.color = colors[Math.floor(Math.random() * colors.length)];
}

  play() {
    // background(0);
      this.calcWave();
      this.renderWave();
      this.opacity = this.opacity -3;
  }

  calcWave() {
    // Increment theta (try different values for
    // 'angular velocity' here)
    this.theta += 0.02;

    // For every x value, calculate a y value with sine function
    let x = this.theta;
    for (let i = 0; i < this.yvalues.length; i++) {
      this.yvalues[i] = sin(x) * this.amplitude;
      x += this.dx;
    }
  }
  renderWave() {
    noStroke();
    fill(this.color.r, this.color.g, this.color.b, this.opacity);
    // A simple way to draw the wave with an ellipse at each location
    for (let x = 0; x < this.yvalues.length; x++) {
      ellipse(x * this.xspacing, window.innerHeight / 2 + this.yvalues[x], 16, 16);
    }
  }
}


class multipleSineWaves {
  constructor() {
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = 255;
    this.xspacing = 1; // Distance between each horizontal location
    this.w = window.innerWidth + 16; // Width of entire wave
    this.theta = 0.0; // Start angle at 0
    this.amplitude = random(50, 200); // Height of wave
    this.period = random(250, 350); // How many pixels before the wave repeats
    this.dx = (TWO_PI / this.period) * this.xspacing; // Value for incrementing x
    this.yvalues = new Array(floor(this.w / this.xspacing)); // Using an array to store height values for the wave
    this.cnt = 0;
}

  play() {
      this.calcWave();
      this.renderWave();
      this.cnt++;
      this.opacity = this.opacity / 1.25;
  }

  calcWave() {
    // Increment theta (try different values for
    // 'angular velocity' here)
    this.theta += 0.09;

    // For every x value, calculate a y value with sine function
    let x = this.theta;
    for (let i = 0; i < this.yvalues.length; i++) {
      this.yvalues[i] = sin(x) * this.amplitude;
      x += this.dx;
    }
  }
  renderWave() {
    noStroke();
    fill(this.color.r, this.color.g, this.color.b, this.opacity);
    // A simple way to draw the wave with an ellipse at each location
    for (let x = 0; x < this.yvalues.length; x++) {
      ellipse(x * this.xspacing, window.innerHeight /4 + this.yvalues[x], 16, 16);
      ellipse(x * this.xspacing, window.innerHeight / 2 + this.yvalues[x], 16, 16);
      ellipse(x * this.xspacing, (window.innerHeight / 4)*3 + this.yvalues[x], 16, 16);
    }
  }
}

class spiral {
  constructor() {
    this.angle = 2.0;
    this.offsetx = random(300, window.innerWidth-300);
    this.offsety = random(300, window.innerHeight-300)
    this.scalar = 1;
    this.speed = 7;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.cnt = 0;
    // this.opacity = 255;
  }

  play() { 
    noStroke();
    fill(this.color.r, this.color.g, this.color.b);
    let x = this.offsetx + cos(this.angle) * this.scalar;
    let y = this.offsety + sin(this.angle) * this.scalar;
    if (this.cnt < 30) {
      ellipse(x, y, 50, 50);
    }
    this.angle += this.speed;
    this.scalar = this.speed+100;
    this.cnt++;
  }
}

class multipleLines {
  constructor() {
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = 255;
  }

  play() { 
  for (let n = 0; n<30; n++) {
    stroke(this.color.r, this.color.g, this.color.b, this.opacity);
    line(random(0,window.innerWidth), 0, random(0,window.innerHeight), window.innerWidth)
  }
  this.opacity = this.opacity-2.5;
}
  }
