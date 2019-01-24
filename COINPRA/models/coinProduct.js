var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Account = require('./account');

var publishedCoin = new Schema({
    round: Number,
    coin_name: String,
    price: Number,
    total_count: Number,
    selling_count: Number,
    selling_price: Number,
    order_buyer: [{type: mongoose.Schema.Types.ObjectId, ref: Account}]
});

module.exports = mongoose.model('CoinProduct', publishedCoin);
