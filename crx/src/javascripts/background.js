var recording = false
  , timer = null
  , socket;

chrome.browserAction.onClicked.addListener(function(tab) {
  recording = !recording;

  if (recording) {
    timer = setTimeout(capture, 0);
  } else {
    clearTimeout(timer);
  }

  chrome.browserAction.setBadgeText({
    text: recording? 'REC' : ''
  });
});

function capture() {
  chrome.windows.getCurrent(function (win) {
    try {
      chrome.tabs.captureVisibleTab(win.id, { "format": "png" }, function(imgUrl) {
        postScreenShot(imgUrl, win.width, win.height);
      });
    } catch (e) {
      console.log(e);
    }
  });
}

function shrink(dataUrl, width, height, callback) {
  var canvas = document.createElement('canvas')
    , ctx = canvas.getContext('2d')
    , image = new Image();

  canvas.width = width;
  canvas.height = height;

  image.onload = function() {
    ctx.drawImage(image, 0, 0, width, height);
    callback(canvas.toDataURL());
  };
  image.src = dataUrl;
}

var i = 1;

function resize(num, ratio) {
  return (num * ratio) | 0;
}

function postScreenShot(data, width, height) {
  console.log(i++);
  var sendData = {
      index: i
    , format: 'png'
    , dataUrl: data
  };
  socket.emit('cast', sendData);
}

function connect(serverUrl) {
  if (socket) {
    socket.disconnect();
  }

  socket = io.connect(serverUrl);

  socket.on('saved', function(data) {
    console.log('saved');
    if (recording) {
      timer = setTimeout(capture, 0);
    }
  });

  i = 11
}

document.addEventListener('DOMContentLoaded', function() {
  var settings = loadSettings();
  if (settings && settings.serverUrl) {
    connect(settings.serverUrl);
  } else {
    chrome.browserAction.setPopup('options.html');
  }
});
