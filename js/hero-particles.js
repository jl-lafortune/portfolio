/* LAFORTUNE Jean-Luc — Portfolio — hero-particles.js
   Decorative WebGL "constellation portrait" behind the hero title: a set
   of nodes traced along the outline of a face/avatar (head + curly hair,
   ears, round glasses, nose, open-mouth smile), connected to their
   nearest neighbours by faint lines, with a domed relief so it reads as
   an actual 3D volume when it rotates — not a flat cutout. A few small
   pulses of light occasionally travel along a connection. Built with
   vanilla Three.js.

   The portrait shape is hand-authored as a set of parametric outlines
   (buildFacePoints below) rather than traced from the source image pixel
   by pixel — there's no image-processing step in this static site, so
   the shape is a deliberate stylised approximation of the reference
   avatar (rounded head, bumpy afro silhouette, two ears, round glasses
   with a bridge, a small triangular nose, a wide smiling mouth).

   Three.js is self-hosted at js/vendor/three.min.js (r128) instead of
   pulled from a CDN, and loaded as a classic script (not an ES module):
   1. Newer Three.js builds (r150+) print their own "deprecated, will be
      removed with r160" warning for this classic build. r128 is a stable,
      fully-supported pin with the full API surface used here.
   2. `<script type="module">` (the CDN alternative) is blocked by the
      browser's CORS rules when a page is opened directly as a local file
      (file://) rather than through a server — exactly how this site gets
      previewed before deploying. A same-origin, self-hosted classic
      script works both opened locally and once deployed, with zero
      external network dependency.

   Reduced motion: if the OS/browser "reduce motion" preference is on, we
   still build and draw the full portrait (nodes + connections) so the
   effect is visible, but skip everything that moves — no rotation, no
   mouse-follow, no travelling pulses, just one static render.

   Performance note: the whole portrait rotates as one rigid THREE.Group
   (slow spin + mouse-follow tilt), so relative distances between nodes
   never change — nearest-neighbour connections are computed once at
   startup, not every frame. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var canvas = document.getElementById("hero-canvas");
  var heroSection = document.querySelector(".hero");
  if (!canvas || !heroSection || typeof window.THREE === "undefined") return;

  var renderer, scene, camera, group, pulsePoints, clock;
  var raf = null;
  var isRunning = false;
  var mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  var edges = [];   // {a: THREE.Vector3, b: THREE.Vector3} — local-space endpoints
  var pulses = [];  // {active, edgeIndex, t, speed, cooldown}

  /* ---- Face/avatar outline generator ----
     Returns an array of {x, y, z} in local "face space" (roughly x:[-11,11],
     y:[-12,10], centered near the origin). Points are placed ALONG curves
     (outlines), not filled across areas, so the later nearest-neighbour
     step naturally traces each feature into a connected line. A dome
     relief (domeDepth) pushes central points (nose, mouth, eye area)
     toward the viewer and outline points back toward z≈0, giving real
     rotate-able volume instead of a flat decal. */
  function buildFacePoints(detail) {
    var pts = [];
    var domeR = 10.5;
    var domeMax = 4.2;

    function domeDepth(x, y) {
      var d2 = x * x + y * y;
      var t = Math.max(0, 1 - d2 / (domeR * domeR));
      return Math.sqrt(t) * domeMax - domeMax * 0.42; // shift so range is roughly centered on 0
    }
    function addPoint(x, y, jitter) {
      var z = domeDepth(x, y) + (Math.random() - 0.5) * (jitter || 0.35);
      pts.push({ x: x, y: y, z: z });
    }
    function lerp(a, b, t) { return a + (b - a) * t; }

    /* Head + bumpy "afro" hair outline, traced clockwise from the top.
       bumpTable holds a radius multiplier every 15° — >1 = hair puffing
       outward, <1 = smoother jaw/chin — linearly interpolated in between. */
    var bumpTable = [
      1.15, 1.30, 1.10, 1.35, 1.05, 1.25, 1.15, 0.95,
      0.85, 0.80, 0.78, 0.75, 0.72, 0.75, 0.78, 0.80,
      0.85, 0.95, 1.15, 1.25, 1.05, 1.35, 1.10, 1.30
    ];
    var baseR = 8.6;
    var headN = Math.round(64 * detail);
    for (var i = 0; i < headN; i++) {
      var theta = (i / headN) * Math.PI * 2;
      var slot = (theta / (Math.PI * 2)) * bumpTable.length;
      var i0 = Math.floor(slot) % bumpTable.length;
      var i1 = (i0 + 1) % bumpTable.length;
      var mul = lerp(bumpTable[i0], bumpTable[i1], slot - Math.floor(slot));
      var r = baseR * mul;
      addPoint(r * Math.sin(theta), r * Math.cos(theta) + 0.3, 0.3);
    }

    /* Ears — small loops sticking out just below the hairline on both sides. */
    var earN = Math.round(9 * detail);
    [-1, 1].forEach(function (side) {
      for (var e = 0; e < earN; e++) {
        var a = (e / earN) * Math.PI * 2;
        addPoint(side * (9.8 + 1.15 * Math.cos(a)), -0.6 + 1.5 * Math.sin(a), 0.3);
      }
    });

    /* Glasses — two round rims plus a short bridge between them. */
    var glassN = Math.round(14 * detail);
    [-1, 1].forEach(function (side) {
      for (var g = 0; g < glassN; g++) {
        var a = (g / glassN) * Math.PI * 2;
        addPoint(side * 3.3 + 2.3 * Math.cos(a), 1.8 + 2.3 * Math.sin(a), 0.25);
      }
    });
    var bridgeN = Math.round(3 * detail) + 2;
    for (var br = 0; br < bridgeN; br++) {
      addPoint(lerp(-1.0, 1.0, br / (bridgeN - 1)), 1.8, 0.2);
    }

    /* Nose — small triangle, apex down. */
    var noseA = { x: 0, y: -1.6 }, noseB = { x: -0.9, y: 0.4 }, noseC = { x: 0.9, y: 0.4 };
    var noseEdgeN = Math.round(5 * detail) + 2;
    [[noseA, noseB], [noseB, noseC], [noseC, noseA]].forEach(function (edge) {
      for (var n = 0; n < noseEdgeN; n++) {
        var t = n / noseEdgeN;
        addPoint(lerp(edge[0].x, edge[1].x, t), lerp(edge[0].y, edge[1].y, t), 0.2);
      }
    });

    /* Mouth — wide open-smile ellipse, plus a straight "teeth" line through it. */
    var mouthN = Math.round(18 * detail);
    for (var m = 0; m < mouthN; m++) {
      var am = (m / mouthN) * Math.PI * 2;
      addPoint(3.6 * Math.cos(am), -4.6 + 1.3 * Math.sin(am), 0.25);
    }
    var teethN = Math.round(6 * detail) + 2;
    for (var tt = 0; tt < teethN; tt++) {
      addPoint(lerp(-3.0, 3.0, tt / (teethN - 1)), -4.6, 0.15);
    }

    return pts;
  }

  function init() {
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    } catch (e) {
      return; // WebGL unsupported/blocked — leave the gradient background as-is
    }

    var w = canvas.clientWidth || heroSection.clientWidth;
    var h = canvas.clientHeight || heroSection.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.z = 20;

    group = new THREE.Group();
    scene.add(group);

    var isSmall = window.innerWidth < 720;
    var detail = isSmall ? 0.55 : 1;
    var maxDist = isSmall ? 4.4 : 2.9;
    var neighbours = 2;

    var accent = new THREE.Color(0x8b6bff);
    var violet = new THREE.Color(0xec4fb8);

    var nodePos = buildFacePoints(detail).map(function (p) {
      return new THREE.Vector3(p.x, p.y, p.z);
    });
    var count = nodePos.length;

    /* ---- nodes: per-node brightness for a varied-opacity look ---- */
    var positions = new Float32Array(count * 3);
    var colors = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      positions[i * 3] = nodePos[i].x;
      positions[i * 3 + 1] = nodePos[i].y;
      positions[i * 3 + 2] = nodePos[i].z;
      var c = Math.random() > 0.55 ? accent : violet;
      var brightness = 0.4 + Math.random() * 0.6; // reads as varied opacity under additive blending
      colors[i * 3] = c.r * brightness;
      colors[i * 3 + 1] = c.g * brightness;
      colors[i * 3 + 2] = c.b * brightness;
    }

    var nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    nodeGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    var nodeMaterial = new THREE.PointsMaterial({
      size: isSmall ? 0.19 : 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    group.add(new THREE.Points(nodeGeometry, nodeMaterial));

    /* ---- connections: each node links to its ~2 nearest neighbours,
       deduplicated, only within maxDist — this is what makes each curve
       (head outline, a lens, the mouth…) read as a traced line rather
       than a filled shape, without hand-listing which points connect. ---- */
    var edgeSeen = {};
    var linePositions = [];
    for (var a = 0; a < count; a++) {
      var dists = [];
      for (var b = 0; b < count; b++) {
        if (a === b) continue;
        var d = nodePos[a].distanceTo(nodePos[b]);
        if (d <= maxDist) dists.push([d, b]);
      }
      dists.sort(function (p, q) { return p[0] - q[0]; });
      var k = Math.min(neighbours, dists.length);
      for (var ki = 0; ki < k; ki++) {
        var bIdx = dists[ki][1];
        var key = a < bIdx ? a + "_" + bIdx : bIdx + "_" + a;
        if (edgeSeen[key]) continue;
        edgeSeen[key] = true;
        var pa = nodePos[a], pb = nodePos[bIdx];
        linePositions.push(pa.x, pa.y, pa.z, pb.x, pb.y, pb.z);
        edges.push({ a: pa, b: pb });
      }
    }

    if (edges.length) {
      var lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePositions), 3));
      var lineMaterial = new THREE.LineBasicMaterial({
        color: 0xa78ee0,
        transparent: true,
        opacity: 0.16, // kept low on purpose — connections should be a hint, not a grid
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      group.add(new THREE.LineSegments(lineGeometry, lineMaterial));
    }

    window.addEventListener("resize", onResize, { passive: true });

    if (reduceMotion) {
      // Static only: full portrait drawn once, nothing animates (no spin,
      // no mouse-follow, no travelling pulses) — respects the OS/browser
      // preference while still showing the effect.
      try { renderer.render(scene, camera); } catch (e) {}
      return;
    }

    /* ---- pulses: a handful of small bright points that travel along a
       random connection every few seconds, then rest before the next one ---- */
    if (edges.length) {
      var pulseCount = Math.min(4, edges.length);
      var pulsePositions = new Float32Array(pulseCount * 3);
      for (var pi = 0; pi < pulseCount; pi++) {
        pulsePositions[pi * 3] = 9999; pulsePositions[pi * 3 + 1] = 9999; pulsePositions[pi * 3 + 2] = 9999;
        pulses.push({ active: false, edgeIndex: -1, t: 0, speed: 0.32 + Math.random() * 0.22, cooldown: Math.random() * 3 });
      }
      var pulseGeometry = new THREE.BufferGeometry();
      pulseGeometry.setAttribute("position", new THREE.BufferAttribute(pulsePositions, 3));
      var pulseMaterial = new THREE.PointsMaterial({
        size: isSmall ? 0.34 : 0.3,
        color: 0xf5b8ea,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      pulsePoints = new THREE.Points(pulseGeometry, pulseMaterial);
      group.add(pulsePoints);
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    clock = new THREE.Clock();

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) start();
            else stop();
          });
        },
        { threshold: 0.05 }
      );
      io.observe(heroSection);
    } else {
      start();
    }
  }

  function onResize() {
    if (!renderer || !camera) return;
    var w = canvas.clientWidth || heroSection.clientWidth;
    var h = canvas.clientHeight || heroSection.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    if (reduceMotion) {
      try { renderer.render(scene, camera); } catch (e) {}
    }
  }

  function onMouseMove(e) {
    targetX = e.clientX / window.innerWidth - 0.5;
    targetY = e.clientY / window.innerHeight - 0.5;
  }

  function onVisibility() {
    if (document.hidden) stop();
    else start();
  }

  function start() {
    if (isRunning || !renderer) return;
    isRunning = true;
    tick();
  }

  function stop() {
    isRunning = false;
    if (raf) cancelAnimationFrame(raf);
  }

  function updatePulses(dt) {
    if (!pulsePoints || !edges.length) return;
    var posAttr = pulsePoints.geometry.attributes.position;
    for (var i = 0; i < pulses.length; i++) {
      var p = pulses[i];
      if (!p.active) {
        p.cooldown -= dt;
        if (p.cooldown > 0) continue;
        p.active = true;
        p.t = 0;
        p.edgeIndex = Math.floor(Math.random() * edges.length);
      }
      p.t += dt * p.speed;
      if (p.t >= 1) {
        p.active = false;
        p.cooldown = 1 + Math.random() * 3;
        posAttr.setXYZ(i, 9999, 9999, 9999);
        continue;
      }
      var edge = edges[p.edgeIndex];
      posAttr.setXYZ(
        i,
        edge.a.x + (edge.b.x - edge.a.x) * p.t,
        edge.a.y + (edge.b.y - edge.a.y) * p.t,
        edge.a.z + (edge.b.z - edge.a.z) * p.t
      );
    }
    posAttr.needsUpdate = true;
  }

  function tick() {
    if (!isRunning) return;
    var dt = clock ? Math.min(clock.getDelta(), 0.1) : 0.016;
    mouseX += (targetX - mouseX) * 0.035;
    mouseY += (targetY - mouseY) * 0.035;
    group.rotation.y += 0.0011;
    group.rotation.x = mouseY * 0.22;
    camera.position.x += (mouseX * 3.2 - camera.position.x) * 0.02;
    camera.lookAt(scene.position);
    updatePulses(dt);
    try {
      renderer.render(scene, camera);
    } catch (e) {
      stop();
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
