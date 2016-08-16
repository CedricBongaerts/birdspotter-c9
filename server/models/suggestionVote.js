var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var suggestionVoteSchema = Schema({
    userId: String,
    voteFrom: String,
    birdSuggestion: { type: Schema.Types.ObjectId, ref: 'Birdsuggestion'},
    notification: [{ type: Schema.Types.ObjectId, ref: 'Notification'}]
});

module.exports = mongoose.model('Suggestionvote', suggestionVoteSchema);