var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sequenceGenerator = require('mongoose-sequence-plugin');

var Account = new Schema({
    username: { type : String , unique : true},
    name: String,
    salt: String,
    password: String,
    phone: String,
    seq: Number,
    my_PLU: { type: Number, default: 0 },
    FNB: Number,
    buy_info: [mongoose.Schema.Types.ObjectId]
});

Account.plugin(sequenceGenerator, {startAt: 135001});

module.exports = mongoose.model('Account', Account);
