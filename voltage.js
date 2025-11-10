// voltage.js
// Voltage divider calculator with EngiLab style animations

document.addEventListener('DOMContentLoaded', () => {
  const vinIn = document.getElementById('vin');
  const r1In = document.getElementById('r1');
  const r2In = document.getElementById('r2');
  const calcBtn = document.getElementById('calc-btn');
  const outEl = document.getElementById('vout');

  function compute() {
    const vin = parseFloat(vinIn.value);
    const r1 = parseFloat(r1In.value);
    const r2 = parseFloat(r2In.value);

    if (isNaN(vin) || isNaN(r1) || isNaN(r2) || r1 < 0 || r2 < 0) {
      outEl.textContent = '-- V';
      return;
    }

    const vout = vin * (r2 / (r1 + r2));
    outEl.textContent = `${Number.isFinite(vout) ? vout.toFixed(3) : '--'} V`;

    // playful glow
    outEl.animate([
      { boxShadow: '0 0 0px rgba(255,122,0,0)' },
      { boxShadow: '0 0 18px rgba(255,122,0,0.45)' },
      { boxShadow: '0 0 0px rgba(255,122,0,0)' }
    ], { duration: 800 });
  }

  if (calcBtn) calcBtn.addEventListener('click', compute);

  // live calculation on input with debounce
  function debounce(fn, t = 250) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), t); };
  }

  [vinIn, r1In, r2In].forEach(el => {
    if (el) el.addEventListener('input', debounce(compute, 300));
  });

  // copy-to-clipboard on click
  outEl.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(outEl.textContent);
      showToast(`Copied: ${outEl.textContent}`);
    } catch {
      showToast('Copy failed (browser may block clipboard).');
    }
  });

  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'mini-toast';
    t.textContent = msg;
    Object.assign(t.style, {
      position: 'fixed', bottom: '28px', right: '28px',
      background: '#ff7a00', color: '#fff', padding: '10px 14px',
      borderRadius: '10px', zIndex: 9999
    });
    document.body.appendChild(t);
    t.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], { duration: 1800 });
    setTimeout(() => t.remove(), 1800);
  }
});
