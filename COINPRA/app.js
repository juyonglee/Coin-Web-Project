var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//  Passport Setting 추가
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

// MongoDB
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var mongoUrl = 'mongodb://localhost:27017/PROJECT';
mongoose.connect(mongoUrl, {useNewUrlParser: true, useCreateIndex: true});
var db = mongoose.connection;
db.once('open', function(){
  console.log("MongoDB No Problem!");
  // var MemberInfo = require('./models/memberInfo');
  // MemberInfo.create({invitation:1000000}, function(err, data){
  //   console.log(err);
  //   console.log(data);
  // });
});

//  Model 추가
var Account = require('./models/account');


//  Router Loading
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var accountRouter = require('./routes/account');
var productRouter = require('./routes/product');
var managerRouter = require('./routes/manager');
var mainRouter = require('./routes/main');
var salelist = require('./routes/saleList');

var app = express();

// view engine setup
// Array 형식으로 view search 범위를 추가
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/manager')]);
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
app.use('/account', accountRouter);
app.use('/product', productRouter);
app.use('/manager', managerRouter);
app.use('/main', mainRouter);
app.use('/salelist', salelist);


//  Passport Configure
passport.use(new LocalStrategy(function(username, password, done){
  console.log("Passport Configure!!");
  Account.findOne({username:username}, function(err, userObject){
    if(err) {
      console.log(err);
      return done(err);
    }
    if(userObject) {
      const crypto = require('crypto');
      crypto.pbkdf2(password, userObject.salt, 100000, 64, 'sha512', function(err, derivedKey) {
        if(userObject.password != derivedKey.toString('base64')) return done(null, false, {message: "ID와 비밀번호를 확인해 주세요."});
        return done(null, userObject);
      });
    } else {
      return done(null, false, {message: "ID와 비밀번호를 확인해 주세요."});
    }
  });
}));

//  Passport Sesssion Message
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

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
