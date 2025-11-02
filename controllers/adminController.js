const Contact = require('../models/Contact');
const News = require('../models/News');
const db = require('../config/database');
const Slide = require('../models/Slide');

// =======================================
// Painel Principal - Pedidos de Músicas
// =======================================
exports.requests = async (req, res) => {
  try {
    const allContacts = await Contact.findAll();
    const pedidos = allContacts.filter(c => c.tipo_assunto === 'Pedidos de músicas');

    res.render('admin/pedidos', {
      title: 'Pedidos de Músicas - Rádio IF',
      user: req.session.user,
      pedidos
    });
  } catch (err) {
    console.error('[AdminController] Erro ao carregar pedidos:', err);
    res.status(500).render('error', {
      title: 'Erro ao carregar pedidos',
      message: 'Não foi possível carregar os pedidos de músicas.',
      error: err
    });
  }
};

// =======================================
// Excluir pedido de música
// =======================================
exports.deleteMusicRequest = async (req, res) => {
  const { id } = req.params;
  
  try {
    await Contact.delete(id);
    
    res.status(200).json({ success: true, message: 'Pedido excluído com sucesso.' });
  } catch (err) {
    console.error('[AdminController] Erro ao excluir pedido:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Não foi possível excluir o pedido.' 
    });
  }
};

// =======================================
// Painel - Mensagens e Reclamações
// =======================================
exports.contacts = async (req, res) => {
  try {
    const allContacts = await Contact.findAll();
    const contatos = allContacts.filter(c => c.tipo_assunto !== 'Pedidos de músicas');

    res.render('admin/contatos', {
      title: 'Mensagens e Reclamações - Rádio IF',
      user: req.session.user,
      contatos
    });
  } catch (err) {
    console.error('[AdminController] Erro ao carregar contatos:', err);
    res.status(500).render('error', {
      title: 'Erro ao carregar contatos',
      message: 'Não foi possível carregar as mensagens.',
      error: err
    });
  }
};

// =======================================
// Excluir contato (mensagem/reclamação)
// =======================================
exports.deleteContact = async (req, res) => {
  const { id } = req.params;
  
  try {
    await Contact.delete(id);
    
    res.status(200).json({ success: true, message: 'Mensagem excluída com sucesso.' });
  } catch (err) {
    console.error('[AdminController] Erro ao excluir contato:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Não foi possível excluir a mensagem.' 
    });
  }
};

// =======================================
// API - Atualização dinâmica
// =======================================
exports.musicRequestsApi = async (req, res) => {
  try {
    const allContacts = await Contact.findAll();
    const pedidos = allContacts.filter(c => c.tipo_assunto === 'Pedidos de músicas');
    res.json(pedidos);
  } catch (err) {
    console.error('[AdminController] Erro ao buscar pedidos via API:', err);
    res.status(500).json({ error: 'Erro ao buscar pedidos.' });
  }
};

exports.contactsApi = async (req, res) => {
  try {
    const allContacts = await Contact.findAll();
    const contatos = allContacts.filter(c => c.tipo_assunto !== 'Pedidos de músicas');
    res.json(contatos);
  } catch (err) {
    console.error('[AdminController] Erro ao buscar contatos via API:', err);
    res.status(500).json({ error: 'Erro ao buscar contatos.' });
  }
};

// =======================================
// Painel - Gerenciar Notícias
// =======================================
exports.manageNews = async (req, res) => {
  try {
    const noticias = await News.findAll();
    res.render('admin/noticias', {
      title: 'Gerenciar Notícias - Rádio IF',
      user: req.session.user,
      noticias
    });
  } catch (err) {
    console.error('[AdminController] Erro ao carregar notícias:', err);
    res.status(500).render('error', {
      title: 'Erro ao carregar notícias',
      message: 'Não foi possível carregar as notícias.',
      error: err
    });
  }
};

// =======================================
// Formulário para criar nova notícia
// =======================================
exports.newNewsForm = (req, res) => {
  res.render('admin/noticia-nova', {
    title: 'Nova Notícia - Rádio IF',
    user: req.session.user,
    error: null
  });
};

// =======================================
// Criar nova notícia
// =======================================
exports.createNews = async (req, res) => {
  const { titulo, conteudo, imagem_url } = req.body;
  const id_autor = req.session.user?.id || null;

  if (!titulo || !conteudo) {
    return res.status(400).render('admin/noticia-nova', {
      title: 'Nova Notícia - Rádio IF',
      user: req.session.user,
      error: 'Título e conteúdo são obrigatórios.'
    });
  }

  try {
    await News.create({ titulo, conteudo, imagem_url, id_autor });
    res.redirect('/admin/noticias');
  } catch (err) {
    console.error('[AdminController] Erro ao criar notícia:', err);
    res.status(500).render('admin/noticia-nova', {
      title: 'Nova Notícia - Rádio IF',
      user: req.session.user,
      error: 'Erro ao criar notícia. Tente novamente.'
    });
  }
};

