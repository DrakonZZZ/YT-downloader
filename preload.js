const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { downloadVideo } = require('./downloader');

contextBridge.exposeInMainWorld('electron', {
  os: os,
  path: path,
});

contextBridge.exposeInMainWorld('electron', {
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

    if (success) {
      ipcRenderer.send('download-status', 'success');
    } else {
      ipcRenderer.send('download-status', 'error');
    }
  },
});
