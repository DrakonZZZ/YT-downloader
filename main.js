const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'), // Path to your HTML file
      protocol: 'file:',
      slashes: true,
    })
  );

  ipcMain.on('download-progress', (e, progress) => {
    win.webContents.send('update-progress', progress);
  });

  ipcMain.on('download-complete', () => {
    win.webContents.send('download-complete');
  });
};

app.on('ready', createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
