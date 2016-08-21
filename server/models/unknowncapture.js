var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var unknowncaptureSchema = Schema({
    place: String,
    author: String,
    picture: Schema.Types.Mixed,
    picture_uuid: String,
    created_at: Date,
    original_id: String,
});

module.exports = mongoose.model('UnknownCapture', unknowncaptureSchema);