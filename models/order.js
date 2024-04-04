const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    prod_id: { type: mongoose.SchemaTypes.ObjectId },
    user_id: { type: mongoose.SchemaTypes.ObjectId },
    amount:{type:Number},
    total:{type:Number},
    receipt_number:{type:String}
    // img:{type:String}
},{
    timestamps:true
})

module.exports = mongoose.model('orders', ordersSchema)