var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = Schema({
    body: String,
    userId: String,
    author: String,
    created_at: Date,
    capture: { type: Schema.Types.ObjectId, ref: 'Capture'}
});

module.exports = mongoose.model('Comment', commentSchema);