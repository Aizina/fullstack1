import { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import {
  Typography,
  Button,
  TextField,
  Stack,
  Card,
  CardContent,
  List,
  ListItem,
  Divider,
  Link
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const DetailedBlog = ({ blog, user, onLike, onDelete, addCommentAction }) => {
  const dispatch = useDispatch()
  const [comments, setComments] = useState(blog.comments || [])
  const [newComment, setNewComment] = useState('')

  if (!blog) return <Typography>Loading blog...</Typography>

  const userObject = typeof blog.user === 'object'
    ? blog.user
    : { name: blog.user || 'Unknown', username: '', id: blog.user || '' }
  const isBlogOwner = user && userObject.username === user.username

  const handleCommentSubmit = async e => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const updatedBlog = await dispatch(addCommentAction(blog.id, newComment.trim()))
      setComments(updatedBlog.comments || [])
      setNewComment('')
    } catch (err) {
      console.error('Failed to add comment', err)
    }
  }

  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>{blog.title}</Typography>

        <Typography variant="body1" gutterBottom>
          URL: <Link href={blog.url} target="_blank" rel="noopener">{blog.url}</Link>
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" mt={1} mb={1}>
          <Typography>Likes: {blog.likes}</Typography>
          <Button variant="contained" size="small" onClick={onLike}>Like</Button>
        </Stack>

        <Typography variant="body2" gutterBottom>
          Added by: <Link component={RouterLink} to={`/users/${userObject.id}`}>{userObject.name}</Link>
        </Typography>

        {isBlogOwner && (
          <Button variant="outlined" color="error" onClick={onDelete} sx={{ mb: 2 }}>
            Remove
          </Button>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Comments</Typography>
        <List>
          {comments.map((c, i) => <ListItem key={i}>{c}</ListItem>)}
        </List>

        <form onSubmit={handleCommentSubmit}>
          <Stack direction="row" spacing={1} mt={1}>
            <TextField
              label="Add a comment"
              variant="outlined"
              size="small"
              fullWidth
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
            <Button type="submit" variant="contained">Add</Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  )
}

DetailedBlog.propTypes = {
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
  onLike: PropTypes.func,
  onDelete: PropTypes.func,
  addCommentAction: PropTypes.func.isRequired,
}

export default DetailedBlog
