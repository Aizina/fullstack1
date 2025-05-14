const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const { title, author, url, likes } = request.body
    
    if (!title || !url) {
      return response.status(400).json({ error: 'title and url are required' })
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})


blogsRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const { title, author, url, likes } = request.body
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { title, author, url, likes: likes || 0 },
      { new: true, runValidators: true, context: 'query' }
    )
    
    if (!updatedBlog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})


module.exports = blogsRouter