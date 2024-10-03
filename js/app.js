/*
  app.js

  Required for the indexedDB polyfill filesystem ???
  
  ------------------------------------------------------------------------------

  Revision History
  ================
  16 Mar 2020 MDS Added header
  17 Mar 2020 MDS Modified for headless function

  ------------------------------------------------------------------------------
 */
var filer = new Filer();

var currentLi = 1; // Keeps track of current highlighted el for keyboard nav.

var fsInfo = {};
fsInfo.head = 'filesystem:file:///temporary';
fsInfo.cwd = '';
fsInfo.dirList = '';
fsInfo.errors = '';
fsInfo.filePreview = '';
fsInfo.log = [];
var dirEntries = []; // Cache of current working directory's entries.

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
//
// ----------------------------------------------------------------------------
// 
//
function onError(e) {
  fsInfo.errors.textContent = e.name;
}
//
// ----------------------------------------------------------------------------
// 
//
function refreshFolder(e) {
  fsInfo.errors.textContent = ''; // Reset errors.

  // Open the FS, otherwise list the files.
  if (filer && !filer.isOpen) {
    openFS();
  } else {
    filer.ls('.', function(dirEntries) {
      renderEntries(dirEntries);
    }, onError);
  }
}
//
// ----------------------------------------------------------------------------
// 
//
function addEntryToList(entry, opt_idx) {

  // If an index isn't passed, we're creating a dir or adding a file. Append it.
  if (opt_idx == undefined) {
    dirEntries.push(entry);
  }

  var idx = (opt_idx === undefined) ? dirEntries.length - 1 : opt_idx;
}
//
// ----------------------------------------------------------------------------
// 
//
function renderEntries(resultEntries) {
  dirEntries = resultEntries; // Cache the result set.
  if (!resultEntries.length) {
    return;
  }

  resultEntries.forEach(function(entry, i) {
    entry.getMetadata(function(meta) {
      console.log(meta.modificationTime, meta.size);
    }, function(e) {
      console.log(e.name);
    });
    addEntryToList(entry, i);
  });
}
//
// ----------------------------------------------------------------------------
// 
//
function openFS() {
  try {
    filer.init({persistent: false, size: 1024 * 1024}, function(fs) {
      fsInfo.log.push(fs.root.toURL());
      fsInfo.log.push('<p>Opened: ' + fs.name, + '</p>');

      setCwd('/'); // Display current path as root.
      refreshFolder();
    }, function(e) {
      if (e.name == 'SECURITY_ERR') {
        fsInfo.errors.textContent = 'SECURITY_ERR: Are you running in incognito mode?';
        return;
      }
      onError(e);
    });
  } catch(e) {
    if (e.code == FileError.BROWSER_NOT_SUPPORTED) {
      dirEntries.push('BROWSER_NOT_SUPPORTED');
    }
  }
}
//
// ----------------------------------------------------------------------------
// 
//
function setCwd(path) {
  var rootPath = filer.pathToFilesystemURL('/');

  if (path == '/' || (path == '..' && (rootPath == fsInfo.cwd))) {
    fsInfo.cwd = filer.pathToFilesystemURL('/');
    return;
  } else if (path == '..') {
    var parts = fsInfo.cwd.split('/');
    parts.pop();
    path = parts.join('/');
    if (path == rootPath.substring(0, rootPath.length - 1)) {
      path += '/';
    }
  }
  fsInfo.cwd = filer.pathToFilesystemURL(path);
  return fsInfo.cwd;
}
//
// ----------------------------------------------------------------------------
// 
//
function mkdir(name, opt_callback) {
  if (!name) return;

  fsInfo.errors.textContent = ''; // Reset errors.

  try {
    if (opt_callback) {
      filer.mkdir(name, false, opt_callback, onError);
    } else {
      filer.mkdir(name, true, addEntryToList, onError);
    }
  } catch(e) {
    fsInfo.log.push('<p class="error">' + e + '</p>');
  }
}
//
// ----------------------------------------------------------------------------
// 
//
function cd(i, opt_callback) {
  fsInfo.errors.textContent = ''; // Reset errors.

  if (i == -1) {
    var path = '..';
  } else {
    var path = dirEntries[i].fullPath;
  }

  setCwd(path);

  if (opt_callback) {
    filer.ls(path, opt_callback, onError);
  } else {
    filer.ls(path, renderEntries, onError);
  }
}
//
// ----------------------------------------------------------------------------
// 
//
function openFile(i) {
  fsInfo.errors.textContent = ''; // Reset errors.
  var fileWin = self.open(toURL(dirEntries[i]), 'fileWin');
}
//
// ----------------------------------------------------------------------------
// 
//
function newFile(name) {
  if (!name) return;

  fsInfo.errors.textContent = ''; // Reset errors.

  try {
    filer.create(name, true, addEntryToList, onError);
  } catch(e) {
    onError(e);
  }
}
//
// ----------------------------------------------------------------------------
// 
//
function writeFile(fileName, file, opt_rerender) {
  if (!file) return;

  var rerender = opt_rerender == undefined ? true : false;

  fsInfo.errors.textContent = ''; // Reset errors.

  filer.write(fileName, {data: file, type: file.type},
    function(fileEntry, fileWriter) {
      if (rerender) {
        addEntryToList(fileEntry);
        filer.ls('.', renderEntries, onError); // Just re-read this dir.
      }
    },
    onError
  );
}
//
// ----------------------------------------------------------------------------
// 
//
function rename(el, i) {
  fsInfo.errors.textContent = ''; // Reset errors.

  filer.mv(dirEntries[i].fullPath, '.', el.textContent, function(entry) {
    fsInfo.log.push('<p>' + dirEntries[i].name + ' renamed to ' + entry.name + '</p>');
    dirEntries[i] = entry;

    // Fill download link with updated filsystem URL.
    var downloadLink = el.parentElement.querySelector('[download]');
    if (downloadLink) {
      downloadLink.href = toURL(entry);
    }
  });
}
//
// ----------------------------------------------------------------------------
// 
//
function remove(link, i) {
  fsInfo.errors.textContent = ''; // Reset errors.

  var entry = dirEntries[i];

  if (!confirm('Delete ' + entry.name + '?')) {
    return;
  }

  filer.rm(entry, function() {

  }, onError);
}
//
// ----------------------------------------------------------------------------
// 
//
function copy(el, i) {
  fsInfo.errors.textContent = ''; // Reset errors.

  filer.cp(dirEntries[i], el.textContent, function(entry) {
    fsInfo.log.push('<p>' + dirEntries[i].name + ' renamed to ' + entry.name + '</p>');
    dirEntries[i] = entry;
  });
}

//
// ----------------------------------------------------------------------------
// 
//
function onImport(e) {
  var files = e.target.files;
  if (files.length) {
    var count = 0;
    Util.toArray(files).forEach(function(file, i) {

      var folders = file.webkitRelativePath.split('/');
      folders = folders.slice(0, folders.length - 1);

      // Add each directory. If it already exists, then a noop.
      mkdir(folders.join('/'), function(dirEntry) {
        var path = file.webkitRelativePath;

        ++count;

        // Write each file by it's path. Skipt '/.' (which is a directory).
        if (path.lastIndexOf('/.') !=  path.length - 2) {
          writeFile(path, file, false);
          if (count == files.length) {
            filer.ls('.', renderEntries, onError); // Rerender view on final file.
          }
        }
      });
    });
  }
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
