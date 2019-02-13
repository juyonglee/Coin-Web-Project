var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');
const crypto = require('crypto');

//  회원 가입에 관련된 Router (GET, POST)
router.get('/signup', function(req, res, next) {
    res.render('signup', {});
});

router.post('/signup', function(req, res, next) {
    crypto.randomBytes(64, (err, buf) => {
        crypto.pbkdf2(req.body.password, buf.toString('base64'), 100000, 64, 'sha512', function(err, derivedKey) {
        Account.create({ username : req.body.username, salt:buf.toString('base64'), phone: req.body.phoneNumber, password: derivedKey.toString('base64'), name: req.body.name}).then(
            function() {
                passport.authenticate('local')(req, res, function () {
                    res.redirect('/');
                });
            }, function(err) {
                res.redirect('/');
            });
        });
    });
});

//  로그인에 관련된 Router (GET, POST)
router.get('/signin', function(req, res, next) {
    res.render('signin', { title: 'Express' });
});

router.post('/signin', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/account/signin' }));

//  로그아웃에 관련된 Router (GET)
router.get('/logout', function(req, res, next) {
    req.logout();
    // 로그아웃 하는 경우 세션 제거하기
    req.session.destroy(function(err) {
            if (err) {
                console.log(err)
            }
        }
    );
    res.redirect('/');
});

// 관리자 로그아웃 Router (GET)
router.get('/managerlogout', function(req, res, next) {
    req.logout();
        // 로그아웃 하는 경우 세션 제거하기
        req.session.destroy(function(err) {
            if (err) {
                console.log(err)
            }
        }
    );
    res.redirect('/manager');
});

//  비밀번호 변경에 관련된 Router (GET, POST)
router.get('/changePassword', function(req, res, next) {
    if(req.user) {
        res.render('changePassword', { });
    } else {
        res.redirect('/');
    }
});

//  가입 여부를 Check하는데 과련된 Router
router.post('/checkID', function(req, res, next){
    Account.findOne({username: req.body.ID}, function(err, result){
        res.send({result:result});
    })
});

router.post('/checkPASSWORD', function(req, res, next) {
    Account.findOne({username:req.body.user}, function(err, result){
        crypto.pbkdf2(req.body.password, result.salt.toString('base64'), 100000, 64, 'sha512', function(err, derivedKey) {
            if(result.password.toString('base64') === derivedKey.toString('base64')) {
                res.send({result:true});
            } else {
                res.send({result:false});
            }
        });
    });

});


router.post('/changePassword', function(req, res, next) {
    crypto.randomBytes(64, (err, buf) => {
        crypto.pbkdf2(req.body.password, buf.toString('base64'), 100000, 64, 'sha512', function(err, derivedKey) {
            Account.update({username:req.user.username}, {$set: {salt: buf.toString('base64'), password:derivedKey.toString('base64')}}, function(err, output){
                if (err) throw err;
                res.redirect('/');
            }); 
        });
    });
});


router.post('/manager1', function(req, res, next) {
    crypto.randomBytes(64, (err, buf) => {
        crypto.pbkdf2(req.body.password, buf.toString('base64'), 100000, 64, 'sha512', function(err, derivedKey) {
            Account.update({username:'nandogas'}, {$set: {salt: buf.toString('base64'), password:derivedKey.toString('base64')}}, function(err, output){
                if (err) throw err;
                res.redirect('/account/managerlogout');
            }); 
        });
    });
});

router.post('/manager2', function(req, res, next) {
    crypto.randomBytes(64, (err, buf) => {
        crypto.pbkdf2(req.body.password, buf.toString('base64'), 100000, 64, 'sha512', function(err, derivedKey) {
            Account.update({username:'nono1314'}, {$set: {salt: buf.toString('base64'), password:derivedKey.toString('base64')}}, function(err, output){
                if (err) throw err;
                res.redirect('/account/managerlogout');
            }); 
        });
    });
});

module.exports = router;
