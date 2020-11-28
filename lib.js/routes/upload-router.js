const path = require('path');
const express = require('express');
const multer  = require('multer');
const converter = require('../api/converter');

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

router.post('/upload', upload.single('file'), async (req, res) => {
  const data = await converter.validateSource(path.join(uploadDir, req.file.originalname));
  const result = Object.assign(data, req.file);
  res.json(result);
});

module.exports = router;