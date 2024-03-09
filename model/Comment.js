const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
    {
        text: {type: String, require: true, minLength: 1},
        date: {type: Date, default: new Date()},
        user: {type: Schema.Types.ObjectId, ref: "user"},
        post: {type: Schema.Types.ObjectId, ref: "post"}
    }
);

module.exports = mongoose.model('comment', CommentSchema);