var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var captureSchema = mongoose.Schema({
    birdname: {type: String, required: true},
    place: {type: String, required: true},
    userId: {type: String, required: true},
    author: {type: String, required: true},
    picture: Schema.Types.Mixed,
    created_at: Date
});

module.exports = mongoose.model('Capture', captureSchema)