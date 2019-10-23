const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var vehicleImageModelSchema = new Schema({

    path: { type: String },
    vehcileId: { type: Schema.ObjectId, ref: 'vehicle' },
    date: { type: Number }

})



module.exports = mongoose.model('vehicleImage', vehicleImageModelSchema);