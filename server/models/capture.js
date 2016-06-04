var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var captureSchema = Schema({
    type: String,
    birdname: String,
    place: String,
    note: String,
    userId: String,
    author: String,
    picture: Schema.Types.Mixed,
    created_at: Date,
    updated_at: Date,
    acceptedSuggestion: Boolean(),
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vote'}],
    suggestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Suggestion'}],
});

module.exports = mongoose.model('Capture', captureSchema);