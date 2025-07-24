const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  })
  res.json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('user', { name: 1, username: 1 })

    if (blog) {
      res.json(blog)
    } else {
      res.status(404).json({ error: 'Blog not found' })
    }
  } catch (error) {
    res.status(400).json({ error: 'Malformatted ID' })
  }
})

blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
  const { title, author, url, likes } = req.body
  const user = req.user

  if (!title || !url) {
    return res.status(400).json({ error: 'title and url are required' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
  res.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
  try{
    const user = req.user
    const blog = await Blog.findById(req.params.id)

    if (!blog) return res.status(404).json({ error: 'blog not found' })
    if (blog.user.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'unauthorized action' })
    }

    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', middleware.userExtractor, async (req, res) => {
  const { title, author, url, likes } = req.body
  const updated = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, author, url, likes, user: req.body.user },
    { new: true, runValidators: true, context: 'query' }
  ).populate('user', { username: 1, name: 1 })
  res.json(updated)
})

module.exports = blogsRouter
