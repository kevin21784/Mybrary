const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const indexRouters = require('./routes/index') 
const mongoose = require('mongoose')

app.set('view engine', 'ejs')
app.set('views',__dirname+'/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use('/', indexRouters)

mongoose.connect('mongodb://localhost/mybrary',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
    .then(()=>console.log('connected successfully ...'))
    .catch((err)=> console.error('Error'+err.message))

app.listen(process.env.PORT || 2000)

