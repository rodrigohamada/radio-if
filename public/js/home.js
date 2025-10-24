(function () {
  // Guardas globais para evitar múltiplas inits/leaks
  window.__slider = window.__slider || {
    timer: null,
    initializedForPath: null
  };

  function clearSliderTimer() {
    if (window.__slider.timer) {
      clearInterval(window.__slider.timer);
      window.__slider.timer = null;
    }
  }

  function startSlider() {
    const slider = document.querySelector('.slider');
    if (!slider) {
      clearSliderTimer();
      return; 
    }

    const slides = slider.querySelectorAll('.slide');
    if (!slides.length) {
      clearSliderTimer();
      return;
    }

    if (window.__slider.initializedForPath === window.location.pathname && window.__slider.timer) {
      return;
    }

    slides.forEach((s, idx) => s.classList.toggle('active', idx === 0));

    let i = 0;

    clearSliderTimer();
    window.__slider.timer = setInterval(() => {
      slides[i].classList.remove('active');
      i = (i + 1) % slides.length;
      slides[i].classList.add('active');
    }, 7000);

    window.__slider.initializedForPath = window.location.pathname;
    console.log('[slider] iniciado:', slides.length, 'slides');
  }

  function initWhenSliderExists() {
    if (document.querySelector('.slider .slide')) {
      startSlider();
      return;
    }

    const observer = new MutationObserver((_, obs) => {
      if (document.querySelector('.slider .slide')) {
        obs.disconnect();
        startSlider();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initWhenSliderExists();
  });

  window.addEventListener('page:loaded', () => {
    clearSliderTimer();
    initWhenSliderExists();
  });
})();
