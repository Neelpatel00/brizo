const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const catSchema = new Schema({

   catname:{
        type: String,
        required: true
    }

}, { timestamps: true } );

const Cat = mongoose.model('Cat',catSchema);
module.exports = Cat;