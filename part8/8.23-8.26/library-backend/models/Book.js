import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 1 },
  published: { type: Number, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
  genres: { type: [String], default: [] }
})

bookSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  }
})

export default mongoose.model('Book', bookSchema)
