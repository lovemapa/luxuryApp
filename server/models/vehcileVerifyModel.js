const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var vehicleVerifyModelSchema = new Schema({

    path: { type: String },
    vehcileId: { type: Schema.ObjectId, ref: 'vehicle' },
    date: { type: Number }

})



module.exports = mongoose.model('vehicleVerify', vehicleVerifyModelSchema);