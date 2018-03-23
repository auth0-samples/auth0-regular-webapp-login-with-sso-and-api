const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');

require('dotenv').config();

//const port = 3003;
const port = process.env.PORT;
const domain = process.env.AUTH0_DOMAIN;

app.use(cors());

// Validate the access token and enable the use of the jwtCheck middleware
app.use(jwt({
  // Dynamically provide a signing key based on the kid in the header
  // and the singing keys provided by the JWKS endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer
  audience: 'jwlm_services',
  issuer: `https://${domain}/`,
  algorithms: [ 'RS256' ]
}));

// Middleware to check scopes
const checkPermissions = function (req, res, next) {
  switch (req.path) {
    case '/api/hasBeenHacked': {
      var permissions = ['read:hasBeenHacked'];
      for (var i = 0; i < permissions.length; i++) {
        if (req.user.scope.includes(permissions[i])) {
          next();
        } else {
          res.status(403).send({message: 'Forbidden'});
        }
      }
      break;
    }
  }
};

app.use(checkPermissions);

app.get('/api/hasBeenHacked', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send({hasBeenHacked: 'service is ON', scopes: req.user.scope});
});

app.listen(port, function () {
  console.log('hasBeenHacked API started on port: ' + port);
});
