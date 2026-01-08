import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function NoteEdit() {
  const router = useRouter()
  const { id } = router.query

  const [note, setNote] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    const fetchNote = async () => {
      try {
        const res = await fetch(`/api/notes/${id}`)
        if (!res.ok) throw new Error('Not found')
        const data = await res.json()
        setNote(data)
        setTitle(data.title || '')
        setContent(data.content || '')
      } catch (err) {
        setError('Failed to load note')
      }
    }
    fetchNote()
  }, [id])

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err?.error || 'Update failed')
      }
      router.push('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-lg w-full p-6">
          <p className="text-red-600">{error}</p>
          <Link href="/"><a className="text-blue-600">Back</a></Link>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit Note</h1>
        <form onSubmit={handleUpdate} className="bg-white p-6 rounded shadow">
          {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
          <label className="block mb-3">
            <span className="text-sm font-medium">Title</span>
            <input
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="block mb-3">
            <span className="text-sm font-medium">Content</span>
            <textarea
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </label>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <Link href="/">
              <a className="px-4 py-2 bg-gray-200 rounded">Cancel</a>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}