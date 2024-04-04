const mongoose = require('mongoose');

const products = new mongoose.Schema({
    prod_name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    user_id: { type: mongoose.SchemaTypes.ObjectId, required: true },
    // img:{type:String}
},{
    timestamps:true
})

module.exports = mongoose.model('products', products)