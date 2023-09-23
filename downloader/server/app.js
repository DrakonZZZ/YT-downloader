import express from 'express';
import { outputdirPATH } from '../public/js/path.js';
import downloadVideo from '../public/js/downloader.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.post('/download', async (req, res) => {
  try {
    const videoUrl = req.body.videoUrl;
    const outputdir = outputdirPATH;

    const progressCB = (progress, videoTitle) => {
      res.json({ progress, videoTitle });
    };

    const completedCB = () => {
      res.json({ progress: 100, videoTitle: 'Download Completed!' });
    };

    await downloadVideo(videoUrl, outputdir, progressCB, completedCB);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
