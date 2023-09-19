const fs = require('fs');
const ytdl = require('ytdl-core');

const downloadVideo = async (videoURL, outputDir, progressCB, completedCB) => {
  try {
    const videoInfo = await ytdl.getInfo(videoURL);
    const videoStream = ytdl(videoURL, { quality: 'highest' });

    const outputFile = fs.createWriteStream(outputDir);
    videoStream.pipe(outputFile);

    videoStream.on('progress', (chunkLength, downloaded, total) => {
      const progress = (downloaded / total) * 100;
      progressCB(progress);
    });

    videoStream.on('end', () => {
      completeCallback();
    });

    return;
  } catch (error) {
    console.error(`Error download: ${error}`);
  }
};

module.exports = { downloadVideo };
