const mongoose = require('mongoose')
const Schema = mongoose.Schema

const signupSchema = new Schema({
    name:String,
    phone:String,
    batch:String,
    password:String,
    domain:String,
    dev1:String,
    dev2:String,
    checkin:Boolean,
    checkinImg:Array,
    checkoutImg:Array,
    block:Boolean
   
})





module.exports = mongoose.model('users',signupSchema)
