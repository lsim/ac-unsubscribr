var extensionUrl = 'http://google.dk'

var http = require('http');
 
  //step 2) start the server
  http.createServer(function (req, res) {
 
  res.writeHead(301, {Location: extensionUrl});
 
  res.end('Your node.js server is running on localhost:3000');
 
}).listen(8080);