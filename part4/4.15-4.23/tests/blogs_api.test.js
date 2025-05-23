const assert = require('node:assert');
const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

let token = '';
let userId = '';

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'John Doe',
    url: 'https://html.com',
    likes: 5
  },
  {
    title: 'JavaScript Basics',
    author: 'Jane Smith',
    url: 'https://js.com',
    likes: 10
  }
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({ username: 'root', name: 'Superuser', passwordHash });
  const savedUser = await user.save();
  userId = savedUser._id.toString();

  const response = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' });

  token = response.body.token;

  const blogObjects = initialBlogs.map(
    blog => new Blog({ ...blog, user: userId })
  );
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);
});

describe('Blog API', () => {
  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test('unique identifier is named id', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach(blog => assert(blog.id));
  });

  test('new blog can be added with token', async () => {
    const newBlog = {
      title: 'React Patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com',
      likes: 7
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1);
    const titles = blogsAtEnd.map(b => b.title);
    assert(titles.includes(newBlog.title));
  });

  test('missing likes defaults to 0', async () => {
    const newBlog = {
      title: 'No Likes Yet',
      author: 'Unknown',
      url: 'https://nolikes.com'
    };

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201);

    assert.strictEqual(response.body.likes, 0);
  });

  test('missing title or url returns 400', async () => {
    const invalidBlog = { author: 'No Title or URL' };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidBlog)
      .expect(400);

    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
  });

  test('blog can be deleted with token', async () => {
    const blogsAtStart = await Blog.find({});
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1);
  });

  test('blog can be updated', async () => {
    const blogsAtStart = await Blog.find({});
    const blogToUpdate = blogsAtStart[0];

    const updatedData = { likes: 100 };
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData)
      .expect(200);

    const updatedBlog = await Blog.findById(blogToUpdate.id);
    assert.strictEqual(updatedBlog.likes, updatedData.likes);
  });

  test('unauthorized user cannot add blog', async() => {

    const newBlog = {
      title: 'Unauthorized Blog',
      author: 'Unauthorized Author',
      url: 'https://unauthorized.com',
      likes: 5
    }

    await api.post('/api/blogs').send(newBlog).expect(401);

    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
  })
});

after(async () => {
  await mongoose.connection.close();
});
