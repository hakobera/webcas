var BASE = 'http://localhost:3001';

var recording = false
  , timer = null
  , socket;

chrome.browserAction.onClicked.addListener(function(tab) {
  recording = !recording;

  if (recording) {
    timer = setInterval(function() {
      chrome.windows.getCurrent(function (win) {
        chrome.tabs.captureVisibleTab(win.id, { "format": "png" }, function(imgUrl) {
          postScreenShot(imgUrl, win.width, win.height);
        });
      });
    }, 3000);
  } else {
    clearInterval(timer);
  }

  chrome.browserAction.setBadgeText({
    text: recording? 'REC' : ''
  });
});

function shrink(dataUrl, width, height, callback) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext('2d');
  var image = new Image();
  image.onload = function() {
    ctx.drawImage(image, 0, 0, width, height);
    callback(canvas.toDataURL());
  };
  image.src = dataUrl;
}

var i = 0;

function resize(num, ratio) {
  return (num * ratio) | 0;
}

function postScreenShot(data, width, height) {
  console.log(i++);
  shrink(data, resize(width, 0.75), resize(height, 0.75), function(dataUrl) {
    socket.emit('cast', {
        index: i
      , format: 'png'
      , dataUrl: dataUrl
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  socket = io.connect(BASE);
});
