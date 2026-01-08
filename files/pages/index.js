import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes')
      const data = await res.json()
      setNotes(data)
    } catch (err) {
      console.error(err)
      setError('Failed to load notes')
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    if (!title.trim()) {
      setError('Title required')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err?.error || 'Failed to create')
      }
      setTitle('')
      setContent('')
      await fetchNotes()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this note?')) return
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      await fetchNotes()
    } catch (err) {
      alert('Failed to delete')
    }
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Notes</h1>

        <form onSubmit={handleCreate} className="mb-8 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Create a new note</h2>
          {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

          <label className="block mb-3">
            <span className="text-sm font-medium">Title</span>
            <input
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
            />
          </label>

          <label className="block mb-3">
            <span className="text-sm font-medium">Content</span>
            <textarea
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write something..."
            />
          </label>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Create'}
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => {
                setTitle(''); setContent(''); setError('')
              }}
            >
              Reset
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {notes.length === 0 && <div className="bg-white p-6 rounded shadow">No notes yet.</div>}

          {notes.map((note) => (
            <div key={note._id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{note.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{new Date(note.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/notes/${note._id}`}>
                    <a className="px-3 py-1 bg-yellow-300 text-sm rounded">Edit</a>
                  </Link>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {note.content && <p className="mt-3 text-gray-800 whitespace-pre-wrap">{note.content}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}