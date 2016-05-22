var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var captureSchema = mongoose.Schema({
    birdname: String,
    place: String,
    userId: String,
    created_at: Date
});

module.exports = mongoose.model('Capture', captureSchema)