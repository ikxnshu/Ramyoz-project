import connectToDatabase from '../../../lib/mongodb'
import Note from '../../../models/Note'
import mongoose from 'mongoose'

export default async function handler(req, res) {
  await connectToDatabase()

  const { id } = req.query

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid note id' })
  }

  if (req.method === 'GET') {
    try {
      const note = await Note.findById(id).lean()
      if (!note) return res.status(404).json({ error: 'Note not found' })
      res.status(200).json(note)
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch note' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { title, content } = req.body
      if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' })
      }
      const updated = await Note.findByIdAndUpdate(id, { title: title.trim(), content: content || '' }, { new: true })
      if (!updated) return res.status(404).json({ error: 'Note not found' })
      res.status(200).json(updated)
    } catch (err) {
      res.status(500).json({ error: 'Failed to update note' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const deleted = await Note.findByIdAndDelete(id)
      if (!deleted) return res.status(404).json({ error: 'Note not found' })
      res.status(200).json({ message: 'Note deleted' })
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete note' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}