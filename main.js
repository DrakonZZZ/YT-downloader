const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

console.log(path.join(__dirname, 'preload.js'));
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
    },
  });

  win.loadFile('index.html');

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
