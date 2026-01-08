import mongoose from 'mongoose'

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
})

// Avoid recompiling model during hot reloads
export default mongoose.models.Note || mongoose.model('Note', NoteSchema)