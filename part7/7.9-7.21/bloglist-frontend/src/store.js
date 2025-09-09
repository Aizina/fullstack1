import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './features/notificationSlice'
import blogReducer from './features/blogSlice'
import userReducer from './features/userSlice'
import usersReducer from './features/usersSlice'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    user: userReducer,
    users: usersReducer
  },
})

export default store