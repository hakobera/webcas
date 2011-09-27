function log(msg) {
  if (window.console) {
    console.log(msg);
  }
}

$(function() {
  var screen = $('#screen');
  var socket = io.connect('http://localhost:3001');

  socket.on('connected', function() {
    log('connected');
  });

  socket.on('update', function(data) {
    var url = data.url;
    var img = new Image();
    img.onload = function() {
      screen.html(img);
    };
    img.src = url;
    log(img.src);
  });
});
