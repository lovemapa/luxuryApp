const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var ownerModelSchema = new Schema({

    // contact: { type: String, unique: true },
    email: { type: String, unique: true },
    contact: { type: String },
    countryCode: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String },
    status: { type: Number, default: 1 }, // 0 (offline)  1 (online)
    date: { type: Number },
    profilePic: { type: String, default: '/default.png' },
    isDeleted: { type: Number, default: 0 },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    isVerified: { type: Boolean, default: false },
    isAdminVerified: { type: Boolean, default: false },
    token: Number,
    currentCoordinates: [{ type: Number }],
    currentLat: { type: Number },
    currentLong: { type: Number },
    deviceType: { type: String },
    deviceId: { type: String }
})

ownerModelSchema.index({ contact: 1, countryCode: 1 }, { unique: true })

ownerModelSchema.set('toObject', { virtuals: true });
ownerModelSchema.set('toJSON', { virtuals: true });
ownerModelSchema.virtual('ownerVerifyImages', {
    ref: 'ownerImage',
    localField: '_id',
    foreignField: 'ownerId'
})

module.exports = mongoose.model('owner', ownerModelSchema);