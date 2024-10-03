/*
  fileSystemWrapper.js

  Contains the interface functions between the commands and the filesystem 
  
  This file has been written specifically as an interface between terminal.html 
  and the indexedDB polyfill fileSystem.  This script needs the following 
  additional scripts to be included:
    <script src="../idb.filesystem.js-master/src/idb.filesystem.js" defer></script>
    <script src="resources/logger.js" defer></script>
    <script src="resources/filer.js" defer></script>
    <script src="resources/dnd.js" defer></script>
    <script src="resources/app.js" onload="openFS()" defer></script>  
  
  If the filesystem philosophy is changed in future, then no other code needs to
  be modified except for the contents of these functions, which provide the 
  interface between the main Javascript terminal system and the specific 
  implementation of the filesystem 
  
  ------------------------------------------------------------------------------

  Revision History
  ================
  16 Mar 2020 MDS Original

  ------------------------------------------------------------------------------
 */
//
// ----------------------------------------------------------------------------
// 
//
function fileSystemWrapperCAT(argc, argv) {  
  var i;
  
  if (argc != 2) {
    showManPage('CAT');
    return '';
  }
  
  i = 0;
  while ((i<dirEntries.length) && (dirEntries[i].name != argv[1])) 
    i++;
  if (i>=dirEntries.length) {
    log('File not found : ' + argv[1]);
  }
  
  if (dirEntries[i].isFile) {  
    var fileWin = self.open(toURL(dirEntries[i]), 'fileWin');
  } else {
    log('Can\'t open \'' + dirEntries[i].name + '\' for viewing - not a file !');
  }
  return;  
}
//
// ----------------------------------------------------------------------------
// 
//
function fileSystemWrapperCHDIR(argc, argv) {  
  log('CHDIR not yet implemented');
  
  return;  
}
//
// ----------------------------------------------------------------------------
// 
//
function fileSystemWrapperCP(argc, argv) {  
  log('CP not yet implemented');
  return;  
}
//
// ----------------------------------------------------------------------------
// 
//
function fileSystemWrapperEXPORT(argc, argv) {  
  log('EXPORT not yet implemented');
  return;  
}
//
// ----------------------------------------------------------------------------
// 
//
function fileSystemWrapperIMPORT(argc, argv) {  
  log('IMPORT not yet implemented');
  return ' ';  
}
//
// ----------------------------------------------------------------------------
// 
//
function fileSystemWrapperLS(argc, argv) {
  var i, width = 0, maxCols, numCols, outS='', 
    fStr, fCount=0, dCount=0, totalBytes=0;

  // All commands need the files in sorted alphabetical order, and we add . 
  // and .. for DIR commands, so copy the info into a local directory array
  var myDirEntries = [];
  for (let i=0; i<dirEntries.length; i++)
    myDirEntries.unshift(dirEntries[i]);
  // Sort the array into alphabetical order
  myDirEntries.sort(function (a, b) {
    if (a.name.toUpperCase() < b.name.toUpperCase()) {
      return -1;
    } else {
      return 1;
    }
  });
  
  if (argv[0] == 'LS') {
    // Display as an LS command
    if (argc == 1) {
      for (i=0; i<myDirEntries.length; i++) {
        if (myDirEntries[i].name.length > width) {
          width = myDirEntries[i].name.length;
        }
      }
      maxCols = Math.ceil(window.innerWidth / (pixelsPerCharCol * (width + 2))); 
      numCols = 0;   
      for (i=0; i<myDirEntries.length; i++) {
        var tmp = myDirEntries[i].name;
        outS = outS + pad(tmp, width);
        numCols++;
        if (numCols >= maxCols) {
          outS = outS + '\n';
          numCols = 0;
        } else {
          outS = outS + '  ';
        }
      }
      log(outS); 
      return;
    } else if (argv[1] == '-l') {
      for (i=0; i<myDirEntries.length; i++) {
        if (myDirEntries[i].isFile) {
          outS = outS + '-rw-r--r--';
        } else {
          outS = outS + 'drw-r--r--';
        }
        outS = outS + ' 1 mike mike ';
        if (myDirEntries[i].isFile) {
          let fSize = parseInt(myDirEntries[i].file_.size);
          outS = outS + pad(fSize,6) + ' ';
          let d = new Date(myDirEntries[i].file_.lastModifiedDate);
          let moy = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          let dt = d.getDate();
          if (dt < 10) dt = ' ' + dt;
          if (d.getHours() > 11) period = 'PM';
          outS = outS + moy[d.getMonth()] + ' ' + dt + '  ' + d.getFullYear() + ' ';
        } else {
          outS = outS + spc(7);
          outS = outS + spc(13);
        } 
        outS = outS + myDirEntries[i].name + '\n';
      }    
      log(outS);
      return;
    } else {
      showManPage('LS');
      return;
    }
  } else {
    // Display as a DIR command.  Add the two DOS parent and current 
    // directory entries
    let tmp1 = {};              let tmp2 = {};
    tmp1.isDirectory = true;    tmp2.isDirectory = true;
    tmp1.isFile = false;        tmp2.isFile = false;
    tmp1.name = '.';            tmp2.name = '..';
    myDirEntries.unshift(tmp1, tmp2);

    if (argc == 1) {
      outS = 
        '  Volume is an indexedDB File System\n\n' +
        '  Directory of ' + fileSystemWrapperPWD() + '\n\n';
      for (i=0; i<myDirEntries.length; i++) {
        if (myDirEntries[i].isFile) {
          fCount++;
          fStr = myDirEntries[i].file_.size;
          totalBytes = totalBytes + parseInt(myDirEntries[i].file_.size);
          var d = new Date(myDirEntries[i].file_.lastModifiedDate);
          var period = 'AM';
          var m = d.getMinutes();
          if (m < 10) m = '0' + m;
          var h = d.getHours();
          if (h < 10) h = '0' + h;
          var dt = d.getDate();
          if (dt < 10) dt = ' ' + dt;
          var mo = d.getMonth();
          if (mo < 10) mo = '0' + mo;
          if (d.getHours() > 11) period = 'PM';
          outS = outS + dt + '/' + mo + '/' + d.getFullYear() + '  ' + h +':' + 
            m + ' ' + period + '    ';
        } else {
          dCount++;
          outS = outS + '                        ';        
        }
        if (myDirEntries[i].isDirectory) {
          outS = outS + '<DIR>';
        } else {
          outS = outS + '     ';
        }
        if (myDirEntries[i].isFile) {
          outS = outS + pad(fStr,9) + ' ';
        } else {
          outS = outS + '          ';        
        }
        outS = outS + myDirEntries[i].name + '\n';
      }
      outS = outS +
        pad(fCount, 16) + ' File(s) ' + pad(totalBytes,14) + ' bytes\n' +
        pad(dCount, 16) + ' Dir(s)' + spc(13) + '??? bytes free\n';
      log(outS);
      return;        
    } else {
      // DIR /w
      if (argv[1] == '/w') {
        for (i=0; i<myDirEntries.length; i++) {
          if (myDirEntries[i].isDirectory) {
            if ((myDirEntries[i].name.length + 2) > width) {
              width = myDirEntries[i].name.length;
            }
          } else {        
            if (myDirEntries[i].name.length > width) {
              width = myDirEntries[i].name.length;
            }
          }
        }
        maxCols = Math.ceil(window.innerWidth / (pixelsPerCharCol * (width + 5))); 
        numCols = 0;
        for (i=0; i<myDirEntries.length; i++) {
          let tmp = '';
          if (myDirEntries[i].isDirectory) {
            dCount++;
            tmp = '[' + myDirEntries[i].name + ']';
          } else {
            fCount++;
            fStr = myDirEntries[i].file_.size;
            totalBytes = totalBytes + parseInt(myDirEntries[i].file_.size);
            tmp = myDirEntries[i].name;
          }
          outS = outS + pad(tmp, width);
          numCols++;
          if (numCols >= maxCols) {
            outS = outS + '\n';
            numCols = 0;
          } else {
            outS = outS + '   ';
          }
        }
        if (numCols !== 0) {
            outS = outS + '\n';
        }
        outS = outS +
          pad(fCount, 16) + ' File(s) ' + pad(totalBytes,14) + ' bytes\n' +
          pad(dCount, 16) + ' Dir(s)' + spc(13) + '??? bytes free\n';
        log(outS);
        return;        
      } else {
        showManPage('DIR');
        return;
      }
    }
  } // Command was DIR
}
//
// ----------------------------------------------------------------------------
// 
//
function fileSystemWrapperMKDIR(argc, argv) {  
  if (argc != 2) {
    showManPage('MKDIR');
    return;
  }
  filer.mkdir(argv[1], true, addEntryToList, onError);
  return;  
}
//
// ----------------------------------------------------------------------------
// 
//
function fileSystemWrapperMV(argc, argv) {  
  log('MV not yet implemented');
  return;  
}
//
// ----------------------------------------------------------------------------
// 
//
function fileSystemWrapperPWD(argc, argv) {
  // argc and argv may be undefined when this is called from getPrompt()
  return fsInfo.cwd.substring(fsInfo.head.length);
}
//
// ----------------------------------------------------------------------------
// 
//
function fileSystemWrapperREN(argc, argv) {  
  log('REN not yet implemented');
  return;  
}
//
// ----------------------------------------------------------------------------
// 
//
function fileSystemWrapperRM(argc, argv) {  
  log('RM not yet implemented');
  return;  
}
//
// ----------------------------------------------------------------------------
// 
//
registerFile(5);
//
// ----------------------------------------------------------------------------
//                               End of file
// ----------------------------------------------------------------------------
//

