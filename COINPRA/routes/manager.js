var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var BuyInfo = require('../models/buyInfo');
var TOTALCOININFO = require('../models/coinProduct');
var MemberInfo = require('../models/memberInfo');
var passport = require('passport');
var moment = require('moment');
//TODO: JUNGEE: 해당 페이지 넘기기

/* GET users listing. */
//  [유정이] - Member를 추가했습니다.
//  router.get인 경우 Loading에 실패함!!
router.get('/', function(req, res, next) {
    res.render(`managerLogin`);
});

// router.post('/managerLogin', passport.authenticate('local', { successRedirect: '/manager/member', failureRedirect: '/manager' }));
router.post('/managerLogin', passport.authenticate('local'), function(req, res){
    //  최종 관리자의 경우만 사용가능! - 배포시 작업 필요!
    if(req.body.username == "nandogas" || req.body.username == "nono1314") {
        res.redirect('/manager/member');
    } else {
        req.logOut();
        res.redirect('/manager');
    }
});

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
                var numbers = [];
                for(var i=0; i<members.length; i++) {
                    var phone = members[i].phone;
                    var start = phone.indexOf('-');
                    var end = phone.indexOf('-', start+1);
                    var middleNumber = phone.substring(start+1, end);
                    var replaceNumber = phone.replace(middleNumber, '****');
                    numbers.push(replaceNumber);
                } 
                res.render(`manager/index`, { member: members, moment, userNumbers: numbers});
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
    if(req.user) {
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
                res.redirect("/salelist");
            });
            
        });
    } else {
        res.redirect(`/manager/`); 
    }
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
            console.log(toxiResults);
            if(toxiResults.length>0) {
                if(toxiResults[0].selling_price !== undefined) {
                    console.log(toxiResults[0].selling_price);
                    totalInfo['TOXI_COUNT'] = toxiResults[0].selling_count;
                    totalInfo['TOXI_PRICE'] = toxiResults[0].selling_price;
                } else {
                    totalInfo['TOXI_COUNT'] = toxiResults[0].selling_count;
                    totalInfo['TOXI_PRICE'] = 0;
                }
            } else {
                totalInfo['TOXI_COUNT'] = 0;
                totalInfo['TOXI_PRICE'] = 0;
            }
            TOTALCOININFO.find({coin_name: "PLU"}).exec((err, pluResults)=>{
                if(err) {
                    console.log(err);
                    next(err);
                }
                console.log(pluResults);
                if(pluResults.length>0) {
                    if(pluResults[0].selling_price !== undefined) {
                        totalInfo['PLU_COUNT'] = pluResults[0].selling_count;
                        totalInfo['PLU_PRICE'] = pluResults[0].selling_price;
                    } else {
                        totalInfo['PLU_COUNT'] = pluResults[0].selling_count;
                        totalInfo['PLU_PRICE'] = 0;
                    }
                    
                } else {
                    totalInfo['PLU_COUNT'] = 0;
                    totalInfo['PLU_PRICE'] = 0;
                }
                console.log(totalInfo);
                res.render('addsales', { addsales: totalInfo, moment});
            });
        });    
    } else {
        res.redirect(`/manager/`);
    }
});

router.get('/coinmenu', function(req, res, next){
    if(req.user) {
        TOTALCOININFO.find({}, function(err, data){
            if(err) {
                console.log("ERROR 발생!");
            } else {
                MemberInfo.find({}, function(err2, data2) {
                    if(err) {
                        console.log("ERROR 발생!");
                    }else {
                        res.render('coinInfo', {currentData: data, numberData: data2, moment});
                    }
                });
            }
        });
    } else {
        res.redirect(`/manager/`);
    }
});

router.get('/managermenu', function(req, res, next) {
    if(req.user) {
        const menuInfo ={manager1: 'nandogas', manager2: 'nono1314'};
        res.render('managermenu', { menu: menuInfo, moment});
    } else {
        res.redirect(`/manager/`);
    }
});


//  목표 회원 수 관리 
router.post('/memberCheck', function(req, res, next) {
    if(req.user) {
        Account.find({}, function(err, data) {
            if(parseInt(req.body.changeUserInfo)>= data.length) {
                res.send({result: true});   
            } else {
                res.send({result: false});
            }
        });
    } else {
        res.redirect(`/manager/`);
    }
});

//  목표 회원 수 관리 변경
router.post('/memberCheckConfirm', function(req, res, next) {
    if(req.user) {
        console.log(req.body.usercountInfo);
        MemberInfo.update({name: 'USER_COUNT'}, {$set: {invitation: parseInt(req.body.usercountInfo)}}, function(err, result){
            if(err) {
                console.log("ERROR 발생!");
                console.log(err);
            } else {
                console.log("Update: " + result);
                res.redirect(`/manager/coinmenu`);
            }
        });
    } else {
        res.redirect(`/manager/`);
    }
});



//  발행량 관리
router.post('/coinCheck', function(req, res, next) {
    if(req.user) {
        console.log(req.body.coinName);
        TOTALCOININFO.find({coin_name: req.body.coinName}, function(err, coinInfo){
            if(err) {
                console.log("ERROR 발생!");
            } else {
                // console.log(coinInfo[0].total_count);
                console.log(coinInfo[0].selling_count);
                if(req.body.coinAmount >=coinInfo[0].selling_count) {
                    res.send({result: true});   
                } else {
                    res.send({result: false});   
                }
            }
        });
    } else {
        res.redirect(`/manager/`);
    }
});

router.post('/coinAmountUpdate', function(req, res, next) {
    if(req.user) {
        var name;
        if(req.body.TOXI != undefined) {
            name= "TOXI";
        } else {
            name= "PLU";
        }
        console.log("Current Coin is " + name);
        console.log(req.body[name]);
        TOTALCOININFO.update({coin_name: name}, {$set: {total_count:req.body[name]}}, function(err, result){
            if(err) {
                console.log("ERROR 발생!");
            } else {
                console.log("Update: " + result);
                res.redirect(`/manager/coinmenu`);
            }
        });
    } else {
        res.redirect(`/manager/`);
    }
});


module.exports = router;
