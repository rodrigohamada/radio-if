const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const programController = require('../controllers/programController');
const teamController = require('../controllers/teamController');
const newsController = require('../controllers/newsController');
const contactController = require('../controllers/contactController');
const { isAuthenticated } = require('../middlewares/auth');
const { adminOnly } = require('../middlewares/adminAuth'); 

// =============================
// Páginas principais
// =============================
router.get('/', homeController.index);
router.get('/programacao', programController.index);
router.get('/equipe', teamController.index);
router.get('/noticias', newsController.index);

// =============================
// Contato
// =============================
router.get('/contato', contactController.form);
router.post('/contato', contactController.send);

// =============================
// Pedir música (usuário logado)
// =============================
router.post('/pedir-musica', isAuthenticated, async (req, res) => {
  res.redirect('/');
});

// =============================
// Painel Admin direto (corrigido)
// =============================
router.get('/admin', adminOnly, (req, res) => {
  res.render('admin/index', {
    title: 'Painel Administrativo - Rádio IF',
    user: req.session.user
  });
});

module.exports = router;
