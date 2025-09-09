/* ==============================
   Peep Lightning Intro — FULL JS
   ============================== */

/** Elementos base */
const stage = document.getElementById('stage');
const tiltEl = document.getElementById('tilt');

/* ---------- Partículas ---------- */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!prefersReduced.matches) {
  const SPARKS = 64;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < SPARKS; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    s.style.left = Math.floor(Math.random() * window.innerWidth) + 'px';
    s.style.top  = Math.floor(Math.random() * window.innerHeight) + 'px';
    s.style.setProperty('--x', (Math.random() * 40 - 20) + 'px');
    s.style.setProperty('--y', (Math.random() * 40 - 20) + 'px');
    s.style.animationDelay = (Math.random() * 3).toFixed(2) + 's';
    s.style.animationDuration = (2.6 + Math.random() * 2).toFixed(2) + 's';
    frag.appendChild(s);
  }
  stage.appendChild(frag);
}

/* ---------- Parallax Tilt ---------- */
let rx = 0, ry = 0, tx = 0, ty = 0;
stage.addEventListener('pointermove', (e) => {
  const { innerWidth:w, innerHeight:h } = window;
  tx = ((e.clientY / h) - 0.5) * -10;
  ty = ((e.clientX / w) - 0.5) *  12;
});
(function tiltLoop(){
  rx += (tx - rx) * 0.08;
  ry += (ty - ry) * 0.08;
  tiltEl.style.setProperty('--rx', rx.toFixed(2) + 'deg');
  tiltEl.style.setProperty('--ry', ry.toFixed(2) + 'deg');
  requestAnimationFrame(tiltLoop);
})();

/* ---------- Botón Repetir (reinicia animaciones del intro) ---------- */
const replay = document.getElementById('replay');
if (replay) {
  replay.addEventListener('click', (e) => {
    e.preventDefault();
    ['.bolt', '.peep-logo', '.title', '.cta', '.halo'].forEach(sel => {
      const n = document.querySelector(sel);
      if (!n) return;
      const clone = n.cloneNode(true);
      n.parentNode.replaceChild(clone, n);
    });
  });
}

/* ---------- Loader 15s (debajo de la P) con lobo + badge móviles ---------- */
(function(){
  const TOTAL_MS = 15000; // duración exacta
  const el = document.getElementById('peepLoader');
  if(!el) return;

  const fill   = document.getElementById('plFill');
  const orb    = document.getElementById('plOrb');
  const pctEl  = document.getElementById('plPercent');
  const wolf   = document.getElementById('wolfIcon');
  const float  = document.getElementById('plFloat');
  const floatN = document.getElementById('plFloatNum');

  let start = null, rafId;

  function clampPos(p){ return Math.min(0.96, Math.max(0.04, p)); }

  function setProgress(p){
    const clamped = Math.max(0, Math.min(1, p));
    const pctText = (clamped * 100).toFixed(0) + '%';

    // ancho de la barra
    fill.style.width = pctText;

    // posición de orbe / lobo / badge
    const pos = (clampPos(clamped) * 100).toFixed(2) + '%';
    orb.style.setProperty('--x', pos);
    if (wolf)  wolf.style.setProperty('--x', pos);
    if (float) float.style.setProperty('--x', pos);

    // textos
    pctEl.textContent = pctText;
    if (floatN) floatN.textContent = pctText;
  }

  function step(now){
    if(!start) start = now;
    const elapsed = now - start;
    const p = Math.min(1, elapsed / TOTAL_MS);
    setProgress(p);
    if(p < 1){
      rafId = requestAnimationFrame(step);
    }else{
      const flash = document.querySelector('.flash');
      if(flash){ flash.classList.remove('show'); void flash.offsetWidth; flash.classList.add('show'); }
    }
  }

  // iniciar
  cancelAnimationFrame(rafId);
  setProgress(0);
  rafId = requestAnimationFrame(step);
})();

