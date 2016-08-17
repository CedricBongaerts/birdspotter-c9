var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var voteBirdsuggestionSchema = Schema({
    userId: String,
    voteFrom: String,
    birdsuggestion: { type: Schema.Types.ObjectId, ref: 'Birdsuggestion'},
    notification: [{ type: Schema.Types.ObjectId, ref: 'Notification'}]
});

module.exports = mongoose.model('VoteBirdsuggestion', voteBirdsuggestionSchema);