// =======================================
// Formulário de edição
// =======================================
exports.editNewsForm = async (req, res) => {
  const { id } = req.params;
  try {
    const noticia = await News.findById(id);
    if (!noticia) {
      return res.status(404).render('error', {
        title: 'Notícia não encontrada',
        message: 'A notícia solicitada não existe.'
      });
    }

    res.render('admin/noticia-editar', {
      title: `Editar Notícia - ${noticia.titulo}`,
      user: req.session.user,
      noticia,
      error: null
    });
  } catch (err) {
    console.error('[AdminController] Erro ao carregar notícia para edição:', err);
    res.status(500).render('error', {
      title: 'Erro ao carregar notícia',
      message: 'Falha ao carregar notícia para edição.'
    });
  }
};

// =======================================
// Atualizar notícia
// =======================================
exports.updateNews = async (req, res) => {
  const { id } = req.params;
  const { titulo, conteudo, imagem_url } = req.body;

  if (!titulo || !conteudo) {
    return res.status(400).render('admin/noticia-editar', {
      title: 'Editar Notícia',
      user: req.session.user,
      noticia: { id, titulo, conteudo, imagem_url },
      error: 'Título e conteúdo são obrigatórios.'
    });
  }

  try {
    await News.update(id, { titulo, conteudo, imagem_url });
    res.redirect('/admin/noticias');
  } catch (err) {
    console.error('[AdminController] Erro ao atualizar notícia:', err);
    res.status(500).render('admin/noticia-editar', {
      title: 'Erro ao atualizar notícia',
      user: req.session.user,
      noticia: { id, titulo, conteudo, imagem_url },
      error: 'Falha ao atualizar notícia.'
    });
  }
};

// =======================================
// Deletar notícia
// =======================================
exports.deleteNews = async (req, res) => {
  const { id } = req.params;
  try {
    await News.delete(id);
    res.redirect('/admin/noticias');
  } catch (err) {
    console.error('[AdminController] Erro ao deletar notícia:', err);
    res.status(500).render('error', {
      title: 'Erro ao deletar notícia',
      message: 'Falha ao remover notícia.',
      error: err
    });
  }
};

// =======================================
// GERENCIAR EQUIPE (Tabela: equipe)
// =======================================
exports.manageTeam = async (req, res) => {
  try {
    // 🔹 Equipe exibida na página "Equipe"
    const [teamRows] = await db.query('SELECT * FROM equipe ORDER BY nome');

    // 🔹 Todos os usuários cadastrados no sistema
    const [userRows] = await db.query('SELECT id, nome, email, administrador FROM usuarios ORDER BY nome');

    res.render('admin/equipe', {
      title: 'Gerenciar Equipe - Rádio IF',
      user: req.session.user,
      members: teamRows,
      users: userRows
    });
  } catch (err) {
    console.error('[AdminController] Erro ao carregar equipe/usuários:', err);
    res.status(500).render('error', {
      title: 'Erro ao carregar equipe',
      message: 'Não foi possível carregar os integrantes da equipe e usuários cadastrados.',
      error: err
    });
  }
};

// Formulário de novo integrante
exports.newMemberForm = (req, res) => {
  res.render('admin/equipe_form', {
    title: 'Novo Integrante - Rádio IF',
    user: req.session.user,
    member: {}
  });
};

// Criar novo integrante
exports.createMember = async (req, res) => {
  try {
    const { nome, funcao, foto_url, instagram, linkedin } = req.body;
    await db.query(
      `INSERT INTO equipe (nome, funcao, foto_url, instagram, linkedin)
       VALUES (?, ?, ?, ?, ?)`,
      [nome, funcao, foto_url, instagram, linkedin]
    );
    res.redirect('/admin/equipe');
  } catch (err) {
    console.error('[AdminController] Erro ao criar integrante:', err);
    res.status(500).render('error', {
      title: 'Erro ao criar integrante',
      message: 'Falha ao adicionar novo integrante da equipe.',
      error: err
    });
  }
};

// Formulário de edição
exports.editMemberForm = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM equipe WHERE id = ?', [req.params.id]);
    if (!rows.length) {
      return res.status(404).render('error', {
        title: 'Integrante não encontrado',
        message: 'O integrante solicitado não existe.'
      });
    }

    res.render('admin/equipe_form', {
      title: 'Editar Integrante - Rádio IF',
      user: req.session.user,
      member: rows[0]
    });
  } catch (err) {
    console.error('[AdminController] Erro ao carregar integrante:', err);
    res.status(500).render('error', {
      title: 'Erro ao carregar integrante',
      message: 'Não foi possível carregar os dados do integrante.',
      error: err
    });
  }
};

