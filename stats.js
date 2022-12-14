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

class Stats {
  currentPanelIndex = 0;
  maxPanels = 2;
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

  constructor({ ...settings } = {}) {
    const parent = document.createElement("div");
    assignStyles(parent, {
      fontFamily: "Helvetica, Arial, sans-serif",
      textAlign: "left",
      fontSize: "9px",
      opacity: "0.9",
      width: "80px",
      cursor: "pointer",
    });
    parent.addEventListener("click", this.nextPanel, false);

    const fpsDiv = this.panelContainer("fps", "block", parent);
    this.fpsDiv = fpsDiv;
    const fpsText = this.panelText("fps", fpsDiv);
    const [fpsCtx, fpsData] = this.panelCanvas(fpsDiv, this.colorSchemes.fps.bg);

    const msDiv = this.panelContainer("ms", "none", parent);
    this.msDiv = msDiv;
    const msText = this.panelText("ms", msDiv);
    const [msCtx, msData] = this.panelCanvas(msDiv, this.colorSchemes.ms.bg);

    try {
      if (performance && performance.memory.totalJSHeapSize) this.maxPanels = 3;
    } catch (ex) { }

    const memDiv = this.panelContainer("mem", "none", parent);
    this.memDiv = memDiv;
    const memText = this.panelText("mem", memDiv);
    const [memCtx, memData] = this.panelCanvas(memDiv, this.colorSchemes.mem.bg);

    if (settings.domElementStyles) assignStyles(parent, settings.domElementStyles);
    if (settings.appendTo) settings.appendTo.appendChild(parent);

    function drawPanelData(data, minVal, colorScheme) {
      for (let i = 0; i < 30; i++)
        for (let j = 0; j < 73; j++) {
          const L = (j + i * 74) * 4;
          data[L] = data[L + 4];
          data[L + 1] = data[L + 5];
          data[L + 2] = data[L + 6];
        }

      for (let i = 0; i < 30; i++) {
        const L = (73 + i * 74) * 4;
        if (i < minVal) {
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

    let minFps = 1000,
      maxFps = 0,
      minMs = 1000,
      maxMs = 0,
      minMem = 1000,
      maxMem = 0;

    let framesThisSec = 0,
      now = performance.now(),
      last = now,
      lastFrame = now;

    this.domElement = parent;
    this.update = function () {
      framesThisSec++;
      now = performance.now();
      const ms = Math.round(now - last);
      minMs = Math.min(minMs, ms);
      maxMs = Math.max(maxMs, ms);
      drawPanelData(msData.data, Math.min(30, 30 - (ms / 200) * 30), this.colorSchemes.ms);
      msText.innerHTML = `<strong>${ms} MS</strong>(${minMs}-${maxMs})`;
      msCtx.putImageData(msData, 0, 0);
      last = now;
      if (now > lastFrame + 1000) {
        const fps = Math.round((framesThisSec * 1000) / (now - lastFrame));
        minFps = Math.min(minFps, fps);
        maxFps = Math.max(maxFps, fps);
        drawPanelData(fpsData.data, Math.min(30, 30 - (fps / 100) * 30), this.colorSchemes.fps);
        fpsText.innerHTML = `<strong>${fps} FPS</strong> (${minFps}-${maxFps})`;
        fpsCtx.putImageData(fpsData, 0, 0);
        if (this.maxPanels === 3) {
          const mem = Math.round(performance.memory.usedJSHeapSize * 9.54e-7);
          minMem = Math.min(minMem, mem);
          maxMem = Math.max(maxMem, mem);
          drawPanelData(memData.data, Math.min(30, 30 - mem / 2), this.colorSchemes.mem);
          memText.innerHTML = `<strong>${mem} MEM</strong> (${minMem}-${maxMem})`;
          memCtx.putImageData(memData, 0, 0);
        }
        lastFrame = now;
        framesThisSec = 0;
      }
    };
  }

  panelContainer = (panelColor, display, appendTo) => {
    const div = document.createElement("div");
    assignStyles(div, {
      backgroundColor: `rgb(${Math.floor(this.colorSchemes[panelColor].bg.r / 2)},${Math.floor(
        this.colorSchemes[panelColor].bg.g / 2
      )},${Math.floor(this.colorSchemes[panelColor].bg.b / 2)})`,
      padding: "2px 0px 3px 0px",
      display,
    });
    appendTo.appendChild(div);
    return div;
  };

  panelText = (panelType, appendTo) => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${panelType.toUpperCase()}</strong>`;
    assignStyles(div, {
      color: `rgb(${this.colorSchemes[panelType].fg.r},${this.colorSchemes[panelType].fg.g},${this.colorSchemes[panelType].fg.b})`,
      margin: "0px 0px 1px 3px",
    });
    appendTo.appendChild(div);
    return div;
  };

  panelCanvas = (appendTo, bgColor) => {
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
  };

  nextPanel = () => {
    this.currentPanelIndex++;
    this.currentPanelIndex = this.currentPanelIndex == this.maxPanels ? 0 : this.currentPanelIndex;

    this.fpsDiv.style.display = "none";
    this.msDiv.style.display = "none";
    this.memDiv.style.display = "none";

    switch (this.currentPanelIndex) {
      case 0:
        this.fpsDiv.style.display = "block";
        break;
      case 1:
        this.msDiv.style.display = "block";
        break;
      case 2:
        this.memDiv.style.display = "block";
        break;
      default:
        break;
    }
  };
}
