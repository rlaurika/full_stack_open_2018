const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// Get all users
usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users.map(User.format))
})

// Create new user
usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    if (body.password && body.password.length < 3) {
      return response.status(400).json(
        { error: 'password given is too short (must be at least 3 chars long)' }
      )
    }

    const existingUser = await User.find({ username: body.username })

    if (existingUser.length !== 0) {
      return response.status(409).json({ error: 'a user with that username already exists' })
    }

    let adult = true
    if (body.adult !== undefined) {
      adult = body.adult
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      adult: adult,
      passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(User.format(savedUser))
  } catch (exception) {
    response.status(500).json({ error: 'something went wrong' })
  }
})

module.exports = usersRouter