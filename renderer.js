const { downloadVideo, os, path, ipcRenderer } = window.stage;
const homeDir = os.homedir();

const downloadButton = document.getElementById('downloadButton');
const videoInput = document.getElementById('videoURL');
const progressBar = document.getElementById('progressBar');

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

downloadButton.addEventListener('click', async () => {
  const videoURL = videoInput.value;
  const outputDir = PATH;

  try {
    await downloadVideo(videoURL, outputDir);

    ipcRenderer.on('download-progress', (e, progress) => {
      console.log(progress);
      progressBar.min = progress;
    });
  } catch (error) {
    console.log(`Error downloading: ${error}`);
  }
});
