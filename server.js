const express = require('express')
//import mongoose from 'mongoose'
//import Cors from 'cors'
const path = require('path')

// App config
const app = express()
const port = process.env.PORT || 8001

// API Endpoints
app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/', require('./routes/root'))
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) res.sendFile(path.join(__dirname, 'views', '404.html'))
    else if (req.accepts('json')) res.json({ message: '404 Not Found' })
    else res.type('txt').send('404 Not Found')
})

// Listenter
app.listen(port, () => console.log(`listening on port: ${port}`))