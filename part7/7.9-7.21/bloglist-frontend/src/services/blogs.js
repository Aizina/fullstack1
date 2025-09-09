import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
export const setToken = newToken => { token = `Bearer ${newToken}` }

export const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export const create = async (newBlog) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

export const updateBlog = async (updatedBlog) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog, config)
  return response.data
}


export const deleteBlog = async (id) => {
  const config = { headers: { Authorization: token } }
  await axios.delete(`${baseUrl}/${id}`, config)
}

export const addComment = async (blogId, comment) => {
  const response = await axios.post(`${baseUrl}/${blogId}/comments`, { comment })
  return response.data
}

export default { getAll, create, updateBlog, deleteBlog, setToken, addComment }
