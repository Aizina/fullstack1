import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { TextField, Button, Stack, Card, CardContent, Typography } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Create New Blog</Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Title" value={title} onChange={({ target }) => setTitle(target.value)} fullWidth required />
            <TextField label="Author" value={author} onChange={({ target }) => setAuthor(target.value)} fullWidth required />
            <TextField label="URL" value={url} onChange={({ target }) => setUrl(target.value)} fullWidth required />
            <Button type="submit" variant="contained">Create</Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default BlogForm
