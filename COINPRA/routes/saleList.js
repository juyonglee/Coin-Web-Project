var express = require('express');
var router = express.Router();

var Account = require('../models/account');
var BuyInfo = require('../models/buyInfo');
var moment = require('moment');

/* GET users listing. */
router.get('/', function(req, res, next) {
    if(req.user) {
        res.render('saleList', { title: "test"});
    } else {
        res.redirect(`/account/signin`);
    }
});

// 1-3 페이지
router.get('/detail', function(req, res, next) {    
    if(req.user) {
        // console.log(req.user.username);
        //req.user.username
        Account.findOne({username: req.user.username}).populate({path:'buy_info', model:BuyInfo}).exec((err, member) => {
            if(err) {
                console.log("User가 존재하지 않습니다.");
                next(err);
            } else {
                // [유정이] - Property와 변수의 이름이 같으면 문제가 생깁니다.
                // const member ={sequence: req., name: "jungee", email: "junge2",phone:"0000", plu:0, fnb: 1};
                //  [유정이] - Hover로 부탁드려요!
                // console.log(req.query.coin);
                // console.log("User가 존재합니다.");
                var totalInfo = [];
                console.log(member.buy_info);
                for(var i=0; i<member.buy_info.length; i++) {
                    // console.log(member.buy_info[i].buy_state);
                    if(member.buy_info[i].buy_state == false) {
                        totalInfo.push(member.buy_info[i]);
                    }
                }
                res.render('saleDetail', { buyInfo: member.buy_info, moment});
            }
        }); 
    } else {
        res.redirect(`/account/signin`);
    }
});

router.post('/depositDelete/:user_id', function(req, res, next) {
    BuyInfo.findOne({_id:req.params.user_id}).exec((err, result)=> {
        if(err) {
            console.log(err);
            next(err);
        }
        Account.update({_id: result.buyer}, {$pull: {buy_info: req.params.user_id}}).exec((err, result)=> {
            if(err) {
                console.log(err);
                next(err);
            }
            BuyInfo.deleteOne({_id:req.params.user_id}).exec((err, result)=> {
                if(err) {
                    console.log(err);
                    next(err);
                }
            });
            res.redirect("../deposits");
        });
        
    });
});
module.exports = router;
