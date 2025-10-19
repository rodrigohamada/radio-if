(function () {
  const audio = new Audio();
  const elPlay = document.getElementById('btn-play');
  const elVol = document.getElementById('vol');
  const elProg = document.getElementById('current-program');
  const streamUrl = document.body.getAttribute('data-stream') || '';

  console.log('[player] Iniciado — streamUrl:', streamUrl);

  audio.src = streamUrl;
  audio.preload = 'none';
  audio.crossOrigin = 'anonymous';
  audio.volume = 0.8;

  async function refreshProgram() {
    try {
      const res = await fetch('/api/now', { cache: 'no-store' });
      console.log('[player] /api/now status:', res.status);
      const data = await res.json();
      console.log('[player] /api/now payload:', data);

      if (data && (data.name || data.nome)) {
        const name = data.name || data.nome;
        const host = data.host || data.locutor || '';
        elProg.textContent = host ? `${name} — ${host}` : name;
      } else {
        elProg.textContent = 'Programação musical';
      }
    } catch (err) {
      console.error('[player] Erro ao atualizar programa:', err);
      elProg.textContent = 'Indisponível';
    }
  }

  elPlay?.addEventListener('click', async () => {
    if (audio.paused) {
      try {
        await audio.play();
        elPlay.textContent = '❚❚';
      } catch (err) {
        alert('Não foi possível iniciar o áudio. Interaja com a página e tente novamente.');
      }
    } else {
      audio.pause();
      elPlay.textContent = '▶';
    }
  });

  elVol?.addEventListener('input', () => {
    audio.volume = Number(elVol.value) / 100;
  });

  refreshProgram();
  setInterval(refreshProgram, 30_000);
})();