// Atualizar integrante
exports.updateMember = async (req, res) => {
  try {
    const { nome, funcao, foto_url, instagram, linkedin } = req.body;
    await db.query(
      `UPDATE equipe SET nome=?, funcao=?, foto_url=?, instagram=?, linkedin=? WHERE id=?`,
      [nome, funcao, foto_url, instagram, linkedin, req.params.id]
    );
    res.redirect('/admin/equipe');
  } catch (err) {
    console.error('[AdminController] Erro ao atualizar integrante:', err);
    res.status(500).render('error', {
      title: 'Erro ao atualizar integrante',
      message: 'Falha ao salvar alterações no integrante da equipe.',
      error: err
    });
  }
};

// Excluir integrante
exports.deleteMember = async (req, res) => {
  try {
    await db.query('DELETE FROM equipe WHERE id = ?', [req.params.id]);
    res.redirect('/admin/equipe');
  } catch (err) {
    console.error('[AdminController] Erro ao excluir integrante:', err);
    res.status(500).render('error', {
      title: 'Erro ao excluir integrante',
      message: 'Falha ao remover integrante da equipe.',
      error: err
    });
  }
};

// =======================================
// Tornar usuário administrador
// =======================================
exports.makeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE usuarios SET administrador = 1 WHERE id = ?', [id]);
    res.redirect('/admin/equipe');
  } catch (err) {
    console.error('[AdminController] Erro ao tornar usuário administrador:', err);
    res.status(500).render('error', {
      title: 'Erro ao atualizar usuário',
      message: 'Falha ao conceder privilégio de administrador.',
      error: err
    });
  }
};

// =======================================
// Excluir usuário
// =======================================
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
    res.redirect('/admin/equipe');
  } catch (err) {
    console.error('[AdminController] Erro ao excluir usuário:', err);
    res.status(500).render('error', {
      title: 'Erro ao excluir usuário',
      message: 'Falha ao remover o usuário do sistema.',
      error: err
    });
  }
};

// =======================================
// GERENCIAR SLIDES (Tabela: slides)
// =======================================
exports.manageSlides = async (req, res) => {
  try {
    const slides = await Slide.findAll();
    res.render('admin/slides', {
      title: 'Gerenciar Slides - Rádio IF',
      user: req.session.user,
      slides
    });
  } catch (err) {
    console.error('[AdminController] Erro ao carregar slides:', err);
    res.status(500).render('error', {
      title: 'Erro ao carregar slides',
      message: 'Falha ao carregar slides do site.',
      error: err
    });
  }
};

// Formulário de novo slide
exports.newSlideForm = (req, res) => {
  res.render('admin/slide_form', {
    title: 'Novo Slide - Rádio IF',
    user: req.session.user,
    slide: {},
    error: null
  });
};

// Criar slide
exports.createSlide = async (req, res) => {
  const { titulo, descricao, imagem_url, badge, ordem } = req.body;

  if (!titulo || !imagem_url) {
    return res.render('admin/slide_form', {
      title: 'Novo Slide - Rádio IF',
      user: req.session.user,
      slide: req.body,
      error: 'Título e imagem são obrigatórios.'
    });
  }

  try {
    await Slide.create({ titulo, descricao, imagem_url, badge, ordem });
    res.redirect('/admin/slides');
  } catch (err) {
    console.error('[AdminController] Erro ao criar slide:', err);
    res.status(500).render('admin/slide_form', {
      title: 'Erro ao criar slide',
      user: req.session.user,
      slide: req.body,
      error: 'Falha ao adicionar novo slide.'
    });
  }
};

// Formulário de edição
exports.editSlideForm = async (req, res) => {
  try {
    const slide = await Slide.findById(req.params.id);
    if (!slide) {
      return res.status(404).render('error', {
        title: 'Slide não encontrado',
        message: 'O slide solicitado não existe.'
      });
    }

    res.render('admin/slide_form', {
      title: 'Editar Slide - Rádio IF',
      user: req.session.user,
      slide,
      error: null
    });
  } catch (err) {
    console.error('[AdminController] Erro ao carregar slide:', err);
    res.status(500).render('error', {
      title: 'Erro ao carregar slide',
      message: 'Falha ao carregar dados do slide.'
    });
  }
};

// Atualizar slide
exports.updateSlide = async (req, res) => {
  const { titulo, descricao, imagem_url, badge, ordem } = req.body;

  if (!titulo || !imagem_url) {
    return res.render('admin/slide_form', {
      title: 'Editar Slide - Rádio IF',
      user: req.session.user,
      slide: { ...req.body, id: req.params.id },
      error: 'Título e imagem são obrigatórios.'
    });
  }

  try {
    await Slide.update(req.params.id, { titulo, descricao, imagem_url, badge, ordem });
    res.redirect('/admin/slides');
  } catch (err) {
    console.error('[AdminController] Erro ao atualizar slide:', err);
    res.status(500).render('admin/slide_form', {
      title: 'Erro ao atualizar slide',
      user: req.session.user,
      slide: req.body,
      error: 'Falha ao salvar alterações.'
    });
  }
};

