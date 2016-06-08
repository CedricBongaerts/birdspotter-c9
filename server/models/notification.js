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
    follow: { type: Schema.Types.ObjectId, ref: 'Follow'}
});

module.exports = mongoose.model('Notification', notificationSchema);