const { Schema, model } = require('mongoose')

const RequiredString = {
    type:String,
    required:true
}

const userSchema = new Schema({
    username : RequiredString,
    password:RequiredString
})

const User = model('user',userSchema);
module.exports = User;