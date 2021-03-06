const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs') // gives access to file system lybrary
const Books = require('../models/book')
const Author = require('../models/author') 
const uploadPath = path.join('public',Books.coverImageBasePath) // combining two paths public with coverImageBasePath 
const imageMimeTypes = ['image/jpeg','image/png','image/gif']
const upload = multer({
    dest: uploadPath, // takes the destination(path) of the files
    fileFilter: (req, file , callback) =>{ // it filter which files our server accept
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})
//all books route
router.get('/', async (req,res) =>{
    let query = Books.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))// regex is equivalent to equal
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore!= ''){
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter!= ''){
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
        res.render('books/index',{
            books:books,
            searchOptions : req.query
        })
    } catch {
        res.redirect('/')
    }
})

//new books route
router.get('/new',async (req,res)=>{
    renderNewPage(res , new Books())
})

//create books route
router.post('/', upload.single('cover'), async (req,res)=>{
    const fileName = req.file != null ? req.file.filename : null
    const book = new Books({
         title: req.body.title,
         author: req.body.author,
         publishDate: new Date(req.body.publishDate), //converting the string returned by req.body.publishDate into an actual Date 
         pageCount: req.body.pageCount,
         coverImageName: fileName,
         discription: req.body.description 
    })
    try{
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect('/books')
    }catch{
        if(book.coverImageName != null){
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res , book, true)
    }
})

async function renderNewPage (res , book, hasError=false){
    try{
        const authors = await Author.find({})
        const params = {
            authors:authors,
            book:book
        }
        if (hasError) params.errorMessage = 'Error Creating Book'
        res.render('books/new',params)
    }catch{
        res.redirect('/books')
    }
}
function removeBookCover(fileName){ 
    fs.unlink(path.join(uploadPath, fileName), err =>{
        if(err) console.error(err)
    })
}

module.exports = router 