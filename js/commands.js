/*
  commands.js

  ------------------------------------------------------------------------------
  Revision History
  ================
  11 Feb 2020 MDS  Original
  07 Sep 2020 MDS  Added Aliases, other command functions
  19 Feb 2022 MDS  Modified file system commands to be compatable with 
  								 commissioned Indexed DB File System wrapper

  ------------------------------------------------------------------------------
 */
//
// ----------------------------------------------------------------------------
// ABOUT
//
cmd['ABOUT'] = {
  name:
    'about - display program information',
  synopsis:'about', 
  description: '',
  seeAlso: '',
  keywords: 'about, ver, version',
  flag: ' ',
  fn: function(argc, argv){
    blockLog(shellVersion.join('\n'));
    blockLog('');
    blockLog(shellHistory.join('\n'));
    return;
  }
};
//
// ----------------------------------------------------------------------------
// ALIASES
//
cmd['ALIASES'] = {
  name:'aliases - show all of the command aliases',
  synopsis:'aliases', 
  description: '',
  seeAlso: '',
  keywords: '',
  flag: '*',
  fn: function(argc, argv){
    blockLog('ALIASES not yet implemented');
    return;
  }
};
//
// ----------------------------------------------------------------------------
// ASCII - display ASCII table
//
cmd['ASCII'] = {
  name:
    'ascii - display ASCII Character Set',
  synopsis:'ascii', 
  description: '',
  seeAlso: 'UTF',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv){
    cmd['UTF'].displayCodeset(0x0000, 0x007f); // ASCII character set
    return;
  }
};
//
// ----------------------------------------------------------------------------
// BASIC
//
cmd['BASIC'] = {
  name:
    'basic - start a Javascript based BASIC interpreter',
  synopsis:'basic\nbasic <file>', 
  description: '',
  seeAlso: '',
  keywords: 'basic',
  flag: ' ',
  fn: function(argc, argv){
    openLink('..\\BBASIC\\BBASIC.html');
    return;
  }
};
//
// ----------------------------------------------------------------------------
// BYE
//
cmd['BYE'] = {
  isAliasFor:'LOGOFF',
  flag: ' '
};
//
// ----------------------------------------------------------------------------
// CALCULATE
//
cmd['CALCULATE'] = {
  name:'calculate - calculate a numeric quantity by opening the Google ' + 
    'calculation appliance',
  synopsis:'calculate <qty1> <operand> <qty2> ...', 
  description: '',
  seeAlso: '',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv){
    argv[0] = "calculate";
    openLink("https://www.google.com/search?q=" + argv.join('+'));
  }
};
//
// ----------------------------------------------------------------------------
// CALENDAR
//
cmd['CALENDAR'] = {
  name: 'calendar - display a calendar',
  synopsis:'calendar\ncalendar <date>', 
  description: 
    'calendar - Display a 12 month calender, starting with the present month\n' +
    'calendar ?<I>date<I>? - Display a calender, starting at the specified date\n' +
    '?<I>date</I>? - The shell will attempt to convert ?<I>date</I>? into a ' + 
    'valid date.  If ?<I>date</I>? is a year, a calendar starting at ' +
    'January 1 for that year will be displayed.  Only years between 1902 ' +
    'and 2037 (inclusive) can be entered, otherwise the present year will ' +
    'be displayed\n' +
    'Examples of valid entries are:\n' +
    '  calendar 2013\n' +
    '  calendar Mar 2013\n' +
    '  calendar Mar 13\n' +
    '  calendar March 2013\n' +
    '  calendar 25/3/2013\n' +
    '  calendar 25/3/65\n\n' +
    '(note the use of dd/mm/yyyy format in the last examples).',
  seeAlso: '',
  keywords: 'calendar',
  flag: ' ',
  fn: function(argc, argv){
    //
    // ------------------------------------------------------------------------
    // Print out three months worth of calendar.
    // Passed argument is the unix timestamp for the start of the three month 
    // period
    function doThreeMonths(startTime) {
        startTime = new Date(startTime);
        var month = startTime.getMonth();
        var year = startTime.getFullYear();
        var dateS1 = new Date(startTime);
        var dateS2 = new Date(year, month + 1, 1, 0);
        var dateS3 = new Date(year, month + 2, 1, 0);

        // Determine day of week that month ends.
        var end1 = new Date(year, month + 1, 0, 0, 0);
        var end2 = new Date(year, month + 2, 0, 0, 0);
        var end3 = new Date(year, month + 3, 0, 0, 0);
        var done1 = false;
        var done2 = false;
        var done3 = false;

        blockLog("        " +
          moy[dateS1.getMonth()] + ' ' + dateS1.getFullYear() + spc(17) +
          moy[dateS2.getMonth()] + ' ' + dateS2.getFullYear() + spc(17) +
          moy[dateS3.getMonth()] + ' ' + dateS3.getFullYear());

        var t = '   S  M  T  W  T  F  S      S  M  T  W  T  F  S      S  M  T  W  T  F  S';
        
        blockLog(t.replace(' ', ' '));
    
        // Do first line.  Here d1, d2 & d3 are used to trigger the start day 
        // of week for the month (once the value hits 1)
        var outL1 = '  ';
        var outL2 = '  ';
        var outL3 = '  ';
        var d1 = 1 - dateS1.getDay();
        var d2 = 1 - dateS2.getDay();
        var d3 = 1 - dateS3.getDay();

        for (var i = 0; i < 7; i++) {
          if (d1 < 1) {
            outL1 = outL1 + '   ';
          } else {
            outL1 += pad(d1, 2) + ' ';
          }
          d1++;
  
          if (d2 < 1) {
            outL2 = outL2 + '   ';
          } else {
            outL2 += pad(d2, 2) + ' ';
          }
          d2++;
  
          if (d3 < 1) {
            outL3 = outL3 + '   ';
          } else {
            outL3 += pad(d3, 2) + ' ';
          }
          d3++;
        }
        blockLog(outL1 + '  ' + outL2 + '  ' + outL3);
    
        // Do second line
        outL1 = '  ';
        outL2 = '  ';
        outL3 = '  ';
        for (i = 0; i < 7; i++) {
          outL1 += pad(d1++, 2) + ' ';
          outL2 += pad(d2++, 2) + ' ';
          outL3 += pad(d3++, 2) + ' ';
        }
        blockLog(outL1 + '  ' + outL2 + '  ' + outL3);
    
        // Do third line
        outL1 = '  ';
        outL2 = '  ';
        outL3 = '  ';
        for (i = 0; i < 7; i++) {
          outL1 += pad(d1++, 2) + ' ';
          outL2 += pad(d2++, 2) + ' ';
          outL3 += pad(d3++, 2) + ' ';
        }
        blockLog(outL1 + '  ' + outL2 + '  ' + outL3);
    
        // Do forth line
        outL1 = '  ';
        outL2 = '  ';
        outL3 = '  ';
        for (i = 0; i < 7; i++) {
          outL1 += pad(d1++, 2) + ' ';
          outL2 += pad(d2++, 2) + ' ';
          outL3 += pad(d3++, 2) + ' ';
        }
        blockLog(outL1 + '  ' + outL2 + '  ' + outL3);
    
        // Fifth line
        outL1 = '  ';
        outL2 = '  ';
        outL3 = '  ';
        for (i = 0; i < 7; i++) {
          if (d1 <= end1.getDate()) {
            outL1 += pad(d1++, 2) + ' ';
          } else {
            outL1 = outL1 + '   ';
            done1 = true;
          }
            
          if (d2 <= end2.getDate()) {	
            outL2 += pad(d2++, 2) + ' ';
          } else {
            outL2 = outL2 + '   ';
            done2 = true;
          }
            
          if (d3 <= end3.getDate()) {	
            outL3 += pad(d3++, 2) + ' ';
          } else {
            outL3 = outL3 + '   ';
            done3 = true;
          }
        }
        blockLog(outL1 + '  ' + outL2 + '  ' + outL3);
    
        // Sixth line if required
        if ((done1 == false) || (done2 == false) || (done3 == false)) {
          outL1 = '  ';
          outL2 = '  ';
          outL3 = '  ';
          for (i = 0; i < 7; i++) {
            if (d1 <= end1.getDate()) {	
              outL1 += pad(d1++, 2) + ' ';
            } else {
              outL1 = outL1 + '   ';
            }
                
            if (d2 <= end2.getDate()) {	
              outL2 += pad(d2++, 2) + ' ';
            } else {
              outL2 = outL2 + '   ';
            }
                
            if (d3 <= end3.getDate()) {	
              outL3 += pad(d3++, 2) + ' ';
            } else {
              outL3 = outL3 + '   ';
            }
          }
          blockLog(outL1 + '  ' + outL2 + '  ' + outL3);
        }
    } // End of doThreeMonths()
    //
    // ------------------------------------------------------------------------
    // Parse a date object from the passed argv[1] through argv[argc - 1] and 
    // return a date string
    // The following formats are accepted
    //   calendar 2003
    //   calendar Mar 2013
    //   calendar March 2013
    //   calendar 25/3/2013
    //
    // If no valid date can be parsed, the present date is returned
    //
    function parseDate(argc, argv) {
      // The following array is used to resolve the month from text
      revMonth = [];
      revMonth['JAN'] =  1; revMonth['JANUARY']   = 1; revMonth['FEB'] =  2; revMonth['FEBRUARY'] =  2;
      revMonth['MAR'] =  3; revMonth['MARCH']     = 3; revMonth['APR'] =  4; revMonth['APRIL']    =  4;
      revMonth['MAY'] =  4; revMonth['MAY']       = 5; revMonth['JUN'] =  6; revMonth['JUNE']     =  6;
      revMonth['JUL'] =  5; revMonth['JULY']      = 7; revMonth['AUG'] =  8; revMonth['AUGUST']   =  8;
      revMonth['SEP'] =  6; revMonth['SEPTEMBER'] = 9; revMonth['OCT'] = 10; revMonth['OCTOBER']  = 10;
      revMonth['NOV'] = 11; revMonth['NOVEMBER'] = 11; revMonth['DEC'] = 12; revMonth['DECEMBER'] = 12;

      if  (argc == 2) {
        if ((argv[1].length == 4) && 
          (parseInt(argv[1]) > 1901) && (parseInt(argv[1]) < 2038))
          // eg. 'calendar 2003'
          return "1/1/" + parseInt(argv[1]);
        else
          if ((argv[1].length > 5) && (argv[1].length < 11)) {
            // eg. 'calendar 25/8/2003'
            var tok = argv[1].split("/");
            if (tok.length == 3) {
              tok[0] = parseInt(tok[0]);
              tok[1] = parseInt(tok[1]);
              tok[2] = parseInt(tok[2]);
              
              if (tok[2] < 38)
                tok[2] += 2000;
              else {
                if (tok[2] < 100)
                  tok[2] += 1900;
              }
              if ((tok[0] > 0) && (tok[0] < 32) &&
                   (tok[1] > 0) && (tok[1] < 13) && 
                   (tok[2] > 1901) && (tok[2] < 2038))
                return tok[1] + "/" + tok[0] + "/" + tok[2];
            }
          }
      } else {
        if  (argc == 3) {
          if (revMonth[argv[1].toUpperCase()] != undefined) {
            // eg. 'calendar march 2003, or calendar mar 2003'
            var month = revMonth[argv[1].toUpperCase()];
            var year = parseInt(argv[2]);
            if (year < 38)
              year += 2000;
            else {
              if (year < 100)
                year += 1900;
            }
            if ((year > 1901) && (year < 2038)) 
              return month + "/1/" + year;
          }
        }
      }
      return Date.now();
    } // End of parseDate()

    unixTime = new Date(parseDate(argc, argv));
    doThreeMonths(unixTime);
    var month = unixTime.getMonth();
    var year = unixTime.getFullYear();
    doThreeMonths(new Date(year, month + 3, 1, 0, 0));
    doThreeMonths(new Date(year, month + 6, 1, 0, 0));
    doThreeMonths(new Date(year, month + 9, 1, 0, 0));
    return;
  }
};
//
// ----------------------------------------------------------------------------
// CAT - Display a file on the screen
//
cmd['CAT'] = {
  name:'cat <filename> - catenate <filename> to the screen in a new tab\n' +
    'Where\n' +
    '  <filename> is the file to display',
  synopsis:'', 
  description: '',
  seeAlso: 'CHDIR, CP, LS, MKDIR, MV, PWD, REN, RM, IMPORT, EXPORT, EXPLORE',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv) {
    fsw.cat(argc, argv);
    return;
  }
};
// ----------------------------------------------------------------------------
// CD
//
cmd['CD'] = {
  name:
    'cd - Print current directory, or change directory',
  synopsis:'', 
  description: '',
  seeAlso: 'CAT, CHDIR, CP, LS, MKDIR, MV, PWD, REN, RM, IMPORT, EXPORT, EXPLORE',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv){
    if (argc == 1) {
      cmd['PWD'].fn(argc, argv);
    } else {
      cmd['CHDIR'].fn(argc, argv);
    };
    return;
  }
};
// ----------------------------------------------------------------------------
// CHAT
//
cmd['CHAT'] = {
  name:
    'chat ?ON || OFF? - Enable or disable the inbuilt chatbot',
  synopsis:'CHAT Display chat status\nCHAT ON enable chatbot\nCHAT OFF Disable chatbot\n\n' +
    'Extra parameters are ignored', 
  description: 'The chatbot is a \'souped up\' version of the traditional ' +
    'Eliza chatbot, and does not use the AIML language',
  seeAlso: '',
  keywords: '',
  flag: 'x',
  fn: function(argc, argv){
    if (argc == 1) {
      if (chatEnabled == true) {
        blockLog('Chat is presently enabled');
      } else {
        blockLog('Chat is presently disabled');
      }
    } else {
      if (argv[1].toUpperCase() == 'ON') {
        if (chatEnabled == false) {
          start();
          chatEnabled = true;
        } else {
          blockLog('Chat is already enabled !');
        }
      } else {
        if (argv[1].toUpperCase() == 'OFF') {
          if (chatEnabled == false) {
            blockLog('Chat is already disabled !');
          } else {
            chatEnabled = false;
            blockLog('Chat disabled');
          }
        } else {
          cmd['MAN'].fn(2, ['MAN', 'CHAT']);
        }
      }
      cmd['CHDIR'].fn(argc, argv);
    };
    return;
  }
};
//
// ----------------------------------------------------------------------------
// CHDIR - Change working directory
//
cmd['CHDIR'] = {
  name:'chdir - change working directory',
  synopsis:'chdir <name>', 
  description:   'chdir <name> - change working directory to <name>, ' +
    'where <name> is the directory name to change to.',
  seeAlso: 'CAT, CP, LS, MKDIR, MV, PWD, REN, RM, IMPORT, EXPORT, EXPLORE',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv) {
    fsw.chdir(argc, argv);
    return;
  }
};
//
// ----------------------------------------------------------------------------
// CLEAR
//
cmd['CLEAR'] = {
  isAliasFor:'CLS',
  flag: ' '
};
//
// ----------------------------------------------------------------------------
// CLS
//
cmd['CLS'] = {
  name:'cls - clear screen',
  synopsis:'cls', 
  description: '',
  seeAlso: '',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv){
    var log = document.getElementsByClassName('log');
    while (log[0]) {
      log[0].parentNode.removeChild(log[0]);
    }
    return;
  }
};
//
// ----------------------------------------------------------------------------
// CODEINFO
// It is not possible to load a javascript file from the local client so we 
// throw an error in the last line of each file as it loads and examine the 
// result, which contains the line that the error was thrown, and the filename
  //
  // --------------------------------------------------------------------------
  // Get the name of the file and the line number from which this function was 
  // called
  function registerFile(linesFollowing = 0) { 
  
    function throwError() {
      try { throw Error('Register File') } catch(err) { return(err); }
    };
    var err = throwError();
    var errStack = err.stack.split("\n");
    var caller_line = errStack[errStack.length - 1]
    var clean = caller_line.slice(caller_line.indexOf("at ") + 2, caller_line.length).split("/"); 
    var codeData = clean[clean.length - 1].split(":");
    cmd['CODEINFO'].addFileInfo(codeData[0], codeData[1]);
  }

