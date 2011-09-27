$(function() {
  var screen = $('#screen');
  var socket = io.connect('http://localhost:3001');

  socket.on('connected', function() {
    console.log('connected');
  });

  socket.on('update', function(data) {
    var url = data.url;
    var img = new Image();
    img.onload = function() {
      screen.html(img);
    };
    img.src = url + '?t=' + new Date().getTime();
    console.log(img.src);
  });
});
