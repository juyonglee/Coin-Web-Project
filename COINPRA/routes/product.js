var express = require('express');
var router = express.Router();
var coinInfo = require('../models/coinInfo');
var eachCoin = require('../models/coin');

router.get('/fnbCreate', function(req, res, next) {
    eachCoin.create({round: 2, coin_name: "FNB",
        price: 100,
        total_count: 20000000,
        selling_count: 0}).then(
            (a)=>{
                console.log("저장");
                console.log(a);
            },
            (err)=>{
                console.log(err);
            }
        )}
);

router.get('/pluCreate', function(req, res, next) {
    res.redirect('/');
});

module.exports = router;