cmd['CODEINFO'] = {
  name:
    'codeinfo - display console code information',
  synopsis:'codeinfo', 
  description: '',
  seeAlso: '',
  keywords: 'codeinfo',
  flag: ' ',
  fn: function(argc, argv){
    var i;
    var totalLines = 0;
      
    blockLog('Files containing Javascript :', 2);
    blockLog('File                     Lines', 3);
    blockLog('~~~~                     ~~~~~', 3);
    for (i = 0; i < this.srcFileNames.length; i++) {
      blockLog(pad(this.srcFileNames[i], 23, " ", PAD_RIGHT) + ' ' 
        + pad(this.srcFileLines[i],6), 3);
      totalLines += parseInt(this.srcFileLines[i]);
    }
    blockLog('------------------------------', 3);
    blockLog(totalLines + ' lines in ' + this.srcFileNames.length + ' files.', 3);
    return;
  },
  
  // The following is stuff that is private to this command
  srcFileNames: [],
  srcFileLines: [],
  addFileInfo: function(fileName, fileLines){
    var tmp, i;
    this.srcFileNames.push(fileName);
    this.srcFileLines.push(fileLines);
    
    for (i = 0; i < (this.srcFileNames.length - 1); i++) {
      if (this.srcFileNames[i] > this.srcFileNames[i + 1]) {
        tmp = this.srcFileNames[i];
        this.srcFileNames[i] = this.srcFileNames[i+1];
        this.srcFileNames[i+1] = tmp;
        tmp = this.srcFileLines[i];
        this.srcFileLines[i] = this.srcFileLines[i+1];
        this.srcFileLines[i+1] = tmp;
      }
    }
    
  }
};
//
// ----------------------------------------------------------------------------
// CONVERT
//
cmd['CONVERT'] = {
  name: 'convert - convert one quantity to another',
  synopsis:'convert <qty><unit1> to <unit2>', 
  description: 'The command attempts to use the Google search engine to convert ' +
    'from one quantity to another',
  seeAlso: '',
  keywords: 'convert',
  flag: ' ',
  fn: function(argc, argv){
    if (argc < 5) {
      blockLog("CONVERT: Incorrect usage");
      cmd['MAN'].fn(2, ['MAN','CONVERT'])
      return;
    }

    argv[0] = 'convert';
    openLink('https://www.google.com/search?q=' + argv.join('+'));   
    return;
  }
};
//
// ----------------------------------------------------------------------------
// COPY - Copy file or folder
//
cmd['COPY'] = {
  name: 'copy - copy file or directory',
  synopsis:'copy <src> ?dst?', 
  description:   'copy will copy the source file (or source folder) to ?dst?, ' +
    'where <src> is the directory or folder to copy, ?dst? is the ' +
    'destination directory or folder to copy to.  If ?dst? is not ' + 
    'specified, then a default name will be used',
  seeAlso: 'CHDIR, CP, LS, MKDIR, MV, PWD, REN, RM, IMPORT, EXPORT, EXPLORE',
  keywords: '',
  flag: 'x',
  fn: function(argc, argv) {
    fsw.copy(argc, argv);
    return;
  }
};
//
// ----------------------------------------------------------------------------
// CP - Copy file or folder
//
cmd['CP'] = {
  name: 'cp - copy file or directory',
  synopsis:'cp <src> ?dst?', 
  description:   'cp will copy the source file (or source folder) to ?dst?, ' +
    'where <src> is the directory or folder to copy, ?dst? is the ' +
    'destination directory or folder to copy to.  If ?dst? is not ' + 
    'specified, then a default name will be used',
  seeAlso: 'CHDIR, COPYLS, MKDIR, MV, PWD, REN, RM, IMPORT, EXPORT, EXPLORE',
  keywords: '',
  flag: 'x',
  fn: function(argc, argv) {
    fsw.cp(argc, argv);
    return;
  }
};
//
// ----------------------------------------------------------------------------
// DATE - Display current time and date
//
cmd['DATE'] = {
  isAliasFor:'TIME',
  flag: ' '
};
//
// ----------------------------------------------------------------------------
// DECRYPT - AES decrypt text and display it on the screen
//
function decrypt(message = '', key = ''){
    var code = CryptoJS.AES.decrypt(message, key);
    var decryptedMessage = code.toString(CryptoJS.enc.Utf8);

    return decryptedMessage;
}

