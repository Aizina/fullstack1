import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from '../components/Blog'
import BlogForm from '../components/BlogForm'
import Togglable from '../components/Togglable'
import { createBlogAction, likeBlog, deleteBlogAction } from '../features/blogSlice'
import { Stack, Typography } from '@mui/material'

const BlogListPage = ({ user }) => {
  const blogs = useSelector(state => state.blogs)
  const dispatch = useDispatch()
  const blogFormRef = useRef()

  const addBlog = async (blogObject) => {
    await dispatch(createBlogAction(blogObject))
    blogFormRef.current.toggleVisibility()
  }

  const handleLike = (blog) => dispatch(likeBlog(blog))
  const handleDelete = (id) => dispatch(deleteBlogAction(id))

  return (
    <div>
      <Typography variant="h4" gutterBottom>Blogs</Typography>

      <Togglable buttonLabel="New Blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <Stack spacing={2} mt={3}>
        {[...blogs].sort((a, b) => b.likes - a.likes).map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            onLike={() => handleLike(blog)}
            onDelete={() => handleDelete(blog.id)}
          />
        ))}
      </Stack>
    </div>
  )
}

export default BlogListPage
