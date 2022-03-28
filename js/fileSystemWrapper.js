/*
  fileSystemWrapper.js

  Contains the interface functions between the commands and the filesystem 
  
  This file has been written specifically as an interface between terminal.html 
  and the indexedDB polyfill fileSystem.  This script has the following 
  dependancies:
    For the virtual filesystem driver
      <script src="client.idb.filesystem.js" defer></script>
      <script src="client.filer.js" defer></script>
    For the zip file creation upon export
      <script src="jszip.js" defer></script>
      
  ------------------------------------------------------------------------------

  Revision History
  ================
  16 Mar 2020 MDS Original
  17 Feb 2022 MDS Changed for working version of indexedDB polyfill

  ------------------------------------------------------------------------------
 */

var FileSystemWrapper = new function() {
  let filer = new Filer();

  // ----------------------------------------------------------------------------
  // Constructor
  function FileSystemWrapper() {

  }


  //
  // ----------------------------------------------------------------------------
  // Private method
  //
  let onSuccess = (s) => {
  }
  //
  // ----------------------------------------------------------------------------
  // Private method
  //
  let onError = (e) => {
    if (typeof e == 'object') {
      if (e.name && e.message) {
        console.log(e.name + ": " + e.message);
      } else {
        console.log(e);
      }
    } else {
      console.log(e);
    }
  }
  //
  // ----------------------------------------------------------------------------
  // Private property
  //
  //  The following would define myPrivateVaraiable as private
  //
  //    let myPrivateVariable = 15; // Example only
  //
  // ----------------------------------------------------------------------------
  // Define public properties
  FileSystemWrapper.prototype = {
    // This sets cwd as publically readable
		get cwd() { 
			return filer.cwd.fullPath;
		},

  }

  //
  // ----------------------------------------------------------------------------
  // Attempt to open or initialise the indexed DB file system
  //
  FileSystemWrapper.prototype.init = (dbName, successCallback, opt_errorHandler) => {
    try {
      /* 
        We are running locally so can't request persistent storage (when you're running on the file:/// 
        protocol you don't get the same privileges as with http/s:///).  Temporary storage is available by 
        default without requesting so this code block is largely redundant.

        Refer
          https://developer.chrome.com/docs/apps/offline_storage/#query
          https://stackoverflow.com/questions/20594804/html-5-file-system-api-i-am-getting-a-domerror-notsupporteerror

          220208 MDS
        */

      filer.init({size: 1024 * 1024, name: dbName},                  // initObj
        function(fs) {                                      // Success callback
          cwd_ = filer.cwd.fullPath;
          makeLinuxFilestructure();
          successCallback();
        },
        
        function(e) {                                  // Error handler callback
          if (e.name == 'SECURITY_ERR') {
            console.log('SECURITY_ERR: Are you running in incognito mode?');
            return;
          } else {
            if (opt_errorHandler) {
              opt_errorHandler(e);
            } else {
              throw e;
            }
          }
        }
      );
    } catch(e) {
      if (e.code == FileError.BROWSER_NOT_SUPPORTED) {
        if (opt_errorHandler) {
          opt_errorHandler(e);
        } else {
          throw e;
        }
      }
    }
  };
  //
  // ----------------------------------------------------------------------------
  // 
  //
  FileSystemWrapper.prototype.cat = (argc, argv) => {  
    var i;

    // Allow a single string argument to be passed
    if ((typeof argc == 'string') && (typeof argv == 'undefined')) {
      argv[0] = "CAT";
      argv[1] = argc;
      argc = 2;
    }
    
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
  // Changes the current working directory by calling the filer function.
  //
  FileSystemWrapper.prototype.cd = (argc, argv) => {  

    // Allow a single string argument to be passed
    if ((typeof argc == 'string') && (typeof argv == 'undefined')) {
      argv = [];
      argv[0] = "CD";
      argv[1] = argc;
      argc = 2;
    }



    if ((argc > 2) && (typeof argv[2] !== 'function')) {
      showManPage('CD');
      return '';
    }
    if ((argc > 3) && (typeof argv[3] !== 'function')) {
      showManPage('CD');
      return '';
    }
    if (argc > 4) {
      showManPage('CD');
      return '';
    }

    // Fill in missing arguments
    if (typeof argv[2] == 'undefined') argv[2] = onSuccess;
    if (typeof argv[3] == 'undefined') argv[3] = onError;
    filer.cd(argv[1], argv[2], argv[3]);
  }
  //
  // ----------------------------------------------------------------------------
  // 
  //
  FileSystemWrapper.prototype.chdir = (argc, argv) => {  
    // Allow a single string argument to be passed
    if ((typeof argc == 'string') && (typeof argv == 'undefined')) {
      argv[0] = "CHDIR";
      argv[1] = argc;
      argc = 2;
    }

  	if (argc != 2) {
      showManPage('CHDIR');
  		return;
  	}
  	if (filer.cwd.fullPath == "/") {
  	  let path = filer.cwd.fullPath + argv[1];		
  	} else {
  	  let path = filer.cwd.fullPath + "/" + argv[1];  		
  	}
	  let path = filer.cwd.fullPath + "/" + argv[1];
	  let rootPath = filer.pathToFilesystemURL('/');
	  if (path == '/' || (path == '..' && (rootPath == cwd))) {
	    return;
	  } else if (path == '..') {
	    var parts = cwd.split('/');
	    parts.pop();
	    path = parts.join('/');
	    if (path == rootPath.substring(0, rootPath.length - 1)) {
	      path += '/';
	    }
	  }	
	  
	  filer.ls(path,
			function() { // Success callback
			  document.getElementById("input_title").innerText = getPrompt();
			},
			function() { blockLog('Path not found')} // Error callback
		);
  }
 //
  // ----------------------------------------------------------------------------
  // 
  //
  FileSystemWrapper.prototype.copy = (argc, argv) => {  
  	// COPY ?opts? src ?dst?
  	// CP ?opts? src ?dst?

    // Allow a single string argument to be passed
/*    if ((typeof argc == 'string') && (typeof argv == 'undefined')) {
      argv[0] = "MKDIR";
      argv[1] = argc;
      argc = 2;
    }
  */	
  	
  	if ((argc < 2) || (argc > 3)) {
      showManPage('COPY');
  		return;
  	}
  	
 	  if (argc == 2) {
 			// Copy into the cwd
 			
    } else {
    	
    	
    }
    
  	
    log('COPY not yet fully implemented');
    return;  
  }
  //
  // ----------------------------------------------------------------------------
  // 
  //
  FileSystemWrapper.prototype.cp = (argc, argv) => {  
  	// COPY ?opts? src ?dst?
  	// CP ?opts? src ?dst?
    // Allow a single string argument to be passed
/*
    if ((typeof argc == 'string') && (typeof argv == 'undefined')) {
      argv[0] = "MKDIR";
      argv[1] = argc;
      argc = 2;
    }
  */	
  	
  	if ((argc < 2) || (argc > 3)) {
      showManPage('CHDIR');
  		return;
  	}
  	
 	  if (argc == 2) {
 			// Copy into the cwd
 			
    } else {
    	
    	
    }
    
  	
    log('CP not yet fully implemented');
    return;  
  }
  //
  // ----------------------------------------------------------------------------
  // 
  //
  FileSystemWrapper.prototype.export = (argc, argv) => {  
    log('EXPORT not yet implemented');
    return;  
  }
  //
  // ----------------------------------------------------------------------------
  // 
  //
  FileSystemWrapper.prototype.import = (argc, argv) => {  
    log('IMPORT not yet implemented');
    return ' ';  
  }
  //
  // ----------------------------------------------------------------------------
  // Perform LS function.  
  // 
  // If argv[2] is a function, then it is assumed that direct access to the 
  // Filer.ls function is required
  //
  FileSystemWrapper.prototype.ls = (argc, argv) => {
    let i, width = 0, maxCols, numCols, outS='', 
      fStr, fCount=0, dCount=0, totalBytes=0;

    // Check for programmatic access directly to Filer.ls 
    if ((argc > 2) && (typeof argv[1] == 'string') && (typeof argv[2] == 'function')) {
      if (typeof argv[3] !== 'function') {
        filer.ls(argv[1], argv[2]);
        return;
      } else if ((argc == 4) && (typeof argv[3] == 'function')) {
        filer.ls(argv[1], argv[2], argv[3]);
        return;
      } else {
        showManPage('LS');
        return;
      }
    }

    // Allow a single string argument to be passed
    if ((typeof argc == 'string') && (typeof argv == 'undefined')) {
      argv[0] = "LS";
      argv[1] = argc;
      argc = 2;
    }

    // Command line access
		filer.ls('.', 
			function(dirEntries) {  // Success callback
		    // All commands need the files in sorted alphabetical order, and we add . 
		    // and .. for DIR commands, so copy the info into a local directory array
		    let myDirEntries = [];
		    for (let i=0; i<dirEntries.length; i++)
		      myDirEntries.unshift(dirEntries[i]);
		    // Sort the array into alphabetical order
		    myDirEntries.sort(function(a, b) {
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
		          '  Volume is an indexedDB File System\n' +
		          '  Directory of ' + fsw.pwd() + '\n';
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
			}, 
			onError            // Error callback
		);

  }
  //
  // ----------------------------------------------------------------------------
  // 
  //
  FileSystemWrapper.prototype.mkdir = (argc, argv) => {  
    // Allow a single string argument to be passed
    if ((typeof argc == 'string') && (typeof argv == 'undefined')) {
      argv[0] = "MKDIR";
      argv[1] = argc;
      argc = 2;
    }

    if (argc != 2) {
      showManPage('MKDIR');
      return;
    }

    // Correct typos on forward slash (backwards slashes crash indexeddb filesystem under wondoze)
    argv[1] = argv[1].replace(/\\/g, "\/")
    filer.mkdir(argv[1], true, function(s){ }, function(e) { });
    return;  
  }

  //
  // ----------------------------------------------------------------------------
  // Private method
  //
  // Linux notes (all run as su through sudo):
  //  - Services get started through links in /etc/rc5.d/ 
  //  - /etc/rc.local is run at the end of bootup
  //  - ~/.bashrc is run each time you personally log on
  //  - Put your script in /etc/init.d/ (make sure of the right permissions and that it is executable) 
  //    and then update-rc.d n nameofscript defaults.  This will make your script start at runlevel 2 
  //    to 5 and stop at runlevel 0,1 and 6

  var makeLinuxFilestructure = (argc, argv) => { 
    // Main directories
    filer.mkdir('/bin', false, onSuccess, onError);         // Essential user command binaries
    filer.mkdir('/etc', false, onSuccess, onError);         // Host specific system configuration
    filer.mkdir('/etc/init.d/', false, onSuccess, onError); // 'autoexec.bat style files are stored here
    filer.mkdir('/home', false, onSuccess, onError);        // User home directories
    filer.mkdir('/home/mike', false, onSuccess, onError);   // User home directories
    filer.mkdir('/home/guest', false, onSuccess, onError);  // User home directories
    filer.mkdir('/opt', false, onSuccess, onError);         // Add-on application software packages
    filer.mkdir('/tmp', false, onSuccess, onError);         // Temporary files
    filer.mkdir('/usr', false, onSuccess, onError);         // User utilities and applications
    filer.mkdir('/var', false, onSuccess, onError);         // Log files

    // Additional directories
    filer.mkdir('/boot', false, onSuccess, onError);        // Static files of the boot loader
    filer.mkdir('/dev', false, onSuccess, onError);         // Device files
    filer.mkdir('/lib', false, onSuccess, onError);         // Shared libraries
    filer.mkdir('/lost+found', false, onSuccess, onError);  // Used to find recovered bits of corrupt files
    filer.mkdir('/media', false, onSuccess, onError);       // Removable media
    filer.mkdir('/mnt', false, onSuccess, onError);         // Mounted filesystem
    filer.mkdir('/proc', false, onSuccess, onError);        // Process information
    filer.mkdir('/sbin', false, onSuccess, onError);        // System binaries
    filer.mkdir('/srv', false, onSuccess, onError);         // Data for service from system
    return;  
  }
  //
  // ----------------------------------------------------------------------------
  // 
  //
  FileSystemWrapper.prototype.mv = (argc, argv) => {  
    log('MV not yet implemented');
    return;  
  }
  //
  // ----------------------------------------------------------------------------
  // 
  //
  FileSystemWrapper.prototype.pwd = (argc, argv) => {
    // argc and argv may be undefined when this is called from getPrompt()
    return filer.cwd.fullPath;
  }
  //
  // ----------------------------------------------------------------------------
  // 
  //
  FileSystemWrapper.prototype.ren = (argc, argv) => {  
    log('REN not yet implemented');
    return;  
  }
  //
  // ----------------------------------------------------------------------------
  // 
  //
  FileSystemWrapper.prototype.rm = (argc, argv) => {  
    log('RM not yet implemented');
    return;  
  }


  return FileSystemWrapper;
}

//
// ----------------------------------------------------------------------------
// 
//
// MDS Temporary until we write one in the main Terminal system
function onError(e) {
    console.log(e);
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

