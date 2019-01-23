var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user) {
    res.render('index', { title: "안녕하세요, " + req.user.username + "님"});
  } else {
    res.render('index', { title: 'Express'});
  }
});

module.exports = router;
