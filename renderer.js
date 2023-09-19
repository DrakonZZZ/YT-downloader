const { downloadVideo, os, path } = window.electron;

const homeDir = os.homedir();

const downloadButton = document.getElementById('downloadButton');
const videoInput = document.getElementById('videoURL');

let PATH;

switch (process.platform) {
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

console.log(downloadButton);

downloadButton.addEventListener('click', async () => {
  const videoURL = videoInput.value;
  const outputDir = PATH;

  try {
    await window.electron.downloadVideo(videoURL, outputDir);
  } catch (error) {
    console.log(`Error downloading: ${error}`);
  }
});
