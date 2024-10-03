/*
  terminal.js

  ------------------------------------------------------------------------------
  Revision History
  ================
  10 Feb 2020 MDS Downloaded from https://github.com/Apthox/Javascript-Terminal
  11 Feb 2020 MDS Added revision history and beautifying.  Changed to object 
                  based, modified logging functions to smart indent/wordwrap.
                  Added more capability in cmd object.

  ------------------------------------------------------------------------------
 */

// Because we use indexes, cmd is an Object, not an Array, so we have to use
// object functions, not array functions.  
//
// The index of a cmd element is the uppercase command name (eg cmd['HELP']).
//
// cmd has one of the following sets of properties:
//    synopsis:     
//      The SYNOPSIS text used for the help page
//    introduction: 
//      The INSTRODUCTION text used for the help page
//    options:
//      The OPTIONS text used for the help page
//    seeAlso:
//      The SEE ALSO text used for the help page
//    keywords:
//      The KEYWORDS text used for the help page
//    flag:
//      A one character flag displayed on the man page
//        ' ' - Completely developed (in production)
//        '*' - Implementation not started 
//        'x' - Implementation started but not complete
//    fn:
//      The function to be called when the command is entered.  Two arguments
//      are passed to the function: argc and argv.  argc is a count of the 
//      arguments (with the command itself being an argument, so argc is always
//      1 or more) and argv, an array of the arguments - argv[0] is the command
//      and is always converted to uppercase when passed to the function.
// or
//    isAliasFor:
//      Contains an uppercase string which is the command which this command is
//      an alias for.
//    flag:
//      A one character flag displayed on the man page
//        ' ' - Always displays this for aliases

var version = 
  'This version March 2020 by Michael Scott';

var copyright = [
  '<a href=\"https://github.com/Apthox/Javascript-Terminal\">Javascript terminal</a> by Apthox',
  'Translated from Myrtle III TCL/TK Command shell 2011',
  'Translated from Myrtle IV shell client 2020',
  'Copyright &copy 1987 - 2006 Michael Scott Consulting Pty Ltd',
  'Copyright &copy 2007 - 2020 Michael Scott'
];

var cmd = [];
var current_block;
var userName = 'Guest';
var pixelsPerCharCol = 10;
var pixelsPerCharRow = 19.5;
var nbsp = '\xa0';
var tab = nbsp + nbsp;
const MAX_CMD = 20; // Number of stored commands 
var cmdHist = [];
var cmdHistPtr = 1;

const KeyEnter = 13;
const KeyUpArr = 38;
const KeyDnArr = 40;
const KeyF3 = 114;
const KeyEsc = 27;
const KeyC = 67; // For Ctrl-C

