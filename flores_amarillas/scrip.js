const field = document.getElementById("field");
const template = document.getElementById("flowerTemplate");
const btnPlay = document.getElementById("togglePlay");
const btnRain = document.getElementById("toggleRain");
const btnClear = document.getElementById("clear");
const rangeIntensity = document.getElementById("intensity");

// ⭐ Fondo animado tipo estrellas
const starsCanvas = document.getElementById("stars");
const ctx = starsCanvas.getContext("2d");
function resizeCanvas() {
  starsCanvas.width = window.innerWidth;
  starsCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const stars = Array.from({ length: 80 }, () => ({
  x: Math.random() * starsCanvas.width,
  y: Math.random() * starsCanvas.height,
  r: Math.random() * 1.5,
  s: Math.random() * 0.5 + 0.2
}));

function drawStars() {
  ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
    star.y += star.s;
    if (star.y > starsCanvas.height) star.y = 0;
  });
  requestAnimationFrame(drawStars);
}
drawStars();

let playing = true;
let raining = true;
let rainTimer = null;

const rand = (min, max) => Math.random() * (max - min) + min;

function createFlower({ x = rand(0, window.innerWidth), y = window.innerHeight, bloom = false } = {}) {
  const clone = template.content.firstElementChild.cloneNode(true);
  clone.style.left = `${x}px`;
  clone.style.top = `${y}px`;
  clone.style.setProperty("--x", `${rand(-250, 250)}px`);
  clone.style.animationDuration = `${rand(10, 16)}s`;
  if (bloom) clone.classList.add("bloom");
  field.appendChild(clone);
  clone.addEventListener("animationend", () => clone.remove(), { once: true });
}

function startRain() {
  raining = true;
  btnRain.textContent = "🌧️ Lluvia ON";
  rainTimer = setInterval(() => {
    for (let i = 0; i < Number(rangeIntensity.value); i++) {
      createFlower({ bloom: Math.random() > 0.5 });
    }
  }, 900);
}

function stopRain() {
  raining = false;
  btnRain.textContent = "🌧️ Lluvia OFF";
  clearInterval(rainTimer);
}

btnPlay.addEventListener("click", () => {
  playing = !playing;
  document.querySelectorAll(".flower").forEach(f => f.style.animationPlayState = playing ? "running" : "paused");
  btnPlay.textContent = playing ? "⏸ Pausar" : "▶️ Reanudar";
});

btnRain.addEventListener("click", () => (raining ? stopRain() : startRain()));
btnClear.addEventListener("click", () => field.innerHTML = "");
rangeIntensity.addEventListener("input", () => { if (raining) { stopRain(); startRain(); } });

field.addEventListener("pointerdown", (evt) => createFlower({ x: evt.clientX, y: evt.clientY, bloom: true }));

// 🌧 Arranca con lluvia
startRain();
