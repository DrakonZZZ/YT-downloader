const { app, BrowserWindow, ipcMain } = require('electron');
const execa = require('execa');
// const path = require('path');

// const appPath = app.getAppPath();

// const ytPath = path.join(appPath, 'utils', 'yt-dlp.exe');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
});
