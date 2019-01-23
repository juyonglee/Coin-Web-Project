var mongoose = require('mongoose');
var CoinScheme = require('./coin');
var Schema = mongoose.Schema;

var SellingInfo = new Schema({
    coin_name: String,
    price: Number,
    buy_count: Number,
    buy_state: Boolean,
    buy_date: { type: Date, default: Date.now },
    buyer: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model('SellInfo', SellingInfo);
