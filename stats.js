class Color {
  constructor({ ...color } = {}) {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
  }
}

class ColorScheme {
  constructor(bg, fg) {
    this.bg = bg;
    this.fg = fg;
  }
}

function assignStyles(element, styles) {
  for (const styleName in styles) {
    element.style[styleName] = styles[styleName];
  }
}

function Stats() {
  let maxFps = 0,
    minFps = 1000;
  var currentPanelIndex = 0,
    panels = 2,
    C = 0,
    E = Date.now(),
    w = E,
    f = E,
    B,
    k = 0,
    G = 1000,
    a = 0,
    p,
    D,
    l,
    v = 0,
    o = 1000,
    s = 0,
    z,
    g,
    b,
    colorSchemes = {
      fps: new ColorScheme(
        {
          r: 16,
          g: 16,
          b: 48,
        },
        {
          r: 0,
          g: 255,
          b: 255,
        }
      ),
      ms: new ColorScheme(
        {
          r: 16,
          g: 48,
          b: 16,
        },
        {
          r: 0,
          g: 255,
          b: 0,
        }
      ),
      mem: new ColorScheme(
        {
          r: 48,
          g: 16,
          b: 26,
        },
        {
          r: 255,
          g: 0,
          b: 128,
        }
      ),
    };
  const parent = document.createElement("div");
  assignStyles(parent, {
    fontFamily: "Helvetica, Arial, sans-serif",
    textAlign: "left",
    fontSize: "9px",
    opacity: "0.9",
    width: "80px",
    cursor: "pointer",
  });
  parent.addEventListener("click", togglePanel, false);
  const fpsDiv = document.createElement("div");
  assignStyles(fpsDiv, {
    backgroundColor: `rgb(${Math.floor(colorSchemes.fps.bg.r / 2)},${Math.floor(
      colorSchemes.fps.bg.g / 2
    )},${Math.floor(colorSchemes.fps.bg.b / 2)})`,
    padding: "2px 0px 3px 0px",
  });
  parent.appendChild(fpsDiv);
  const fpsText = document.createElement("div");
  fpsText.innerHTML = "<strong>FPS</strong>";
  assignStyles(fpsText, {
    color: `rgb(${colorSchemes.fps.fg.r},${colorSchemes.fps.fg.g},${colorSchemes.fps.fg.b})`,
    margin: "0px 0px 1px 3px",
  });
  fpsDiv.appendChild(fpsText);
  const canvas = document.createElement("canvas");
  canvas.width = 74;
  canvas.height = 30;
  assignStyles(canvas, { display: "block", marginLeft: "3px" });
  fpsDiv.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = `rgb(${colorSchemes.fps.bg.r},${colorSchemes.fps.bg.g},${colorSchemes.fps.bg.b})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  B = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const msDiv = document.createElement("div");
  assignStyles(msDiv, {
    backgroundColor: `rgb(${Math.floor(colorSchemes.ms.bg.r / 2)},${Math.floor(
      colorSchemes.ms.bg.g / 2
    )},${Math.floor(colorSchemes.ms.bg.b / 2)})`,
    padding: "2px 0px 3px 0px",
    display: "none",
  });
  parent.appendChild(msDiv);
  const msText = document.createElement("div");
  msText.innerHTML = "<strong>MS</strong>";
  assignStyles(fpsText, {
    color: `rgb(${colorSchemes.ms.fg.r},${colorSchemes.ms.fg.g},${colorSchemes.ms.fg.b})`,
    margin: "0px 0px 1px 3px",
  });
  msDiv.appendChild(msText);
  p = document.createElement("canvas");
  p.width = 74;
  p.height = 30;
  assignStyles(p, { display: "block", marginLeft: "3px" });
  msDiv.appendChild(p);
  D = p.getContext("2d");
  D.fillStyle = `rgb(${colorSchemes.ms.bg.r},${colorSchemes.ms.bg.g},${colorSchemes.ms.bg.b})`;
  D.fillRect(0, 0, p.width, p.height);
  l = D.getImageData(0, 0, p.width, p.height);
  try {
    if (webkitPerformance && webkitPerformance.memory.totalJSHeapSize) panels = 3;
  } catch (ex) {}
  const memDiv = document.createElement("div");
  memDiv.style.backgroundColor = `rgb(${Math.floor(colorSchemes.mem.bg.r / 2)}, ${Math.floor(
    colorSchemes.mem.bg.g / 2
  )}, ${Math.floor(colorSchemes.mem.bg.b / 2)})`;
  memDiv.style.padding = "2px 0px 3px 0px";
  memDiv.style.display = "none";
  parent.appendChild(memDiv);
  const memText = document.createElement("div");
  memText.innerHTML = "<strong>MEM</strong>";
  memText.style.color = `rgb(${colorSchemes.mem.fg.r},${colorSchemes.mem.fg.g},${colorSchemes.mem.fg.b}`;
  memText.style.margin = "0px 0px 1px 3px";
  memDiv.appendChild(memText);
  z = document.createElement("canvas");
  z.width = 74;
  z.height = 30;
  assignStyles(z, { display: "block", marginLeft: "3px" });
  memDiv.appendChild(z);
  g = z.getContext("2d");
  g.fillStyle = "#301010";
  g.fillRect(0, 0, z.width, z.height);
  b = g.getImageData(0, 0, z.width, z.height);
  function I(N, M, K) {
    let L;
    for (let i = 0; i < 30; i++) {
      for (let j = 0; j < 73; j++) {
        L = (j + i * 74) * 4;
        N[L] = N[L + 4];
        N[L + 1] = N[L + 5];
        N[L + 2] = N[L + 6];
      }
    }
    for (let i = 0; i < 30; i++) {
      L = (73 + i * 74) * 4;
      if (i < M) {
        N[L] = colorSchemes[K].bg.r;
        N[L + 1] = colorSchemes[K].bg.g;
        N[L + 2] = colorSchemes[K].bg.b;
      } else {
        N[L] = colorSchemes[K].fg.r;
        N[L + 1] = colorSchemes[K].fg.g;
        N[L + 2] = colorSchemes[K].fg.b;
      }
    }
  }
  function togglePanel() {
    currentPanelIndex++;
    currentPanelIndex = currentPanelIndex == panels ? 0 : currentPanelIndex;
    fpsDiv.style.display = "none";
    msDiv.style.display = "none";
    memDiv.style.display = "none";
    switch (currentPanelIndex) {
      case 0:
        fpsDiv.style.display = "block";
        break;
      case 1:
        msDiv.style.display = "block";
        break;
      case 2:
        memDiv.style.display = "block";
        break;
      default:
        break;
    }
  }
  return {
    domElement: parent,
    update: function () {
      C++;
      E = Date.now();
      k = E - w;
      G = Math.min(G, k);
      a = Math.max(a, k);
      I(l.data, Math.min(30, 30 - (k / 200) * 30), "ms");
      msText.innerHTML = `<strong>${k} MS</strong>(${G}-${a})`;
      D.putImageData(l, 0, 0);
      w = E;
      if (E > f + 1000) {
        const fps = Math.round((C * 1000) / (E - f));
        minFps = Math.min(minFps, fps);
        maxFps = Math.max(maxFps, fps);
        I(B.data, Math.min(30, 30 - (fps / 100) * 30), "fps");
        fpsText.innerHTML = `<strong>${fps} FPS</strong> (${minFps}-${maxFps})`;
        ctx.putImageData(B, 0, 0);
        if (panels == 3) {
          v = webkitPerformance.memory.usedJSHeapSize * 9.54e-7;
          o = Math.min(o, v);
          s = Math.max(s, v);
          I(b.data, Math.min(30, 30 - v / 2), "mem");
          memText.innerHTML = `<strong>${Math.round(v)} MEM</strong> (${Math.round(o)}-${Math.round(
            s
          )})`;
          g.putImageData(b, 0, 0);
        }
        f = E;
        C = 0;
      }
    },
  };
}
