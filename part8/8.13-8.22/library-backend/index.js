require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const Author = require('./models/Author')
const Book = require('./models/Book')
const User = require('./models/User')

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err.message))

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => await Book.countDocuments(),
    authorCount: async () => await Author.countDocuments(),
    allBooks: async (root, args) => {
      const query = {}
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (author) query.author = author._id
      }
      if (args.genre) query.genres = { $in: [args.genre] }

      return await Book.find(query).populate('author')
    },
    allAuthors: async () => await Author.find({}),
    me: (root, args, context) => context.currentUser
  },

  Author: {
    bookCount: async (root) => await Book.countDocuments({ author: root._id })
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } })

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }

      const book = new Book({ ...args, author: author._id })

      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.title, error }
        })
      }

      const populatedBook = await book.populate('author')
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
      if (!currentUser) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } })

      const author = await Author.findOne({ name: args.name })
      if (!author) return null

      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.name, error }
        })
      }

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
      try {
        await user.save()
      } catch (error) {
        throw new GraphQLError('Creating the user failed', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.username, error }
        })
      }
      return user
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', { extensions: { code: 'BAD_USER_INPUT' } })
      }

      const userForToken = { username: user.username, id: user._id }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
    return {}
  },
}).then(({ url }) => console.log(`🚀 Server ready at ${url}`))
