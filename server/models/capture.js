var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var captureSchema = Schema({
    type: String,
    birdname: {type: String, required: true},
    place: String,
    note: String,
    userId: String,
    author: String,
    picture: Schema.Types.Mixed,
    created_at: Date,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

module.exports = mongoose.model('Capture', captureSchema);