//
// ----------------------------------------------------------------------------
//
function smartSplit(input, del, emptySpace) {
  if (input.length === 0) return input;
  var outputs = [""];

  var compare = function(base, insert, position) {
    if ((position + insert.length) > base.length) return false;
    for (var i = 0; i < insert.length; i++) {
      if (!(base.charAt(position + i) === insert.charAt(i))) return false;
    }
    return true;
  };

  var quotes = false;
  for (var i = 0; i < input.length; i++) {
    var char = input.charAt(i);
    if (char === '"') {
      quotes = !quotes;
      continue;
    }

    if (!quotes && compare(input, del, i)) {
      outputs.push("");
      i += del.length - 1;
      continue;
    }

    outputs[outputs.length-1] += char;
  }

  if (!emptySpace) {
    for (var i = 0; i < outputs.length; i++) {
      if (outputs[i] === "") {
        outputs.splice(i, 1);
      }
    }
  }
  return outputs;
}
//
// ----------------------------------------------------------------------------
//
function newBlock() {
  var wrapper = document.getElementById('wrapper');
  current_block = document.createElement("div");
  current_block.classList.add("log");
  wrapper.appendChild(current_block);
}
//
// ----------------------------------------------------------------------------
//
function wrapIt(message, indents) {
  var numChar = Math.floor((window.innerWidth / pixelsPerCharCol) - (indents * 2) + 1);

  // Wrap message - to be no more than 'numChar' characters in a line, and with  
  // each line indented, and accounting for <BR/> tags
  var re = new RegExp("(?![^\n]{1," + numChar + "}$)([^\n]{1," + numChar + "})\\s", "g");
  var strIndent = nbsp.repeat(indents * 2)
  message = message.replace(/<BR\/>/gi,'\n');       // Replace the <BR/> for now
  var strOut = strIndent + message.replace(re, '$1' + '\n');

  strOut = strOut
    .replace(/>/g, '&gt;').replace(/</g, '&lt;')  // Replace the < and >
    //  The following line will screw up the href RegEx replace below so it
    //  has been commented out
    //  .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
    .replace(/\n/gi, '<BR/>' + strIndent)         // Put the <BR/> tags back
    .replace(/&lt;I&gt;/gi, '<I>')                // Put the italics tags back
    .replace(/&lt;\/I&gt;/gi, '</I>')
    .replace(/&lt;U&gt;/gi, '<U>')                // Put the underline tags back
    .replace(/&lt;\/U&gt;/gi, '</U>')
    .replace(/&lt;B&gt;/gi, '<B>')                // Put the bold tags back
    .replace(/&lt;\/B&gt;/gi, '</B>')
    .replace(/&lt;\/a&gt;/gi, '</A>')             // Put the </a> tags back
    .replace(/ /gi, nbsp);       // Replace all spaces with something that will
                                 // display correctly

  // Put the <a> tags back. No simple regex is perfect for extracting a URL, 
  // and we put this in after substituting the spaces because we need the 
  // 'real' space for the <A> tag
  strOut = strOut.replace(/&lt;a(.*?)href(.*?)=(.*?)&gt;/gi, '<a href=' + '$3' + '>');
  return strOut;
}
//
// ----------------------------------------------------------------------------
//
function blockLog(message, indents) {
  if (indents == undefined) indents = 1;
  current_block.innerHTML += "<p>" + wrapIt(message, indents) + "</p>";
}
//
// ----------------------------------------------------------------------------
//
function log(message, indents) {
  var wrapper = document.getElementById('wrapper');
  if (indents == undefined) indents = 1;
  wrapper.innerHTML += "<div class='log'><p>" + wrapIt(message, indents) + "</p></div>";
}
//
// ----------------------------------------------------------------------------
//
document.getElementById('input_source').onblur = function(){
  document.getElementById("input_source").focus();
};
document.getElementById('input_source').addEventListener('keyup', submitCommand);
//
// ----------------------------------------------------------------------------
//
function getPrompt() {
  return userName + '@' + fileSystemWrapperPWD() + ': ';
}
//
// ----------------------------------------------------------------------------
//
function submitCommand() {
  var cmdStr;

  event.preventDefault();

  // Process 'DOS' keypresses
  if (event.keyCode === KeyEnter) {
    cmdStr = document.getElementById("input_source").value;
    var argv = smartSplit(cmdStr, " ", false)
    document.getElementById("input_source").value = "";
    newBlock();
    blockLog(getPrompt() + cmdStr, 0);
    if (argv[0] == undefined)                           // Null command entered
      return;
   
    // Only load it into the command history if it is a new command entered
    if ((cmdHist.length === 0) || (cmdStr !== cmdHist[cmdHist.length - 1])) {
      if (cmdHist.length >= MAX_CMD) {
        cmdHist.shift();
      } 
      cmdHist.push(cmdStr);
      cmdHistPtr = cmdHist.length - 1;
      localStorage.setItem('cmdHist', JSON.stringify(cmdHist));
    }
  } else {
    if (cmdHist.length > 0) {
      if (event.keyCode === KeyUpArr) {
        cmdStr = cmdHist[cmdHistPtr];
        document.getElementById("input_source").value = cmdStr;
        if (cmdHistPtr > 0)
          cmdHistPtr--;
      } else {
        if (event.keyCode === KeyDnArr) {
          if (cmdHistPtr < (cmdHist.length - 1))
            cmdHistPtr++;
          cmdStr = cmdHist[cmdHistPtr];
          document.getElementById("input_source").value = cmdStr;
        } else {
          if (event.keyCode === KeyF3) {
            cmdHistPtr = cmdHist.length - 1;
            cmdStr = cmdHist[cmdHistPtr];
            document.getElementById("input_source").value = cmdStr;
          }
        }
      }
    }
  }

  if (event.keyCode !== KeyEnter)
    return;

  // Process the command: Substitute alias if we can to get to the 'real' command
  var command = getAlias(argv[0]);
  if ((command != undefined) && (command.length > 0)) {
    argv[0] = command;
  } else {
    // Can't find an alias so put the entered command back
    command = argv[0].toUpperCase();
  }
 
  // Now that we have preprocessed, try to execute the command
  if (cmd[command] != undefined) {
    if (cmd[command].fn != undefined) {
      if ((argv.length == 2) && 
        ((argv[1].toUpperCase() == 'H') || (argv[1].toUpperCase() == '/H') ||
         (argv[1].toUpperCase() == '?') || (argv[1].toUpperCase() == '-H'))) {
          showManPage(command);
        return;
      }
      //
      // Check for execute permissions for the user here prior to executing the next line
      //
      cmd[command].fn(argv.length, argv);
    } else {
      blockLog("Nothing to do for " + command);
    }
  } else {
    blockLog("Command '" + command + "' unknown, please try 'MAN' to get a full list of commands");
  }
}
//
// ----------------------------------------------------------------------------
//
function updateClockDisplay() {
  var d = new Date().toLocaleString("en-US");
  d = new Date(d);
  document.getElementById("statusBarCentre").innerHTML = getTimeString(d);
}
//
// ----------------------------------------------------------------------------
//
window.onload = function() {
  document.getElementById('wrapper').innerHTML += '<div class="log"><H1>Welcome to the Javascript Terminal</H1></div>';
  newBlock();
  cmd["ABOUT"].fn();
  document.getElementById("input_title").innerText = userName + '@/: ';
  updateClockDisplay();
  setInterval(function(){ updateClockDisplay(); }, 1000);
  if (localStorage.getItem('cmdHist') != null) {
    cmdHist = JSON.parse(localStorage.getItem('cmdHist'));
    cmdHistPtr = cmdHist.length - 1;
  }
  registerFile(7);
}
//
// ----------------------------------------------------------------------------
//                               End of file
// ----------------------------------------------------------------------------
//

