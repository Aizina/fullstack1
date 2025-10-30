const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const { v1: uuid } = require('uuid')

let authors = [
  { name: 'Robert Martin', id: "afa51ab0-344d-11e9-a414-719c6709cf3e", born: 1952 },
  { name: 'Martin Fowler', id: "afa5b6f0-344d-11e9-a414-719c6709cf3e", born: 1963 },
  { name: 'Fyodor Dostoevsky', id: "afa5b6f1-344d-11e9-a414-719c6709cf3e", born: 1821 },
  { name: 'Joshua Kerievsky', id: "afa5b6f2-344d-11e9-a414-719c6709cf3e" },
  { name: 'Sandi Metz', id: "afa5b6f3-344d-11e9-a414-719c6709cf3e" }
]

let books = [
  { title: 'Clean Code', published: 2008, author: 'Robert Martin', id: uuid(), genres: ['refactoring'] },
  { title: 'Agile software development', published: 2002, author: 'Robert Martin', id: uuid(), genres: ['agile', 'patterns', 'design'] },
  { title: 'Refactoring, edition 2', published: 2018, author: 'Martin Fowler', id: uuid(), genres: ['refactoring'] },
  { title: 'Refactoring to patterns', published: 2008, author: 'Joshua Kerievsky', id: uuid(), genres: ['refactoring', 'patterns'] },
  { title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby', published: 2012, author: 'Sandi Metz', id: uuid(), genres: ['refactoring', 'design'] },
  { title: 'Crime and punishment', published: 1866, author: 'Fyodor Dostoevsky', id: uuid(), genres: ['classic', 'crime'] },
  { title: 'Demons', published: 1872, author: 'Fyodor Dostoevsky', id: uuid(), genres: ['classic', 'revolution'] }
]

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
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
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      let filtered = books
      if (args.author) {
        filtered = filtered.filter(b => b.author === args.author)
      }
      if (args.genre) {
        filtered = filtered.filter(b => b.genres.includes(args.genre))
      }
      return filtered
    },
    allAuthors: () => authors,
  },

  Author: {
    bookCount: (root) => books.filter(b => b.author === root.name).length
  },

  Mutation: {
    addBook: (root, args) => {
      if (books.find(b => b.title === args.title)) {
        throw new GraphQLError('Book title must be unique', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.title }
        })
      }

      let author = authors.find(a => a.name === args.author)
      if (!author) {
        author = { name: args.author, id: uuid(), born: null }
        authors = authors.concat(author)
      }

      const newBook = { ...args, id: uuid() }
      books = books.concat(newBook)
      return newBook
    },

    editAuthor: (root, args) => {
      const authorIndex = authors.findIndex(a => a.name === args.name)
      if (authorIndex === -1) return null

      const updatedAuthor = { ...authors[authorIndex], born: args.setBornTo }
      authors = authors.map((a, i) => i === authorIndex ? updatedAuthor : a)
      return updatedAuthor
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => ({}),
  cors: {
    origin: [
      "https://studio.apollographql.com",
      "http://localhost:3000", 
      "http://localhost:4000"
    ],
    credentials: true,
  },
}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
