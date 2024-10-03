# Terminal
A configurable browser based javascript shell complete with virtual file system.  This shell uses a bash style command system, and is a hybrid between DOS and Linux commands.

This project is written in vanilla Javascript, and is installed and run on a client system.  Aside from a Javascript browser, all dependancies are included in the project (ie no need for Node.js, React, jQuery etc etc).  This code will consequently require CORS Access-Control-Allow-Origin enabled to run.

Start by opening terminal.html in a browser window, and type MAN from the subsequent command prompt.

This is a running program but is still a work in progress, so not all features are complete.  The code was developed for the Chrome browser under Microsoft Windows, so may render differently under other browsers.  Limited testing has been completed under *nix and MacOS environments, with no real operability tests on the iOS environment for an iPhone and iPad.

TODO:
  Finish IMPORT command and integrate IMPORT and EXPORT into main command shell
  Add AES encrypted passwords for login, complete with user level priveledges
  Add basic fopen, fclose, fwrite function under FileSystemWrapper
  
