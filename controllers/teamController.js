const dbTeam = require('../config/database');

exports.index = async (req, res) => {
  let teamMembers = [];
  try {
    const [rows] = await dbTeam.query('SELECT * FROM equipe ORDER BY nome');
    teamMembers = rows;
  } catch (e) {
    console.error('[teamController.index] Erro ao buscar equipe:', e);
    if (process.env.DEBUG_DB_FALLBACK === 'true') {
      teamMembers = [
        {
          id: 1,
          name: 'Ana Souza',
          role: 'Locutora',
          photo_url: '/images/team1.jpg',
          instagram: '#',
          linkedin: '#'
        },
        {
          id: 2,
          name: 'Bruno Lima',
          role: 'Apresentador',
          photo_url: '/images/team2.jpg',
          instagram: '#',
          linkedin: '#'
        }
      ];
    }
  }

  res.render('equipe', {
    title: 'Equipe - Rádio IF',
    teamMembers
  });
};
