/*
  utilities.js

  Contains utility functions
  ------------------------------------------------------------------------------

  Revision History
  ================
  12 Feb 2020 MDS Original

  ------------------------------------------------------------------------------
 */

const PAD_LEFT = 0;
const PAD_RIGHT = 1;
//
// ----------------------------------------------------------------------------
// Wait for a keypress.  Return true for continuation, false to escape the 
//   current action 
//
function more(fn) {
  function moreHandler(e) {
    blockLog('\n');
    if ((e.keyCode == KeyEsc) || 
        ((e.keyCode == KeyC) && (e.ctrlKey == true))) {
      // Do nothing because default is to get out
    } else {
      // On keypress, queue display of next page into the event queue
      if (moreHandler.fn) {
        setTimeout(moreHandler.fn, 0);
        moreHandler.fn = null;
      }
    }
    
    // 'More' functionality is complete, so put everything back the way it was
    document.getElementById('input_source').removeEventListener('keyup', moreHandler);    
    document.getElementById('input_source').addEventListener('keyup', submitCommand);
    document.getElementById('input_source').value = "";
    document.getElementById("input_title").innerText = getPrompt();
    return;
  }

  document.getElementById("input_title").innerText = 
    'Press any key to continue (ESC or Ctrl-C to exit) ... ';
  document.getElementById('input_source').removeEventListener('keyup', submitCommand);
  document.getElementById('input_source').addEventListener('keyup', moreHandler); 
  moreHandler.fn = fn;
}
//
// ----------------------------------------------------------------------------
// open the passed link in a new window
//
function openLink(url) {
  if (url.length == 0) {
    blockLog("I can\'t open the empty URL that was passed to me.");
    return;
  }
  
  if ((url.substring(0,4).toUpperCase() === "HTTP") ||
      (url.substring(0,4).toUpperCase() === "WWW.")) {
    if (navigator.onLine) {
      window.open(url);
    } else {
      blockLog("I\'m unable to connect to the internet at the moment, " +
        "so can\'t complete your request.");
    }
  } else {
    window.open(url);
  }
}
//
// ----------------------------------------------------------------------------
// pad a string and return the padded result
//
function pad(s, width, ch, dirn) {
  if (width == undefined) 
    return s;
  if (ch == undefined) 
    ch = ' ';
  if (ch.length > 1)
    ch = ch[0];
  if (dirn == undefined) dirn = PAD_LEFT;

  s = s.toString();
  var i = s.length;
  
  if (dirn == PAD_LEFT) {
    while (i < width) {
      s = ch + s;
      i++;
    }
  } else {
    while (i < width) {
      s = s + ch;
      i++;
    }
  }
  return s;
}
//
// ----------------------------------------------------------------------------
// return a string of HTML friendly spaces
//
function spc(width) {
  if (width == undefined) 
    return '';
  var s = '\xa0';
  return s.repeat(width);
}
registerFile(5);
//
// ----------------------------------------------------------------------------
//                               End of file
// ----------------------------------------------------------------------------
//

