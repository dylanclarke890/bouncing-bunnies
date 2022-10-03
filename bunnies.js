class Bunny {
  constructor() {
    this.speedX = Math.random() * 10 - 4;
    this.speedY = Math.random() * 10 - 5;
    this.x = 0;
    this.y = 0;
  }
}

let snapping = false,
  bcolor = "rgba(255, 255, 255, 1)",
  bunnies = [],
  stats;

const numBunnies = 3000,
  gravity = 3,
  img = new Image();
img.src = "wabbit_alpha.png";

function setup() {
  for (let i = 0; i < numBunnies; i++) bunnies.push(new Bunny());
  stats = new Stats({
    domElementStyles: {
      position: "fixed",
      left: "0px",
      top: "0px",
    },
    appendTo: document.body,
  });
}

function toggleSnapping() {
  snapping = document.getElementById("snapped").checked;
  bcolor = snapping ? "rgba(200, 200, 255, 1)" : "rgba(255, 255, 255, 1)";
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const { width, height } = canvas;

function update() {
  ctx.fillStyle = bcolor;
  ctx.fillRect(0, 0, width, height);
  for (let i = 0; i < numBunnies; i++) {
    const bunny = bunnies[i];
    bunny.x += bunny.speedX;
    bunny.y += bunny.speedY;
    bunny.speedY += gravity;

    if (bunny.x > width) {
      bunny.speedX *= -1;
      bunny.x = width;
    } else if (bunny.x < 0) {
      bunny.speedX *= -1;
      bunny.x = 0;
    }

    if (bunny.y > height) {
      bunny.speedY *= -0.8;
      bunny.y = height;
      if (Math.random() > 0.5) bunny.speedY -= Math.random() * 12;
    } else if (bunny.y < 0) {
      bunny.speedY = 0;
      bunny.y = 0;
    }
    if (snapping) ctx.drawImage(img, (0.5 + bunny.x) | 0, (0.5 + bunny.y) | 0);
    else ctx.drawImage(img, bunny.x, bunny.y);
  }
  document.getElementById("snapped").addEventListener("change", toggleSnapping);
}

let stop = false,
  now,
  lastFrame;
const fpsInterval = 1000 / 60;

(function startAnimating() {
  lastFrame = window.performance.now();
  setup();
  animate();
})();

function animate(newtime) {
  if (stop) return;
  requestAnimationFrame(animate);
  now = newtime;
  const elapsed = now - lastFrame;
  if (elapsed > fpsInterval) {
    lastFrame = now - (elapsed % fpsInterval);
    stats.update();
    update();
  }
}
