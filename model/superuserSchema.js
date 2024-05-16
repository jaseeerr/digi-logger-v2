const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ownerSchema = new Schema({
    name:String,
    phone:String,
    location:String,
    password:String
    
   
})





module.exports = mongoose.model('superuser',ownerSchema)
