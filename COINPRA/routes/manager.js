var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var BuyInfo = require('../models/buyInfo');
var TOTALCOININFO = require('../models/coinProduct');
var passport = require('passport');
var moment = require('moment');
//TODO: JUNGEE: 해당 페이지 넘기기

/* GET users listing. */
//  [유정이] - Member를 추가했습니다.
//  router.get인 경우 Loading에 실패함!!
router.get('/', function(req, res, next) {
    res.render(`managerLogin`);
});

router.post('/managerLogin', passport.authenticate('local', { successRedirect: '/manager/member', failureRedirect: '/manager' }));
// router.post('/managerLogin', passport.authenticate('local'), function(req, res){
    //  최종 관리자의 경우만 사용가능! - 배포시 작업 필요!
    // if(req.body.username == "nandogas" || req.body.username == "nono1314") {
    //     res.redirect('/manager/member');
    // } else {
    //     req.logOut();
    //     res.redirect('/manager');
    // }
// });

router.get('/member', function(req, res, next) {
    if(req.user) {
        Account.find().populate({path:'buy_info', model:BuyInfo}).exec((err, members) => {
            if(err) {
                console.log("User가 존재하지 않습니다.");
                next(err);
            } else {
                // [유정이] - Property와 변수의 이름이 같으면 문제가 생깁니다.
                // const member ={sequence: req., name: "jungee", email: "junge2",phone:"0000", plu:0, fnb: 1};
                //  [유정이] - Hover로 부탁드려요!
                res.render(`manager/index`, { member: members});
            }
        }); 
    } else {
        res.redirect(`/manager/`);
    }
});

router.get('/deposits', function(req, res, next) {
    if(req.user) {
        BuyInfo.find({buy_state: false}).populate({path:'buyer', model:Account}).exec((err, infos)=>{
            if(err){
                console.log('router.get(/deposits, function(req, res, next)');
                console.log(err);
                next(err);
            }
            res.render(`deposits`, { deposit: infos, moment});
        });
    } else {
        res.redirect(`/manager/`);
    }
});

router.post('/depositConfirm/:user_id', function(req, res, next) {
    if(req.user) {
        console.log(req.params.user_id);
    BuyInfo.update({_id:req.params.user_id}, {$set: {buy_state: true, buy_confirm_date: req.body.incomingDate}}, function(err, updateResult) {
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
                        } else {
                            // var price = parseInt(infos[0].price) * parseInt(infos[0].buy_count);
                            var price = parseInt(infos[0].price);
                            console.log("*****");
                            console.log(infos[0].price);
                            console.log(infos[0].buy_count);
                            console.log(price);
                            TOTALCOININFO.update({coin_name:"TOXI"}, {$inc: {selling_count: infos[0].buy_count, selling_price: price}}, function(err, toxiInfo){
                                if(err) {
                                    console.log(err);
                                    next(err);
                                }
                                res.redirect("../deposits");
                            });
                        }
                    });
                } else {
                    Account.update({_id:infos[0].buyer._id}, {$inc: {my_PLU: infos[0].buy_count}}, function(err, output){
                        if(err) {
                            console.log(err);
                            next(err);
                        } else {
                            var price = parseInt(infos[0].price);
                            TOTALCOININFO.update({coin_name:"PLU"}, {$inc: {selling_count: infos[0].buy_count, selling_price: price}}, function(err, output){
                                if(err) {
                                    console.log(err);
                                    next(err);
                                }
                                res.redirect("../deposits");
                            });
                        }
                    });
                }
            });
        }
    });
    } else {
        res.redirect(`/manager/`);
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


router.get('/sales', function(req, res, next) {
    if(req.user) {
        BuyInfo.find({buy_state: true}).populate({path:'buyer', model:Account}).exec((err, salesInfos)=>{
            console.log(salesInfos);
            res.render(`sales`, { sales: salesInfos, moment});
        });
    } else {
        res.redirect(`/manager/`);
    }
});

router.get('/addsales', function(req, res, next) {
    if(req.user) {
        var totalInfo = {};
        TOTALCOININFO.find({coin_name: "TOXI"}).exec((err, toxiResults)=>{
            if(err) {
                console.log(err);
                next(err);
            }
            if(toxiResults.length>0) {
                totalInfo['TOXI_COUNT'] = toxiResults[0].selling_count;
                totalInfo['TOXI_PRICE'] = toxiResults[0].selling_price;
            } else {
                totalInfo['TOXI_COUNT'] = 0;
                totalInfo['TOXI_PRICE'] = 0;
            }
            TOTALCOININFO.find({coin_name: "PLU"}).exec((err, pluResults)=>{
                if(err) {
                    console.log(err);
                    next(err);
                }
                if(pluResults.length>0) {
                    totalInfo['PLU_COUNT'] = pluResults[0].selling_count;
                    totalInfo['PLU_PRICE'] = pluResults[0].selling_price;
                } else {
                    totalInfo['PLU_COUNT'] = 0;
                    totalInfo['PLU_PRICE'] = 0;
                }
                console.log(totalInfo);
                res.render('addsales', { addsales: totalInfo});
            });
        });    
    } else {
        res.redirect(`/manager/`);
    }
});

router.get('/managermenu', function(req, res, next) {
    if(req.user) {
        const menuInfo ={id: 0, date: 0, user_id: 0, name: "jung", kinds:"FNB", num: 2, price: 2000, status: "w"};
        res.render('managermenu', { menu: menuInfo});
    } else {
        res.redirect(`/manager/`);
    }
});

module.exports = router;
