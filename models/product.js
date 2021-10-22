const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({

    productname:{
        type: String,
        required: true
    },
    image:{
        type: String
    },
    price:{
        type: Number,
    },
    size:{
        type:String
    },
    cat:{
        type: String
    }

}, { timestamps: true } );

const Product = mongoose.model('Product',productSchema);
module.exports = Product;