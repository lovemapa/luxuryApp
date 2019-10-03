const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var userModelSchema = new Schema({
    contact: { type: String, unique: true },
    email: { type: String, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String },
    socialMedia: { type: String },
    status: { type: Number, default: 1 }, // 0 (offline)  1 (online)
    date: { type: Number },
    profilePic: { type: String, default: '/default.png' },
    isDeleted: { type: Number, default: 0 },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    isVerified: { type: Boolean, default: false },
    token: Number
})



module.exports = mongoose.model('user', userModelSchema);

