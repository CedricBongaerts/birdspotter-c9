var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var birdsuggestionSchema = Schema({
    birdSuggestion: String,
    userId: String,
    author: String,
    created_at: Date,
    capture: { type: Schema.Types.ObjectId, ref: 'Capture'},
    suggestionVote: [{ type: Schema.Types.ObjectId, ref: 'Suggestionvote'}],
    notification: [{ type: Schema.Types.ObjectId, ref: 'Notification'}]
});

module.exports = mongoose.model('Birdsuggestion', birdsuggestionSchema);