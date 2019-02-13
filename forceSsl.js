function requireHTTPS(req, res, next) {
  if (req.get('host').includes('localhost')) {
    return next();
  }

  // The 'x-forwarded-proto' check is for Heroku
  if (
    !req.secure &&
    req.get('x-forwarded-proto') !== 'https' &&
    process.env.NODE_ENV !== 'development'
  ) {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

module.exports = { requireHTTPS };
