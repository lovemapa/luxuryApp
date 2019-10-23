const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var bookingModelSchema = new Schema({
    bookingDuration: { type: Number },
    vehicleId: { type: Schema.ObjectId, ref: 'vehicle' },
    typeOfEvent: { type: String },
    startTime: { type: Number },
    endTime: { type: Number },
    currentCoordinates: [{ type: Number }],
    currentLat: { type: Number },
    currentLong: { type: Number },
    userId: { type: Schema.ObjectId, ref: 'user' },
    trackImage: { type: String },
    // pickupLat: { type: Number },
    // pickupLong: { type: Number },
    // notes: { type: String },
    // details: { type: String },
    // pickUpCordinates: [{ type: String }],
    // name: { type: String },
    // contact: { type: String, required: true },
    // userId: { type: Schema.ObjectId, ref: 'user' },
    status: { type: String, enum: ['active', 'closed', 'rejected', 'pending'], default: 'pending' },
    // timeForPickup: { type: Number },
    // condition: { type: String },
    date: { type: Number }

})



module.exports = mongoose.model('booking', bookingModelSchema);