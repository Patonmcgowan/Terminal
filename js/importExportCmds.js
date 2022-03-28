'use strict';

//-----------------------------------------------------------------------------
// Convert blob URL to a Base64 encoded string
//
async function urlToBase64Data(item) {
  const retrieved = await URL.getFromObjectURL( toURL(item) );
  const buffer = await retrieved.arrayBuffer();
  const u8Arr = new Uint8Array(buffer);
  return Base64.fromUint8Array(u8Arr);
};

//-----------------------------------------------------------------------------
// Adds an URL.getFromObjectURL( <blob:// URI> ) method
// returns the original object (<Blob> or <MediaSource>) the URI points to or null
(() => {
  // overrides URL methods to be able to retrieve the original blobs later on
  const old_create = URL.createObjectURL;
  const old_revoke = URL.revokeObjectURL;
  Object.defineProperty(URL, 'createObjectURL', {
    get: () => storeAndCreate
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    get: () => forgetAndRevoke
  });
  Object.defineProperty(URL, 'getFromObjectURL', {
    get: () => getBlob
  });
  const dict = {};

  function storeAndCreate(blob) {
    const url = old_create(blob); // let it throw if it has to
    dict[url] = blob;
    return url
  }

  function forgetAndRevoke(url) {
    old_revoke(url);
    try {
      if(new URL(url).protocol === 'blob:') {
        delete dict[url];
      }
    } catch(e){}
  }

  function getBlob(url) {
    return dict[url] || null;
  }
})();


//-----------------------------------------------------------------------------
// Look at a filesystem entry and return the URL for the blob
//
function toURL(entry) {
  // Can't polyfill opening filesystem: URLs, so create a blob: URL instead.
  // TODO(ericbidelman): cleanup URLs created using revokeObjectUR().
  if (entry.isFile && entry.file_.blob_) {
    var blob = entry.file_.blob_;
  } else {
    var blob = new Blob([]);
  }

  return window.URL.createObjectURL(blob);
}


//-----------------------------------------------------------------------------
// Download a filesystem entry to the 'Downloads' folder.  As at 220310, we 
// don't use this function but have proven that it works
function downloadBlob(item) {
  window.a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = toURL(item);
  a.setAttribute("download",item.name);
  a.click();
  window.URL.revokeObjectURL(toURL(item));
}


