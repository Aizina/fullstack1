const _ = require('lodash')

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorCounts = _.countBy(blogs, 'author')
  const topAuthor = _.maxBy(_.keys(authorCounts), (author) => authorCounts[author])

  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likesByAuthor = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})

  const topAuthor = _.maxBy(_.keys(likesByAuthor), (author) => likesByAuthor[author])

  return {
    author: topAuthor,
    likes: likesByAuthor[topAuthor]
  }
}

module.exports = {
    mostBlogs, 
    mostLikes
  }