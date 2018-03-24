const express = require('express');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const router = express.Router();
const request = require('request');
const ensureTokenValid = require('../utils/ensureTokenValid');
const authorize = require('../utils/authorize');

const handleDelivery = (res, url, accessToken) => {
  const options = {
    url: url,
    json: true,
    headers: {
      'authorization': `bearer ${accessToken}`
    }
  };
  request(options, function (error, response, body) {
    if (error) {
      console.error(error);
      return res.json({ error: true, description: 'Check server logs & whether API Ports already in use' , error: error});
    }
    res.json(body);
  });
};

const handleOutboundDelivery = (res, url, accessToken) => {
  const options = {
    url: url,
    json: true,
    headers: {
      'User-Agent': `jwlm-check-hack-tool`
    }
  };
  request(options, function (error, response, body) {
    if (error) {
      console.error(error);
      return res.json({ error: true, description: 'Check server logs & whether API Ports already in use' });
    }
    else if (body === undefined) {
      return res.json({numberOfAccountHacked: '0', Awesome: 'Your email username appears to have not been hacked in past!' });
    }
    else {
    return res.json({numberOfAccountHacked: body.length, recommendation: 'Reset your password!', accountsHacked: body});
  }
  });
};

router.get('/session', ensureLoggedIn('/auth'), ensureTokenValid, function (req, res, next) {
  authorize(req, res, true);
});

router.get('/userinfo', ensureLoggedIn('/auth'), ensureTokenValid, function (req, res, next) {
  const url = `https://${process.env.AUTH0_DOMAIN}/userinfo`;
  handleDelivery(res, url, req.session.access_token);
});

router.get('/hasBeenHacked', ensureLoggedIn('/auth'), ensureTokenValid, function (req, res, next) {
   const url = `${process.env.API_HOST}/api/hasBeenHacked`;
  handleDelivery(res, url, req.session.access_token);
});

router.get('/check_hack', ensureLoggedIn('/auth'), ensureTokenValid, function (req, res, next) {
  const url = `https://haveibeenpwned.com/api/v2/breachedaccount/` + req.user.displayName + '?truncateResponse=true';
  handleOutboundDelivery(res, url, req.session.access_token);
});

module.exports = router;