cmd['EXPORT'] = {
  name: 'export - export the virtual filesystem to the local filesystem',
  synopsis:'export\nexport </q>', 
  description: 
    'export - export the entire virtual filesystem as a zip file [yymmdd.virtual.export.zip] into the default downloads directory\n' +

    'options can be:\n' +
    '  /q - quiet mode.  Export the file(s) silently to the downloads directory.  If this option is not specified, a file picker window\n' +
    '       will open to select the destination directory\n' +
    '',
  seeAlso: 'import',
  keywords: 'export',
  flag: ' ',
  fn: function(argc, argv){
    let quietMode = false;
    let fileName = null;

    // Strip out options
    for (let i=1; i<argc; i++) {
      if (((argv[i][0] == '-') || (argv[i][0] == '/') || (argv[i][0] == '\\')) && (argv[i].length >= 2)) {
        switch (argv[i][1]) {
          /*
          case 'p': // Specify destination path
            let pattern = /^([a-z]:)?((\\|\/)[^<>:"/\\|?*]+)+\\?$/i // Checks for valid Windows path
            let pattern = /^([a-z])?([^<>:"/\\|?*]+)+?$/i // Check for valid file name
            let result = pattern.test(argv[i].substr(2))
            if (result) {
              destPath = destPath||argv[i].substr(2);
            }
            break;
           */
          case 'q': // Quiet mode
            quietMode = true;
            break;
          default:
            showManPage(argv[0]);
            break;
        }
      } else {
        showManPage(argv[0]);
        return;
      }
    };


    //-------------------------------------------------------------------------
    // Make a blob of the virtual filesystem ready for writing to disk
    //
    zip = new JSZip();
    if(!JSZip.support.blob) {
      console.log('Blob operations not supported - aborting export');
      return;
    }

    // Step through virtual filesystem, adding bits to the output blob
    let nestingLevel = 0;
    fsw.cd("/");
    readDirRecursive(".");
    function readDirRecursive(dir) {
      nestingLevel++;
      fsw.ls(4, ['LS', 
        dir, 
        function(r) {               // Success callback
          nestingLevel--;

          // Write zip file once we've built it all
          if ((nestingLevel == 0) && (Object.keys(zip.files).length > 0)) {
            let d = new Date();
            let filename = d.getFullYear().toString().substr(2);
            filename += (d.getMonth() +1).toString().length < 2 ? '0' + (d.getMonth() + 1).toString() : (d.getMonth() + 1).toString();
            filename += d.getDate().toString().length < 2 ? '0' + d.getDate().toString() : d.getDate().toString();
            zip.file("signature.txt",            // The signature proves it's our file when we try to import it
              'MS Virtual Filesystem\n=====================\n' + 
              'This virtual filesystem export was created on ' + d.toString() + ' with quietMode ' + (quietMode?'enabled':'disabled') + '\n' +
              'An MD5 signature has not been implemented yet\n\n' +
              'This software copyright Michael Scott 2000 - 2022\n' +
              license()
            );

            // Add end bit for final file
            filename +=  ".virtualFileSystemExport.zip";
            // Call cleanup using a timeout to force it to the back of the event queue
            // This allows the zip file creation to complete properly.  Note a 
            // small time is required to allow all files to be base64 encoded 
            // and added to the zip file correctly
            setTimeout(function() {
              zip.generateAsync({type:"blob"})
                .then(function(content) {
                  saveArchive(quietMode, filename, content); 
                });
             }, 100);
          }

          if (r.length == 0) {
            return;
          } else {
            r.forEach(async function(item) {
              if (item.isDirectory) {
                zip.folder(item.fullPath.substr(1)); // Ignore leading slash
                readDirRecursive(item.fullPath);
              } else {
                let out = await urlToBase64Data(item);
                zip.file(item.fullPath.substr(1), out, {base64: true}); // Ignore leading slash
              }
            });
          }
        },
        function(e) {
          console.log('Error: ' + typeof e);
          console.log(e);
        }]);
      return;
    }

    //-------------------------------------------------------------------------
    // Write the contents of the passed blob to a physical disk zipfile
    //
    async function saveArchive(quietMode, filename, content) {
      if (quietMode) {
        // Write silently to downloads folder
        if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
          return navigator.msSaveOrOpenBlob(content, fileName);
        } else if (typeof navigator.msSaveBlob !== 'undefined') {
          return navigator.msSaveBlob(content, fileName);
        } else {
          var elem = window.document.createElement('a');
          elem.href = window.URL.createObjectURL(content);
          elem.download = filename;
          elem.style = 'display:none;opacity:0;color:transparent;';
          (document.body || document.documentElement).appendChild(elem);
          if (typeof elem.click === 'function') {
            elem.click();
          } else {
            elem.target = '_blank';
            elem.dispatchEvent(new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true
            }));
          }
          URL.revokeObjectURL(elem.href);
        }
      } else {
        // Open file saveAs picker and write content to selected file/directory
        // Based upon https://fjolt.com/article/javascript-new-file-system-api
        try {
          const opts = {
              types: [{
                description: 'Virtual Filesystem Archive',
                accept: {'application/zip': ['.zip']},
              }],
              suggestedName: filename
            };
          let saveFile = await window.showSaveFilePicker(opts);
          const file = await saveFile.getFile();
          const contents = await file.text();

          if(typeof saveFile !== "undefined") {
            if ((await saveFile.queryPermission()) === 'granted') {
              const writable = await saveFile.createWritable();
              await writable.write(content);
              await writable.close();
            }
          }
        } catch(e) {
            console.log(e);
        }
      }
    }
    return;
  }
};

