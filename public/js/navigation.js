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

  // Salva estado antes de reload (fallback)
  window.addEventListener('beforeunload', () => {
    if (window.globalAudio) {
      sessionStorage.setItem('radio_is_playing', window.globalIsPlaying ? '1' : '0');
      sessionStorage.setItem('radio_volume', window.globalAudio.volume);
    }
  });

  // ---------------------------
  // 🚀 Carrega página via fetch()
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
        console.error('[nav] Conteúdo principal (#page-container) não encontrado.');
        container.innerHTML = '<p style="padding:2rem;">Erro: Container não encontrado.</p>';
        container.style.opacity = '1';
        return;
      }

      // Substitui o conteúdo principal
      container.innerHTML = newMain.innerHTML;
      container.style.opacity = '1';

      // Atualiza título da aba
      const newTitle = doc.querySelector('title');
      if (newTitle) document.title = newTitle.innerText;

      // Atualiza histórico
      if (addHistory) window.history.pushState({}, '', url);

      // Reexecuta scripts embutidos na página EJS
      executeScripts(newMain);

      // Reintercepta links internos recém-carregados
      interceptLinks();

      // Dispara evento para outros módulos (player.js, etc.)
      window.dispatchEvent(new Event('page:loaded'));
      console.log('[nav] Página trocada com sucesso:', url);

      // Mantém player visível
      if (player) player.classList.remove('hidden');
    } catch (err) {
      console.error('[nav] Erro ao carregar página:', err);
      container.innerHTML = '<p style="padding:2rem;">Erro ao carregar a página.</p>';
      container.style.opacity = '1';
    }
  }

  // -------------------------------
  // ⚡ Executa scripts embutidos
  // -------------------------------
  function executeScripts(scope) {
    const scripts = scope.querySelectorAll('script');
    console.log(`[nav] Executando ${scripts.length} script(s) da nova página...`);

    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');

      // Copia atributos originais (importante para módulos ou async)
      [...oldScript.attributes].forEach(attr => newScript.setAttribute(attr.name, attr.value));

      if (oldScript.src) {
        // Script externo (src)
        newScript.src = oldScript.src;
      } else {
        // Script inline
        newScript.textContent = oldScript.textContent;
      }

      // Evita executar 2x o mesmo script
      if (oldScript.dataset.executed) return;
      oldScript.dataset.executed = 'true';

      // Injeta e executa
      document.body.appendChild(newScript);
      document.body.removeChild(newScript);
    });
  }

  // --------------------------------------------------
  // 🔗 Intercepta links internos e reatribui listeners
  // --------------------------------------------------
  function interceptLinks() {
    // Remove listeners antigos clonando os links
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href') || '';
      const sameOrigin = href.startsWith('/') && !href.startsWith('//');
      if (!sameOrigin || link.hasAttribute('data-no-ajax')) return;

      const clone = link.cloneNode(true);
      link.replaceWith(clone);
    });

    // Adiciona novos listeners
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href') || '';
      const sameOrigin = href.startsWith('/') && !href.startsWith('//');
      if (!sameOrigin || link.hasAttribute('data-no-ajax')) return;

      link.addEventListener('click', async e => {
        const modified = e.ctrlKey || e.shiftKey || e.metaKey || e.altKey;
        if (modified) return; // abre em nova aba, etc.

        e.preventDefault();
        if (href === window.location.pathname) return;

        console.log('[nav] Navegando (SPA) para:', href);
        await loadPage(href);
      });
    });
  }

  // 🔙 Suporte ao botão Voltar / Avançar
  window.addEventListener('popstate', () => loadPage(window.location.pathname, false));

  // Inicializa interceptação inicial
  interceptLinks();

  console.log('[nav] Sistema de navegação dinâmico ativo.');
})();
