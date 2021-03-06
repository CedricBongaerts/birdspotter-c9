var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = Schema({
    comment: String,
    userId: String,
    author: String,
    created_at: Date,
    capture: { type: Schema.Types.ObjectId, ref: 'Capture'},
    notification: [{ type: Schema.Types.ObjectId, ref: 'Notification'}]
});

module.exports = mongoose.model('Comment', commentSchema);