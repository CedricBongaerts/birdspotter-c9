var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var followSchema = Schema({
    followed_id: String,
    follower_id: String,
    created_at: Date,
});

module.exports = mongoose.model('Follow', followSchema);