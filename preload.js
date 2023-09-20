const { contextBridge, ipcRenderer } = require('electron');
const os = require('node:os');
const path = require('node:path');
const { downloadVideo } = require('./downloader.js');

contextBridge.exposeInMainWorld('stage', {
  os: os,
  path: path,
  ipcRenderer: ipcRenderer,
  downloadVideo: async (videoUrl, outputDir) => {
    const progressCB = (progress) => {
      ipcRenderer.send('download-progress', progress);
    };

    const completedCB = () => {
      ipcRenderer.send('download-complete');
    };

    const status = await downloadVideo(
      videoUrl,
      outputDir,
      progressCB,
      completedCB
    );

    if (status) {
      ipcRenderer.send('download-status', 'success');
    } else {
      ipcRenderer.send('download-status', 'error');
    }
  },
});
