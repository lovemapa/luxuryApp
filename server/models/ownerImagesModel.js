const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var ownerImageModelSchema = new Schema({

    path: { type: String },
    ownerId: { type: Schema.ObjectId, ref: 'owner' },
    date: { type: Number }

})



module.exports = mongoose.model('ownerImage', ownerImageModelSchema);