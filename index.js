// index.js
// Playful animations for index.html (hero, floating shapes, fade-up reveal)

document.addEventListener('DOMContentLoaded', () => {
  // Fade-up reveal
  const fadeUpEls = document.querySelectorAll('.fade-up');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  fadeUpEls.forEach(el => obs.observe(el));

  // Hero CTA bounce timing (subtle)
  const cta = document.querySelector('.btn');
  if (cta) {
    let up = true;
    setInterval(() => {
      if (up) {
        cta.style.transform = 'translateY(-8px) scale(1.02)';
      } else {
        cta.style.transform = 'translateY(0) scale(1)';
      }
      up = !up;
    }, 1800);
  }

  // Floating decorative shapes (makes the hero lively)
  const hero = document.querySelector('.hero');
  if (hero) {
    for (let i = 0; i < 8; i++) {
      const dot = document.createElement('div');
      dot.className = 'floating-dot';
      const size = 8 + Math.random() * 24;
      dot.style.width = dot.style.height = `${size}px`;
      dot.style.left = `${Math.random() * 90}%`;
      dot.style.top = `${Math.random() * 85}%`;
      dot.style.opacity = (0.1 + Math.random() * 0.6).toString();
      hero.appendChild(dot);
      animateFloating(dot, 3000 + Math.random() * 4500);
    }
  }

  function animateFloating(el, duration) {
    const startX = parseFloat(el.style.left);
    const startY = parseFloat(el.style.top);
    let dir = (Math.random() > 0.5) ? 1 : -1;
    setInterval(() => {
      const dx = (Math.random() * 3 + 1) * dir;
      const dy = (Math.random() * 2 - 1);
      el.style.transform = `translate(${dx}px, ${dy}px) rotate(${(Math.random() * 20 - 10)}deg)`;
      dir *= -1;
    }, duration);
  }
});
