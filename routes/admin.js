const express = require('express');
const router = express.Router();
const { adminOnly } = require('../middlewares/adminAuth');
const adminController = require('../controllers/adminController');

// =============================
// Painel Principal
// =============================
router.get('/', adminOnly, (req, res) => {
  res.render('admin/index', {
    title: 'Painel Administrativo - Rádio IF',
    user: req.session.user
  });
});

// =============================
// Pedidos de Músicas
// =============================
router.get('/pedidos', adminOnly, adminController.requests);

// =============================
// Excluir Pedido de Música
// =============================
router.post('/pedidos/excluir/:id', adminOnly, adminController.deleteMusicRequest);

// =============================
// Mensagens e Reclamações
// =============================
router.get('/contatos', adminOnly, adminController.contacts);

// =============================
// Excluir Contato
// =============================
router.post('/contatos/excluir/:id', adminOnly, adminController.deleteContact);

// =============================
// APIs dinâmicas
// =============================
router.get('/api/pedidos', adminOnly, adminController.musicRequestsApi);
router.get('/api/contatos', adminOnly, adminController.contactsApi);

// =============================
// Gerenciar Notícias
// =============================
router.get('/noticias', adminOnly, adminController.manageNews);

// Página de criação
router.get('/noticias/nova', adminOnly, adminController.newNewsForm);
router.post('/noticias/nova', adminOnly, adminController.createNews);

// Página de edição
router.get('/noticias/editar/:id', adminOnly, adminController.editNewsForm);
router.post('/noticias/editar/:id', adminOnly, adminController.updateNews);

// Excluir notícia
router.get('/noticias/excluir/:id', adminOnly, adminController.deleteNews);

// =============================
// Gerenciar Equipe
// =============================
router.get('/equipe', adminOnly, adminController.manageTeam);
router.get('/equipe/novo', adminOnly, adminController.newMemberForm);
router.post('/equipe/novo', adminOnly, adminController.createMember);
router.get('/equipe/editar/:id', adminOnly, adminController.editMemberForm);
router.post('/equipe/editar/:id', adminOnly, adminController.updateMember);
router.get('/equipe/excluir/:id', adminOnly, adminController.deleteMember);

// Tornar usuário administrador
router.get('/usuarios/admin/:id', adminOnly, adminController.makeAdmin);

// Excluir usuário
router.get('/usuarios/excluir/:id', adminOnly, adminController.deleteUser);

// =============================
// SLIDES
// =============================
router.get('/slides', adminOnly, adminController.manageSlides);
router.get('/slides/novo', adminOnly, adminController.newSlideForm);
router.post('/slides/novo', adminOnly, adminController.createSlide);
router.get('/slides/editar/:id', adminOnly, adminController.editSlideForm);
router.post('/slides/editar/:id', adminOnly, adminController.updateSlide);
router.get('/slides/excluir/:id', adminOnly, adminController.deleteSlide);

// =============================
// GERENCIAR PROGRAMAÇÃO
// =============================
router.get('/programas', adminOnly, adminController.managePrograms);
router.get('/programas/novo', adminOnly, adminController.newProgramForm);
router.post('/programas/novo', adminOnly, adminController.createProgram);
router.get('/programas/editar/:id', adminOnly, adminController.editProgramForm);
router.post('/programas/editar/:id', adminOnly, adminController.updateProgram);
router.get('/programas/excluir/:id', adminOnly, adminController.deleteProgram);

// =============================
// IMPORTANTE: module.exports deve ser a ÚLTIMA linha
// =============================
module.exports = router;