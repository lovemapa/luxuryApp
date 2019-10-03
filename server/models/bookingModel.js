const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var bookingModelSchema = new Schema({
    bookingDuration: { type: Number, required: true },
    currentCoordinates: [{ type: String }],
    carType: { type: String },
    currentLat: { type: Number },
    currentLong: { type: Number },
    pickupLat: { type: Number },
    pickupLong: { type: Number },
    notes: { type: String },
    details: { type: String },
    pickUpCordinates: [{ type: String }],
    name: { type: String },
    contact: { type: String, required: true },
    userId: { type: Schema.ObjectId, ref: 'user', required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'closed'], default: 'pending' },
    timeForPickup: { type: Number },
    condition: { type: String },
    date: { type: Number }

})



module.exports = mongoose.model('booking', bookingModelSchema);