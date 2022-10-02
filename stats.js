var Stats = function () {
  let maxFps = 0,
    minFps = 1000;
  var j = 0,
    u = 2,
    C = 0,
    E = Date.now(),
    w = E,
    f = E,
    fpsDiv,
    fpsText,
    canvas,
    ctx,
    B,
    k = 0,
    G = 1000,
    a = 0,
    msDiv,
    msText,
    p,
    D,
    l,
    v = 0,
    o = 1000,
    s = 0,
    h,
    n,
    z,
    g,
    b,
    y = {
      fps: {
        bg: {
          r: 16,
          g: 16,
          b: 48,
        },
        fg: {
          r: 0,
          g: 255,
          b: 255,
        },
      },
      ms: {
        bg: {
          r: 16,
          g: 48,
          b: 16,
        },
        fg: {
          r: 0,
          g: 255,
          b: 0,
        },
      },
      mem: {
        bg: {
          r: 48,
          g: 16,
          b: 26,
        },
        fg: {
          r: 255,
          g: 0,
          b: 128,
        },
      },
    };
  const parent = document.createElement("div");
  parent.style.fontFamily = "Helvetica, Arial, sans-serif";
  parent.style.textAlign = "left";
  parent.style.fontSize = "9px";
  parent.style.opacity = "0.9";
  parent.style.width = "80px";
  parent.style.cursor = "pointer";
  parent.addEventListener("click", H, false);
  fpsDiv = document.createElement("div");
  fpsDiv.style.backgroundColor =
    "rgb(" +
    Math.floor(y.fps.bg.r / 2) +
    "," +
    Math.floor(y.fps.bg.g / 2) +
    "," +
    Math.floor(y.fps.bg.b / 2) +
    ")";
  fpsDiv.style.padding = "2px 0px 3px 0px";
  parent.appendChild(fpsDiv);
  fpsText = document.createElement("div");
  fpsText.innerHTML = "<strong>FPS</strong>";
  fpsText.style.color = "rgb(" + y.fps.fg.r + "," + y.fps.fg.g + "," + y.fps.fg.b + ")";
  fpsText.style.margin = "0px 0px 1px 3px";
  fpsDiv.appendChild(fpsText);
  canvas = document.createElement("canvas");
  canvas.width = 74;
  canvas.height = 30;
  canvas.style.display = "block";
  canvas.style.marginLeft = "3px";
  fpsDiv.appendChild(canvas);
  ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgb(" + y.fps.bg.r + "," + y.fps.bg.g + "," + y.fps.bg.b + ")";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  B = ctx.getImageData(0, 0, canvas.width, canvas.height);
  msDiv = document.createElement("div");
  msDiv.style.backgroundColor =
    "rgb(" +
    Math.floor(y.ms.bg.r / 2) +
    "," +
    Math.floor(y.ms.bg.g / 2) +
    "," +
    Math.floor(y.ms.bg.b / 2) +
    ")";
  msDiv.style.padding = "2px 0px 3px 0px";
  msDiv.style.display = "none";
  parent.appendChild(msDiv);
  msText = document.createElement("div");
  msText.innerHTML = "<strong>MS</strong>";
  msText.style.color = "rgb(" + y.ms.fg.r + "," + y.ms.fg.g + "," + y.ms.fg.b + ")";
  msText.style.margin = "0px 0px 1px 3px";
  msDiv.appendChild(msText);
  p = document.createElement("canvas");
  p.width = 74;
  p.height = 30;
  p.style.display = "block";
  p.style.marginLeft = "3px";
  msDiv.appendChild(p);
  D = p.getContext("2d");
  D.fillStyle = "rgb(" + y.ms.bg.r + "," + y.ms.bg.g + "," + y.ms.bg.b + ")";
  D.fillRect(0, 0, p.width, p.height);
  l = D.getImageData(0, 0, p.width, p.height);
  try {
    if (webkitPerformance && webkitPerformance.memory.totalJSHeapSize) {
      u = 3;
    }
  } catch (x) {}
  h = document.createElement("div");
  h.style.backgroundColor =
    "rgb(" +
    Math.floor(y.mem.bg.r / 2) +
    "," +
    Math.floor(y.mem.bg.g / 2) +
    "," +
    Math.floor(y.mem.bg.b / 2) +
    ")";
  h.style.padding = "2px 0px 3px 0px";
  h.style.display = "none";
  parent.appendChild(h);
  n = document.createElement("div");
  n.innerHTML = "<strong>MEM</strong>";
  n.style.color = "rgb(" + y.mem.fg.r + "," + y.mem.fg.g + "," + y.mem.fg.b + ")";
  n.style.margin = "0px 0px 1px 3px";
  h.appendChild(n);
  z = document.createElement("canvas");
  z.width = 74;
  z.height = 30;
  z.style.display = "block";
  z.style.marginLeft = "3px";
  h.appendChild(z);
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
        N[L] = y[K].bg.r;
        N[L + 1] = y[K].bg.g;
        N[L + 2] = y[K].bg.b;
      } else {
        N[L] = y[K].fg.r;
        N[L + 1] = y[K].fg.g;
        N[L + 2] = y[K].fg.b;
      }
    }
  }
  function H() {
    j++;
    j = j == u ? 0 : j;
    fpsDiv.style.display = "none";
    msDiv.style.display = "none";
    h.style.display = "none";
    switch (j) {
      case 0:
        fpsDiv.style.display = "block";
        break;
      case 1:
        msDiv.style.display = "block";
        break;
      case 2:
        h.style.display = "block";
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
        if (u == 3) {
          v = webkitPerformance.memory.usedJSHeapSize * 9.54e-7;
          o = Math.min(o, v);
          s = Math.max(s, v);
          I(b.data, Math.min(30, 30 - v / 2), "mem");
          n.innerHTML = `<strong>${Math.round(v)} MEM</strong> (${Math.round(o)}-${Math.round(s)})`;
          g.putImageData(b, 0, 0);
        }
        f = E;
        C = 0;
      }
    },
  };
};
