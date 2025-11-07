(function () {
  console.log('[player] script carregado');

  const elPlay = document.getElementById('btn-play');
  const elVol  = document.getElementById('vol');
  const elProg = document.getElementById('current-program');
  const streamUrl = "http://s2.myradiostream.com:9020/;";
  let audio = window.globalAudio || null;
  let isPlaying = window.globalIsPlaying || false;

  if (!elPlay || !elVol) {
    console.error('[player] Elementos do player não encontrados.');
    return;
  }

  // Restaura estado 
  const prevPlaying = sessionStorage.getItem('radio_is_playing') === '1';
  const prevVolume = parseFloat(sessionStorage.getItem('radio_volume') || '0.8');

  if (!audio) {
    audio = new Audio(streamUrl);
    window.globalAudio = audio;
    audio.crossOrigin = 'anonymous';
    audio.preload = 'none';
    audio.volume = prevVolume;
  }

  if (prevPlaying) {
    audio.play().then(() => {
      if (elPlay) elPlay.textContent = '❚❚';
      window.globalIsPlaying = true;
      console.log('[player] reprodução restaurada automaticamente');
    }).catch(() => {
      console.warn('[player] não pôde restaurar reprodução automaticamente.');
    });
  }

  function attachAudioEvents(a) {
    if (a._eventsAttached) return;
    a.addEventListener('playing', () => console.log('Play'));
    a.addEventListener('pause',   () => console.log('Pause'));
    a.addEventListener('error',   e => console.error('[player] Erro de áudio:', e));
    a._eventsAttached = true;
  }
  attachAudioEvents(audio);

  function ensureAudio() {
    if (!audio) {
      audio = new Audio(streamUrl);
      window.globalAudio = audio;
      attachAudioEvents(audio);
    }
    const needsSrc = !audio.src || audio.src === window.location.href || audio.src === 'about:blank';
    if (needsSrc) {
      console.log('[player] definindo src do áudio');
      audio.src = streamUrl;
      audio.preload = 'none';
      audio.crossOrigin = 'anonymous';
    }
    audio.volume = Number(elVol.value) / 100;
  }

  // Play/Pause
  elPlay.addEventListener('click', () => {
    ensureAudio();

    if (!isPlaying) {
      console.log('[player] tentando tocar stream...');
      const p = audio.play();
      if (p) {
        p.then(() => {
          elPlay.textContent = '❚❚';
          isPlaying = true;
          window.globalIsPlaying = true;
          console.log('[player] play iniciado com sucesso');
        }).catch(err => {
          console.error('Erro no play():', err);
          alert('Player indisponível no momento.');
        });
      }
    } else {
      console.log('[player] pausando...');
      audio.pause();
      elPlay.textContent = '▶';
      isPlaying = false;
      window.globalIsPlaying = false;
    }
  });



  // Volume
  elVol.addEventListener('input', () => {
    if (audio) audio.volume = Number(elVol.value) / 100;
  });

  // Programa atual
  async function refreshProgram() {
    if (!elProg) return;
    try {
      const res = await fetch('/api/now', { cache: 'no-store' });
      const data = await res.json();
      console.log('[player] /api/now:', res.status, data);

      if (data && (data.name || data.nome)) {
        const name = data.name || data.nome;
        const host = data.host || data.locutor || '';
        const start = data.start_time || '';
        const end   = data.end_time   || '';
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

  // Intervalo único
  if (window.refreshProgramTimer) clearInterval(window.refreshProgramTimer);
  refreshProgram();
  window.refreshProgramTimer = setInterval(refreshProgram, 30_000);

  // Reatualiza ao trocar de página via SPA
  window.addEventListener('page:loaded', refreshProgram);

  // Sincroniza ícone caso já estivesse tocando
  if (isPlaying) elPlay.textContent = '❚❚';
})();
