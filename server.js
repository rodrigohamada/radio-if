// ============================================================
// 🌐 Rádio IF - Servidor Principal
// ============================================================
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const expressLayouts = require('express-ejs-layouts');

const app = express();

// ============================================================
// 🛡️ Segurança
// ============================================================
app.use(helmet({
  contentSecurityPolicy: false, // compatível com player e iframes
}));

// ============================================================
// 🧱 EJS + Layouts
// ============================================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// ============================================================
// ⚙️ Middlewares essenciais
// ============================================================
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ============================================================
// 💾 Sessão
// ============================================================
app.use(session({
  secret: process.env.SESSION_SECRET || 'radio-if-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // altere para true em produção (HTTPS)
    maxAge: 24 * 60 * 60 * 1000 // 24h
  }
}));

// ============================================================
// 🌍 Variáveis Globais
// ============================================================
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isAdmin = Boolean(req.session.user?.administrador); // 
  res.locals.STREAM_URL = process.env.STREAM_URL || '';
  res.locals.appTitle = 'Rádio IF';
  next();
});

// ============================================================
// 🚦 Rotas
// ============================================================
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const apiRouter = require('./routes/api');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/api', apiRouter);

// ============================================================
// ❌ Página 404
// ============================================================
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página não encontrada' });
});

// ============================================================
// 🚀 Inicialização do Servidor
// ============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎵 Rádio IF rodando na porta ${PORT}`);
  console.log(`🌐 Acesse: http://localhost:${PORT}`);
});
