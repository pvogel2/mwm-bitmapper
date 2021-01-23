const path = require('path');
const express = require('express');
const converter = require('../api/converter');
const targetPath = path.join(__dirname, '../../data/converted');
const sourcePath = path.join(__dirname, '../../data/uploads');

const router = express.Router();

router.use('/converted', express.static(targetPath));

router.get('/tiles', async (req, res) => {
  const fileName = req.query.filename || 'terrain.png';
  const tileSize = req.query.tileSize || 256;

  const sourceFile = path.join(sourcePath, fileName);
  const targetName = `bmtls_${fileName}`;
  const targetFile = path.join(targetPath, targetName);
  console.log('>>>>>>>>>>>>', sourceFile, targetFile, tileSize);
 const result = await converter.calcTiles(sourceFile, targetFile, tileSize);
  res.json(result);
});

module.exports = router;