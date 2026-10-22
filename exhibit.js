/* exhibit.js: shared viewer. renderExhibit(root, data, opts) -> { destroy() } */
(function (global) {
  var EV = { documented: "Documented", inferred: "Inferred", speculative: "Speculative" };
  // Dark, single-surface theme. Tune colours through the variables on .exh.
  // The blue active-step bar is switched off for now; to bring it back set --step-bar-active:#0b5fff.
  var CSS = [
    ".exh{--bg:#000;--fg:#ebe7df;--muted:#a9a49b;--accent:#c9b27c;--line:#2b2b2b;--step-bar:transparent;--step-bar-active:transparent;display:grid;grid-template-columns:1.2fr 1fr;font:16px/1.6 system-ui,sans-serif;color:var(--fg);background:var(--bg)}",
    ".exh .stage{position:sticky;top:0;height:100vh;background:var(--bg)}",
    ".exh model-viewer{width:100%;height:100%;background:var(--bg);--poster-color:#000;--progress-bar-color:var(--accent)}",
    ".exh .side{padding:0 1.5rem 40vh;background:var(--bg)}",
    ".exh .nav{position:sticky;top:0;display:flex;gap:.5rem;padding:.75rem 0;background:var(--bg);z-index:2}",
    ".exh .nav button{padding:.5rem 1rem;font:inherit;cursor:pointer;background:#141414;color:var(--fg);border:1px solid #3a3a3a;border-radius:4px}",
    ".exh .nav button:hover{border-color:var(--accent)}",
    ".exh button:focus-visible,.exh .step:focus-visible{outline:2px solid var(--accent);outline-offset:2px}",
    ".exh h1{font-size:1.3rem;font-weight:400;margin:.5rem 0 1rem;color:var(--accent)}",
    ".exh .steps{list-style:none;margin:0;padding:0}",
    ".exh .step{min-height:70vh;padding:1rem;margin:0 0 1rem;border-left:4px solid var(--step-bar);opacity:.5;transition:opacity .3s}",
    ".exh .step.active{opacity:1;border-left-color:var(--step-bar-active)}",
    ".exh .step h2{font-size:.85rem;font-weight:600;margin:0 0 .5rem;text-transform:uppercase;letter-spacing:.08em;color:var(--accent)}",
    ".exh .chip{display:inline-block;margin:.25rem 0;padding:.1rem .6rem;border-radius:1rem;font-size:.8rem;border:1px solid currentColor}",
    ".exh .chip.documented{color:#86d79a}.exh .chip.inferred{color:#e6b95a}.exh .chip.speculative{color:#ff9a9a}",
    ".exh .source{font-size:.85rem;color:var(--muted);margin:.25rem 0 0}",
    ".exh .progress{position:fixed;top:0;left:0;right:0;height:5px;background:var(--accent);transform:scaleX(0);transform-origin:0 50%;z-index:20;pointer-events:none}",
    ".exh .credit{font-size:.8rem;color:var(--muted);margin:1.5rem 0 0;padding-top:.75rem;border-top:1px solid var(--line)}",
    "@media (prefers-reduced-motion:reduce){.exh .step{transition:none}}",
    "@media (max-width:760px){.exh{grid-template-columns:1fr}.exh .stage{height:48vh;z-index:3}.exh .nav{top:48vh}.exh .step{min-height:50vh}}"
  ].join("\n");

  function el(tag, props, kids) {
    var n = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) {
      if (k === "text") n.textContent = props[k]; else n.setAttribute(k, props[k]);
    });
    (kids || []).forEach(function (c) { n.appendChild(c); });
    return n;
  }

  function applyCamera(mv, cam, instant) {
    if (!cam) return;
    // Attributes, not properties: they survive when the element is not upgraded yet.
    if (cam.orbit) mv.setAttribute("camera-orbit", cam.orbit);
    if (cam.target) mv.setAttribute("camera-target", cam.target);
    if (cam.fov) mv.setAttribute("field-of-view", cam.fov);
    if (instant && mv.jumpCameraToGoal) mv.jumpCameraToGoal();
  }

  function renderExhibit(root, data, opts) {
    opts = opts || {};
    if (!document.getElementById("exh-css")) {
      var st = el("style", { id: "exh-css" });
      st.textContent = CSS;
      document.head.appendChild(st);
    }
    root.innerHTML = "";
    var reduce = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    var steps = data.steps || data.stops || [];
    var model = data.model || {};

    var mv = el("model-viewer", {
      src: opts.modelSrc || model.src || "",
      alt: model.alt || data.title || "3D model",
      "camera-controls": "",
      "interaction-prompt": "none",
      "interpolation-decay": "150",
      "touch-action": "pan-y"
    });
    var list = el("ol", { "class": "steps", "aria-label": "Steps" });
    steps.forEach(function (s, i) {
      var li = el("li", { "class": "step", tabindex: "0" }, [
        el("h2", { text: "Step " + (i + 1) + " of " + steps.length }),
        el("p", { text: s.text || "" })
      ]);
      if (EV[s.evidence]) li.appendChild(el("p", { "class": "chip " + s.evidence, text: EV[s.evidence] }));
      if (s.source) li.appendChild(el("p", { "class": "source", text: "Source: " + s.source }));
      list.appendChild(li);
    });
    var prev = el("button", { type: "button", text: "Previous step" });
    var next = el("button", { type: "button", text: "Next step" });
    var side = el("div", { "class": "side" }, [
      el("div", { "class": "nav" }, [prev, next]),
      el("h1", { text: data.title || "" }),
      list
    ]);
    if (data.credit) side.appendChild(el("p", { "class": "credit", text: data.credit }));
    var wrap = el("div", { "class": "exh" }, [el("div", { "class": "stage" }, [mv]), side]);
    var bar = el("div", { "class": "progress", "aria-hidden": "true" });
    wrap.appendChild(bar);
    root.appendChild(wrap);

    var cur = -1;
    function goTo(i, scroll) {
      if (i < 0 || i >= steps.length) return;
      cur = i;
      applyCamera(mv, steps[i].camera, reduce);
      Array.prototype.forEach.call(list.children, function (li, k) {
        li.classList.toggle("active", k === i);
        if (k === i) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
      });
      if (scroll) list.children[i].scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    }
    prev.onclick = function () { goTo(Math.max(0, cur - 1), true); };
    next.onclick = function () { goTo(Math.min(steps.length - 1, cur + 1), true); };
    function onKey(e) {
      var t = e.target.tagName;
      if (t === "TEXTAREA" || t === "INPUT" || t === "SELECT") return;
      if (e.key === "ArrowRight") { next.onclick(); e.preventDefault(); }
      else if (e.key === "ArrowLeft") { prev.onclick(); e.preventDefault(); }
    }
    document.addEventListener("keydown", onKey);

    var scroller = null;
    function onResize() { if (scroller) scroller.resize(); }
    if (global.scrollama && steps.length) {
      scroller = global.scrollama();
      scroller.setup({ step: Array.prototype.slice.call(list.children), offset: 0.5 })
        .onStepEnter(function (r) { goTo(r.index, false); });
      window.addEventListener("resize", onResize);
    }
    goTo(0, false);

    // 5px reading-progress bar at the very top, in the accent colour; follows the page or, in the editor preview, the overlay.
    function scrollParent() {
      for (var n = root; n && n !== document.body; n = n.parentElement) {
        var oy = getComputedStyle(n).overflowY;
        if ((oy === "auto" || oy === "scroll") && n.scrollHeight > n.clientHeight) return n;
      }
      return null;
    }
    var sc = scrollParent();
    var scrollTarget = sc || window;
    function paintProgress() {
      var top = sc ? sc.scrollTop : (window.pageYOffset || document.documentElement.scrollTop);
      var max = sc ? sc.scrollHeight - sc.clientHeight : document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, Math.max(0, top / max)) : 0) + ")";
    }
    scrollTarget.addEventListener("scroll", paintProgress, { passive: true });
    window.addEventListener("resize", paintProgress);
    paintProgress();

    return {
      destroy: function () {
        scrollTarget.removeEventListener("scroll", paintProgress);
        window.removeEventListener("resize", paintProgress);
        document.removeEventListener("keydown", onKey);
        window.removeEventListener("resize", onResize);
        if (scroller) scroller.destroy();
        root.innerHTML = "";
      }
    };
  }

  global.applyCamera = applyCamera;
  global.renderExhibit = renderExhibit;
})(window);
