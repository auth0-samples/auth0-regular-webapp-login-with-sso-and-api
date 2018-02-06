const request = require('request');
const decode = require('jwt-decode');

const getTokenExpirationDate = (token) => {
  const decoded = decode(token);
  if (!decoded.exp) {
    return null;
  }
  const date = new Date(0); // The 0 here is the key, which sets the date to the epoch
  date.setUTCSeconds(decoded.exp);
  return date;
};

const isTokenExpired = (token) => {
  const date = getTokenExpirationDate(token);
  if (date === null) {
    return false;
  }
  // is expiration date before the date now
  return date.valueOf() < new Date().valueOf();
};

const refreshTokens = (refreshToken) => {
  return new Promise((resolve, reject) => {
    var options = {
      method: 'POST',
      url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      headers: { 'content-type': 'application/json' },
      body: {
        grant_type: 'refresh_token',
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        refresh_token: refreshToken
      },
      json: true
    };
    request(options, function (error, response, body) {
      if (error) {
        reject(new Error(error));
      }
      resolve(body);
    });
  });
};

module.exports = {
  isTokenExpired,
  refreshTokens
};
