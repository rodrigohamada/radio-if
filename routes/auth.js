const express = require('express');
const router = express.Router();
const { isGuest, isAuthenticated } = require('../middlewares/auth');
const authController = require('../controllers/authController');
const contactController = require('../controllers/contactController');

// ==================== AUTENTICAÇÃO ====================

// Página de login com alerta opcional
router.get('/login', isGuest, (req, res) => {
  const alertParam = req.query.alert;
  let alertMessage = null;

  if (alertParam === 'login-required') {
    alertMessage = '⚠️ Você precisa estar logado para enviar uma mensagem de contato. Faça login ou crie uma conta.';
  } else if (req.query.error === 'unauthorized') {
    alertMessage = '⚠️ Acesso restrito. Faça login para continuar.';
  }

  res.render('login', {
    title: 'Entrar - Rádio IF',
    error: alertMessage || null
  });
});

// Login e registro
router.post('/login', isGuest, authController.login);
router.get('/register', isGuest, authController.registerForm);
router.post('/register', isGuest, authController.register);
router.post('/logout', authController.logout);

// ==================== CONTATO (somente usuários logados) ====================

// Protege as rotas de contato
router.get('/contato', isAuthenticated, contactController.form);
router.post('/contato', isAuthenticated, contactController.send);

// Middleware global para capturar acessos diretos não autenticados
router.use((req, res, next) => {
  if (req.path === '/contato' && !req.session.user) {
    return res.redirect('/auth/login?alert=login-required');
  }
  next();
});

module.exports = router;
