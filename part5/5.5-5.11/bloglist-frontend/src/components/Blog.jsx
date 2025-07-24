import DetailedBlog from "./DetailedBlog"
import { useState } from "react"
import PropTypes from 'prop-types'

const Blog = ({ blog, user }) => {

    const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [showDetails, setShowDetails] = useState(false)

  const handleToggle = () => {
    setShowDetails(!showDetails)
  }
  return (
  <div style={blogStyle}>
    {blog.title} {blog.author}
    <button onClick={handleToggle}>{showDetails ? 'hide' : 'view'}</button>
    {showDetails && <DetailedBlog id={blog.id} user = {user}/>}
  </div>  
  )

}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired
  }).isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired
  })
}

export default Blog