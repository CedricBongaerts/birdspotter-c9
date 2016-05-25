var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var captureSchema = Schema({
    birdname: {type: String, required: true},
    place: String,
    userId: String,
    author: String,
    picture: Schema.Types.Mixed,
    created_at: Date,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

module.exports = mongoose.model('Capture', captureSchema);