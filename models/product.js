const mongoose = require('mongoose');

const deliveryOptionSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true
    }
  });


const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:20,
        max:255
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true,
        min:50,
        max:1200
    },
    currency:{
        type:String,
        required:true
    },
    seller_id:{
        type:String,
        required:true
    },
    in_stock:{
        type:Boolean,
        required:true
    },
    delivery_options:[deliveryOptionSchema]
});




module.exports = mongoose.model('Product',productSchema);