const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
    {
        title: {type: String, require: true, minLength: 3, maxLength: 20},
        text: {type: String, require: true, minLength: 3},
        comments: [{type: Schema.Types.ObjectId, ref: "comment"}],
        date: {type: Date, default: new Date()},
        user: {type: Schema.Types.ObjectId, ref: "user"}
    }
);

module.exports = mongoose.model('post', PostSchema);
