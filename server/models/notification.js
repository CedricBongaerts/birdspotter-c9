var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var notificationSchema = Schema({
    notificationFor: String,
    notificationFrom: String,
    concirning: String,
    parameter: String,
    detected: Boolean(),
    seen: Boolean(),
    created_at: Date,
    vote: { type: Schema.Types.ObjectId, ref: 'Vote'},
    comment: { type: Schema.Types.ObjectId, ref: 'Comment'},
    birdsuggestion: { type: Schema.Types.ObjectId, ref: 'Birdsuggestion'},
    follow: { type: Schema.Types.ObjectId, ref: 'Follow'},
    capture: {type: Schema.Types.ObjectId, ref: 'Capture'},
});

module.exports = mongoose.model('Notification', notificationSchema);