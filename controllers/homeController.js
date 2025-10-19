const News = require('../models/News');
const Program = require('../models/Program');
const Slide = require('../models/Slide');

/**
 * Obtém o dia da semana em português no formato do ENUM do MySQL.
 * Ex: 'Domingo' | 'Segunda' | ... | 'Sábado'
 */
function getBrazilWeekdayEnum() {
  const fmt = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long'
  });

  const weekdayLong = fmt.format(new Date()); // Ex: 'quinta-feira'
  const base = weekdayLong.split('-')[0].trim(); // 'quinta'

  // Capitaliza a primeira letra
  const cap = base.charAt(0).toUpperCase() + base.slice(1).toLowerCase();

  // Mapeamento compatível com ENUM do banco
  const map = {
    Domingo: 'Domingo',
    Segunda: 'Segunda',
    Terca: 'Terça',
    Terça: 'Terça',
    Quarta: 'Quarta',
    Quinta: 'Quinta',
    Sexta: 'Sexta',
    Sabado: 'Sábado',
    Sábado: 'Sábado'
  };

  // Normaliza caso venha sem acento
  const key = cap
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace('ç', 'c')
    .replace('Ç', 'C');

  return map[cap] || map[key] || cap;
}

/**
 * Página inicial da Rádio IF
 * Carrega: slides dinâmicos, programa atual, grade do dia e últimas notícias.
 */
exports.index = async (req, res) => {
  try {
    // ===================================================
    // 📅 Dia local correto (timezone BR)
    // ===================================================
    const today = getBrazilWeekdayEnum();
    console.log(`[HomeController] Hoje (BR): ${today}`);

    // ===================================================
    // 🎙️ Programa atual
    // ===================================================
    let currentProgram = null;
    try {
      currentProgram = await Program.getCurrentProgram();
      if (currentProgram) {
        console.log(
          `[HomeController] Programa atual: ${currentProgram.name} (${currentProgram.host})`
        );
      } else {
        console.log('[HomeController] Nenhum programa no ar — Playlist da Casa');
      }
    } catch (err) {
      console.warn('[HomeController] Falha ao obter programa atual:', err.message);
      currentProgram = {
        name: 'Playlist da Casa',
        host: 'Rádio IF'
      };
    }

    // ===================================================
    // 🗓️ Programas do dia
    // ===================================================
    let todayPrograms = [];
    try {
      todayPrograms = await Program.findByDay(today);
      console.log(
        `[HomeController] ${todayPrograms.length} programas encontrados para ${today}`
      );
    } catch (err) {
      console.warn('[HomeController] Erro ao buscar programas do dia:', err.message);
    }

    // ===================================================
    // 📰 Notícias recentes (limite 3)
    // ===================================================
    let recentNews = [];
    try {
      recentNews = await News.findRecent(3);
      console.log(`[HomeController] Notícias recentes: ${recentNews.length}`);
    } catch (err) {
      console.warn('[HomeController] Nenhuma notícia recente encontrada:', err.message);
    }

    // ===================================================
    // 🖼️ Slides dinâmicos
    // ===================================================
    let slides = [];
    try {
      slides = await Slide.findAll();
      console.log(`[HomeController] ${slides.length} slides carregados para exibição.`);
    } catch (err) {
      console.warn('[HomeController] Falha ao carregar slides:', err.message);
    }

    // ===================================================
    // Renderiza página inicial
    // ===================================================
    res.render('home', {
      title: 'Rádio IF - Início',
      currentProgram,
      todayPrograms,
      recentNews,
      slides
    });
  } catch (err) {
    console.error('[HomeController] Erro crítico ao carregar home:', err);
    res.status(500).render('error', {
      title: 'Erro ao carregar página inicial',
      message: 'Falha ao carregar o conteúdo da página inicial.',
      error: err
    });
  }
};
