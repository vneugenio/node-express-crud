const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
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
