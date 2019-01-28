var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('saleList', { title: "test"});
});

// 1-3 페이지
router.get('/detail', function(req, res, next) {
    res.render('saleDetail', { title: "test"});
});
module.exports = router;
