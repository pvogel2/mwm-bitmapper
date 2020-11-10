var createError = require('http-errors');
var express = require('express');

const uploadRouter = require('./lib.js/routes/upload-router'); 
const convertRouter = require('./lib.js/routes/convert-router'); 

var app = express();

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

app.use(uploadRouter);
app.use(convertRouter);

app.use('/res/js/three/', express.static('node_modules/three/'));
app.use('/res/js/mwm/', express.static('node_modules/mwm-renderer/dist/'));
app.use('/res/js/pngjs/', express.static('node_modules/pngjs/'));

app.use('/res/js/react/', express.static('node_modules/react/'));
app.use('/res/js/react-dom/', express.static('node_modules/react-dom/'));

app.use('/res/js/assets/', express.static('res/js/'));
app.use('/res/css/', express.static('res/css/'));
app.use('/res/img/', express.static('res/img/'));

app.use('/dist/', express.static('build/'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log('ERROR:', err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
});

module.exports = app;