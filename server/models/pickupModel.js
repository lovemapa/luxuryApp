const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var ratingModelSchema = new Schema({
    bookingId: { type: Schema.Types.ObjectId, ref: 'booking' },
    schedule: { type: Number },
    date: { type: Number },
    duration: { type: Number },
    condition: { type: String },
    specialRequest: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'user' },

})



module.exports = mongoose.model('rating', ratingModelSchema);

