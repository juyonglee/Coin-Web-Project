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
                //  저장이 완료된 경우 호출
                passport.authenticate('local')(req, res, function () {
                    res.redirect('/');
                });
            }, function(err) {
                //  이미 가입된 경우 호출
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
    res.redirect('/');
});

//  비밀번호 변경에 관련된 Router (GET, POST)
router.get('/changePassword', function(req, res, next) {
    if(req.user) {
        res.render('changePassword', { });
    } else {
        res.redirect('/');
    }
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

module.exports = router;
