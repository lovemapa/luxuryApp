const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var eventModelSchema = new Schema({

    eventId: { type: Number },
    eventType: { type: String },

})



module.exports = mongoose.model('event', eventModelSchema);

