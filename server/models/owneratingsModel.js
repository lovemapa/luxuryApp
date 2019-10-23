const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var ratingModelSchema = new Schema({
    bookingId: { type: Schema.Types.ObjectId, ref: 'booking' },
    serviceRatings: { type: Number, default: 0 },
    userRatings: { type: Number, default: 0 },
})



module.exports = mongoose.model('rating', ratingModelSchema);

