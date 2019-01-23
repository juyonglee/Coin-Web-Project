var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');
const crypto = require('crypto');

router.get('/signup', function(req, res, next) {
    res.render('signup', {});
});

router.post('/signup', function(req, res, next) {
    crypto.randomBytes(64, (err, buf) => {
        crypto.pbkdf2(req.body.password, buf.toString('base64'), 100000, 64, 'sha512', function(err, derivedKey) {
        Account.create({ username : req.body.username, salt:buf.toString('base64'), phone: req.body.phoneNumber, password: derivedKey.toString('base64'), name: req.body.name}).then(
            function(product) {
                passport.authenticate('local')(req, res, function () {
                    res.redirect('/');
                });
            }, function(err) {
                console.log("이미 가입된 회원입니다.");
                res.redirect('/');
            });
        });
    });
});

router.get('/signin', function(req, res, next) {
    res.render('login', { title: 'Express' });
});

router.post('/signin', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/account/signin' }));

router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

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
