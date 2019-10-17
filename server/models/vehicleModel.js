const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var vehicleModelSchema = new Schema({
    aboutCar: { type: String },
    vehicleType: { type: String },
    vehicleModel: { type: String },
    color: { type: String, },
    chassis: { type: String, },
    engine: { type: String, },
    ownerId: { type: Schema.ObjectId, ref: 'owner', },
    condition: { type: String, },
    makeOfCar: { type: String, },
    hourlyRate: { type: Number },
    dayRate: { type: Number },
    carName: { type: String },
    date: { type: Number },
    currentLat: { type: Number },
    currentLong: { type: Number },
    location: {
        type: {
            type: String, default: "Point"
        },

        coordinates: [Number]
    }
})

vehicleModelSchema.set('toObject', { virtuals: true });
vehicleModelSchema.set('toJSON', { virtuals: true });
vehicleModelSchema.virtual('vehicleImages', {
    ref: 'vehicleImage',
    localField: '_id',
    foreignField: 'vehcileId'
})


module.exports = mongoose.model('vehicle', vehicleModelSchema);