const path = require('path');
const express = require('express');
const multer  = require('multer');

const uploadDir = path.join(__dirname, '../../data/uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage })

const router = express.Router();

router.use('/uploaded', express.static(uploadDir));

router.post('/upload', upload.single('file'), (req, res) => {
  console.log('Upload data:', req.file, req.body);
  res.json(req.file);
});

module.exports = router;