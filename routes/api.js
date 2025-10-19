const express4 = require('express');
const router4 = express4.Router();
const Program = require('../models/Program');
const MusicRequest = require('../models/MusicRequest');
const { isAuthenticated } = require('../middlewares/auth');
const { adminOnly } = require('../middlewares/adminAuth');

// ============================================================
// 📻 API: Programa atual (para o player)
// ============================================================
router4.get('/now', async (req, res) => {
  try {
    const now = await Program.getCurrentProgram();

    if (!now) {
      return res.json({
        id: 0,
        name: 'Programação musical',
        host: 'Rádio IF',
        start_time: '00:00:00',
        end_time: '23:59:59',
        day_of_week: 'Hoje'
      });
    }

    // 🔹 Garante que os campos sejam consistentes
    res.json({
      id: now.id || 0,
      name: now.name || now.nome || 'Programação musical',
      host: now.host || now.locutor || 'Rádio IF',
      start_time: now.start_time || now.hora_inicio,
      end_time: now.end_time || now.hora_fim,
      day_of_week: now.day_of_week || now.dia_semana
    });
  } catch (err) {
    console.error('[API /now] Erro ao buscar programa atual:', err);
    res.status(500).json({ error: 'Erro ao buscar programa atual.' });
  }
});

module.exports = router4;
