var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//  Passport Setting 추가
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//  MongoDB 
var mongoose = require('mongoose');
mongoose.Promise = global.Promise; 
var AutoIncrement = require('mongoose-sequence')(mongoose);
var mongoUrl = 'mongodb://localhost:27017/PROJECT';
mongoose.connect(mongoUrl, {useMongoClient: true});
var db = mongoose.connection;
db.once('open', function(){
  console.log("MongoDB Connection!");
});

//  Model 추가
var Account = require('./models/account');

//  Router Loading
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//  Passport Setup & Seesion 사용을 위한 express-session 추가
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false})
);
app.use(passport.initialize());
app.use(passport.session());

//  Router Setting
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
