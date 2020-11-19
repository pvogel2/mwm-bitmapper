const path = require('path');
const express = require('express');
var bodyParser = require('body-parser');
const converter = require('../api/converter');
const targetPath = path.join(__dirname, '../../data/converted');
const sourcePath = path.join(__dirname, '../../data/uploads');

const router = express.Router();

const jsonParser = bodyParser.json();

router.use('/converted', express.static(targetPath));

router.post('/convert', jsonParser, async (req, res, next) => {
  const fileName = req.body.sourcefile;
  const extName = path.extname(fileName);

  const sourceFile = path.join(sourcePath, fileName);
  const targetName = `bmout_${path.basename(fileName, extName)}.png`;
  const targetFile = path.join(targetPath, targetName);
  const result = await converter.calcHeightmap(sourceFile, targetFile);
  res.json(result);
});

module.exports = router;