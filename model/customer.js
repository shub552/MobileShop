var mongoose = require('mongoose');
var mobileSchema = mongoose.Schema({
    name :String,
    _id :String,
    password :String,
    address :String,
    verify:String
})

module.exports=mongoose.model('',mobileSchema,'mobileSchema');