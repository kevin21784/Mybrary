const mongoose = require('mongoose')
const coverImageBasePath = 'uploads/bookCovers'    // where the covers pictures will be stored
const path = require('path')
const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    discription:{
        type: String,
    },
    publishDate:{
        type: Date, 
        required : true
    },
    pageCount:{
        type: Number,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default : Date.now // this will be set every time we create a new book
    },
    coverImageName:{
        type: String, // you only store the name of the book in db and store the actual file in file system
        required: true 
    },
    author: {
        type: String, // refering to the id of author object // error: mongoose.Schema.Types.ObjectId
        required: true,
        ref: 'Author' // showing that you are refering to the Author collection
    }
})
bookSchema.virtual('coverImagePath').get(function (){ //virtual gets same vilues of bookSchema
    if(this.coverImageName != null){
        return path.join('/', coverImageBasePath , this.coverImageName)
    }
})

module.exports = mongoose.model('Book' , bookSchema)
module.exports.coverImageBasePath = coverImageBasePath