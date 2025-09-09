import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setTimedNotification } from './notificationSlice'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) { return action.payload },
    addBlog(state, action) { state.push(action.payload) },
    updateBlog(state, action) {
      const updated = action.payload
      return state.map(b => (b.id === updated.id ? updated : b))
    },
    removeBlog(state, action) { return state.filter(b => b.id !== action.payload) },
  },
})

export const { setBlogs, addBlog, updateBlog, removeBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlogAction = (blogObject) => async (dispatch, getState) => {
  try {
    const newBlog = await blogService.create(blogObject)
    const user = getState().user
    const populatedBlog = { ...newBlog, user: user ? { name: user.name, username: user.username, id: user.id } : newBlog.user }
    dispatch(addBlog(populatedBlog))
    dispatch(setTimedNotification(`A new blog "${newBlog.title}" by ${newBlog.author} added`, 'success', 5))
    return populatedBlog
  } catch (error) {
    dispatch(setTimedNotification(error?.response?.data?.error || 'Failed to add new blog', 'error', 5))
    throw error
  }
}

export const likeBlog = (blog) => async (dispatch) => {
  try {
    const updated = { ...blog, likes: (blog.likes || 0) + 1 }
    const returned = await blogService.updateBlog(updated)
    dispatch(updateBlog(returned))
  } catch (error) {
    dispatch(setTimedNotification(error?.response?.data?.error || 'Failed to update likes', 'error', 5))
    console.error('likeBlog failed', error)
  }
}

export const deleteBlogAction = (id) => async (dispatch) => {
  try {
    await blogService.deleteBlog(id)
    dispatch(removeBlog(id))
    dispatch(setTimedNotification('Blog deleted successfully.', 'success', 5))
  } catch (error) {
    dispatch(setTimedNotification(error?.response?.data?.error || 'Failed to delete blog', 'error', 5))
    console.error('deleteBlogAction failed', error)
  }
}

export const addCommentAction = (blogId, comment) => async (dispatch) => {
  try {
    const updatedBlog = await blogService.addComment(blogId, comment)
    dispatch(updateBlog(updatedBlog))
    dispatch(setTimedNotification('Comment added', 'success', 5))
    return updatedBlog
  } catch (error) {
    dispatch(setTimedNotification(error?.response?.data?.error || 'Failed to add comment', 'error', 5))
    throw error
  }
}

export default blogSlice.reducer
