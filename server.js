import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import Tasks from './dbTasks.js'

// App config
const app = express()
const port = process.env.PORT || 8080
const connection_url = 'mongodb+srv://admin:ieUcQybPWxpk9xiS@cluster0.q0fia0h.mongodb.net/taskmaster?retryWrites=true&w=majority'

// Middlewares
app.use(express.json())
app.use(cors())

// DB config
mongoose.connect(connection_url, {
    
})

// API Endpoints
app.get("/", (req, res) => res.status(200).send("WE ON"))

app.post("/tasks", (req, res) => {
    const dbTask = req.body

    Tasks.create(dbTask, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

app.get("/tasks", (req, res) => {
    Tasks.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

app.delete("/tasks", (req, res) => {
    Tasks.deleteMany((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})


// Listener
app.listen(port, () => console.log(`listening on 10.0.2.2: ${port}`))