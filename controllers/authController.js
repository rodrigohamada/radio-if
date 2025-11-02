const User = require('../models/User');

// =======================================
// Exibe formulário de login
// =======================================
exports.loginForm = (req, res) => {
  res.render('login', { title: 'Entrar - Rádio IF', error: null });
};

// =======================================
// Autenticação de usuário
// =======================================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).render('login', {
        title: 'Entrar - Rádio IF',
        error: 'Credenciais inválidas.'
      });
    }

    const valid = await User.verifyPassword(password, user.senha);
    if (!valid) {
      return res.status(401).render('login', {
        title: 'Entrar - Rádio IF',
        error: 'Credenciais inválidas.'
      });
    }

    req.session.user = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      administrador: !!user.administrador
    };

    if (req.session.user.administrador) {
      return res.redirect('/admin/');
    }

    const redirectTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    return res.redirect(redirectTo);

  } catch (err) {
    console.error('[AuthController] Erro ao autenticar usuário:', err);
    return res.status(500).render('login', {
      title: 'Entrar - Rádio IF',
      error: 'Erro interno ao processar login. Tente novamente.'
    });
  }
};

// =======================================
// Exibe formulário de cadastro
// =======================================
exports.registerForm = (req, res) => {
  res.render('cadastro', { title: 'Cadastro - Rádio IF', error: null });
};

// =======================================
// Criação de novo usuário
// =======================================
exports.register = async (req, res) => {
  console.log('📝 Dados recebidos no cadastro:', req.body);

  const {
    name,
    email,
    password,
    celular,
    telefone,
    cep,
    logradouro,
    numero,
    bairro,
    cidade,
    uf
  } = req.body;

  // Validação dos campos obrigatórios
  if (!name || !email || !password || !celular || !cep || !logradouro || !numero || !bairro || !cidade || !uf) {
    console.log('❌ Campos obrigatórios faltando');
    return res.status(400).render('cadastro', {
      title: 'Cadastro - Rádio IF',
      error: 'Preencha todos os campos obrigatórios.'
    });
  }

  // Validação de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).render('cadastro', {
      title: 'Cadastro - Rádio IF',
      error: 'E-mail inválido.'
    });
  }

  // Validação de senha (mínimo 6 caracteres)
  if (password.length < 6) {
    return res.status(400).render('cadastro', {
      title: 'Cadastro - Rádio IF',
      error: 'A senha deve ter no mínimo 6 caracteres.'
    });
  }

  try {
    // Verifica se o e-mail já está cadastrado
    const existing = await User.findByEmail(email);
    if (existing) {
      console.log('⚠️ E-mail já cadastrado:', email);
      return res.status(400).render('cadastro', {
        title: 'Cadastro - Rádio IF',
        error: 'E-mail já cadastrado.'
      });
    }

    console.log('✅ Criando novo usuário...');
    const id = await User.create({
      nome: name,
      email,
      senha: password,
      celular,
      telefone: telefone || null,
      cep,
      logradouro,
      numero,
      bairro,
      cidade,
      uf
    });

    console.log('✅ Usuário criado com ID:', id);

    // Cria sessão após cadastro bem-sucedido
    req.session.user = {
      id,
      nome: name,
      email,
      administrador: false
    };

    console.log('✅ Sessão criada, redirecionando...');
    return res.redirect('/');

  } catch (err) {
    console.error('[AuthController] ❌ Erro ao cadastrar usuário:', err);
    console.error('Stack trace:', err.stack);
    return res.status(500).render('cadastro', {
      title: 'Cadastro - Rádio IF',
      error: 'Erro ao cadastrar. Verifique os dados e tente novamente. Detalhes: ' + err.message
    });
  }
};

// =======================================
// Logout (encerra a sessão)
// =======================================
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('[AuthController] Erro ao encerrar sessão:', err);
    }
    return res.redirect('/');
  });
};