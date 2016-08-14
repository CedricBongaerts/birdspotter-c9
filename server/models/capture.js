var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var captureSchema = Schema({
    birdname: String,
    place: String,
    note: String,
    userId: String,
    author: String,
    picture: Schema.Types.Mixed,
    picture_uuid: String,
    created_at: Date,
    updated_at: Date,
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}],
    birdsuggestions: [{ type: Schema.Types.ObjectId, ref: 'Birdsuggestion'}],
    votes: [{ type: Schema.Types.ObjectId, ref: 'Vote'}],
});

module.exports = mongoose.model('Capture', captureSchema);