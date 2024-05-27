const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const app = express();

const maxSize = 2 * 1024 * 1024; // 2MB

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize }
});

const pathToFfmpeg = '/usr/bin/ffmpeg';
ffmpeg.setFfmpegPath(pathToFfmpeg);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'encode.html'));
});

app.post('/embed', upload.fields([{ name: 'videoFile', maxCount: 1 }, { name: 'textFile', maxCount: 1 }]), (req, res) => {
  const videoPath = req.files['videoFile'][0].path;
  const textPath = req.files['textFile'][0].path;
  const outputPath = 'outputs/steganography_video.mp4';

  // Pastikan direktori 'outputs' ada
  if (!fs.existsSync('outputs')) {
    fs.mkdirSync('outputs');
  }

  fs.readFile(textPath, 'utf8', (err, textData) => {
    if (err) {
      return res.status(500).send('Error reading text file');
    }

    ffmpeg(videoPath)
      .outputOptions('-metadata', `comment=${Buffer.from(textData).toString('base64')}`)
      .save(outputPath)
      .on('end', () => {
        res.download(outputPath, (err) => {
          if (err) {
            console.error('Error during file download:', err);
            res.status(500).send('Error during file download');
          } else {
            fs.unlink(videoPath, () => {});
            fs.unlink(textPath, () => {});
            fs.unlink(outputPath, () => {});
          }
        });
      })
      .on('error', (err) => {
        console.error('Error during processing:', err);
        res.status(500).send('Error during processing');
      });
  });
});

app.post('/extract', upload.single('videoFile'), (req, res) => {
  const videoPath = req.file.path;

  ffmpeg.ffprobe(videoPath, (err, metadata) => {
    if (err) {
      console.error('Error during metadata extraction:', err);
      return res.status(500).send('Error during metadata extraction');
    }

    const comment = metadata.format.tags && metadata.format.tags.comment;
    if (comment) {
      const extractedText = Buffer.from(comment, 'base64').toString('utf8');
      res.send(extractedText);
    } else {
      res.status(404).send('No hidden text found in video');
    }

    fs.unlink(videoPath, () => {});
  });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server started on http://0.0.0.0:3000');
});
