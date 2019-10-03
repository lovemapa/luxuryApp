const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var carCategorySchema = new Schema({

    carType: { type: String, },
    baseFare: { type: Number },
    date: { type: Number }
})

module.exports = mongoose.model('carCategory', carCategorySchema);