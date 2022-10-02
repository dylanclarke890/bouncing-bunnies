class Bunny {
  constructor() {
    this.speedX = Math.random() * 10;
    this.speedY = Math.random() * 10 - 5;
    this.x = 0;
    this.y = 0;
  }
}

let snapping = false;
let bcolor = "rgba(255, 255, 255, 1)";

function setup() {
  const numBunnies = 3000;
  let gravity = 3,
    bunnies = [],
    img = new Image();

  img.src = "wabbit_alpha.png";

  for (let i = 0; i < numBunnies; i++) bunnies.push(new Bunny());

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  function render() {
    ctx.fillStyle = bcolor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numBunnies; i++) {
      const bunny = bunnies[i];

      bunny.x += bunny.speedX;
      bunny.y += bunny.speedY;
      bunny.speedY += gravity;

      if (bunny.x > canvas.width) {
        bunny.speedX *= -1;
        bunny.x = canvas.width;
      } else if (bunny.x < 0) {
        bunny.speedX *= -1;
        bunny.x = 0;
      }

      if (bunny.y > canvas.height) {
        bunny.speedY *= -0.8;
        bunny.y = canvas.height;

        if (Math.random() > 0.5) {
          bunny.speedY -= Math.random() * 12;
        }
      } else if (bunny.y < 0) {
        bunny.speedY = 0;
        bunny.y = 0;
      }

      if (snapping) ctx.drawImage(img, (0.5 + bunny.x) | 0, (0.5 + bunny.y) | 0);
      else ctx.drawImage(img, bunny.x, bunny.y);
    }
  }
  var loop = setInterval(function () {
    render();
  }, 1000 / 30);
}

function toggleSnapping() {
  snapping = document.forms[0].snappingCheckbox.checked;
  bcolor = snapping ? "rgba(200, 200, 255, 1)" : "rgba(255, 255, 255, 1)";
}

var interval = setInterval(function () {
  if (typeof Stats == "function") {
    clearInterval(interval);
    const stats = new Stats({
      domElementStyles: {
        position: "fixed",
        left: "0px",
        top: "0px",
      },
      appendTo: document.body,
    });
    setInterval(function () {
      stats.update();
    }, 1000 / 60);
  }
}, 100);
