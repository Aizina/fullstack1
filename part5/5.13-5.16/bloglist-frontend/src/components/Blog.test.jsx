
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import DetailedBlog from './DetailedBlog'
import blogService from '../services/blogs'
import { vi } from 'vitest'

vi.mock('../services/blogs')

const blog = {
  id: '123',
  title: 'Test Blog',
  author: 'Author',
  url: 'http://example.com',
  likes: 5,
  user: {
    username: 'testuser',
    name: 'Test User'
  }
}

const user = {
  username: 'testuser',
  name: 'Test User'
}

describe('<Blog />', () => {
  beforeEach(() => {
    blogService.getBlog = vi.fn().mockResolvedValue(blog)
  })

test('5.13: renders title and author, but not url or likes by default', () => {
  const mockLikeUpdate = vi.fn()
  const mockDeleteUpdate = vi.fn()

  render(
    <Blog
      blog={blog}
      user={user}
      onLikeUpdate={mockLikeUpdate}
      onDeleteUpdate={mockDeleteUpdate}
    />
  )
  
  expect(screen.getByText(/Test Blog/)).toBeInTheDocument()
  expect(screen.getByText(/Author/)).toBeInTheDocument()

  expect(screen.queryByText(/http:\/\/example.com/)).not.toBeInTheDocument()
  expect(screen.queryByText(/Likes:/)).not.toBeInTheDocument()
})

  test('5.14: shows url and likes when view button is clicked', () => {
    render(<Blog blog={blog} user={user} />)

    const viewButton = screen.getByText('view')
    fireEvent.click(viewButton)

    expect(screen.getByText('http://example.com')).toBeInTheDocument()
    expect(screen.getByText('Likes: 5')).toBeInTheDocument()
  })

  test('5.15: clicking like button twice calls handler twice', () => {
    const onLike = vi.fn()

    render(<DetailedBlog blog={blog} user={user} onLike={onLike} />)

    const likeButton = screen.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(onLike).toHaveBeenCalledTimes(2)
  })
})
