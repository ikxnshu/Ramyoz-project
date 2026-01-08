import connectToDatabase from '../../../lib/mongodb'
import Note from '../../../models/Note'

export default async function handler(req, res) {
  await connectToDatabase()

  if (req.method === 'GET') {
    try {
      const notes = await Note.find().sort({ createdAt: -1 }).lean()
      res.status(200).json(notes)
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch notes' })
    }
  } else if (req.method === 'POST') {
    try {
      const { title, content } = req.body
      if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' })
      }
      const note = await Note.create({ title: title.trim(), content: content || '' })
      res.status(201).json(note)
    } catch (err) {
      res.status(500).json({ error: 'Failed to create note' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}