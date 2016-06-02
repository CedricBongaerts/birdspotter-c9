var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var voteSchema = Schema({
    userId: String,
    userName: String,
    votedFor: String,
    capture: { type: Schema.Types.ObjectId, ref: 'Capture'}
});

module.exports = mongoose.model('Vote', voteSchema);