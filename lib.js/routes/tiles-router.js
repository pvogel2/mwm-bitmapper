const path = require('path');
const express = require('express');
const converter = require('../api/converter');
const targetPath = path.join(__dirname, '../../data/converted');
const sourcePath = path.join(__dirname, '../../data/uploads');
const router = express.Router();

router.get('/tiles', async (req, res) => {
  const fileName = req.query.filename;
  const tileSize = req.query.tileSize || 256;

  const sourceFile = path.join(sourcePath, fileName);
  const targetName = `bmtls_${fileName}`;
  const targetFile = path.join(targetPath, targetName);
  try {
    const result = await converter.calcTiles(sourceFile, targetFile, tileSize);
    res.json(result);
  } catch(err) {
    res.status(500).end();
  }
});

module.exports = router;