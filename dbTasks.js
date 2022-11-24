import mongoose from 'mongoose'

const taskSchema = mongoose.Schema({
    name: String,
    description: String,
    date: Date,
    completed: {type: Boolean, default: false}
})

export default mongoose.model('tasks', taskSchema)