var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var captureSchema = mongoose.Schema({
    birdname: String,
    place: {
        city: String,
        country: String   
    }
});

module.exports = mongoose.model('Capture', captureSchema)