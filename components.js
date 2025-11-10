// components.js
// Search + interactive hover effects for component cards

document.addEventListener('DOMContentLoaded', () => {
  // Search bar filter
  const search = document.getElementById('component-search');
  const cards = Array.from(document.querySelectorAll('.component-card'));

  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      cards.forEach(card => {
        const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
        const desc = (card.querySelector('p')?.textContent || '').toLowerCase();
        const ok = title.includes(q) || desc.includes(q);
        card.style.display = ok ? 'block' : 'none';
        // playful highlight for matches
        if (ok && q.length > 0) {
          card.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.02)' }, { transform: 'scale(1)' }], { duration: 420 });
        }
      });
    });
  }

  // Card tilt on mouse move (playful)
  cards.forEach(card => {
    card.style.transition = 'transform 0.18s ease, box-shadow 0.18s ease';
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      const rx = dy * 6; // tilt x
      const ry = dx * -8; // tilt y
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      card.style.boxShadow = `${-ry*2}px ${rx*2}px 18px rgba(255,122,0,0.08)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });

    // quick info popup on click (small)
    card.addEventListener('click', () => {
      const info = card.querySelector('h3')?.textContent || 'Component';
      const toast = document.createElement('div');
      toast.className = 'mini-toast';
      toast.textContent = `${info} — added to quick view (demo)`;
      document.body.appendChild(toast);
      toast.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], { duration: 1800 });
      setTimeout(()=>toast.remove(), 1800);

    });
  });
});


document.addEventListener('DOMContentLoaded', () => {
  // create modal element
  const modal = document.createElement('div');
  modal.id = 'card-modal';
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  document.querySelectorAll('.component-card').forEach(card => {
    card.addEventListener('click', () => {
      modalContent.innerHTML = card.innerHTML; // copy image + text
      modal.style.display = 'flex';
    });
  });

  modal.addEventListener('click', () => {
    modal.style.display = 'none';
  });
});
