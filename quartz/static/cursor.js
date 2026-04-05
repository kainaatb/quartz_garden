// Lunar phase cursor with silver fairy dust trail

const LUNAR_CYCLE = 29.530588853;
const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z').getTime();

function getLunarPhase() {
  const now = Date.now();
  const elapsed = (now - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24);
  const phase = ((elapsed % LUNAR_CYCLE) / LUNAR_CYCLE);
  return phase;
}

function getMoonEmoji(phase) {
  if (phase < 0.0625) return '🌑';
  if (phase < 0.1875) return '🌒';
  if (phase < 0.3125) return '🌓';
  if (phase < 0.4375) return '🌔';
  if (phase < 0.5625) return '🌕';
  if (phase < 0.6875) return '🌖';
  if (phase < 0.8125) return '🌗';
  if (phase < 0.9375) return '🌘';
  return '🌑';
}




// Create moon cursor
const moon = document.createElement('div');
moon.id = 'lunar-cursor';
moon.style.cssText = `
  position: fixed;
  pointer-events: none;
  z-index: 99999;
  font-size: 18px;
  transform: translate(-50%, -50%);
  transition: transform 0.05s ease;
  filter: drop-shadow(0 0 4px rgba(220, 220, 255, 0.8));
`;
moon.textContent = getMoonEmoji(getLunarPhase());
document.body.appendChild(moon);

// Fairy dust particles
const particles = [];
const PARTICLE_COUNT = 12;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const p = document.createElement('div');
  p.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 99998;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(210, 210, 255, 0.9);
    box-shadow: 0 0 4px rgba(200, 200, 255, 0.8), 0 0 8px rgba(180, 180, 255, 0.4);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
  `;
  document.body.appendChild(p);
  particles.push({ el: p, x: 0, y: 0, opacity: 0, life: 0 });
}

let mouseX = 0;
let mouseY = 0;
let trailPoints = [];

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  moon.style.left = mouseX + 'px';
  moon.style.top = mouseY + 'px';
  trailPoints.unshift({ x: mouseX, y: mouseY, life: 1.0 });
  if (trailPoints.length > PARTICLE_COUNT) trailPoints.pop();
});

function animate() {
  trailPoints = trailPoints.map(p => ({ ...p, life: p.life - 0.06 }))
                           .filter(p => p.life > 0);

  particles.forEach((p, i) => {
    const point = trailPoints[i];
    if (point) {
      const scatter = (Math.random() - 0.5) * 6;
      p.el.style.left = (point.x + scatter) + 'px';
      p.el.style.top = (point.y + scatter) + 'px';
      p.el.style.opacity = point.life * 0.8;
      p.el.style.width = (point.life * 3) + 'px';
      p.el.style.height = (point.life * 3) + 'px';
    } else {
      p.el.style.opacity = 0;
    }
  });

  requestAnimationFrame(animate);
}

animate();