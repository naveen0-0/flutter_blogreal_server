const { Schema } = require('mongoose')

const commentSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

module.exports = {
    commentSchema
}