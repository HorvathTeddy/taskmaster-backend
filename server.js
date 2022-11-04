require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')

// App config
const app = express()
const port = process.env.PORT || 8001
console.log(process.env.NODE_ENV)

// DB connection
connectDB()

// Middlewares
app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// API Endpoints
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/root'))
app.use('/users', require('./routs/userRoutes'))
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) res.sendFile(path.join(__dirname, 'views', '404.html'))
    else if (req.accepts('json')) res.json({ message: '404 Not Found' })
    else res.type('txt').send('404 Not Found')
})

// more middleware
app.use(errorHandler)

// Listenter
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(port, () => console.log(`listening on port: ${port}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})