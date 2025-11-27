(function () {
  console.log('[player] script carregado');

  const elPlay = document.getElementById('btn-play');
  const elVol = document.getElementById('vol');
  const elProg = document.getElementById('current-program');
  const playerRoot = document.querySelector('.player');

  if (!elPlay || !elVol || !playerRoot) {
    console.error('[player] Elementos do player não encontrados.');
    return;
  }

  // Lê URLs do HTML (data-stream-urls='[...]')
  let streamUrls = [];
  try {
    streamUrls = JSON.parse(playerRoot.getAttribute('data-stream-urls') || '[]');
  } catch (e) {
    console.warn('[player] data-stream-urls inválido, usando fallback.');
  }

  // Fallback caso venha vazio
  if (!Array.isArray(streamUrls) || streamUrls.length === 0) {
    streamUrls = [
      "http://s6.myradiostream.com:50486/;",
      "http://s6.myradiostream.com:50486/;stream.mp3",
      "http://s6.myradiostream.com:50486/"
    ];
  }

  // Aviso de mixed content (HTTPS -> HTTP)
  if (location.protocol === 'https:' && streamUrls.some(u => /^http:\/\//i.test(u))) {
    console.warn('[player] Seu site está em HTTPS e o stream é HTTP. Isso pode ser bloqueado (mixed content).');
  }

  // Estado global
  let audio = window.globalAudio || null;
  let isPlaying = window.globalIsPlaying || false;
  let currentUrlIndex = Number(sessionStorage.getItem('radio_stream_idx') || '0');

  // Restaura estado
  const prevPlaying = sessionStorage.getItem('radio_is_playing') === '1';
  const prevVolume = parseFloat(sessionStorage.getItem('radio_volume') || '0.8');
  elVol.value = String(Math.round(prevVolume * 100));

  function attachAudioEvents(a) {
    if (a._eventsAttached) return;

    a.addEventListener('playing', () => console.log('[player] playing:', a.src));
    a.addEventListener('pause', () => console.log('[player] pause'));
    a.addEventListener('waiting', () => console.log('[player] buffering...'));
    a.addEventListener('stalled', () => console.log('[player] stalled'));
    a.addEventListener('error', () => {
      const err = a.error ? `${a.error.code}` : 'unknown';
      console.error('[player] audio error code:', err, 'src=', a.src);
    });

    a._eventsAttached = true;
  }

  function ensureAudio() {
    if (!audio) {
      audio = new Audio();
      window.globalAudio = audio;
      audio.crossOrigin = 'anonymous';
      audio.preload = 'none';
      attachAudioEvents(audio);
    }
    audio.volume = Number(elVol.value) / 100;
    sessionStorage.setItem('radio_volume', String(audio.volume));
  }

  async function tryPlayFrom(index) {
    ensureAudio();

    for (let attempt = 0; attempt < streamUrls.length; attempt++) {
      const idx = (index + attempt) % streamUrls.length;
      const url = streamUrls[idx];

      console.log(`[player] tentando URL (${idx + 1}/${streamUrls.length}):`, url);

      try {
        audio.pause();
        audio.src = url;
        audio.load();

        const p = audio.play();
        if (p) await p;

        // Sucesso
        currentUrlIndex = idx;
        sessionStorage.setItem('radio_stream_idx', String(currentUrlIndex));
        elPlay.textContent = '❚❚';
        isPlaying = true;
        window.globalIsPlaying = true;

        sessionStorage.setItem('radio_is_playing', '1');
        console.log('[player] play OK em:', url);
        return true;

      } catch (err) {
        console.error('[player] falhou ao tocar:', url, err);
        // tenta a próxima
      }
    }

    // Se chegou aqui, falhou em todas
    elPlay.textContent = '▶';
    isPlaying = false;
    window.globalIsPlaying = false;
    sessionStorage.setItem('radio_is_playing', '0');

    alert('Player indisponível no momento.');
    return false;
  }

  // Click Play/Pause
  elPlay.addEventListener('click', async () => {
    if (!isPlaying) {
      await tryPlayFrom(currentUrlIndex);
    } else {
      audio.pause();
      elPlay.textContent = '▶';
      isPlaying = false;
      window.globalIsPlaying = false;
      sessionStorage.setItem('radio_is_playing', '0');
    }
  });

  // Volume
  elVol.addEventListener('input', () => {
    if (audio) audio.volume = Number(elVol.value) / 100;
    sessionStorage.setItem('radio_volume', String(Number(elVol.value) / 100));
  });

  // Programa atual (mantive a sua lógica)
  async function refreshProgram() {
    if (!elProg) return;
    try {
      const res = await fetch('/api/now', { cache: 'no-store' });
      const data = await res.json();
      if (data && (data.name || data.nome)) {
        const name = data.name || data.nome;
        const host = data.host || data.locutor || '';
        const start = data.start_time || '';
        const end = data.end_time || '';
        const horario = (start && end) ? ` (${start} - ${end})` : '';
        elProg.textContent = host ? `${name} — ${host}${horario}` : `${name}${horario}`;
      } else {
        elProg.textContent = 'Programação musical';
      }
    } catch (err) {
      console.warn('[player] Erro ao atualizar programa:', err);
      elProg.textContent = 'Indisponível';
    }
  }

  if (window.refreshProgramTimer) clearInterval(window.refreshProgramTimer);
  refreshProgram();
  window.refreshProgramTimer = setInterval(refreshProgram, 30_000);
  window.addEventListener('page:loaded', refreshProgram);

  // Auto-restore (se estava tocando)
  ensureAudio();
  if (prevPlaying) {
    tryPlayFrom(currentUrlIndex).catch(() => {
      console.warn('[player] não pôde restaurar reprodução automaticamente.');
    });
  } else {
    if (isPlaying) elPlay.textContent = '❚❚';
  }
})();
