const Contact = require('../models/Contact');

exports.form = (req, res) => {
  // Exige login (garantido também na rota via middleware)
  if (!req.session || !req.session.user) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/auth/login?error=unauthorized');
  }

  res.render('contato', {
    title: 'Contato - Rádio IF',
    success: false,
    errors: [],
    user: req.session.user,
    form: {}
  });
};

exports.send = async (req, res) => {
  if (!req.session || !req.session.user) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/auth/login?error=unauthorized');
  }

  const user = req.session.user;
  const { name, email, subject, subject_other, message } = req.body;

  const errors = [];
  // nome / e-mail vêm do usuário logado; ainda assim validamos
  if (!name) errors.push('Nome é obrigatório');
  if (!email) errors.push('E-mail é obrigatório');

  if (!subject) errors.push('Selecione um assunto');
  if (subject === 'Outros' && !subject_other) errors.push('Informe o assunto em "Outros"');

  if (!message) errors.push('Mensagem é obrigatória');

  if (errors.length) {
    return res.status(400).render('contato', {
      title: 'Contato - Rádio IF',
      success: false,
      errors,
      user,
      form: { subject, subject_other, message }
    });
  }

  // Monta assunto final
  const finalSubject = subject === 'Outros' ? subject_other : subject;

  try {
    await Contact.create({
      user_id: user.id,
      name,
      email,
      subject: finalSubject,
      subject_type: subject, // guarda o tipo escolhido originalmente
      message
    });
  } catch (e) {
    // Em último caso, exibe erro genérico
    return res.status(500).render('contato', {
      title: 'Contato - Rádio IF',
      success: false,
      errors: ['Não foi possível enviar a mensagem. Tente novamente.'],
      user,
      form: { subject, subject_other, message }
    });
  }

  res.render('contato', {
    title: 'Contato - Rádio IF',
    success: true,
    errors: [],
    user,
    form: {}
  });
};
