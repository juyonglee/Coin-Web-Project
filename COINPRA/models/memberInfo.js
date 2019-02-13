var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var memberInvite = new Schema({
    invitation: Number,
    name: String
});

module.exports = mongoose.model('MemberInvitation', memberInvite);
