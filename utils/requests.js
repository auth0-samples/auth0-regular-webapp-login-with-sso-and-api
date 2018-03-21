const https = require('https');

var optionsget = {
    host : 'haveibeenpwned.com', // here only the domain name
    // (no http/https !)
    port : 443,
    path : '/api/v2/breachedaccount/test@test.com', // the rest of the url with parameters if needed
    method : 'GET' // do GET
};


const check_for_hack = function() {
  var reqGet = https.request(optionsget, function(res) {
    console.log("statusCode: ", res.statusCode);
    // uncomment it for header details
//  console.log("headers: ", res.headers);
    res.on('data', function(d) {
        console.info('GET result:\n');
        process.stdout.write(d);
        console.info('\n\nCall completed');
    });

});

reqGet.end();
reqGet.on('error', function(e) {
    console.error(e);
  });
  return reqGet;
};

module.exports = check_for_hack;
