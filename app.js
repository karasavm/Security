var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/config');
const formidable = require('express-formidable');


var app = express();

// -------  MONGO DB -------
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/security_tests');
require('./models/users');
require('./models/securities');
require('./models/clients');
require('./models/checkpoints');
// -------------------------

require('./config/passport');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.use(formidable({
//   encoding: 'utf-8',
//   uploadDir: './uploads',
//   multiples: true, // req.files to be arrays of files
// }));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'css')));
// app.use(express.static('public'));
app.set('superSecret', config.secret);

var cors = require('cors');

// use it before all route definitions
app.use(cors({origin: '*'}));

app.use('/', require('./routes/index'));
// app.use('/users', require('./routes/users'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
