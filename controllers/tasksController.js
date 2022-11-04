const User = require('../models/User')
const Task = require('../models/Task')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all tasks
// @route GET /tasks
// @access Private
const getAllTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find().lean()
    if (!tasks.length) {
        return res.status(400).json({ Message: 'No tasks were found' })
    }

    const tasksWithUser = await Promise.all(tasks.map(async (task) => {
        const user = await User.findById(task.user).lean().exec()
        return {...task, username: user.username}
    }))

    res.json(tasksWithUser)
})

// @desc Create a new task
// @route POST /tasks
// @access Private
const createNewTask = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body

    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const duplicate = await Task.findOne({ title }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate task title' })
    }

    const task = await Task.create({ user, title, text })

    if (task) {
        return res.status(201).json({ message: 'New task created' })
    } else {
        return res.status(400).json({ message: 'Invalid task data recieved' })
    }
})

// @desc Update a task
// @route PATCH /tasks
// @access Private
const updateTask = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body

    // Confirm data
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm task exists to update
    const task = await Task.findById(id).exec()

    if (!task) {
        return res.status(400).json({ message: 'Task not found' })
    }

    // Check for duplicate title
    const duplicate = await Task.findOne({ title }).lean().exec()

    // Allow renaming of the original task 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate task title' })
    }

    task.user = user
    task.title = title
    task.text = text
    task.completed = completed

    const updatedTask = await task.save()

    res.json(`'${updatedTask.title}' updated`)
})

// @desc Delete a task
// @route DELETE /tasks
// @access Private
const deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Task ID required' })
    }

    // Confirm task exists to delete 
    const task = await Task.findById(id).exec()

    if (!task) {
        return res.status(400).json({ message: 'Task not found' })
    }

    const result = await task.deleteOne()

    const reply = `Task '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
})