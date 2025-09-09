const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (_req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  res.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (req, res, next) => {
  try {
    const { title, author, url, likes } = req.body
    const user = req.user

    if (!user)
      return res.status(401).json({ error: 'token missing or invalid' })
    if (!title || !url)
      return res.status(400).json({ error: 'title and url are required' })

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user._id,
    })

    const savedBlog = await blog.save()
    await User.findByIdAndUpdate(user._id, { $push: { blogs: savedBlog._id } })

    const populatedBlog = await savedBlog.populate('user', {
      username: 1,
      name: 1,
    })
    res.status(201).json(populatedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', middleware.userExtractor, async (req, res, next) => {
  try {
    const { title, author, url, likes } = req.body
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, author, url, likes },
      { new: true, runValidators: true }
    ).populate('user', { username: 1, name: 1 })

    if (updatedBlog) {
      res.json(updatedBlog)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({ error: 'blog not found' })

    if (blog.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'unauthorized' })
    }

    await Blog.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'deleted', id: req.params.id })
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/:id/comments', async (req, res, next) => {
  try {
    const { comment } = req.body
    if (!comment) {
      return res.status(400).json({ error: 'comment is required' })
    }

    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({ error: 'blog not found' })

    blog.comments = blog.comments.concat(comment)
    const updatedBlog = await blog.save()
    res.status(201).json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
