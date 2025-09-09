import DetailedBlog from './DetailedBlog'
import { useState } from 'react'
import PropTypes from 'prop-types'
import { addCommentAction } from '../features/blogSlice'
import { Card, CardContent, Typography, Button, Stack, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const Blog = ({ blog, user, onLike, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false)
  const toggleDetails = () => setShowDetails(prev => !prev)

  const userObject = typeof blog.user === 'object' ? blog.user : { name: blog.user || 'Unknown', id: blog.user || '' }

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            <Link component={RouterLink} to={`/blogs/${blog.id}`} underline="hover">{blog.title}</Link>{' '}
            by <Link component={RouterLink} to={`/users/${userObject.id}`} underline="hover">{userObject.name}</Link>
          </Typography>
          <Button size="small" variant="outlined" onClick={toggleDetails}>
            {showDetails ? 'Hide' : 'View'}
          </Button>
        </Stack>

        {showDetails && (
          <DetailedBlog
            blog={blog}
            user={user}
            onLike={onLike}
            onDelete={onDelete}
            addCommentAction={addCommentAction}
          />
        )}
      </CardContent>
    </Card>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    comments: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    name: PropTypes.string,
  }),
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default Blog
