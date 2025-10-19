// Verifica se o usuário está autenticado
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) return next();

    // Guarda a página original e redireciona para o login com aviso
    req.session.returnTo = req.originalUrl;
    return res.redirect('/auth/login?alert=login-required');
};

// Verifica se o usuário NÃO está autenticado (usado em login/register)
const isGuest = (req, res, next) => {
    if (req.session && req.session.user) return res.redirect('/');
    return next();
};

module.exports = { isAuthenticated, isGuest };
