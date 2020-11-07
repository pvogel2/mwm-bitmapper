const express = require('express');
const multer  = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage })

const router = express.Router();

router.post('/upload', upload.single('file'), (req, res) => {
  console.log('Data:', req.file, req.body);
  res.json(req.file);
});

module.exports = router;