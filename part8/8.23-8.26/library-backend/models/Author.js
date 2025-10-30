import mongoose from 'mongoose'

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 3 },
  born: { type: Number, default: null },
})

authorSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  }
})

export default mongoose.model('Author', authorSchema)
