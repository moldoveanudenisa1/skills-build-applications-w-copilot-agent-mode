import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { UserModel } from './models/User.js'

const app = express()
const port = process.env.PORT ? Number(process.env.PORT) : 8000
const mongoUri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/octofit'

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ message: 'OctoFit Tracker backend is running' })
})

app.post('/users', async (req, res) => {
  try {
    const user = new UserModel(req.body)
    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unable to create user' })
  }
})

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB at', mongoUri)
    app.listen(port, () => {
      console.log(`Backend listening on http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  })
