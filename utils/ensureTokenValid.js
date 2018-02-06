const isTokenExpired = require('./tokenUtils').isTokenExpired;
const refreshTokens = require('./tokenUtils').refreshTokens;

/* middleware to ensure access token is valid - refresh if expired */
function ensureTokenValid (req, res, next) {
  if (!isTokenExpired(req.session.access_token)) {
    return next();
  } else {
    // refresh the tokens - access token
    refreshTokens(req.session.refresh_token)
      .then((tokens) => {
        req.session.id_token = tokens.id_token;
        req.session.access_token = tokens.access_token;
        req.session.expires_in = tokens.expires_in;
        return next();
      }).catch((err) => {
        // handle error
        console.error(err);
        res.redirect('/failure');
      });
  }
}
module.exports = ensureTokenValid;
