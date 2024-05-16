const mongoose = require('mongoose')
const Schema = mongoose.Schema

const adminSchema = new Schema({
    name:String,
    phone:String,
    location:String,
    password:String,
    block:Boolean
   
})





module.exports = mongoose.model('admins',adminSchema)
