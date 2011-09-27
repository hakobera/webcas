var WEBCAS_SETTINGS = "webcas_settings";

/**
 * Saves settings to localStorage.
 */
function saveSettings() {
  var settings = {
    serverUrl: $('#server').val()
  };
  localStorage[WEBCAS_SETTINGS] = JSON.stringify(settings);

  chrome.browserAction.setPopup({ popup: '' });
  console.log(chrome.extension.getBackgroundPage());
  chrome.extension.getBackgroundPage().connect(settings.serverUrl);

  var msgBox = $('#messageBox');
  msgBox.show().find('p').text('Options Saved.');
  setTimeout(function() {
    msgBox.fadeOut('slow');
  }, 2000);
}

/**
 * Restores settings from localStorage.
 */
function restoreSettings() {
  var settings = loadSettings();
  if (settings) {
    $('#server').val(settings.serverUrl);
  }
}

/**
 * Load and return settings from localStorage
 */
function loadSettings() {
  if (localStorage[WEBCAS_SETTINGS]) {
    return JSON.parse(localStorage[WEBCAS_SETTINGS]);
  }
  return null;s
}

$(function() {
  $('#closeMessage').click(function(e) {
    e.preventDefault();
    $('#messageBox').hide();
  });

  $('form').submit(function(e) {
    e.preventDefault();
    saveSettings();
  });

  restoreSettings();
});