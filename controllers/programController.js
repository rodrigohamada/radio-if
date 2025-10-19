const Program = require('../models/Program');

exports.index = async (req, res) => {
  try {
    // Busca todos os programas
    const all = await Program.findAllGrouped();

    // Agrupa os programas por dia da semana
    const grouped = all.reduce((acc, cur) => {
      // Ajuste do campo para o nome correto vindo do banco (dia_semana)
      const dia = cur.dia_semana || cur.day_of_week;
      acc[dia] = acc[dia] || [];
      acc[dia].push(cur);
      return acc;
    }, {});

    // Renderiza a view de programação
    res.render('programacao', {
      title: 'Programação - Rádio IF',
      grouped
    });
  } catch (err) {
    console.error('[ProgramController] Erro ao carregar programação:', err);

    res.status(500).render('error', {
      title: 'Erro ao carregar programação',
      message: 'Não foi possível carregar a grade de programação.',
      error: err
    });
  }
};
