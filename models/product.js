const mongoose = require('mongoose');

const products = new mongoose.Schema({
    prod_name:{type:String},
    price:{type:Number},
    stock:{type:Number},
    user_id: { type: mongoose.SchemaTypes.ObjectId },
    // img:{type:String}
},{
    timestamps:true
})

module.exports = mongoose.model('products', products)