import { outputdirPATH } from './path';

const progressValue = document.getElementById('progressValue');
const videoTitle = document.getElementById('videoTitle');

function updateProgress(progress, title) {
  progressValue.textContent = progress + '%';
  videoTitle.textContent = 'Video Title: ' + title;
}

const downloadForm = document.getElementById('downloadForm');

downloadForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const videoURL = document.getElementById('videoUrl').value;
  const outputDir = outputdirPATH;

  const fetcher = async () => {
    try {
      const response = await fetch('/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `videoUrl=${encodeURIComponent(videoURL)}`,
      });

      if (!response.ok) {
        throw new Error('Download request failed');
      }

      const data = await response.json();

      updateProgress(data.progress, data.videoTitle);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  fetcher();
});
