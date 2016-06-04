var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var suggestionSchema = Schema({
    suggestedBirdname: String,
    acceptedSuggestion: Boolean(),
    userId: String,
    author: String,
    created_at: Date,
    capture: { type: Schema.Types.ObjectId, ref: 'Capture'}
});

module.exports = mongoose.model('Suggestion', suggestionSchema);