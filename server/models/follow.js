var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var followSchema = Schema({
    followed_id: String,
    follower_id: String,
    created_at: Date,
    notification: [{ type: Schema.Types.ObjectId, ref: 'Notification'}]
});

module.exports = mongoose.model('Follow', followSchema);