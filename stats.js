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

function newCanvas(appendTo, bgColor) {
  const canv = document.createElement("canvas");
  canv.width = 74;
  canv.height = 30;
  assignStyles(canv, { display: "block", marginLeft: "3px" });
  appendTo.appendChild(canv);

  const ctx = canv.getContext("2d");
  ctx.fillStyle = `rgb(${bgColor.r},${bgColor.g},${bgColor.b})`;
  ctx.fillRect(0, 0, canv.width, canv.height);
  const data = ctx.getImageData(0, 0, canv.width, canv.height);

  return [ctx, data];
}

function Stats() {
  const colorSchemes = {
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
  var currentPanelIndex = 0,
    maxPanels = 2,
    C = 0,
    now = Date.now(),
    w = now,
    lastFrame = now;

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

  const [fpsCtx, fpsData] = newCanvas(fpsDiv, colorSchemes.fps.bg);

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

  const [msCtx, msData] = newCanvas(msDiv, colorSchemes.ms.bg);

  try {
    if (webkitPerformance && webkitPerformance.memory.totalJSHeapSize) maxPanels = 3;
  } catch (ex) {}

  const memDiv = document.createElement("div");
  assignStyles(memDiv, {
    backgroundColor: `rgb(${Math.floor(colorSchemes.mem.bg.r / 2)}, ${Math.floor(
      colorSchemes.mem.bg.g / 2
    )}, ${Math.floor(colorSchemes.mem.bg.b / 2)})`,
    padding: "2px 0px 3px 0px",
    display: "none",
  });
  parent.appendChild(memDiv);

  const memText = document.createElement("div");
  memText.innerHTML = "<strong>MEM</strong>";
  assignStyles(memText, {
    color: `rgb(${colorSchemes.mem.fg.r},${colorSchemes.mem.fg.g},${colorSchemes.mem.fg.b}`,
    margin: "0px 0px 1px 3px",
  });
  memDiv.appendChild(memText);

  const [memCtx, memData] = newCanvas(memDiv, colorSchemes.mem.bg);

  function drawPanelData(data, M, colorScheme) {
    let L;
    for (let i = 0; i < 30; i++) {
      for (let j = 0; j < 73; j++) {
        L = (j + i * 74) * 4;
        data[L] = data[L + 4];
        data[L + 1] = data[L + 5];
        data[L + 2] = data[L + 6];
      }
    }
    for (let i = 0; i < 30; i++) {
      L = (73 + i * 74) * 4;
      if (i < M) {
        data[L] = colorScheme.bg.r;
        data[L + 1] = colorScheme.bg.g;
        data[L + 2] = colorScheme.bg.b;
      } else {
        data[L] = colorScheme.fg.r;
        data[L + 1] = colorScheme.fg.g;
        data[L + 2] = colorScheme.fg.b;
      }
    }
  }
  function togglePanel() {
    currentPanelIndex++;
    currentPanelIndex = currentPanelIndex == maxPanels ? 0 : currentPanelIndex;
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

  let minFps = 1000,
    maxFps = 0,
    minMs = 1000,
    maxMs = 0,
    minMem = 1000,
    maxMem = 0;

  return {
    domElement: parent,
    update: function () {
      C++;
      now = Date.now();
      const ms = now - w;
      minMs = Math.min(minMs, ms);
      maxMs = Math.max(maxMs, ms);
      drawPanelData(msData.data, Math.min(30, 30 - (ms / 200) * 30), colorSchemes.ms);
      msText.innerHTML = `<strong>${ms} MS</strong>(${minMs}-${maxMs})`;
      msCtx.putImageData(msData, 0, 0);
      w = now;
      if (now > lastFrame + 1000) {
        const fps = Math.round((C * 1000) / (now - lastFrame));
        minFps = Math.min(minFps, fps);
        maxFps = Math.max(maxFps, fps);
        drawPanelData(fpsData.data, Math.min(30, 30 - (fps / 100) * 30), colorSchemes.fps);
        fpsText.innerHTML = `<strong>${fps} FPS</strong> (${minFps}-${maxFps})`;
        fpsCtx.putImageData(fpsData, 0, 0);
        if (maxPanels === 3) {
          const mem = webkitPerformance.memory.usedJSHeapSize * 9.54e-7;
          minMem = Math.min(minMem, mem);
          maxMem = Math.max(maxMem, mem);
          drawPanelData(memData.data, Math.min(30, 30 - mem / 2), colorSchemes.mem);
          memText.innerHTML = `<strong>${Math.round(mem)} MEM</strong> (${Math.round(
            minMem
          )}-${Math.round(maxMem)})`;
          memCtx.putImageData(memData, 0, 0);
        }
        lastFrame = now;
        C = 0;
      }
    },
  };
}
