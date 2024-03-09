const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username: {type: String, require: true, minLength: 3, maxLength: 20},
        password: {type: String, require: true, minLength: 8},
    }
);

module.exports = mongoose.model('user', UserSchema);
