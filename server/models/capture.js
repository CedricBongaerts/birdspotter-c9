var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var captureSchema = mongoose.Schema({
    birdname: String,
    place: String
});

module.exports = mongoose.model('Capture', captureSchema)