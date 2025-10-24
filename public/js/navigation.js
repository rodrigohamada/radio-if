(function () {
  console.log('[nav] Navegação dinâmica iniciada');

  const container = document.getElementById('page-container');
  const player = document.querySelector('.player');

  // === Áudio global persistente ===
  let audio;
  if (window.globalAudio) {
    audio = window.globalAudio;
  } else {
    audio = new Audio();
    window.globalAudio = audio;
    console.log('[player] Áudio global inicializado');
  }

  // Salva estado antes de um eventual reload total (fallback)
  window.addEventListener('beforeunload', () => {
    if (window.globalAudio) {
      sessionStorage.setItem('radio_is_playing', window.globalIsPlaying ? '1' : '0');
      sessionStorage.setItem('radio_volume', window.globalAudio.volume);
    }
  });

  // ---------------------------
  // Carrega página via fetch()
  // ---------------------------
  async function loadPage(url, addHistory = true) {
    try {
      container.style.opacity = '0.5';
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newMain = doc.querySelector('#page-container');

      if (!newMain) {
        console.error('[nav] Conteúdo principal não encontrado.');
        return;
      }

      // Substitui apenas o conteúdo do container dinâmico
      container.innerHTML = newMain.innerHTML;
      container.style.opacity = '1';

      // Atualiza título
      const newTitle = doc.querySelector('title');
      if (newTitle) document.title = newTitle.innerText;

      // Histórico
      if (addHistory) window.history.pushState({}, '', url);

      // Reintercepta links do DOM recém-carregado
      interceptLinks();

      // Dispara evento para componentes dependentes (player.js, etc.)
      window.dispatchEvent(new Event('page:loaded'));
      console.log('[nav] Página trocada com sucesso:', url);

      // Garante que o player permaneça visível
      if (player) player.classList.remove('hidden');
    } catch (err) {
      console.error('[nav] Erro ao carregar página:', err);
      container.innerHTML = '<p style="padding:2rem;">Erro ao carregar a página.</p>';
      container.style.opacity = '1';
    }
  }

  // --------------------------------------------
  // Intercepta links internos SEM duplicar events
  // --------------------------------------------
  function interceptLinks() {
    // 1) remove listeners antigos clonando os links
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href') || '';
      const sameOrigin = href.startsWith('/') && !href.startsWith('//');

      // Ignora só externos ou explicitamente marcados
      if (!sameOrigin || link.hasAttribute('data-no-ajax')) return;

      const clone = link.cloneNode(true);
      link.replaceWith(clone);
    });

    // adiciona listeners limpos
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href') || '';
      const sameOrigin = href.startsWith('/') && !href.startsWith('//');

      if (!sameOrigin || link.hasAttribute('data-no-ajax')) return;

      link.addEventListener('click', async e => {
        const modified = e.ctrlKey || e.shiftKey || e.metaKey || e.altKey;
        if (modified) return; 

        e.preventDefault();
        if (href === window.location.pathname) return;

        console.log('[nav] Navegando (SPA) para:', href);
        await loadPage(href);
      });
    });
  }

  // Suporte ao botão Voltar/Avançar
  window.addEventListener('popstate', () => loadPage(window.location.pathname, false));

  // Inicializa
  interceptLinks();
})();
