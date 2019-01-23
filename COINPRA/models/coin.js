var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Coin = new Schema({
    round: Number,
    coin_name: String,
    price: Number,
    total_count: Number,
    selling_count: Number
});

module.exports = mongoose.model('Coin', Coin);