cmd['IMPORT'] = {
  name: 'import - import files into the virtual file system from the local filesystem',
  synopsis:'import\nimport <filelist> </p[<I>source path</I>]> || </i> </q>', 
  description: 
    'import - open a file picker window and import the selected file or files.  If a valid virtual filesystem zip file is found in the selected files, then the files and directories contained therein are created.  Files will be written relative to the current working directory\n' +
    'import ?<I>path</I>? ?<I>file</I>? ... ?<I>file</I>? - import the named files from the entered path or the default import directory if no path was entered\n' +
    'options can be:\n' +
    '  /i - interactive mode (open file picker window to select destination directory).  This option is default and overrides any specified destination paths\n' +
    '  /p - specify source path.  If this option is not given, an interactive pick window will open\n' +
    '  /q - quite mode.  Import the file(s).  If a zip file is specified, then the contents are stored relative to the root directory.  If files/directories are\n' +
    '       specified, then store the contents relative to thge current working directory. At least one file must be specified\n' +
    '',
  seeAlso: 'export',
  keywords: 'import',
  flag: ' ',
  fn: function(argc, argv){
  
    // create a reference for our file handle
    let fileHandle;

    // Search for options in the passed command
    for (i=1; i<argc; i++) {
      if (argv[i].startsWith('/') || argv[i].startsWith("-")) {
        switch (argv[i][1]) {
          case 'i':
  console.log("i option");
            break;
          case 'p':
  console.log("p option");
            break;
        }
      }
    }

    async function getAndProcessFileList() {
      // open file picker
      const pickerOpts = {
        /* From original example  - disabled so that we accept anythng
          types: [
            {
              description: 'Images',
              accept: {
                'image/*': ['.png', '.gif', '.jpeg', '.jpg']
              }
            },
          ],
          excludeAcceptAllOption: true,
         */
        excludeAcceptAllOption: false,
        multiple: true
      }; 

      try {
        fileHandle = await window.showOpenFilePicker(pickerOpts);
      } catch(e) {
        // User cancelled request
      }  
      
      
      if (typeof fileHandle == 'undefined') {
        // User cancelled request
        console.log("User cancelled request");
        return;
      }        

      // ----------------------------------------------------------------------
      // run code with our fileHandle   
      console.log('Returned filehandle array is: ');
      console.log(fileHandle);
      

      // ----------------------------------------------------------------------
      // Process one selected file for import 
      
       /***********************************************************************
        From https://web.dev/file-system-access/
        
        Calling handle.getFile() returns a File object, which contains a blob. 
        To get the data from the blob, call one of its methods, (slice(), 
        stream(), text(), or arrayBuffer()).

        The File object returned by FileSystemFileHandle.getFile() is only 
        readable as long as the underlying file on disk hasn't changed. If the 
        file on disk is modified, the File object becomes unreadable and you'll 
        need to call getFile() again to get a new File object to read the 
        changed data.
        
        const file = await fileHandle.getFile();
        const contents = await file.text();
        
        For the majority of use cases, you can read files in sequential order 
        with the stream(), text(), or arrayBuffer() methods. For getting random 
        access to a file's contents, use the slice() method.
        ***********************************************************************/
      // ----------------------------------------------------------------------
      async function handleFile(f) {
        
        const file = await f.getFile(); 
        
        // MDS Note: Look at file.type in the console to get the mime type to 
        // figure out how to use options
        
        


        const contents = await file.text();
        console.log('handleFile("' + f.name + '")');
        blockLog(contents, f.name + " Content", true);;        
        return;
        
        var title = "<h4>" + f.name;
        var fileContent = "<ul>";
        var dateBefore = new Date();

        JSZip.loadAsync(f)                                 // 1) read the Blob
        .then(function(zip) {
          var dateAfter = new Date();
          title = title + "<span class='small'>" + " (loaded in " + (dateAfter - dateBefore) + "ms)" + "</span>";

          zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
            fileContent = fileContent + "<li>";
            fileContent = fileContent + zipEntry._data;
            fileContent = fileContent + "</li>";
            console.log(zipEntry);
          });
          fileContent = fileContent + "</ul>";
          blockLog(fileContent, title, true);
        }, function (e) {
            blockLog("<div>" + "Error reading " + f.name + ": " + e.message + "</div>", "Error", true);
        });
      }
      
      // Look at each fileHandle element and process it
      for (var i = 0; i < fileHandle.length; i++) {
          handleFile(fileHandle[i]);
      };
      // ----------------------------------------------------------------------

    };




    getAndProcessFileList();
  }
};
