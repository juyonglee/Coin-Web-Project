var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('saleList', { title: "test"});
});

module.exports = router;