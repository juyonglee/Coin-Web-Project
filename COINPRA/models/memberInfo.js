var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var memberInvite = new Schema({
    invitation: Number,
});

module.exports = mongoose.model('MemberInvitation', memberInvite);
