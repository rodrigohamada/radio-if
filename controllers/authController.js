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

    // Cria sessão do usuário autenticado
    req.session.user = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      administrador: !!user.administrador
    };

    // Redirecionamento inteligente:
    // - Admins vão direto ao painel principal
    // - Usuários comuns seguem o fluxo normal
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

  // 🔒 Validação dos campos obrigatórios
  if (!name || !email || !password || !celular || !cep || !logradouro || !numero || !bairro || !cidade || !uf) {
    return res.status(400).render('cadastro', {
      title: 'Cadastro - Rádio IF',
      error: 'Preencha todos os campos obrigatórios.'
    });
  }

  try {
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).render('cadastro', {
        title: 'Cadastro - Rádio IF',
        error: 'E-mail já cadastrado.'
      });
    }

    const id = await User.create({
      nome: name,
      email,
      senha: password,
      celular,
      telefone,
      cep,
      logradouro,
      numero,
      bairro,
      cidade,
      uf
    });

    // Cria sessão após cadastro bem-sucedido
    req.session.user = { id, nome: name, email, administrador: false };
    return res.redirect('/');

  } catch (err) {
    console.error('[AuthController] Erro ao cadastrar usuário:', err);
    return res.status(500).render('cadastro', {
      title: 'Cadastro - Rádio IF',
      error: 'Erro ao cadastrar. Tente novamente.'
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
