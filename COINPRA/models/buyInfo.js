var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Account = require('./account');

var BuyInfoScheme = new Schema({
    coin_name: String,
    price: Number,
    buy_count: Number,
    buy_state: Boolean,
    buy_confirm_date: Date,
    buy_date: { type: Date, default: Date.now},
    buyer: {type: mongoose.Schema.Types.ObjectId, ref: Account}
});

module.exports = mongoose.model('BuyInfo', BuyInfoScheme);
