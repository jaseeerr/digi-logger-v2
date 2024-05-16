const mongoose = require('mongoose')
const Schema = mongoose.Schema

const regularizeSchema = new Schema({
    student:String,
    stdphone:Number,
    admin:String,
    adminphone:Number,
    type:String,
    date:Date,
    reason:String

    
    
   
})





module.exports = mongoose.model('regularize',regularizeSchema)
