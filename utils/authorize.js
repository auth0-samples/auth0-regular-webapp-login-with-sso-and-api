const uuidv4 = require('uuid/v4');

const env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://jwlm.com:3000/callback',
  AUDIENCE: process.env.AUDIENCE || 'https://#{env.AUTH0_DOMAIN}/userinfo',
  SCOPE: process.env.SCOPE
};

function authorize (req, res, promptNone) {
  promptNone = promptNone || false;
  req.session.state = uuidv4();
  let url = `https://${env.AUTH0_DOMAIN}/authorize?response_type=code&client_id=${env.AUTH0_CLIENT_ID}` +
      `&redirect_uri=${env.AUTH0_CALLBACK_URL}&audience=${env.AUDIENCE}&state=${req.session.state}&scope=${env.SCOPE}`;
  if (promptNone) {
    url = `${url}&prompt=none`;
  }
  res.redirect(url);
}

module.exports = authorize;
