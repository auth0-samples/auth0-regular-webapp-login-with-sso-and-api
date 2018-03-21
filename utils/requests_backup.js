var querystring = require('querystring');
var https = require('https');

var host = 'haveibeenpwned.com';

function performRequest(endpoint, method, data, success) {
  var dataString = JSON.stringify(data);
  //var headers = {"User-Agent": "jwlm-check-hack-tool"};
  var headers = {"User-Agent": "jwlm-check-hack-tool"};

  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
  }
  else {
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    };
  }

  var options = {
    host: host,
    path: endpoint,
    method: method,
    headers: headers
  };

  var req = https.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      //console.log(responseString);
      var responseObject = JSON.parse(responseString);
      success(responseObject);
    });
  });

  req.write(dataString);
  req.end();
}

//module.exports = performRequest;

module.exports = performRequest(
  '/api/v2/breachedaccount/test@test.com',
  'GET',
  {
    truncateResponse: true
  },
  function(data)
  {
   console.log(data);
  }
);
