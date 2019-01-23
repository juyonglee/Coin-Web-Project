var express = require('express');
var router = express.Router();
var sellingInfo = require('../models/coinInfo');
var eachCoin = require('../models/coin');
var Account = require('../models/account');

router.get('/fnbCreate', function(req, res, next) {
    eachCoin.create({round: 2, coin_name: "FNB",
        price: 100,
        total_count: 20000000,
        selling_count: 0}).then(
            (result)=>{
                console.log("저장");
                res.redirect('/');  
            },
            (err)=>{
                console.log(err);
                res.redirect('/');
            }
        )}
);

router.get('/pluCreate', function(req, res, next) {
    eachCoin.create({round: 3, coin_name: "PLU",
        price: 100,
        total_count: 15000000,
        selling_count: 0}).then(
            (result)=>{
                console.log("저장");
                res.redirect('/');  
            },
            (err)=>{
                console.log(err);
                res.redirect('/');
            }
        )}
);

router.post('/fnbPurchase', function(req, res, next) {
    eachCoin.findOne({coin_name:'FNB'}).then(
        (product)=>{
            if(product.total_count >= req.body.buy_count) {
                console.log("구매 가능");
                //  구매내역 생성
                sellingInfo.create({coin_name: product.coin_name, price: req.body.buy_count * product.price, buy_count: req.body.buy_count, buy_state: false, buyer:req.user}).then(
                    (result)=> {
                        //  사용자 판매기록
                        console.log("buy_count",req.body.buy_count);
                        console.log("eq.user.mFNB",req.user.FNB);
                        var userTotalCount = parseInt(req.body.buy_count) + parseInt(req.user.FNB);
                        console.log(userTotalCount);
                        console.log(typeof(userTotalCount));
                        Account.update({username:req.user.username}, {$inc: {FNB: req.body.buy_count}, $push: {buy_info:result.id}}).then(
                            (result)=>{
                                console.log("구매 성공!");
                                res.redirect('/');
                            },
                            (err)=>{
                                console.log("구매 Error");
                                res.redirect('/');
                            }
                        )
                    },
                    (err)=> {
                        console.log("구매 실패!");
                        console.log(err);
                        res.redirect('/');
                    }
                );
            } else {
                console.log("수량이 부족합니다.");
            }
        },
        (err)=>{
            console.log(err);
            next(err);
        }
    );
});

router.post('/pluPurchase', function(req, res, next) {
    
});

module.exports = router;
