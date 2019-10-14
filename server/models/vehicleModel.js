const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var vehicleModelSchema = new Schema({
    vehicleType: { type: String },
    vehicleModel: { type: String },
    vehiclePics: [{ type: String }],
    color: { type: String, },
    chassis: { type: String, },
    engine: { type: String, },
    ownerId: { type: Schema.ObjectId, ref: 'owner', },
    condition: { type: String, },
    makeOfCar: { type: String, },
    hourlyRate: { type: Number },
    dayRate: { type: Number },

    carName: { type: String },
    date: { type: Number }

})



module.exports = mongoose.model('vehicle', vehicleModelSchema);