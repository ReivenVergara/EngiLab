// resistor.js
// Fully functional resistor color decoder interactions

document.addEventListener('DOMContentLoaded', () => {
  const bandEls = [
    document.getElementById('band1'),
    document.getElementById('band2'),
    document.getElementById('band3'),
    document.getElementById('band4')
  ];
  const s1 = document.getElementById('band1-select');
  const s2 = document.getElementById('band2-select');
  const s3 = document.getElementById('band3-select');
  const s4 = document.getElementById('band4-select');
  const out = document.getElementById('res-value');

  // Color maps
  const colors = {
    black: '#111827', brown: '#7a4a2b', red: '#d3423f', orange: '#ff7800',
    yellow: '#ffd400', green: '#1fa855', blue: '#1e66f2', violet: '#7b4bd6',
    gray: '#8b8f92', white: '#ffffff', gold: '#d4af37', silver: '#c0c0c0'
  };
  const valueMap = { black:0, brown:1, red:2, orange:3, yellow:4, green:5, blue:6, violet:7, gray:8, white:9 };
  const multMap = { black:1, brown:10, red:100, orange:1000, yellow:10000, green:100000, blue:1000000, gold:0.1, silver:0.01 };
  const tolMap = { brown:'±1%', red:'±2%', green:'±0.5%', blue:'±0.25%', violet:'±0.1%', gray:'±0.05%', gold:'±5%', silver:'±10%' };

  function updateBand(el, colorKey) {
    el.style.background = colors[colorKey] || '#ccc';
    el.style.boxShadow = `0 6px 20px ${hexToRgba(colors[colorKey] || '#000', 0.12)}`;
  }

  function hexToRgba(hex, alpha) {
    if(!hex) return `rgba(0,0,0,${alpha})`;
    hex = hex.replace('#','');
    const bigint = parseInt(hex,16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function formatOhms(n) {
    if (n >= 1e6) return (n/1e6).toFixed(2) + ' MΩ';
    if (n >= 1e3) return (n/1e3).toFixed(2) + ' kΩ';
    if (Number.isInteger(n)) return n + ' Ω';
    return n.toFixed(2) + ' Ω';
  }

  function compute() {
    const c1 = s1.value;
    const c2 = s2.value;
    const c3 = s3.value;
    const c4 = s4.value;
    // basic validation
    if(!c1 || !c2 || !c3) {
      out.textContent = '-- Ω';
      return;
    }

    updateBand(bandEls[0], c1);
    updateBand(bandEls[1], c2);
    updateBand(bandEls[2], c3);
    updateBand(bandEls[3], c4);

    const base = (valueMap[c1]*10 + valueMap[c2]);
    const multiplier = multMap[c3];
    let value = base * multiplier;
    const tol = tolMap[c4] || '';

    out.textContent = `${formatOhms(value)} ${tol}`;
    // little flash animation to catch attention
    out.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 360 });
  }

  // events
  [s1, s2, s3, s4].forEach(sel => {
    if (sel) sel.addEventListener('change', compute);
  });

  // initial set
  compute();

  // copy-to-clipboard on clicking the result
  out.addEventListener('click', async () => {
    const txt = out.textContent.replace(/\s+/g,' ').trim();
    try {
      await navigator.clipboard.writeText(txt);
      showToast(`Copied: ${txt}`);
    } catch {
      showToast('Copy failed (browser may block clipboard).');
    }
  });

  // small toast helper
  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'mini-toast';
    t.textContent = msg;
    Object.assign(t.style, {
      position: 'fixed', bottom: '28px', right: '28px', background: '#ff7a00',
      color: '#fff', padding: '10px 14px', borderRadius: '10px', zIndex: 9999
    });
    document.body.appendChild(t);
    t.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], { duration: 1800 });
    setTimeout(()=>t.remove(), 1800);
  }
});
