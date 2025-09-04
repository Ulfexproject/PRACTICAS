// ===== Parallax leve con el mouse =====
const stage = document.querySelector('.stage');
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth) - 0.5;
  const y = (e.clientY / window.innerHeight) - 0.5;
  mouseX = x * 6;     // grados
  mouseY = y * -4;    // grados
});

function raf(){
  stage.style.transform = `rotateY(${mouseX}deg) rotateX(${mouseY}deg)`;
  requestAnimationFrame(raf);
}
raf();

// ===== Escalado automático para que TODO quepa centrado =====
// El universo mide 1360x1360px (diámetro de la órbita más grande).
// Escalado + centrado para que TODO quepa
const universe = document.querySelector('.universe');
function fitUniverse(){
  const safeMargin = 120; // margen para que no toque el borde inferior/superior
  const target = Math.min(window.innerWidth, window.innerHeight) - safeMargin;
  const scale = Math.max(0.1, Math.min(1.0, target / 1360));
  universe.style.transform = `translate(-50%, -50%) scale(${scale})`;
}
window.addEventListener('resize', fitUniverse);
fitUniverse();

window.addEventListener('resize', fitUniverse);
fitUniverse();

// ===== Ocultar/mostrar UI al presionar H; re-lanzar título con T =====
const wm = document.querySelector('.watermark');
const tip = document.querySelector('.tip');
const title = document.querySelector('.title');
window.addEventListener('keydown', (e)=>{
  const k = e.key.toLowerCase();
  if(k === 'h'){
    const v = wm.style.display === 'none' ? 'block' : 'none';
    wm.style.display = v; tip.style.display = v;
  }
  if(k === 't'){
    title.style.display = 'block';
    title.style.animation = 'none'; void title.offsetWidth;
    title.style.animation = 'title-in 2.5s ease both';
    setTimeout(()=> title.style.display = 'none', 3000);
  }
});
// Auto-oculta el título luego de 3s
setTimeout(()=> { title.style.display = 'none'; }, 3000);

// ===== Estrellas fugaces cada 2s =====
const layer = document.querySelector('.shooting-layer');

function spawnShootingStar(){
  const star = document.createElement('div');
  star.className = 'shooting-star';

  // Punto de partida aleatorio fuera de pantalla (arriba/izq)
  // y dirección diagonal hacia abajo/derecha.
  const startX = -Math.random() * 200; // px (negativos => fuera)
  const startY = Math.random() * window.innerHeight * 0.6; // 0%–60% alto
  // Desplazamiento total (recorrido)
  const dx = window.innerWidth + 400;   // más que ancho para asegurar salida
  const dy = window.innerHeight * 0.35 + Math.random() * 120;

  // Rotación para alinear la estela con la trayectoria
  const rot = Math.atan2(dy, dx) * (180/Math.PI);

  // Seteamos variables CSS para la animación
  star.style.setProperty('--sx', `${startX}px`);
  star.style.setProperty('--sy', `${startY}px`);
  star.style.setProperty('--dx', `${dx}px`);
  star.style.setProperty('--dy', `${dy}px`);
  star.style.setProperty('--rot', `${rot}deg`);

  // Duración ligeramente aleatoria 1.2–1.8s
  const dur = 1.2 + Math.random() * 0.6;
  star.style.animation = `shoot ${dur}s ease-out forwards`;

  layer.appendChild(star);
  star.addEventListener('animationend', () => star.remove());
}

// Llama una cada 2 segundos (como pediste)
setInterval(spawnShootingStar, 2000);
// Dispara una al inicio para que no esperes
spawnShootingStar();


