const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    flagEnabled: { type: Boolean, default: false },
    role: { type: String, default: 'user' }  
});

const User = mongoose.model('User', userSchema);

module.exports = User;
