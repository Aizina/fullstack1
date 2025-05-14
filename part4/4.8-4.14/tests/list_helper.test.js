const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('dummy function', () => {
  test('dummy returns one', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  const listWithMultipleBlogs = [
    {
      _id: '1',
      title: 'First Blog',
      author: 'Alice',
      url: 'https://example.com/1',
      likes: 10,
      __v: 0
    },
    {
      _id: '2',
      title: 'Second Blog',
      author: 'Bob',
      url: 'https://example.com/2',
      likes: 20,
      __v: 0
    },
    {
      _id: '3',
      title: 'Third Blog',
      author: 'Charlie',
      url: 'https://example.com/3',
      likes: 30,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has multiple blogs, sum of all likes is correct', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    assert.strictEqual(result, 60)
  })

  test('when list is empty, total likes should be 0', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
})

describe('favorite blog', () => {
  const blogs = [
    {
      _id: '1',
      title: 'First Blog',
      author: 'Alice',
      url: 'https://example.com/1',
      likes: 10,
      __v: 0
    },
    {
      _id: '2',
      title: 'Second Blog',
      author: 'Bob',
      url: 'https://example.com/2',
      likes: 20,
      __v: 0
    },
    {
      _id: '3',
      title: 'Third Blog',
      author: 'Charlie',
      url: 'https://example.com/3',
      likes: 30,
      __v: 0
    }
  ]

  test('when list has multiple blogs, return the one with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, {
      title: 'Third Blog',
      author: 'Charlie',
      likes: 30
    })
  })

  test('when list has only one blog, return that blog', () => {
    const oneBlogList = [blogs[0]]
    const result = listHelper.favoriteBlog(oneBlogList)
    assert.deepStrictEqual(result, {
      title: 'First Blog',
      author: 'Alice',
      likes: 10
    })
  })

  test('when list is empty, return null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })
})
