/**
 * asa-plate.js — Shared runtime for all Altered State Archive plate pages
 * ViceLab · 2026
 *
 * Reads two data-attributes from the <html> element:
 *
 *   data-cc-rgb="R,G,B"
 *     RGB values of the plate's class colour (no alpha, no hash).
 *     Used to tint starfield particles and floating reference tags.
 *     Example: data-cc-rgb="228,60,255"
 *
 *   data-plate-tags="TAG1,TAG2,TAG3,..."
 *     Comma-separated list of substance-relevant terms for the
 *     floating archive reference tag layer.
 *     Example: data-plate-tags="ASA-EM-01,MDMA,SEROTONIN,SERT,5-HT"
 *
 * DO NOT EDIT per-plate. Set data attributes on <html> only.
 */

(function () {
  'use strict';

  const root   = document.documentElement;
  const ccRgb  = root.dataset.ccRgb   || '150,180,255';
  const rawTags = root.dataset.plateTags || 'ARCHIVE,VICELAB,HARM REDUCTION,ASA';
  const TAGS   = rawTags.split(',').map(function (t) { return t.trim(); });

  /* ── STARFIELD CANVAS ─────────────────────────────────────────────── */
  var cv  = document.getElementById('c-field');
  var ctx = cv.getContext('2d');
  var W, H, stars;
  var N = 140;

  function resize() {
    W = cv.width  = window.innerWidth;
    H = cv.height = window.innerHeight;
  }

  function init() {
    stars = [];
    for (var i = 0; i < N; i++) {
      stars.push({
        x:      Math.random() * W,
        y:      Math.random() * H,
        r:      Math.random() * 0.70 + 0.10,
        a:      Math.random() * 0.18 + 0.02,
        vx:     (Math.random() - 0.5) * 0.06,
        vy:     (Math.random() - 0.5) * 0.05 - 0.018,
        ph:     Math.random() * Math.PI * 2,
        sp:     Math.random() * 0.007 + 0.002,
        // ~80 % tinted to class colour; ~20 % neutral white-blue
        tinted: Math.random() > 0.20,
      });
    }
  }

  var t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.003;
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < -4)    s.x = W + 4;
      if (s.x > W + 4) s.x = -4;
      if (s.y < -4)    { s.y = H + 4; s.x = Math.random() * W; }
      var f = s.a * (0.4 + 0.6 * Math.sin(t * s.sp * 80 + s.ph));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.tinted
        ? 'rgba(' + ccRgb + ',' + f + ')'
        : 'rgba(220,230,255,' + (f * 0.45) + ')';
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize();
  init();
  draw();
  window.addEventListener('resize', function () { resize(); init(); });


  /* ── FLOATING ARCHIVE REFERENCE TAGS ─────────────────────────────── */
  var POSITIONS = [
    [5,12], [18,58], [82,9],  [90,48], [56,82], [34,94], [72,28],
    [14,74],[50,40], [94,72], [66,58], [28,22], [45,8],
  ];

  var layer = document.getElementById('tag-layer');

  POSITIONS.forEach(function (pos, i) {
    var el = document.createElement('div');
    el.className   = 'atag';
    el.textContent = TAGS[i % TAGS.length];
    el.style.left  = pos[0] + '%';
    el.style.top   = pos[1] + '%';
    el.style.color = 'rgba(' + ccRgb + ',0.038)';
    var dur = 36 + Math.random() * 30;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay   = -(Math.random() * dur) + 's';
    layer.appendChild(el);
  });


  /* ── SCROLL REVEAL ────────────────────────────────────────────────── */
  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.07, rootMargin: '0px 0px -32px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
    obs.observe(el);
  });

})();