// Excluir slide
exports.deleteSlide = async (req, res) => {
  try {
    await Slide.delete(req.params.id);
    res.redirect('/admin/slides');
  } catch (err) {
    console.error('[AdminController] Erro ao excluir slide:', err);
    res.status(500).render('error', {
      title: 'Erro ao excluir slide',
      message: 'Falha ao remover o slide.'
    });
  }
};

// =======================================
// GERENCIAR PROGRAMAÇÃO (Tabela: programas)
// =======================================
exports.managePrograms = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM programas
       ORDER BY FIELD(dia_semana,'Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'), hora_inicio`
    );

    res.render('admin/programas', {
      title: 'Gerenciar Programação - Rádio IF',
      user: req.session.user,
      programs: rows
    });
  } catch (err) {
    console.error('[AdminController] Erro ao carregar programação:', err);
    res.status(500).render('error', {
      title: 'Erro ao carregar programação',
      message: 'Não foi possível carregar a grade de programação.',
      error: err
    });
  }
};

// Novo programa
exports.newProgramForm = (req, res) => {
  res.render('admin/programa_form', {
    title: 'Novo Programa - Rádio IF',
    user: req.session.user,
    program: {},
    error: null
  });
};

exports.createProgram = async (req, res) => {
  const { nome, descricao, hora_inicio, hora_fim, dia_semana, locutor } = req.body;
  if (!nome || !hora_inicio || !hora_fim || !dia_semana) {
    return res.render('admin/programa_form', {
      title: 'Novo Programa - Rádio IF',
      user: req.session.user,
      program: req.body,
      error: 'Todos os campos obrigatórios devem ser preenchidos.'
    });
  }

  try {
    await db.query(
      `INSERT INTO programas (nome, descricao, hora_inicio, hora_fim, dia_semana, locutor)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, descricao, hora_inicio, hora_fim, dia_semana, locutor]
    );
    res.redirect('/admin/programas');
  } catch (err) {
    console.error('[AdminController] Erro ao criar programa:', err);
    res.status(500).render('admin/programa_form', {
      title: 'Erro ao criar programa',
      user: req.session.user,
      program: req.body,
      error: 'Falha ao adicionar novo programa.'
    });
  }
};

// Editar programa
exports.editProgramForm = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM programas WHERE id = ?', [req.params.id]);
    if (!rows.length) {
      return res.status(404).render('error', {
        title: 'Programa não encontrado',
        message: 'O programa solicitado não existe.'
      });
    }

    res.render('admin/programa_form', {
      title: 'Editar Programa - Rádio IF',
      user: req.session.user,
      program: rows[0],
      error: null
    });
  } catch (err) {
    console.error('[AdminController] Erro ao carregar programa:', err);
    res.status(500).render('error', {
      title: 'Erro ao carregar programa',
      message: 'Falha ao carregar dados do programa.'
    });
  }
};

exports.updateProgram = async (req, res) => {
  const { nome, descricao, hora_inicio, hora_fim, dia_semana, locutor } = req.body;
  if (!nome || !hora_inicio || !hora_fim || !dia_semana) {
    return res.render('admin/programa_form', {
      title: 'Editar Programa - Rádio IF',
      user: req.session.user,
      program: { ...req.body, id: req.params.id },
      error: 'Todos os campos obrigatórios devem ser preenchidos.'
    });
  }

  try {
    await db.query(
      `UPDATE programas
          SET nome=?, descricao=?, hora_inicio=?, hora_fim=?, dia_semana=?, locutor=?
        WHERE id=?`,
      [nome, descricao, hora_inicio, hora_fim, dia_semana, locutor, req.params.id]
    );
    res.redirect('/admin/programas');
  } catch (err) {
    console.error('[AdminController] Erro ao atualizar programa:', err);
    res.status(500).render('admin/programa_form', {
      title: 'Erro ao atualizar programa',
      user: req.session.user,
      program: req.body,
      error: 'Falha ao salvar alterações.'
    });
  }
};

// Excluir programa
exports.deleteProgram = async (req, res) => {
  try {
    await db.query('DELETE FROM programas WHERE id = ?', [req.params.id]);
    res.redirect('/admin/programas');
  } catch (err) {
    console.error('[AdminController] Erro ao excluir programa:', err);
    res.status(500).render('error', {
      title: 'Erro ao excluir programa',
      message: 'Falha ao remover programa.'
    });
  }
};