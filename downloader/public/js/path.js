import os from 'os';
const homeDir = os.homedir();
import path from 'path';

export let outputdirPATH;

switch (os.platform()) {
  case 'win32':
    outputdirPATH = path.join(homeDir, 'Downloads');
    break;
  case 'darwin':
    outputdirPATH = path.join(homeDir, 'Downloads');
    break;
  case 'linux':
    outputdirPATH = path.join(homeDir, 'Downloads');
    break;
  default:
    outputdirPATH = path.join(homeDir, 'Downloads');
    break;
}