cmd['DECRYPT'] = {
  name:'decrypt <<I>cyphertext</I>> - AES decrypt <<I>cyphertext</I>> and display it on the screen',
  synopsis:'decrypt <I><cyphertext> ?<cyphertext>? ... ?<cyphertext>? ?key?</I>.\n' +
    'Decrypt cyphertext with key.  If key is not provided, a default key will be used\n' +
    'Multiple cycphertexts are joined with spaces before decryption.', 
  description: '',
  seeAlso: 'DECRYPT',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv) {
    if (argc < 2) {
      blockLog("Please enter some text to decrypt !");
      cmd['MAN'].fn(2, ['MAN','DECRYPT'])
      return;
    }
    if (argc < 3) {
      blockLog(decrypt(argv[1], 'Terminal'));
    } else {
      blockLog(decrypt(argv.slice(1, -1).join(' '), argv[argc-1]));
    }
  }
};
//
// ----------------------------------------------------------------------------
// DEFINE
//
cmd['DEFINE'] = {
  name:'define - use the Google search engine to define a phrase',
  synopsis:'define <phrase>', 
  description: '',
  seeAlso: '',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv){
    if (argc > 2) {
      blockLog("DEFINE: Too many parameters.  Extra parameters ignored");
    } else {
      if (argc < 2) {
        blockLog("DEFINE: Incorrect usage");
        cmd['MAN'].fn(2, ['MAN','CONVERT'])
        return;
      }
    }

    argv[0] = 'define';
    openLink('https://www.google.com/search?q=' + argv[0] + '+' + argv[1]);   
    return;
  }
};
//
// ----------------------------------------------------------------------------
// DEFINE
//
cmd['DIR'] = {
  name:'dir - display contents of directory',
  synopsis:'dir\ndir /w', 
  description: 
    'dir displays information about the contents of the current directory.  ' +
    'dir /w displays the information in condensed (wide) format',
  seeAlso: '',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv){
    fsw.ls(argc, argv);
    return;
  }
};
//
// ----------------------------------------------------------------------------
// ENCRYPT - AES encrypt text and display it on the screen
//
function encrypt(message = '', key = ''){
    var message = CryptoJS.AES.encrypt(message, key);
    return message.toString();
}

