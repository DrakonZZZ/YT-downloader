const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

const downloadVideo = async (videoURL, outputDir, progressCB, completedCB) => {
  try {
    const videoInfo = await ytdl.getInfo(videoURL);

    const highestVideo = videoInfo.formats.find(format => format.qualityLabel === '1080');

    const highestAudio = ytdl.chooseFormat(videoInfo.formats, {
      audioCodec: highestVideo.audioCodec,
    });

    console.log(videoInfo);

    const videoStream = ytdl(videoURL, { format: highestVideo });
    const audioStream = ytdl(videoURL, { format: highestAudio });

    const videopath = `${outputDir}/${videoInfo.videoDetails.title}video.${highestVideo.container}`;
    const audiopath = `${outputDir}/${videoInfo.videoDetails.title}audio.${highestAudio}`;

    const outputVideoFile = fs.createWriteStream(videopath);
    const outputAudioFile = fs.createWriteStream(audiopath);

    videoStream.pipe(outputVideoFile);
    audioStream.pipe(outputAudioFile);

    videoStream.on('progress', (chunkLength, downloaded, total) => {
      const progress = (downloaded / total) * 100;
      // console.log(`Progress: ${progress.toFixed(2)}%`);
      progressCB(progress);
    });

    videoStream.on('end', async () => {
      console.log('completed');

      await mergeAudioVideo(ffmpegPath, videopath, audiopath, outputDir);

      completedCB();
    });

    return;
  } catch (error) {
    console.error(`Error download: ${error}`);
  }
};

const mergeAudioVideo = async (
  ffmpegPath,
  videoFilePath,
  audioFilePath,
  outputDir
) => {
  console.log(videoFilePath, audioFilePath, outputDir);
  try {
    const mergedOutput = fs.createWriteStream(
      `${outputDir}/merged_video_audio.mp4`
    );

    ffmpeg()
      .setFfmpegPath(ffmpegPath)
      .input(videoFilePath)
      .input(audioFilePath)
      .videoCodec('copy')
      .audioCodec('opus')
      .on('error', (err) => {
        console.error('Error:', err);
      })
      .on('end', () => {
        console.log('Merging completed');

        fs.unlinkSync(videoFilePath);
        fs.unlinkSync(audioFilePath);
      })
      .pipe(mergedOutput, { end: true });
  } catch (error) {
    console.error(`Error merging audio and video: ${error}`);
  }
};

module.exports = { downloadVideo };
