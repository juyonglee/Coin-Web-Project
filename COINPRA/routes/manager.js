var express = require('express');
var router = express.Router();

//TODO: JUNGEE: 해당 페이지 넘기기

/* GET users listing. */
router.get('/', function(req, res, next) {
    const member ={id: 0, name: "jungee", email: "junge2",phone:"0000", plu:0, fnb: 1};
    res.render('member', { member: member});
});

router.get('/deposit', function(req, res, next) {

    const deposit ={id: 0, date: 0, user_id: 0, name: "jung", kinds:"FNB", num: 2, price: 2000, status: "w"};
    res.render('deposit', { deposit: deposit});
});

router.get('/sales', function(req, res, next) {

    const sales ={date: 0, user_id: 0, name: "JUNGEE", kinds: "FNB", num:1, status: "w"};
    res.render('sales', { sales: sales});
});

router.get('/addsales', function(req, res, next) {

    const addsales ={id: 0, date: 0, user_id: 0, name: "jung", kinds:"FNB", num: 2, price: 2000, status: "w"};
    res.render('addsales', { addsales: addsales});
});

router.get('/managermenu', function(req, res, next) {

    const menu ={id: 0, date: 0, user_id: 0, name: "jung", kinds:"FNB", num: 2, price: 2000, status: "w"};
    res.render('menu', { menu: menu});
});
module.exports = router;
