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

  const colors = {
    black: '#111827', brown: '#7a4a2b', red: '#d3423f', orange: '#ff7800',
    yellow: '#ffd400', green: '#1fa855', blue: '#1e66f2', violet: '#7b4bd6',
    gray: '#8b8f92', white: '#ffffff', gold: '#d4af37', silver: '#c0c0c0'
  };

  const valueMap = { black:0, brown:1, red:2, orange:3, yellow:4, green:5, blue:6, violet:7, gray:8, white:9 };
  const multMap = { black:1, brown:10, red:100, orange:1000, yellow:10000, green:100000, blue:1000000, gold:0.1, silver:0.01 };
  const tolMap = { brown:'±1%', red:'±2%', green:'±0.5%', blue:'±0.25%', violet:'±0.1%', gray:'±0.05%', gold:'±5%', silver:'±10%' };

  function updateBand(el, colorKey) {
    el.style.fill = colors[colorKey] || 'lightgray';
    el.style.stroke = '#222';
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

    // Always update band colors
    updateBand(bandEls[0], c1);
    updateBand(bandEls[1], c2);
    updateBand(bandEls[2], c3);
    updateBand(bandEls[3], c4);

    // Only compute value if first 3 bands are selected
    if (!c1 || !c2 || !c3) {
      out.textContent = '-- Ω';
      return;
    }

    const base = (valueMap[c1]*10 + valueMap[c2]);
    const multiplier = multMap[c3];
    const value = base * multiplier;
    const tol = tolMap[c4] || '';

    out.textContent = `${formatOhms(value)} ${tol}`;

    out.animate([{ transform:'scale(1)' }, { transform:'scale(1.06)' }, { transform:'scale(1)' }], { duration: 360 });
  }

  [s1, s2, s3, s4].forEach(sel => {
    if(sel) sel.addEventListener('change', compute);
  });

  compute(); // initial update

  // Copy to clipboard
  out.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(out.textContent.trim());
      showToast(`Copied: ${out.textContent.trim()}`);
    } catch {
      showToast('Copy failed.');
    }
  });

  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'mini-toast';
    t.textContent = msg;
    Object.assign(t.style, {
      position:'fixed', bottom:'28px', right:'28px', background:'#ff7a00',
      color:'#fff', padding:'10px 14px', borderRadius:'10px', zIndex:9999
    });
    document.body.appendChild(t);
    t.animate([{opacity:0},{opacity:1},{opacity:0}], {duration:1800});
    setTimeout(()=>t.remove(),1800);
  }
});
