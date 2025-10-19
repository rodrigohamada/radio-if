const News = require('../models/News');

// ============================================
// Página principal de notícias (pública)
// ============================================
exports.index = async (req, res) => {
  try {
    const items = await News.findAll();
    res.render('noticias', {
      title: 'Notícias - Rádio IF',
      items
    });
  } catch (err) {
    console.error('[NewsController] Erro ao carregar notícias:', err);
    res.status(500).render('error', {
      title: 'Erro ao carregar notícias',
      message: 'Não foi possível carregar as notícias.',
      error: err
    });
  }
};
