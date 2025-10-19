const adminOnly = (req, res, next) => {
  if (req.session?.user?.administrador) return next();
  return res.status(403).render('error', {
    title: 'Acesso negado',
    message: 'Você não tem permissão para acessar esta página.',
    error: {}
  });
};

module.exports = { adminOnly };
