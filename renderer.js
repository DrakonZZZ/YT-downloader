const electron = require('electron');
const { ipcRenderer } = electron;
const ytdl = require('ytdl-core');
const { createWriteStream } = require('node:fs');

const outputDir = process.env.USERPROFILE + '/Downloads';
const progressBar = document.getElementById('progress-bar');

document.addEventListener('DOMContentLoaded', () => {
  const downloadButton = document.getElementById('downloadButton');
  const videoInput = document.getElementById('videoURL');

  downloadButton.addEventListener('click', async () => {
    const videoURL = videoInput.value;
    console.log(videoInput);

    const videoData = await ytdl.getInfo(videoURL);

    const videoStrem = ytdl(videoURL, { quality: 'highest' });

    const outputFile = createWriteStream(outputDir);
    videoStrem.pipe(outputFile);

    videoStrem.on('progress', (chunkLength, downloaded, total) => {
      const progress = (downloaded / total) * 100;
      ipcRenderer.send('download-progress', progress);
      console.log(`Download Progress: ${progress.toFixed(2)}`);
    });

    videoStrem.on('end', () => {
      ipcRenderer.send('download complete');
      console.log('Download complete');
    });

    videoStrem.on('error', (error) => {
      console.error(`Error downloading: ${error}`);
    });
  });
});

ipcRenderer.on('update-progress', (e, progress) => {
  progressBar.style.width = `${progress}%`;
});

ipcRenderer.on('download-complete', (e, progress) => {
  progressBar.style.width = '100%';
  alert('Download complete!');
});
