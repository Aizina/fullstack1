import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import http from 'http'
import mongoose from 'mongoose'
import DataLoader from 'dataloader'
import jwt from 'jsonwebtoken'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServer } from 'apollo-server-express'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/use/ws'
import { PubSub } from 'graphql-subscriptions'
import Author from './models/Author.js'
import Book from './models/Book.js'
import User from './models/User.js'

mongoose.set('strictQuery', false)
await mongoose.connect(process.env.MONGODB_URI)
console.log('Connected to MongoDB')

const pubsub = new PubSub()

const typeDefs = `
  type Book { title: String! published: Int! author: Author! genres: [String!]! id: ID! }
  type Author { name: String! born: Int id: ID! bookCount: Int! }
  type User { username: String! favoriteGenre: String! id: ID! }
  type Token { value: String! }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(title: String!, author: String!, published: Int!, genres: [String!]!): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`

const createBookCountLoader = () =>
  new DataLoader(async (authorIds) => {
    const objectIds = authorIds.map(id => new mongoose.Types.ObjectId(id))
    const counts = await Book.aggregate([
      { $match: { author: { $in: objectIds } } },
      { $group: { _id: '$author', count: { $sum: 1 } } }
    ])
    const countMap = new Map(counts.map(c => [c._id.toString(), c.count]))
    return authorIds.map(id => countMap.get(id.toString()) || 0)
  })

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),
    allBooks: async (root, args) => {
      const query = {}
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (author) query.author = author._id
      }
      if (args.genre) query.genres = { $in: [args.genre] }
      return Book.find(query).populate('author')
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      return authors.map(a => ({
        _id: a._id,
        id: a._id.toString(),
        name: a.name,
        born: a.born
      }))
    },
    me: (root, args, context) => context.currentUser
  },
  Author: {
    bookCount: (root, args, { bookCountLoader }) => {
      const id = root._id ? root._id.toString() : (root.id ? root.id.toString() : undefined)
      if (!id) return 0
      return bookCountLoader.load(id)
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) throw new Error('Not authenticated')

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }

      const book = new Book({ ...args, author: author._id })
      await book.save()

      const populatedBook = await book.populate('author')
      pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook })

      const bookCount = await Book.countDocuments({ author: author._id })
      return {
        __typename: 'Book',
        id: populatedBook._id.toString(),
        title: populatedBook.title,
        published: populatedBook.published,
        genres: populatedBook.genres,
        author: {
          __typename: 'Author',
          id: author._id.toString(),
          name: author.name,
          born: author.born,
          bookCount
        }
      }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) throw new Error('Not authenticated')

      const author = await Author.findOne({ name: args.name })
      if (!author) return null
      author.born = args.setBornTo
      await author.save()

      const bookCount = await Book.countDocuments({ author: author._id })
      return {
        __typename: 'Author',
        id: author._id.toString(),
        name: author.name,
        born: author.born,
        bookCount
      }
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      await user.save()
      return user
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') throw new Error('Wrong credentials')
      const userForToken = { username: user.username, id: user._id }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
    Subscription: {
      bookAdded: {
        subscribe: () => {
          if (typeof pubsub.asyncIterableIterator === 'function') {
            return pubsub.asyncIterableIterator('BOOK_ADDED')
          }
          return pubsub.asyncIterator('BOOK_ADDED')
        },
      },
    },
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

async function httpContext({ req }) {
  const auth = req?.headers?.authorization
  const bookCountLoader = createBookCountLoader()
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    try {
      const decoded = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decoded.id)
      return { currentUser, bookCountLoader, pubsub }
    } catch {
    }
  }
  return { bookCountLoader, pubsub }
}

const app = express()
app.use(cors())
app.use(express.json())

const apolloServer = new ApolloServer({
  schema,
  context: httpContext,
})
await apolloServer.start()
apolloServer.applyMiddleware({ app, path: '/graphql', cors: false })

const httpServer = http.createServer(app)

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
})

async function getWsContext(ctx) {
  const connectionParams = ctx.connectionParams || {}
  const auth = connectionParams.authorization || connectionParams.Authorization
  const bookCountLoader = createBookCountLoader()
  if (auth && typeof auth === 'string' && auth.toLowerCase().startsWith('bearer ')) {
    try {
      const decoded = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decoded.id)
      return { currentUser, bookCountLoader, pubsub }
    } catch {
    }
  }
  return { bookCountLoader, pubsub }
}

useServer(
  {
    schema,
    context: getWsContext,
  },
  wsServer
)

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`)
  console.log(`📡 Subscriptions ready at ws://localhost:${PORT}${apolloServer.graphqlPath}`)
})
