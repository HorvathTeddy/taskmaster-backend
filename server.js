import express from 'express'
import mongoose from 'mongoose'
import Cors from 'cors'

// App config
const app = express()
const port = process.env.PORT || 8001

// API Endpoint
app.get("/", (req, res) => res.status(200).send("WE ON"))

// Listenter
app.listen(port, () => console.log(`listening on port: ${port}`))