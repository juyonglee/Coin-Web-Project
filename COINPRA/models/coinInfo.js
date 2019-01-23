var mongoose = require('mongoose');
var CoinScheme = require('./coin');
var Schema = mongoose.Schema;

var Coin = new Schema({
    round: Number,
    coin_name: String,
    price: Number,
    total_count: Number,
    selling_count: Number
});

var CoinInfo = new Schema({
    // fnbCoinsList: [{
    //     round: Number,
    //     coin_name: String,
    //     price: Number,
    //     total_count: Number,
    //     selling_count: Number
    // }],
    fnbCoinList: [Coin],
    pluConinsList: [Coin]
});

module.exports = mongoose.model('CoinInfo', CoinInfo);
