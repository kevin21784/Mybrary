const express = require('express')
const router = express.Router()
const Author = require('../models/author')

//all Authors route
router.get('/', async (req,res) =>{
    let searchOptions = {}
    if(req.query.name != null && req.query.name !==''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try{
        const authors = await Author.find(searchOptions)     // {}you pass no wheres when you want to get all authors
        res.render('authors/index',{
            authors: authors,
            searchOptions : req.query
        })
    }catch{
        res.redirect('/')
    }
})

//new Authors route
router.get('/new',(req,res)=>{
    res.render('authors/new',{author : new Author()})
})

//create Author route
router.post('/', async (req,res)=>{
    const author = new Author({
        name: req.body.name
    })
        try {
            const newAuthor = await author.save()
            res.redirect('/authors')
        } catch {
            res.render('authors/new',{
                author : author,      // rewriting the value in the textbox from req.body.name
                errorMessage: 'Error creating Author'
            })
        }
})


module.exports = router