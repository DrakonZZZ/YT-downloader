const { downloadVideo, os, path, downloadProgress, downloadComplete } =
  window.stage;
const homeDir = os.homedir();

const downloadButton = document.getElementById('downloadButton');
const videoInput = document.getElementById('videoURL');
const progressBar = document.getElementById('progressBar');
const youtubeTitle = document.getElementById('youtubeTitle');

let PATH;

switch (os.platform()) {
  case 'win32':
    PATH = path.join(homeDir, 'Downloads');
    break;
  case 'darwin':
    PATH = path.join(homeDir, 'Downloads');
    break;
  case 'linux':
    PATH = path.join(homeDir, 'Downloads');
    break;
  default:
    PATH = path.join(homeDir, 'Downloads');
    break;
}

console.log(window.stage);

downloadButton.addEventListener('click', async () => {
  const videoURL = videoInput.value;
  const outputDir = PATH;

  progressBar.value = 0;
  youtubeTitle.textContent = '';

  downloadProgress((progress, videoTitle) => {
    console.log(`Progress: ${progress}%`);
    console.log(`Video Title: ${videoTitle}`);
    progressBar.value = progress;
    youtubeTitle.textContent = `Downloading: ${videoTitle}`;
  });

  try {
    await downloadVideo(videoURL, outputDir);
    downloadComplete();
  } catch (error) {
    console.log(`Error downloading: ${error}`);
  }
});
