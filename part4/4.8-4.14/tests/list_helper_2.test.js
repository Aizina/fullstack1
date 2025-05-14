const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelperTwo = require('../utils/list_helper_2')

describe('most blogs', () => {
  const blogs = [
    { _id: '1', author: 'Alice', title: 'Blog 1', likes: 5 },
    { _id: '2', author: 'Bob', title: 'Blog 2', likes: 3 },
    { _id: '3', author: 'Alice', title: 'Blog 3', likes: 7 },
    { _id: '4', author: 'Alice', title: 'Blog 4', likes: 10 },
    { _id: '5', author: 'Bob', title: 'Blog 5', likes: 1 }
  ]

  test('author with most blogs', () => {
    const result = listHelperTwo.mostBlogs(blogs)
    assert.deepStrictEqual(result, { author: 'Alice', blogs: 3 })
  })

  test('when list has only one blog, return that author', () => {
    const oneBlogList = [{ _id: '1', author: 'Charlie', title: 'Single Blog', likes: 2 }]
    const result = listHelperTwo.mostBlogs(oneBlogList)
    assert.deepStrictEqual(result, { author: 'Charlie', blogs: 1 })
  })

  test('when list is empty, return null', () => {
    const result = listHelperTwo.mostBlogs([])
    assert.strictEqual(result, null)
  })
})


describe('most likes', () => {
    const blogs = [
      { _id: '1', author: 'Alice', title: 'Blog 1', likes: 5 },
      { _id: '2', author: 'Bob', title: 'Blog 2', likes: 3 },
      { _id: '3', author: 'Alice', title: 'Blog 3', likes: 7 },
      { _id: '4', author: 'Alice', title: 'Blog 4', likes: 10 },
      { _id: '5', author: 'Bob', title: 'Blog 5', likes: 12 }
    ]
  
    test('author with most likes', () => {
      const result = listHelperTwo.mostLikes(blogs)
      assert.deepStrictEqual(result, { author: 'Alice', likes: 22 })
    })
  
    test('when list has only one blog, return that author and likes', () => {
      const oneBlogList = [{ _id: '1', author: 'Charlie', title: 'Single Blog', likes: 2 }]
      const result = listHelperTwo.mostLikes(oneBlogList)
      assert.deepStrictEqual(result, { author: 'Charlie', likes: 2 })
    })
  
    test('when list is empty, return null', () => {
      const result = listHelperTwo.mostLikes([])
      assert.strictEqual(result, null)
    })
  })
  