var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sequenceGenerator = require('mongoose-sequence-plugin');
var SellInfo = require('./buyInfo');

var AccountScheme = new Schema({
    username: { type : String , unique : true},
    name: String,
    salt: String,
    password: String,
    phone: String,
    seq: Number,
    my_PLU: { type: Number, default: 0 },
    my_TOXI: { type: Number, default: 0 },
    buy_info: [{type: mongoose.Schema.Types.ObjectId, ref: SellInfo}]
});

AccountScheme.plugin(sequenceGenerator, {startAt: 135001});
module.exports = mongoose.model('Account', AccountScheme);
