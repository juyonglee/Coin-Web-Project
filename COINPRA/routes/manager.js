var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var BuyInfo = require('../models/buyInfo');
//TODO: JUNGEE: 해당 페이지 넘기기

/* GET users listing. */
//  [유정이] - Member를 추가했습니다.
//  router.get인 경우 Loading에 실패함!!
router.get('/', function(req, res, next) {

});

router.get('/member', function(req, res, next) {
    Account.find().populate({path:'buy_info', model:BuyInfo}).exec((err, members) => {
        if(err) {
            console.log("User가 존재하지 않습니다.");
            next(err);
        } else {
            // [유정이] - Property와 변수의 이름이 같으면 문제가 생깁니다.
            // const member ={sequence: req., name: "jungee", email: "junge2",phone:"0000", plu:0, fnb: 1};
            //  [유정이] - Hover로 부탁드려요!
            console.log(members[0].buy_info);
            res.render(`manager/index`, { member: members});
        }
    });
});

router.get('/deposits', function(req, res, next) {
    BuyInfo.find({buy_state: false}).populate({path:'buyer', model:Account}).exec((err, infos)=>{
        if(err){
            console.log('router.get(/deposits, function(req, res, next)');
            console.log(err);
            next(err);
        }
        // console.log(infos);
        res.render(`deposits`, { deposit: infos});
    });
});

router.post('/depositConfirm/:user_id', function(req, res, next) {
    console.log(req.params.user_id);
    BuyInfo.update({_id:req.params.user_id}, {$set: {buy_state: true}}, function(err, updateResult) {
        if(err) {
            console.log('err');
        } else {
            console.log(updateResult);
            BuyInfo.find({_id: req.params.user_id}).populate({path:'buyer', model:Account}).exec((err, infos)=>{
                if(err){
                    console.log(err);
                    next(err);
                }
                if(infos[0].coin_name == "TOXI") {
                    Account.update({_id:infos[0].buyer._id}, {$inc: {my_TOXI: infos[0].buy_count}}, function(err, output){
                        if(err) {
                            console.log(err);
                            next(err);
                        }
                    });
                } else {
                    Account.update({_id:infos[0].buyer._id}, {$inc: {my_PLU: infos[0].buy_count}}, function(err, output){
                        if(err) {
                            console.log(err);
                            next(err);
                        }
                    });
                }
                res.redirect("../deposits");
            });
        }
    });
});

router.get('/sales', function(req, res, next) {
    BuyInfo.find({buy_state: true}).populate({path:'buyer', model:Account}).exec((err, salesInfos)=>{
        console.log(salesInfos);
        res.render(`sales`, { sales: salesInfos});
    });
});

router.get('/addsales', function(req, res, next) {
    const addsalesInfos ={pricenum: 0, plunum: 0, fnbnum: 1};
    res.render('addsales', { addsales: addsalesInfos});
});

router.get('/managermenu', function(req, res, next) {
    const menuInfo ={id: 0, date: 0, user_id: 0, name: "jung", kinds:"FNB", num: 2, price: 2000, status: "w"};
    res.render('managermenu', { menu: menuInfo});
});

module.exports = router;
