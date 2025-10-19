// ================== NAV (hambúrguer) ==================
(function () {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
  }
})();

// ================== SLIDER (rotativo) ==================
(function () {
  const slides = Array.from(document.querySelectorAll('.slider .slide'));
  if (!slides.length) return;

  let idx = slides.findIndex(s => s.classList.contains('active'));
  if (idx < 0) { idx = 0; slides[0].classList.add('active'); }

  setInterval(() => {
    slides[idx].classList.remove('active');
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add('active');
  }, 6000);
})();

// ================== PLAYER (sempre visível) ==================
(function () {
  const player = document.querySelector('.player');
  if (!player) return;

  // Remove qualquer classe antiga que esconda o player
  player.classList.remove('hidden-by-footer');

  // Garante que nenhum outro script/estado volte a escondê-lo
  const ensureVisible = () => player.classList.remove('hidden-by-footer');
  window.addEventListener('scroll', ensureVisible);
  window.addEventListener('resize', ensureVisible);
  document.addEventListener('visibilitychange', ensureVisible);
})();
