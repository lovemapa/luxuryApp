const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var adminModelSchema = new Schema({
    email: { type: String, unique: true },
    password: { type: String },
    date: { type: Number },



})

module.exports = mongoose.model('admin', adminModelSchema);