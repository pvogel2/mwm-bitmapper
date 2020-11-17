const path = require('path');
const express = require('express');
var bodyParser = require('body-parser');
const converter = require('../api/converter');
// const uploadDir = path.join(__dirname, '../../data/uploads');
const targetPath = path.join(__dirname, '../../data/converted');
const sourcePath = 'data/uploads';

const router = express.Router();

const jsonParser = bodyParser.json();

router.use('/converted', express.static(targetPath));

router.post('/convert', jsonParser, async (req, res, next) => {
  const fileName = req.body.sourcefile;
  const sourceFile = `${data/uploads}/${fileName}`;
  const targetFile = `${targetPath}/test`;
  const result = await converter.calcHeightmap(sourceFile, targetFile);
  res.json(result);
});

module.exports = router;