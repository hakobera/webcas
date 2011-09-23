var connect = require('connect')
  , sio = require('socket.io')
  , http = require('http')
  , s3 = require('./lib/s3');

var port = 3000;

var server = connect.createServer(
    connect.favicon()
  , connect.logger()
  , connect.static(__dirname + '/public')
  , connect.staticCache()
);

var io = require('socket.io').listen(port + 1);

io.sockets.on('connection', function (socket) {
  console.log(socket.id);
  socket.emit('con', { id: socket.id });

  socket.on('cast', function(data) {
    var dataUrl = data.dataUrl
      , format = data.format;
    
    if (dataUrl) {
      dataUrl = dataUrl.substring(dataUrl.indexOf(','));
      var buf = new Buffer(dataUrl, 'base64');
      var s3req = s3.put('/test' + '.' + format, {
        'Content-Length': buf.length,
        'Content-Type': 'image/' + format
      });
      s3req.on('response', function(s3res) {
        if (s3res.statusCode === 200) {
          console.log('saved to %s', s3req.url);
          socket.broadcast.volatile.emit('update', { url: s3req.url + '?t=' + new Date().getTime() });
        } else {
          console.log('Screenshot image cannot save');
        }
      });
      s3req.end(buf);
    }
  });
});

server.listen(port);
console.log("Server listening on port %d in %s mode", port, process.env.NODE_ENV || 'development');