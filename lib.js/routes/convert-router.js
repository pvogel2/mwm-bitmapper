const path = require('path');
const express = require('express');
var bodyParser = require('body-parser');
const converter = require('../api/converter');
// const uploadDir = path.join(__dirname, '../../data/uploads');
const convertDir = path.join(__dirname, '../../data/converted');

const router = express.Router();

const jsonParser = bodyParser.json();

router.use('/converted', express.static(convertDir));

router.post('/convert', jsonParser, async (req, res, next) => {
  const result = await converter.calcHeightmap(req.body.sourcefile);
  console.log('result', result);
  res.json(result);
});

module.exports = router;