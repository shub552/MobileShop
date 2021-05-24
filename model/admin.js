var mongoose = require('mongoose');
var adminSchema = mongoose.Schema({
    email:String,
    password:String
})

var category = mongoose.Schema({
    _id:String,
    cname:String
});

var product = mongoose.Schema({
    _id:String,
    cname:String,
    pname:String,
    price:Number,
    quantity:Number,
    filename:String
});

const adminModel = mongoose.model('admin',adminSchema,'adminSchema');
const categoryModel = mongoose.model('category',category,'category');
const productModel = mongoose.model('product',product,'product');

module.exports={admin : adminModel ,category : categoryModel,product : productModel};