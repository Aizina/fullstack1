import { useParams, Link as RouterLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { likeBlog } from '../features/blogSlice'
import { Typography, Link, Button, Stack, Card, CardContent } from '@mui/material'

const BlogView = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const blog = useSelector(state => state.blogs.find(b => b.id === id))

  if (!blog) return null

  const userObject = typeof blog.user === 'object' ? blog.user : { name: blog.user || 'Unknown', id: blog.user || '' }

  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          <Link component={RouterLink} to={`/blogs/${blog.id}`} underline="hover">{blog.title}</Link>{' '}
          by <Link component={RouterLink} to={`/users/${userObject.id}`} underline="hover">{userObject.name}</Link>
        </Typography>

        <Typography>
          URL: <Link href={blog.url} target="_blank" rel="noopener">{blog.url}</Link>
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" mt={1}>
          <Typography>{blog.likes} likes</Typography>
          <Button variant="contained" size="small" onClick={() => dispatch(likeBlog(blog))}>Like</Button>
        </Stack>

        <Typography mt={1}>
          Added by <Link component={RouterLink} to={`/users/${userObject.id}`} underline="hover">{userObject.name}</Link>
        </Typography>
      </CardContent>
    </Card>
  )
}

export default BlogView
