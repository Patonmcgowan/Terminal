/*
  aliases.js

  Contains definition of aliases (commands that can be typed as an alias for 
  another command) and a function to return the actual command from the 
  entered command:
    - because they are the same eg. HELP points to MAN, or
    - to be tolerant of typos eg. CALENDER points to CALENDAR, or
    - to allow shortened command entry eg. MA points to MAN
  
  Aliases can be defined in two ways:
    - as an entry into the alias array
    - as a definition of the final command in the .isAliasFor property of the 
      cmd object (this will cause the command to be displayed when 'MAN' is
      entered).
  ------------------------------------------------------------------------------

  Revision History
  ================
  11 Feb 2020 MDS Original

  ------------------------------------------------------------------------------
 */
var alias = new Array()

alias['A'] = 'ABOUT';
alias['AB'] = 'ABOUT';
alias['AS'] = 'ASCII';
alias['ASC'] = 'ASCII';
alias['ASCI'] = 'ASCII';
alias['B'] = 'BASIC';
alias['BA'] = 'BASIC';
alias['BYE'] = 'LOGOFF';
alias['C'] = 'CLS';
alias['CA'] = 'CALENDAR';
alias['CALC'] = 'CALCULATE';
alias['CALENDER'] = 'CALENDAR';
alias['CL'] = 'CLS';
alias['C'] = 'CONVERT';
alias['CO'] = 'CONVERT';
alias['CODE'] = 'CODEINFO';
alias['CON'] = 'CONVERT';
alias['CONV '] = 'CONVERT';
alias['COP'] = 'CP';
alias['COPY'] = 'CP';
alias['D'] = 'TIME';
alias['DA'] = 'TIME';
alias['DE'] = 'DEFINE';
alias['DEF'] = 'DEFINE';
alias['DIR/W'] = 'DIR';
alias['E'] = 'EXPLORE';
alias['EX'] = 'EXPLORE';
alias['EXP'] = 'EXPORT';
alias['F'] = 'FRENCHTIME';
alias['FI'] = 'EXPLORER';
alias['FILES'] = 'EXPLORER';
alias['FR'] = 'FRENCHTIME';
alias['H'] = 'HOME';
alias['HE'] = 'MAN';
alias['HO'] = 'HOME';
alias['HOM'] = 'HOME';
alias['I'] = 'IMPORT';
alias['IM'] = 'IMPORT';
alias['IMP'] = 'IMPORT';
alias['K'] = 'EXIT';
alias['KI'] = 'EXIT';
alias['KILL'] = 'EXIT';
alias['L'] = 'LOG';
alias['LO'] = 'LOG';
alias['M'] = 'MAN';
alias['MA'] = 'MAN';
alias['MD'] = 'MKDIR';
alias['MOV'] = 'MV';
alias['MOVE'] = 'MV';
alias['Q'] = 'EXIT';
alias['QU'] = 'EXIT';
alias['QUIT'] = 'EXIT';
alias['RD'] = 'RM';
alias['SL'] = 'SLEEPYBYES';
alias['SLEEP'] = 'SLEEPYBYES';
alias['T'] = 'TIME';
alias['TE'] = 'TEST';
alias['TEM'] = 'TEMPLATES';
alias['TEMP'] = 'TEMPLATES';
alias['TEMPLATE'] = 'TEMPLATES';
alias['TI'] = 'TIME';
alias['TO'] = 'TODO';
alias['TR'] = 'TRAIN';
alias['TRAN'] = 'TRANSLATE';
alias['TRANS'] = 'TRANSLATE';
alias['V'] = 'ABOUT';
alias['VE'] = 'ABOUT';
alias['VERSION'] = 'ABOUT';
alias['WH'] = 'WHOAMI';
alias['WHO'] = 'WHOAMI';

//
// ----------------------------------------------------------------------------
// Return the 'real' command for the passed string - this allows the user to 
// mistype or type an abbreviation of a command and the system will
// understand it
//
function getAlias(command) {
  command = command.toUpperCase();

  // Look for an isAliasFor property for the command
  if ((cmd[command] != undefined) &&
      (cmd[command].isAliasFor != undefined) && 
      (cmd[command].isAliasFor.length > 0))
    return cmd[command].isAliasFor;

  // Look in the alias array for an alias for the command
  if (alias[command] != undefined)
    return alias[command];

  // Return the command if it is a 'real' command, because there is no better
  // option
  if (cmd[command] != undefined)
    return command;

  // To Do : in here step through all commands and see if this is a shortened 
  // version of one


  // Nothing found
  return '';
}
registerFile(5);
//
// ----------------------------------------------------------------------------
//                               End of file
// ----------------------------------------------------------------------------
//

