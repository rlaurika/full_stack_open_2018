const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  try {
    const blog = new Blog(request.body)

    const result = await blog.save()

    response.status(201).json(result)
  } catch (exception) {
    response.status(500).json({ error: 'unexpected error' })
  }
})

module.exports = blogsRouter