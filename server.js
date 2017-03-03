var fs = require('fs');
var https = require('https');
var connect = require('connect');
var serveStatic = require('serve-static');

var app = connect();

var options = {
      key:    fs.readFileSync('ssl/server.key'),
      cert:   fs.readFileSync('ssl/server.crt')
};

app.use(serveStatic(__dirname));

https.createServer(options,app).listen(3000, function () {
  console.log('server stated on 3000');
});
