const LUNAR_CYCLE = 29.530588853;
const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z').getTime();

function getLunarPhase() {
  const elapsed = (Date.now() - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24);
  return (elapsed % LUNAR_CYCLE) / LUNAR_CYCLE;
}

function getMoonSigil(phase) {
  const s = 'rgba(220,215,255,0.95)';
  const shapes = [
    // new moon
    '<circle cx="14" cy="14" r="10" stroke="rgba(220,215,255,0.4)" stroke-width="1"/><line x1="14" y1="4" x2="14" y2="24" stroke="rgba(220,215,255,0.3)" stroke-width="0.5"/><line x1="4" y1="14" x2="24" y2="14" stroke="rgba(220,215,255,0.3)" stroke-width="0.5"/><circle cx="14" cy="14" r="2" fill="rgba(220,215,255,0.2)"/>',
    // waxing crescent
    '<path d="M14 4 C8 4 4 8.5 4 14 C4 19.5 8 24 14 24 C10 20 10 8 14 4Z" fill="' + s + '"/><line x1="14" y1="2" x2="14" y2="6" stroke="' + s + '" stroke-width="1"/><line x1="14" y1="22" x2="14" y2="26" stroke="' + s + '" stroke-width="1"/><line x1="4" y1="10" x2="7" y2="11.5" stroke="' + s + '" stroke-width="0.8"/><line x1="4" y1="18" x2="7" y2="16.5" stroke="' + s + '" stroke-width="0.8"/>',
    // first quarter
    '<path d="M14 4 A10 10 0 0 1 14 24 Z" fill="' + s + '"/><line x1="14" y1="2" x2="14" y2="26" stroke="' + s + '" stroke-width="1"/><line x1="9" y1="5" x2="6" y2="3" stroke="' + s + '" stroke-width="0.8"/><line x1="9" y1="23" x2="6" y2="25" stroke="' + s + '" stroke-width="0.8"/><circle cx="14" cy="14" r="2" fill="none" stroke="' + s + '" stroke-width="0.8"/>',
    // waxing gibbous
    '<path d="M14 4 A10 10 0 1 1 14 24 C18 20 20 8 14 4Z" fill="' + s + '"/><line x1="14" y1="2" x2="14" y2="6" stroke="' + s + '" stroke-width="1"/><line x1="14" y1="22" x2="14" y2="26" stroke="' + s + '" stroke-width="1"/><line x1="24" y1="10" x2="21" y2="11.5" stroke="' + s + '" stroke-width="0.8"/>',
    // full moon
    '<circle cx="14" cy="14" r="10" fill="' + s + '"/><line x1="14" y1="1" x2="14" y2="5" stroke="' + s + '" stroke-width="1"/><line x1="14" y1="23" x2="14" y2="27" stroke="' + s + '" stroke-width="1"/><line x1="1" y1="14" x2="5" y2="14" stroke="' + s + '" stroke-width="1"/><line x1="23" y1="14" x2="27" y2="14" stroke="' + s + '" stroke-width="1"/><line x1="4" y1="4" x2="7" y2="7" stroke="' + s + '" stroke-width="0.8"/><line x1="24" y1="4" x2="21" y2="7" stroke="' + s + '" stroke-width="0.8"/><line x1="4" y1="24" x2="7" y2="21" stroke="' + s + '" stroke-width="0.8"/><line x1="24" y1="24" x2="21" y2="21" stroke="' + s + '" stroke-width="0.8"/><circle cx="14" cy="14" r="5" fill="none" stroke="rgba(220,215,255,0.3)" stroke-width="0.8"/>',
    // waning gibbous
    '<path d="M14 4 A10 10 0 1 0 14 24 C10 20 8 8 14 4Z" fill="' + s + '"/><line x1="14" y1="2" x2="14" y2="6" stroke="' + s + '" stroke-width="1"/><line x1="4" y1="10" x2="7" y2="11.5" stroke="' + s + '" stroke-width="0.8"/><line x1="8" y1="5" x2="10" y2="7" stroke="' + s + '" stroke-width="0.8"/>',
    // last quarter
    '<path d="M14 4 A10 10 0 0 0 14 24 Z" fill="' + s + '"/><line x1="14" y1="2" x2="14" y2="26" stroke="' + s + '" stroke-width="1"/><line x1="19" y1="5" x2="22" y2="3" stroke="' + s + '" stroke-width="0.8"/><circle cx="14" cy="14" r="2" fill="none" stroke="' + s + '" stroke-width="0.8"/>',
    // waning crescent
    '<path d="M14 4 C18 8 18 20 14 24 C20 24 24 19.5 24 14 C24 8.5 20 4 14 4Z" fill="' + s + '"/><line x1="14" y1="2" x2="14" y2="6" stroke="' + s + '" stroke-width="1"/><line x1="24" y1="10" x2="21" y2="11.5" stroke="' + s + '" stroke-width="0.8"/><line x1="24" y1="18" x2="21" y2="16.5" stroke="' + s + '" stroke-width="0.8"/>'
  ];

  const index = phase < 0.0625 ? 0 : phase < 0.1875 ? 1 : phase < 0.3125 ? 2 : phase < 0.4375 ? 3 : phase < 0.5625 ? 4 : phase < 0.6875 ? 5 : phase < 0.8125 ? 6 : 7;
  return '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">' + shapes[index] + '</svg>';
}

document.addEventListener('DOMContentLoaded', function() {
  document.body.style.cursor = 'none';
  const style = document.createElement('style');
  style.textContent = '*, *::before, *::after { cursor: none !important; }';
  document.head.appendChild(style);

  const moon = document.createElement('div');
  moon.style.cssText = 'position:fixed;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);filter:drop-shadow(0 0 3px rgba(200,200,255,0.9)) drop-shadow(0 0 8px rgba(180,180,255,0.4));';
  moon.innerHTML = getMoonSigil(getLunarPhase());
  document.body.appendChild(moon);

  const particles = [];
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.style.cssText = 'position:fixed;pointer-events:none;z-index:99998;width:3px;height:3px;border-radius:50%;background:rgba(210,210,255,0.9);box-shadow:0 0 4px rgba(200,200,255,0.8);transform:translate(-50%,-50%);opacity:0;';
    document.body.appendChild(p);
    particles.push(p);
  }

  let trailPoints = [];
  document.addEventListener('mousemove', function(e) {
    moon.style.left = e.clientX + 'px';
    moon.style.top = e.clientY + 'px';
    trailPoints.unshift({x: e.clientX, y: e.clientY, life: 1.0});
    if (trailPoints.length > 12) trailPoints.pop();
  });

  function animate() {
    trailPoints = trailPoints.map(function(p) { return {x: p.x, y: p.y, life: p.life - 0.06}; }).filter(function(p) { return p.life > 0; });
    particles.forEach(function(p, i) {
      const point = trailPoints[i];
      if (point) {
        p.style.left = (point.x + (Math.random()-0.5)*6) + 'px';
        p.style.top = (point.y + (Math.random()-0.5)*6) + 'px';
        p.style.opacity = point.life * 0.8;
      } else {
        p.style.opacity = 0;
      }
    });
    requestAnimationFrame(animate);
  }
  animate();
});