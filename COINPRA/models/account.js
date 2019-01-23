var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sequenceGenerator = require('mongoose-sequence-plugin');

var Account = new Schema({
    username: { type : String , unique : true},
    name: String,
    salt: String,
    password: String,
    phone: String,
    seq: Number
});

Account.plugin(sequenceGenerator, {startAt: 135001});

module.exports = mongoose.model('Account', Account);
