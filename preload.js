const { contextBridge, ipcRenderer } = require('electron');
const os = require('node:os');
const path = require('node:path');
const { downloadVideo } = require('./downloader.js');

console.log('exposing download functions');
contextBridge.exposeInMainWorld('stage', {
  os: os,
  path: path,
  downloadProgress: (handler) => {
    ipcRenderer.on('download-progress', (e, progress, videoTitle) =>
      handler(progress, videoTitle)
    );
  },
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
  downloadComplete: () => ipcRenderer.on('download-complete', (e) => {}),
});
