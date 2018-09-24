const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username: {
        trim: true,
        type: String,
        required: true
    },
    email: {
        trim: true,
        type: String,
        required: true
    },
    password: {
        trim: true,
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
});


let Users = mongoose.model('Users', userSchema);
module.exports = Users;
