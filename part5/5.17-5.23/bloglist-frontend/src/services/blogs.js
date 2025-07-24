import axios from 'axios';
const baseUrl = '/api/blogs';

export const getAll = () =>
  axios.get(baseUrl).then(res => res.data);

export const create = async newBlog =>
  (await axios.post(baseUrl, newBlog)).data;

export const getBlog = async id =>
  (await axios.get(`${baseUrl}/${id}`)).data;

export const updateBlog = async ({ id, title, author, url, likes }) => {
  const response = await axios.put(`${baseUrl}/${id}`, {
    title,
    author,
    url,
    likes,
  });
  return response.data;
};

export const deleteBlog = async id =>
  (await axios.delete(`${baseUrl}/${id}`));

export default { getAll, create, getBlog, updateBlog, deleteBlog };