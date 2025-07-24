import { useState } from 'react';
import BlogService from '../services/blogs'; 

const BlogForm = ( { createBlog }) => {

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault()
        createBlog( {title, author, url})
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    
    return (
        <div className="create-new-container">
            <h2>Create New </h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input id="title" type="text" name="title" 
                    value={title} onChange={({target}) => {setTitle(target.value)}}/>
                </div>
                <div>
                    <label htmlFor="author">Author</label>
                    <input id="author" type="text" name="author" 
                    value={author} onChange={({target}) => {setAuthor(target.value)}}/>
                </div>
                <div>
                    <label htmlFor="url">URL</label>
                    <input id="url" type="text" name="url" 
                    value={url} onChange={({target}) => {setUrl(target.value)}}/>
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    )
}

export default BlogForm;