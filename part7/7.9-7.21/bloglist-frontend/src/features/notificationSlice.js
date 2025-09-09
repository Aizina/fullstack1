import { createSlice } from '@reduxjs/toolkit'

const initialState = { message: '', type: '' } 

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return { message: '', type: '' }
    },
  },
})

export const { setNotification, clearNotification } = notificationSlice.actions


export const setTimedNotification = (message, type = 'success', seconds = 5) => {
  return (dispatch) => {
    dispatch(setNotification({ message, type }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