cmd['ENCRYPT'] = {
  name:'encrypt <<I>plaintext</I>> - AES encrypt <<I>plaintext</I>> and display it on the screen',
  synopsis:'encrypt <I><plaintext> ?<plaintext>? ... ?<plaintext>? ?key?</I>\n' +
    'Encrypt plaintext with key.  If key is not provided, a default key will be used', 
  description: '',
  seeAlso: 'DECRYPT',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv) {
    if (argc < 2) {
      blockLog("Please enter some text to encrypt !");
      cmd['MAN'].fn(2, ['MAN','ENCRYPT'])
      return;
    }
    if (argc < 3) {
      blockLog(encrypt(argv[1], 'Terminal'));
    } else {
      blockLog(encrypt(argv.slice(1, -1).join(' '), argv[argc-1]));
    }
  }
};
//
// ----------------------------------------------------------------------------
// EXIT
//
cmd['EXIT'] = {
  name:'exit - close the Javascript terminal session',
  synopsis:'', 
  description: '',
  seeAlso: '',
  keywords: '',
  flag: '*',
  fn: function(argc, argv){
    window.open("", "");
    window.close();
    return;
  }
};
//
// ----------------------------------------------------------------------------
// EXPLORE - Opens an indexedDB file explorer GUI instance in a new tab
//
cmd['EXPLORE'] = {
  name:'explore - opens an indexedDB file explorer GUI in a new browser tab',
  synopsis:'explore', 
  description: '',
  seeAlso: 'IMPORT, EXPORT',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv) {
    openLink('../fileExplorer/index.html');
  }
};
//
// ----------------------------------------------------------------------------
//  EXPORT - Export a file from the indexedDB filesystem to the operating system
//    filesystem 
//
cmd['EXPORT'] = {
  name:'export - export files from the indexedDB filesystem\n',
  synopsis:'export <file>', 
  description: 'export <file> - export file from indexedDB filesystem to ' +
    'the operating system filesystem, where <file> is the name of the file ' +
    'to export.  The exported file will appear in the downloads directory ' +
    'of the operating system',
  seeAlso: 'IMPORT, EXPLORE',
  keywords: '',
  flag: '*',
  fn: function(argc, argv) {
    fsw.export(argc, argv);
    return;
  }
};//
// ----------------------------------------------------------------------------
// FRENCHTIME - Display current time and date in Paris
//
function frenchtimeFunction(argc, argv) {
  var frenchTime = new Date().toLocaleString("en-US", {timeZone: "Europe/Paris"});
  frenchTime = new Date(frenchTime);
  blockLog(
    'In France, it\'s ' + getTimeString(frenchTime) + '.\n' +
    'TDF stages typically start between 10:30am and 12:00 midday.'
    );
}
//
cmd['FRENCHTIME'] = {
  name:'frenchtime - display the current time and date in France',
  synopsis:
    'frenchtime',
  description: 
    'The TDF is held during Central Daylight Davings time, which means that ' +
    'France is ahead of GMT by 2 hours.  This command displays the current ' +
    'time in France when under Central Daylight Savings time.', 
  seeAlso: 'date, time, TDF, LeTour',
  keywords: '',
  flag: ' ',
  fn: frenchtimeFunction
};
//
// ----------------------------------------------------------------------------
// HELP - display help
//
cmd['HELP'] = {
  isAliasFor:'MAN',
  flag: ' ',
};
//
// ----------------------------------------------------------------------------
// HOME - open the home webpage
//
cmd['HOME'] = {
  name:'home - open my links webpage in a new tab',
  synopsis:'', 
  description: '',
  seeAlso: '',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv) {
    openLink('http://220.233.173.28/');
  }
};
//
// ----------------------------------------------------------------------------
//  IMPORT - Import a file from the operating system filesystem to the 
//    indexedDB filesystem 
//
cmd['IMPORT'] = {
  name: 'import',
  synopsis:'', 
  description:
    'Files are imported to the current working directory by dragging and ' +
    ' dropping them from the native file explorer into the browser window',
  seeAlso: 'EXPORT, EXPLORE',
  keywords: '',
  flag: 'x',
  fn: function(argc, argv) {
    fsw.import(argc, argv);
    return;
  }
};
//
// ----------------------------------------------------------------------------
// LICENSE
//
cmd['LICENSE'] = {
  name:'license - show software license',
  synopsis:'license', 
  description: '',
  seeAlso: '',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv) {
    blockLog(shellLicense.join('\n'), 3);
  }
};
//
// ----------------------------------------------------------------------------
// LIST - unknown functionality as of yet
//
cmd['LIST'] = {
  name:'list - unknown functionality and implementation at present',
  synopsis:'', 
  description: '',
  seeAlso: '',
  keywords: '',
  flag: '*',
  fn: function(argc, argv){
    log('LIST function not implemented');
    return;
  }
};
//
// ----------------------------------------------------------------------------
// LOG - Can either be LOGIN or LOGOUT, depending upon context
//
cmd['LOG'] = {
  name: 'log - log a user into or out of the shell',
  synopsis:
    'log <user\n' +
    'log <user> ?password?\n' +
    'log',
  description: 
    'log either logs the user in or out of the shell, depending upon the ' +
    'context.\n' +
    'If a user other than Guest is logged in, the user is logged out when ' + 
    'log is typed.\n' + 
    'If user Guest is logged in, then the log command is treated as a login ' +
    'command for a higher privilege user.  Both the username and password ' +
    'are case sensitive',
  seeAlso: 'login, logon, logoff, logout, bye',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv){
    if (userName == 'Guest') {
      argv[0] = "LOGON";
      cmd['LOGON'].fn(argc, argv);
    } else {
      argv[0] = "LOGOFF";
      cmd['LOGOFF'].fn(argc, argv);
    }
    return;
  }
};
//
// ----------------------------------------------------------------------------
// LOGIN
//
cmd['LOGIN'] = {
  isAliasFor:'LOGON',
  flag: ' '
};
//
// ----------------------------------------------------------------------------
// LOGOFF
//
cmd['LOGOFF'] = {
  name:'logoff - Log user off of the system',
  synopsis:'logoff', 
  description: '',
  seeAlso: 'login, logon, whoami, logout, bye',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv) {
    blockLog('Goodbye ' + userName + '.');
    timeFunction();
    userName = "Guest";
    document.getElementById("input_title").innerText = getPrompt();  
  }
};
//
// ----------------------------------------------------------------------------
// LOGON
//
function logonFunction(argc, argv) {
  if (argc < 2) {
    blockLog("LOGON: Incorrect usage");
    cmd['MAN'].fn(2, ['MAN','LOGON'])
    return;
  }
  userName = argv[1].charAt(0).toUpperCase() + argv[1].slice(1);
  blockLog('Hi ' + userName + ', welcome back.');

  if (userName.toUpperCase() == 'MIKE') {
    blockLog(
        '<h2>Rules Of Life</h2>    ' +
        '1. <b>Make peace with your past</b>\n' +
        '    so it won\'t disturb your future\n' +
        '2. <b>What other people think of you is none of your business</b>\n' +
        '    How other people treat you is your business\n' + 
        '3. <b>The only person in charge </b>\n' +
        '    of your happy is you\n' +
        '4. <b>Don\'t compare your life to others</b>\n' +
        '    comparison is the thief of joy\n' +
        '5. <b>Time heals almost everything</b>\n' +
        '    give it time\n' +
        '6. <b>STOP thinking so much</b>\n' +
        '    it\'s alright not to know all the answers\n' +
        '7. <b>Smile</b>\n' +
        '    you don\'t own all the problems of the world\n' +
        '8. <b>Don\'t take life too seriously</b>\n' +
        '    none of us get out of this life alive\n', 2);
    blockLog(
        '<b>"That\'s interesting"\n' +
        '"Let me get back to you"\n' +
        '"How can I help"', 6);

    blockLog('<h2>Who I Aspire To Be</h2>  ' +
      '1. <b>Love & Tolerance Is My Code</b>\n' +
      '    because this was the code of the wisest man I ever knew\n' +
      '2. <b>Follow The Rules Of Life</b>\n' +
      '    because they were written by a wiser man than me, and they work\n' +
      '3. <b>Be Understated</b>\n' +
      '    because it is not important what other ' +
          'people think of you; it is only important ' +
          'what you think of yourself\n' +
      '4. <b>Live and Die With Honour</b>\n' +
      '    because it\'s about how you live and how' +
          'you die - it\'s not about when you die\n' +
      '5. <b>Fight It All The Way</b>\n' +
      '    because anything else would be to give in, ' +
          'which is wrong. But when the time has ' +
          'come, the time has come\n' +
      '6. <b>0x2152</b>\n');
    blockLog(
      '<b>"Be who you are and say what you think\n' +
      'because those that matter don\'t mind,\n' +
      'and those that mind don\'t matter"</b>\n', 6);
  }

  timeFunction();
  document.getElementById("input_title").innerText = getPrompt();
/*
    function logon($args) {

        if ($debug) logToDisk(timestamp()."customCmd.php:logon(): Entry\n");        
        if ((count($args) < 1) && (strtolower($args[0]) != "guest")) {
            man("logon");
            return true;
        }
        if (count($args) < 2) $args[]='';
        if (!$session->userLogon($args[0], $args[1])) {
            sendTextToShell("Unknown user or password incorrect (passwords are case sensitive)\n");            
            return true;
        }

        if (strtolower($args[0]) == 'mike') {
            sendTextToShell("Hi Mike.  Welcome back. I've given you permissions to access all."."\n");
        } elseif (strtolower($args[0]) == 'georgia') {
            sendTextToShell("Hello my beautiful.  How are you.  What do you want me to do."."\n");
        } elseif (strtolower($args[0]) == 'rosetta') {
            sendTextToShell("Hello Bella Mia.  How are you.  Type man to get some help."."\n");
        } else {
            sendTextToShell("Login successful\n");
        }
        return true;
    }
*/
}
//
cmd['LOGON'] = {
  name:
    'logon <<I>user</I>> ?<I>password</I>? - Log the user into the shell system\n' +
    '<<I>user</I>> is the case sensitive username\n' +
    '?<I>password</I>? is the user\'s password (if the user has been ' +
    'assigned one)',
  synopsis:'', 
  description: '',
  seeAlso: 'login, whoami, logoff, logout, bye',
  keywords: '',
  flag: 'x',
  fn: logonFunction
};
//
// ----------------------------------------------------------------------------
// LOGOUT
//
cmd['LOGOUT'] = {
  isAliasFor:'LOGOFF',
  flag: ' '
};
//
// ----------------------------------------------------------------------------
// LS - Display contents of current working directory
//
cmd['LS'] = {
  name:'ls - display contents of current working directory',
  synopsis:'ls\nls -l', 
  description: 'The -l shows full file information, whereas typing the ' +
    'command with no options returns a summary list',
  seeAlso: 'CHDIR, CAT, CP, MKDIR, MV, PWD, REN, RM, IMPORT, EXPORT, EXPLORE',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv) {
    fsw.ls(argc, argv);
    return;
  }
};
//
// ----------------------------------------------------------------------------
// MAN
//
function manFunction(argc, argv) {
  // Display possible commands
  if (argc == 1) {
    var outStr = "";
    var i = 0;

    blockLog('These are the possible commands on this system for user \'' +
      userName + '\':');
    Object.keys(cmd).forEach(function(key,index) {
        if (cmd[key].flag == undefined) {
          key = '?\xa0' + key;
        } else {
          key = cmd[key].flag + '\xa0' + key;
        }
        for (; key.length < cmd['MAN'].helpWidth - 2;) {
          key += '\xa0'
        }
        outStr += key + '\xa0';
        i++;
        cmd['MAN'].calcNumhelp();
        if (i >= cmd['MAN'].numHelp) {
          blockLog(outStr, 2);
          outStr = '';
          i = 0;
        }
      });
    blockLog(outStr, 2);
    blockLog(
      '\n' + 'LEGEND:\n' +
      tab + '* - development not started\n' +
      tab + 'x - partially implemented\n\n' +
      'Type MAN <<I>command</I>> for more detailed information for a command');
    blockLog('Type TEMPLATES for help on MAN templates, scriptfile formats ' +
      'and MARKDOWN commentry');
    return;
  }

  // Display help for a specific command
  showManPage(argv[1]);
}
//
//
//
function showManPage(key) {
  cmd['MAN'].key = getAlias(key.toUpperCase());
  if (cmd['MAN'].key.length == 0) {
    blockLog('Man: Command \'' + key + '\' unknown');
  } else {
    // Display help stuff
    key = cmd['MAN'].key;
    blockLog('\nNAME');
    if ((cmd[key].name != undefined) && (cmd[key].name.trim().length > 0)) {
      strOut = cmd[key].name.trim() + '\n';
    }
    blockLog(strOut,2);

    blockLog('SYNOPSIS');
    strOut = '\n';
    if ((cmd[key].synopsis != undefined) && (cmd[key].synopsis.trim().length > 0)) {
      strOut = cmd[key].synopsis.trim() + '\n';
    }
    blockLog(strOut,2);

    blockLog('DESCRIPTION');
    strOut = '\n';
    if ((cmd[key].description != undefined) && (cmd[key].description.trim().length > 0)) {
      strOut = cmd[key].description.trim() + '\n';
    }
    blockLog(strOut,2);

    blockLog('OPTIONS');
    strOut = '\n';
    if ((cmd[key].options != undefined) && (cmd[key].options.trim().length > 0)) {
      strOut = cmd[key].options.trim() + '\n';
    }
    blockLog(strOut,2);

    blockLog('SEE ALSO');
    strOut = '\n';
    if ((cmd[key].seeAlso != undefined) && (cmd[key].seeAlso.trim().length > 0)) {
      strOut = cmd[key].seeAlso.trim() + '\n';
    }
    blockLog(strOut,2);

    blockLog('KEYWORDS');
    strOut = '\n';
    if ((cmd[key].keywords != undefined) && (cmd[key].keywords.trim().length > 0)) {
      strOut = cmd[key].keywords.trim() + '\n';
    }
    blockLog(strOut,2);
    
    blockLog('REGISTERED ALIASES'); 
    cmd['MAN'].myAliases = [];  
    Object.keys(alias).forEach(cmd['MAN'].aliasFn); 
    var strOut = '';
    var i = 0;
    while (cmd['MAN'].myAliases.length > 0) {
      if (cmd['MAN'].myAliases.length > 1) {
        strOut = strOut + cmd['MAN'].myAliases[0] + ', ';
        i++;
        cmd['MAN'].calcNumhelp();
        if (i >= cmd['MAN'].numHelp) {
          blockLog(strOut, 2);
          strOut = '';
          i = 0;
        }
      } else {
        strOut = strOut + cmd['MAN'].myAliases[0];
      }
      cmd['MAN'].myAliases.shift();
    }
    if (strOut.length > 0) blockLog(strOut, 2);
  }
};
//
//
//
cmd['MAN'] = {
  name:'man ?<I>topic</I>? - Display help on a topic',
  synopsis: 'man\nman ?command?\nman man',
  description:     
    'The man command displays help on the topic entered as a ' +
    'command line parameter.  If no topic is entered, a list of available ' +
    'man topics is displayed.  Topics are typically custom commands ' + 
    'implemented for the shell interface that are vendor and operating ' + 
    'system independant.',
  seeAlso: '',
  keywords: 'HELP, MAN',
  flag: ' ',
  fn: manFunction,
  key: '',
  helpWidth: 15, // Width of each help entry  
  aliasFn : function(index) {    
      if (alias[index] === cmd['MAN'].key) {
        cmd['MAN'].myAliases.push(index);
      }
    },
};
//
//
//
cmd['MAN'].calcNumhelp = function(){
  cmd['MAN'].numHelp = 
    Math.ceil(window.innerWidth / (pixelsPerCharCol * (cmd['MAN'].helpWidth + 4)));    
}
cmd['MAN'].calcNumhelp();
//
// ----------------------------------------------------------------------------
// MKDIR - make directory 
//
cmd['MKDIR'] = {
  name: 'mkdir - make directory',
  synopsis:'mkdir <name>', 
  description: 'mkdir <name> creates a new directory (if the directory ' +
    'doesn\'t presently exist) under the current working directory, ' +
    'where <name> is the new directory name',
  seeAlso: 'CHDIR, CAT, CP, LS, MV, PWD, REN, RM, IMPORT, EXPORT, EXPLORE',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv) {
    fsw.mkdir(argc, argv);
    return;
  }
};
//
// ----------------------------------------------------------------------------
//  - 
//
cmd['MV'] = {
  name:'mv - move (rename) a file or directory',
  synopsis:'mv [options]<name> <newname>\n',
  description: 'mv <name> <newname> - move <name> to <newname> ' +
    'where <name> is a file or directory, and <newname> is a file or directory',
  seeAlso: 'CHDIR, CAT, CP, LS, MKDIR, PWD, RM, IMPORT, EXPORT, EXPLORE',
  keywords: '',
  flag: '*',
  fn: function(argc, argv) {
    var result = fsw.mv(argc, argv);
    if (result.length > 0) {
      log(result);
    } else {
      showManPage('MV');
    }
    return;
  }
};
//
// ----------------------------------------------------------------------------
// PLC
//
cmd['PLC'] = {
  name: 'PLC - start a browser based Allen Bradley PLC5 emulation',
  synopsis:'PLC\nPLC network', 
  description: 'This command will start a single full register Javascript ' +
    'based PLC, or a number of PLCs to allow inter PLC communication over ' +
    'the virtual network.  The PLC ladder logic can be edited whilst the ' +
    'PLCs are running, and all registers can be examined and modified',
  seeAlso: '',
  keywords: 'PLC',
  flag: ' ',
  fn: function(argc, argv){ 
    if ((argc > 1) && (argv[1].substring(0,3).toUpperCase() === "NET")) {
      openLink('..\\PLC\\index.html')
    } else {
      openLink('..\\PLC\\PLC.html');
    }
    return;
  }
};
//
// ----------------------------------------------------------------------------
//  - 
//
cmd['PWD'] = {
  name:'pwd - prints working directory',
  synopsis:'', 
  description: '',
  seeAlso: 'CHDIR, CAT, CP, LS, MKDIR, MV, REN, RM, IMPORT, EXPORT, EXPLORE',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv) {
    log(fsw.pwd(argc, argv));
    return;
  }
};
//
// ----------------------------------------------------------------------------
//  - 
//
cmd['REN'] = {
  name:'ren - rename a file',
  synopsis:'ren [path]<name> <newname>', 
  description: 'ren [path]<name> <newname> - renamee <name> to <newname> ' +
    'where <name> is a file, and <newname> is a file.\n' +
    'Note that you cannot specify a new drive or path for your destination file.',
  seeAlso: 'CHDIR, CAT, CP, LS, MKDIR, MV, PWD, RM, IMPORT, EXPORT, EXPLORE',
  keywords: '',
  flag: '*',
  fn: function(argc, argv) {
    fsw.ren(argc, argv);
    return;
  }
};
//
// ----------------------------------------------------------------------------
// RM - Remove file or directory
//
cmd['RM'] = {
  name:'rm - remove file or directory',
  synopsis:'rm <name>', 
  description: 'removes <name> where <name> is a file or directory',
  seeAlso: 'CHDIR, CAT, CP, LS, MKDIR, MV, PWD, REN, IMPORT, EXPORT, EXPLORE',
  keywords: '',
  flag: 'x',
  fn: function(argc, argv) {
    fsw.rm(argc, argv);
    return;
  }
};
//
// ----------------------------------------------------------------------------
// ALIASES
//
cmd['SHOW'] = {
  name:'show - show various thingies',
  synopsis:'show ?stuff?', 
  description: '',
  seeAlso: '',
  keywords: '',
  flag: '*',
  fn: function(argc, argv){
    blockLog('SHOW not yet implemented');
    return;
  }
};
//
// ----------------------------------------------------------------------------
// SLEEPYBYES
//
cmd['SLEEPYBYES'] = {
  name:
    'sleepybyes - Display the bedtime narration used by Mike and Georgia',
  synopsis:'sleepybyes', 
  description: 
    'The user must be logged on as Mike or Georgia to access this ' +
    'function.',
  seeAlso: '',
  keywords: 'sleepybyes',
  flag: ' ',
  fn: function(argc, argv){
    if ((userName.toUpperCase() != 'MIKE') && (userName.toUpperCase() != 'GEORGIA')) {
        blockLog('You must be logged in as Mike or Georgia to use this function');
        return;
    }
    blockLog('<u>Narration between Georgia and Mike at Georgia\'s bedtime</u>\n',2);
    blockLog('Is it sleepybyes time already ?',2);
    blockLog('Nigh nighes Georgia <i>Nigh nighes Daddy</i>',2);
    blockLog('Have a good nights sleepies and I\'ll see you in the morning',2);
    blockLog('Would you like some secrets ? <i>Yes please</i>',2);
    blockLog('I love you very much',2);
    blockLog('Would you like some more secrets ? <i>Yes please</i>',2);
    blockLog('I love you more than all the stars in the sky, all the sand on the beach, all the water in the ocean, and all the water in the ocean again',2);
    blockLog('Would you like to see the stars ... no stars but there\'s a meercat',2);
    blockLog('I\'ll call out to you, but only twice and two ... one loud, one quiet OK ? <i>OK</i>',2);
    blockLog('(whisper)Nigh nighes Georgia <i>nigh nighes Daddy</i>',2);
    blockLog('(shout)Nigh nighes Georgia <i>Nigh nighes Daddy</i>',2);
    blockLog('I\'ll tuck you in twice, one real, one pretend OK ? <i>OK</i>',2);
    blockLog('Ready ? <i>Yes</i>',2);
    blockLog('Grrrrrrgh (as pretends to strangle Georgia)',2);
    blockLog('One real (as Georgia is tucked in)',2);
    blockLog('One pretend (as motions are made above Georgia pretending to tuck her in)',2);
    blockLog('(Kiss goodnight)',2);
    blockLog('See ya <i>Nigh night</i>',2);
    return;
  }
};
//
// ----------------------------------------------------------------------------
// TDF - display the TDF website
//
cmd['TDF'] = {
  name:'tdf - open le Tour de France website',
  synopsis:'tdf', 
  description: '',
  seeAlso: '',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv) {
    openLink('https://www.letour.fr/en/');
  }
};
//
// ----------------------------------------------------------------------------
// TEMPLATES - display information about how to code MAN pages, script files 
//   and the like 
//
cmd['TEMPLATES'] = {
  name:'templates - display information about how to code MAN pages,' + 
    ' script files and the like ',
  synopsis:'templates', 
  description: '',
  seeAlso: '',
  keywords: '',
  flag: '*',
  fn: function(argc, argv) {
    function page1(){
      blockLog('\n<u>MAN Templating Guide</u>\n\n' +
        'Mandatory parameters are written thus : <mandatory parameter>\n' +
        'Optional parameters are written thus : ?optional parameter?\n\n' +
        'The MAN page should be written similar to this :\n');
        blockLog(
          'NAME\n  cp - copy files\n\n' +
          'SYNOPSIS\n  cp <src> \n  cp <src> ?dst?\n\n' +
          'DESCRIPTION\n' +
          '  Copy <src> to ?dst? where\n' +
          '  <src> is the source file or directory, and\n' +
          '  ?dst? is the destination file or directory\n\n' +
          '  If ?dst? is not given then a copy of the file or directory is ' +
          '  created with the name \'Copy of <src>\'\n', 3);
      more(page2);
    }
    
    function page2(){
      blockLog('<u>Javascript Script File Template</u>\n\n'  +
        'Javascript files should start with a header written ' +
        'similar to this :\n');
      blockLog(
        '/*\n' +
        '  commands.js\n' +
        '\n' +
        '  -----------------------------------------' + 
          '-------------------------------------\n' +
        '  Revision History\n' +
        '  ================\n' +
        '  11 Feb 2020 MDS  Original\n' +
        '\n\n' +
        '  -----------------------------------------' +
          '-------------------------------------\n' +
        ' */\n\n',2);
      blockLog(
        'and finish with a footer written similar to this :\n');
      blockLog('registerFile(5);\n' +
        '//\n' +
        '// ----------------------------------------' + 
           '------------------------------------\n' +
        '//                               End of file\n' +
        '// ----------------------------------------' + 
           '------------------------------------\n' +
        '//\n\n',2);
      blockLog('registerFile() is used by the codeInfo command to ' +
        'count the number of Javascript lines\n' +        
        'Javascript files should be included in terminal.html after ' +
        'resources/commands.js, which contains the function definition ' +
        'for registerFile()\n' +
        'Source code lines should be no more than 80 characters wide\n');
      more(page3);
    }    
    
    function page3(){
      blockLog('<u>Markdown Information</u>\n\n' +
        'Markdown is used to document the code.  This code uses the ' +
        'following conventions :\n');
      blockLog(
        'H1 style comment headers are underlined with ===== signs\n' +
        'H2 style comment headers are underlined with ----- signs\n' +
        'Italics style comments are surrounded thus *comment*\n' +
        'Bold style comments are surrounded thus **comment**\n' +
        'Combined style comments are surrounded thus **__comment__**\n' +
        'Strikethrough comments are surrounded thus ~~comment~~\n' +
        'Ordered lists have numerics (actual numbers don\'t matter, just ' +
        'the fact that they are a number thus\n' +
        '  1. Comment1\n' +
        '  8. Comment2\n' +
        '  2. Comment3\n' +
        'Unordered lists can use *, +, - or any combination thus\n' +
        '  * Comment1\n' +
        '  * Comment2\n' +
        '  - Comment3\n' +
        'Sublists are indented by two spaces.All sentences associated ' + 
        'with that sublist are also indented by two spaces\n' +
        '  &#8231;&#8231;Comment1\n' +
        'To have a line break without a paragraph, use two trailing spaces.\n' +
        '  &#8231;&#8231;Comment1&#8231;&#8231;\n' +
        '  Comment1&#8231;&#8231;\n' +
        'Links are created thus\n' +
        '  [Text that appears](https://www.google.com)\n' +
        'Inline code has backticks around it\n' +
        '  ```javascript\n' +
        '  var s = "JavaScript syntax highlighting";\n' +
        '  alert(s);\n' +
        '  ```\n\n' +
        '  ```\n' +
        '  No language indicated, so no syntax highlighting.\n' +
        '  ```\n' +
        'Tables:\n', 2);
      blockLog(
        'There must be at least 3 dashes in the lines defining the ' +
        'table header\n' +
        'The outer pipes (|) are optional, and you don\'t need to make the ' +
        'raw Markdown line up prettily \n' +
        'Colons in the table header underlining row define the alignment\n' +
        'Alternate table rows are automatically shaded\n' +
        '  |     Tables    |       Are     |  Cool |\n' +
        '  | ------------- |:-------------:| -----:|\n' +
        '  | col 3 is      | right aligned | $1600 |\n' +
        '  | col 2 is      |    centred    |   $12 |\n' +
        '  | zebra stripes |    are neat   |    $1 |\n',3);
      blockLog(
        'Blockquote lines are started with a > sign, and continuous ' +
        'lines starting with a > sign form the same blockquote\n' +
        '  > Blockquotes are very handy in email to emulate reply text.\n' +
        '  > This line is part of the same quote\n' +
        'You can also use raw HTML in your Markdown, and it\'ll ' +
        'mostly work pretty well\n' +
        'Three or more hyphens, asterisks or underscores are ' +
        'used to generate a horizontal rule\n' +
      '',2);
    }
    page1();   
    return;
  }
};
//
// ----------------------------------------------------------------------------
// TEST - a sandbox for testing new stuff
//
function testFunction(argc, argv) {
  blockLog('TEST function');
  blockLog('argv = ' + JSON.stringify(argv));
  blockLog('cmd[\'TEST\'] = ' + JSON.stringify(cmd['TEST']));
}
//
cmd['TEST'] = {
  name:'test - run a test function in a controlled environment',
  synopsis:'This command is used when coding test software to verify ' +
    'it\'s functionality before integrating it into the main terminal', 
  description: '',
  seeAlso: '',
  keywords: '',
  flag: '*',
  fn: testFunction
};
//
// ----------------------------------------------------------------------------
// TIME - display current date and time
//
var dow = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
var moy = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
function getTimeString(d) {
  if (Object.prototype.toString.call(d) === "[object Date]") {
    // it is a date
    if (isNaN(d.getTime())) {
      // date is not valid
    } else {
      // date is valid
      var period = 'am';
      var m = d.getMinutes();
      if (m < 10) m = '0' + m;
      if (d.getHours() > 11) period = 'pm';
      return d.getHours() + ":" + m + period + " on " +
        dow[d.getDay()] + ", " + d.getDate() + " " + moy[d.getMonth()] + ", " + d.getFullYear();
    }
  }
  return "Invalid date";
}
//
function timeFunction(argc, argv) {
  var strOut;
  var tod;
  var dSyd = new Date().toLocaleString("en-US", {timeZone: "Australia/Sydney"});
  dSyd = new Date(dSyd);
  var d = new Date().toLocaleString("en-US");
  d = new Date(d);

  if (userName != 'Mike') {
    if (d.getTime() !== dSyd.getTime()) {
      blockLog('It\'s ' + getTimeString(d) + ' (' + getTimeString(dSyd) + 
        ' in Sydney).');
    } else {
      blockLog('It\'s ' + getTimeString(d));
    }
    return;
  }
  
  if (d.getTime() != dSyd.getTime()) blockLog('It\'s ' + getTimeString(dSyd) + ' in Sydney.');

  var hour = d.getHours();
  var dow = d.getDay();
  var period = 'am';
  if (d.getHours() > 11) period = 'pm';
  if (d.getMinutes() < 10) {
    tod = d.getHours() + ":0" + d.getMinutes() + period;
  } else {
    tod = d.getHours() + ":" + d.getMinutes() + period;
  }

  if (hour < 2) { 
      // Night time - sleeping hours - midnight to 1:59
      strOut = "It's " + tod + " - rather late. You should be asleep " + 
        userName + ".";
  } else {
    if (hour < 7) { 
        // Night time - sleeping hours
        strOut = "It's " + tod + " - rather early. You should be asleep " + 
          userName + ".";
    } else {
      if ((hour >= 7 && hour <= 10 && (dow == 6 || dow == 0))) {
          // Breakfast time - weekends
          strOut = "It's " + tod + " " + userName + ", time for breakfast.";
      } else {
        if ((hour == 7 && (dow > 0 || dow < 6))) {
            // Breakfast time - weekdays
            strOut = "It's " + tod + " " + userName + ", time for breakfast.";
        } else {
          if (hour < 12) {
              // Mornings
              strOut = "Good morning " + userName + ", it's " + tod + ".";
          } else {
            if (hour < 13) {
                // Lunchtime
                strOut = "It's " + tod + " " + userName + ", time for lunch.";
            } else {
              if (hour < 17) {
                  // Afternoon
                  strOut = "It's " + tod + " in the afternoon " + 
                    userName + ".";
              } else {
                if (hour < 18) {
                    // Cooking tea time
                    strOut = "It's " + tod + " " + userName + 
                      ". Time to cook tea.";
                } else {
                  if (hour < 19) {
                      // Tea time
                      strOut = "It's " + tod + " " + userName + 
                        ". You should be eating tea !";
                  } else {
                    if (hour < 22) {
                      strOut = "It's " + tod + " " + userName + 
                        ". Good to see you here.";
                    } else {
                      if (hour == 22) {
                          // Just about time for bed
                          strOut = "It's " + tod + " " + userName + 
                            ". Almost time for bed.";
                      } else {
                        // Night time
                        strOut = "It's " + tod + " in the evening " + userName + 
                          ".  You should be thinking about going to bed.";
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }    
  blockLog(strOut + '\n');
}
//
cmd['TIME'] = {
  name:'time - display the current time and date',
  synopsis:'time', 
  description: 'Time reports the present time and date as reported by the ' +
    'computer.  If the user is outside the Sydney time zone, the Sydney time ' +
    'is also displayed.  More friendly prompts are displayed if the user is ' +
    'Mike.',
  seeAlso: 'date, frenchtime',
  keywords: '',
  flag: ' ',
  fn: timeFunction
};
//
// ----------------------------------------------------------------------------
// TODO
//
cmd['TODO'] = {
  name:'todo - list remaining work on this system',
  synopsis:'todo', 
  description: '',
  seeAlso: '',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv) {
    blockLog('To Do :');
    blockLog('Additional functions:',2);
    blockLog(
      'homeAutomation, OS, ping, whatIs, where (whereIs), wiki', 3);
    blockLog('Other stuff:',2);
    blockLog(shellTodo.join('\n'), 3);
  }
};
//
// ----------------------------------------------------------------------------
//  - 
//
cmd['TOUCH'] = {
  name:'touch - create a file (or change the modified time to now if it exists',
  synopsis:'', 
  description: '',
  seeAlso: 'CHDIR, CAT, CP, LS, MKDIR, MV, REN, RM, IMPORT, EXPORT, EXPLORE',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv) {
    fsw.touch(argc, argv);
    return;
  }
};
//
// ----------------------------------------------------------------------------
// TRAIN - display the CityRail timetable
//
cmd['TRAIN'] = {
  name:'train - open the CityRail timetable in a new tab',
  synopsis:'train', 
  description: '',
  seeAlso: '',
  keywords: '',
  flag: ' ',
  fn: function(argc, argv) {
    openLink('https://transportnsw.info/routes/train');
  }
};
//
// ----------------------------------------------------------------------------
// TRANSLATE
//
cmd['TRANSLATE'] = {
  name:
    'translate - use the Google search engine to translate from one ' +
      'language to another',
  synopsis:'translate\ntranslate <language> to <language>', 
  description:'',
  seeAlso: '',
  keywords: 'translate',
  flag: ' ',
  fn: function(argc, argv){
    argv[0] = 'translate';
    openLink('https://www.google.com/search?q=' + argv.join('+'));   
    return;
  }
};
//
// ----------------------------------------------------------------------------
// UPDATE - unknown functionality as of yet
//
cmd["UPDATE"] = {
  name : 'update - update system parameters and variables',
  synopsis:'update <name> <newvalue>',
  description: 'There are presently no system variables that can be updated ' +
    'by the user',
  seeAlso: '',
  keywords: '',
  flag: '*',
  fn: function(argc, argv){
    blockLog("UPDATE hasn't been implemented by Mike yet");
    return;

    // This is the old code from the original terminal.js
    var parameters = argv[1];
    console.log(argv[1]);
    if (parameters.length === 0) {
      blockLog("Please specify value that you would like to update!");
      return;
    }

    if (parameters[0].toString().toUpperCase() === "TITLE") {
      if (parameters.length === 1) {
        blockLog("Please specify title you would like to update the User Title!");
        return;
      }      
      blockLog("Successfully Updated User Title!");
      return;
    }
  }
};
//
// ----------------------------------------------------------------------------
// ASCII - display UTF-8 character set
//
cmd['UTF'] = {
  name: 'UTF - Display UTF-8 Character Set',
 
  synopsis:'UTF\nUTF <charcode>', 
  description: 
    'Using the command with no parameter will result in the ASCII character ' +
    'set being displayed (the UTF-8 character set is backwards compatible ' +
    'with the ASCII character set).  If an intermediate charcode is entered, ' +
    'the entire codepage will be displayed.\n\n' +
    'Below is a list of some of the UTF-8 character codes supported by HTML5:\n\n' +
    '  Character codes                     Decimal       Hexadecimal\n' +
    '  C0 Controls and Basic Latin          0-127        0000-007F\n' +
    '  C1 Controls and Latin-1 Supplement 128-255        0080-00FF\n' +
    '  Latin Extended-A                   256-383        0100-017F\n' +
    '  Latin Extended-B                   384-591        0180-024F\n' +
    '  Spacing Modifiers                  688-767        02B0-02FF\n' +
    '  Diacritical Marks                  768-879        0300-036F\n' +
    '  Greek and Coptic                   880-1023       0370-03FF\n' +
    '  Cyrillic Basic                    1024-1279       0400-04FF\n' +
    '  Cyrillic Supplement               1280-1327       0500-052F\n' +
    '  General Punctuation               8192-8303       2000-206F\n' +
    '  Currency Symbols                  8352-8399       20A0-20CF\n' +
    '  Letterlike Symbols                8448-8527       2100-214F\n' +
    '  Arrows                            8592-8703       2190-21FF\n' +
    '  Mathematical Operators            8704-8959       2200-22FF\n' +
    '  Box Drawings                      9472-9599       2500-257F\n' +
    '  Block Elements                    9600-9631       2580-259F\n' +
    '  Geometric Shapes                  9632-9727       25A0-25FF\n' +
    '  Miscellaneous Symbols             9728-9983       2600-26FF\n' +
    '  Dingbats                          9984-10175      2700-27BF\n',
  seeAlso: 'ASCII',
  keywords: '',
  flag: ' ',
  colWidth: 22, // Needs to be this wide because of the way we define the 
    // characters ie '&#xabcd', so each character is read by wrapIt() as being
    // 7 characters wide.  Also, some characters print to wider than one space
  colSpace: 4,
  fn: function(argc, argv){
    var start, end;
 //   function page1() { displayCodeset(); more(page2);};
    if (argc == 1) {
      this.displayCodeset(0x0000, 0x007f, 'ASCII Character Set');
      return;
    }
    if (argc != 2) { // We need exactly one parameter
      showManPage('UTF');
      return;
    }
    if (!isNaN(argv[1])) {
      // Decimal number
      start = parseInt(argv[1]);
    } else {
      if (!isNaN(parseInt(argv[1],16))) {
        // Hexadecimal number
        start = parseInt(argv[1],16);
      } else {
        showManPage('UTF');
        return;
      }
    }

    if (start < 128) {this.displayCodeset(0, 127, 'C0 Controls and Basic Latin'); } else
    if (start < 256) {this.displayCodeset(128, 255, 'C1 Controls and Latin-1 Supplement'); } else
    if (start < 384) {this.displayCodeset(256, 383, 'Latin Extended-A'); } else
    if (start < 592) {this.displayCodeset(384, 591, 'Latin Extended-B'); } else
    if (start < 768) {this.displayCodeset(688, 767, 'Spacing Modifiers'); } else
    if (start < 880) {this.displayCodeset(768, 879, 'Diacritical Marks'); } else
    if (start < 1024) {this.displayCodeset(880, 1023, 'Greek and Coptic'); } else
    if (start < 1280) {this.displayCodeset(1024, 1279, 'Cyrillic Basic'); } else
    if (start < 1328) {this.displayCodeset(1280, 1327, 'Cyrillic Supplement'); } else
    if (start < 8304) {this.displayCodeset(8192, 8303, 'General Punctuation'); } else
    if (start < 8400) {this.displayCodeset(8352, 8399, 'Currency Symbols'); } else
    if (start < 8528) {this.displayCodeset(8448, 8527, 'Letterlike Symbols'); } else
    if (start < 8704) {this.displayCodeset(8592, 8703, 'Arrows'); } else
    if (start < 8960) {this.displayCodeset(8704, 8959, 'Mathematical Operators'); } else
    if (start < 9600) {this.displayCodeset(9472, 9599, 'Box Drawings'); } else
    if (start < 9632) {this.displayCodeset(9600, 9631, 'Block Elements'); } else
    if (start < 9728) {this.displayCodeset(9632, 9727, 'Geometric Shapes'); } else
    if (start < 9984) {this.displayCodeset(9728, 9983, 'Miscellaneous Symbols'); } else
    if (start < 10176) {this.displayCodeset(9984, 10175, 'Dingbats'); } else
      {this.displayCodeset(0, 127, 'C0 Controls and Basic Latin'); }
    
    return;
  }
};
//
//
//
cmd['UTF'].displayCodeset = function(min, max, charSet) {
  var i, j, step, outStr;

  function header() {
    var i, outS1 = '', outS2 = '';
    
    cmd['UTF'].calcNumColsRows();
    for (i = 1; i <= cmd['UTF'].numCols; i++) {
      if (i > 1) {
        outS1 += '    ';
        outS2 += '    ';
      }
      outS1 += 'CHAR   DEC  HEX';
      outS2 += '==== ===== ====';
    }
    return(outS1 + '\n' + outS2 + '\n');
  }
  function doEntry(n) {
    var c;
    var cc = ['NUL', 'SOH', 'STX', 'ETX', 'EOT', 'ENQ', 'ACK', 'BEL', ' BS', ' HT', 
      ' LF', ' VT', ' FF', ' CR', ' SO', ' SI', 'DLE', 'DC1', 'DC2', 'DC3', 
      'DC4', 'NAK', 'SYN', 'ETB', 'CAN', ' EM', 'SUB', 'ESC', ' FS', ' GS', 
      ' RS', ' US'];
    if (n < 32) {
      c = ' ' + cc[n];
    } else if (n == 127) {
      c = ' DEL';
    } else
      if (((n >= 128) && (n <= 159)) || 
           (n == 173) || 
          ((n > 8383) && (n < 8448))) { // Non displayable characters
      c = '    ';    
    } else { 
      c = '   &#x' + n.toString(16) + ';'
    }
    var d = n;
    d = pad(d, 5);
    h = n.toString(16);
    h = pad(h, 4, '0');
    return(c + ' ' + d + ' ' + h);    
  }

  if (charSet == undefined) {
    outStr = header();
  } else {
    outStr = charSet + '\n' + header();
  }
  step = Math.floor((max - min + 1) / cmd['UTF'].numCols);
  for (i = min; i < (min + step); i++) {
    for (j = 0; j<cmd['UTF'].numCols; j++) {
      if ((i + (step * j)) <= max)  {
        outStr = outStr + doEntry(i + (step * j));
        if (j < cmd['UTF'].numCols - 1) {
          outStr = outStr + '    ';  
        }
      }
    }
    outStr = outStr + '\n';
  }
  blockLog(outStr, 2);
}
//
//
//
cmd['UTF'].calcNumColsRows = function(){
  cmd['UTF'].numCols = Math.ceil(((window.innerWidth / pixelsPerCharCol) - 4) / 
    (cmd['UTF'].colWidth + cmd['UTF'].colSpace));
  if ((((cmd['UTF'].numCols * cmd['UTF'].colWidth) + 
        ((cmd['UTF'].numCols - 1) * cmd['UTF'].colSpace) + 4) * pixelsPerCharCol)
            > window.innerWidth)
         cmd['UTF'].numCols--;
  cmd['UTF'].numRows = Math.ceil((window.innerHeight / pixelsPerCharRow) - 4); 
}
cmd['UTF'].calcNumColsRows();
//
// ----------------------------------------------------------------------------
// VER
//
cmd['VER'] = {
  isAliasFor: 'ABOUT',
  flag: ' '
};
//
// ----------------------------------------------------------------------------
// WHOAMI
//
cmd['WHOAMI'] = {
  name:'whoami - display current user info',
  synopsis:'whoami', 
  description: '',
  seeAlso: 'logon, logoff, bye',
  keywords: '',
  flag: 'x',
  fn: function(argv, argc) {
    if (userName.length > 0) {
      blockLog("You\'re " + userName + " !!!");
    } else {
      blockLog("I don\'t know who you are - no-one is logged onto the " +
        "system at the moment !!!"); 
    }
    return
    }
};
registerFile(5);
//
// ----------------------------------------------------------------------------
//                               End of file
// ----------------------------------------------------------------------------
//



