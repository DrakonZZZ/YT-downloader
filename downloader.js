const fs = require('fs');
const ytdl = require('ytdl-core');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const downloadVideo = async (videoURL, outputDir, progressCB, completedCB) => {
  try {
    const videoInfo = await ytdl.getInfo(videoURL);

    const videoStream = ytdl(videoURL, { quality: 'highestvideo' });
    const audioStream = ytdl(videoURL, { quality: 'highestaudio' });

    const videopath = `${outputDir}/${videoInfo.videoDetails.title}video.mp4`;
    const audiopath = `${outputDir}/${videoInfo.videoDetails.title}audio.mp4a`;

    const outputVideoFile = fs.createWriteStream(videopath);
    const outputAudioFile = fs.createWriteStream(audiopath);

    videoStream.pipe(outputVideoFile);
    audioStream.pipe(outputAudioFile);

    videoStream.on('progress', (chunkLength, downloaded, total) => {
      const progress = (downloaded / total) * 100;
      progressCB(progress);
    });

    videoStream.on('end', async () => {
      console.log('Video download completed');

      await mergeAudioVideo(
        videoInfo,
        ffmpegPath,
        videopath,
        audiopath,
        outputDir,
        completedCB
      );
    });
  } catch (error) {
    console.error(`Error download: ${error}`);
  }
};

const mergeAudioVideo = async (
  videoInfo,
  ffmpegPath,
  videoFilePath,
  audioFilePath,
  outputDir,
  completedCB
) => {
  try {
    const ffmpegProcess = spawn(ffmpegPath, [
      '-i',
      videoFilePath,
      '-i',
      audioFilePath,
      '-map',
      '0:v',
      '-map',
      '1:a',
      '-c:v',
      'copy',
      '-c:a',
      'aac',
      '-strict',
      'experimental',
      '-y',
      `${outputDir}/${videoInfo.videoDetails.title}.mp4`,
    ]);

    ffmpegProcess.on('close', () => {
      console.log('Merging completed');

      fs.unlinkSync(videoFilePath);
      fs.unlinkSync(audioFilePath);

      completedCB();
    });
  } catch (error) {
    console.error(`Error merging audio and video: ${error}`);
  }
};

module.exports = { downloadVideo };
