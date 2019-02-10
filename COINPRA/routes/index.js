var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  // if(req.user) {
  //   res.render('index', { title: "안녕하세요, " + req.user.username + "님"});
  // } else {
  //   res.render('index', { title: 'Express'});
  // }
  res.render('test');
});

router.get('/PLUINFO', function(req, res, next){
  var data =fs.readFileSync('public/pdf/PLU.pdf');
  res.contentType("application/pdf");
  res.send(data);
});

router.get('/TOXIINFO', function(req, res, next){
  var data =fs.readFileSync('public/pdf/TOXI.pdf');
  res.contentType("application/pdf");
  res.send(data);
});

router.get('/popup', function(req, res, next){
  var data =fs.readFileSync('public/images/popupImg.png');
  res.contentType("image/png");
  res.send(data);
});

router.get('/personalInfo', function(req, res, next){
  var data =fs.readFileSync('public/pdf/personal.pdf');
  res.contentType("application/pdf");
  res.send(data);
});

router.get('/usageInfo', function(req, res, next){
  var data =fs.readFileSync('public/pdf/usageInfo.pdf');
  res.contentType("application/pdf");
  res.send(data);
});


module.exports = router;
