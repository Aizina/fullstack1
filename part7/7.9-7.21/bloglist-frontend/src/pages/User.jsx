import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Typography, List, ListItem, Card, CardContent } from '@mui/material'

const User = () => {
  const { id } = useParams()
  const user = useSelector(state => state.users.find(u => u.id === id))

  if (!user) return null

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h4" gutterBottom>{user.name}</Typography>
        <Typography variant="h6" gutterBottom>Added Blogs</Typography>
        <List>
          {user.blogs.map(blog => (
            <ListItem key={blog.id}>{blog.title}</ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

export default User
