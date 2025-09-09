const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const initialUsers = [
  {
    username: 'testuser',
    name: 'Test User',
    password: 'password123',
  },
  {
    username: 'anotheruser',
    name: 'Another User',
    password: 'password456',
  },
]

beforeEach(async () => {
  await User.deleteMany({})

  const userObjects = await Promise.all(
    initialUsers.map(async (user) => {
      const passwordHash = await bcrypt.hash(user.password, 10)
      return new User({
        username: user.username,
        name: user.name,
        passwordHash,
      })
    })
  )

  await User.insertMany(userObjects)
})

describe('Blog Users', () => {
  test('Invalid usernames should not be created', async () => {
    const invalidUser = {
      username: 'ab',
      name: 'Short Username',
      password: 'validpass',
    }

    const response = await api.post('/api/users').send(invalidUser).expect(400)

    assert.ok(response.body.error)

    const users = await User.find({})
    console.log(
      'Users in DB:',
      users.map((u) => u.username)
    )
    assert.strictEqual(users.length, initialUsers.length)
  })

  test('Invalid passwords should not be created', async () => {
    const invalidUser = {
      username: 'validusername',
      name: 'Short Password',
      password: 'pw',
    }

    const response = await api.post('/api/users').send(invalidUser).expect(400)

    assert.ok(response.body.error)

    const users = await User.find({})
    console.log(
      'Users in DB:',
      users.map((u) => u.username)
    )
    assert.strictEqual(users.length, initialUsers.length)
  })

  test('Duplicate usernames should not be created', async () => {
    const duplicateUser = {
      username: initialUsers[0].username,
      name: 'Duplicate User',
      password: 'somepassword',
    }

    const response = await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400)

    assert.ok(response.body.error.includes('unique'))

    const users = await User.find({})
    console.log(
      'Users in DB:',
      users.map((u) => u.username)
    )
    assert.strictEqual(users.length, initialUsers.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
