'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Trash2, Plus } from 'lucide-react'

type Webinar = { id: string; title: string; description: string | null; host: string | null; scheduled_at: string; join_url: string | null; active: boolean }

export default function WebinarManager({ initialWebinars }: { initialWebinars: Webinar[] }) {
  const [webinars, setWebinars] = useState<Webinar[]>(initialWebinars)
  const [form, setForm] = useState({ title: '', description: '', host: '', scheduled_at: '', join_url: '' })
  const [adding, setAdding] = useState(false)
  const supabase = createClient()

  async function addWebinar(e: React.FormEvent) {
    e.preventDefault()
    setAdding(true)
    const { data } = await supabase.from('webinars').insert({
      title: form.title,
      description: form.description || null,
      host: form.host || null,
      scheduled_at: form.scheduled_at,
      join_url: form.join_url || null,
    }).select().single()
    if (data) setWebinars(w => [data, ...w])
    setForm({ title: '', description: '', host: '', scheduled_at: '', join_url: '' })
    setAdding(false)
  }

  async function deleteWebinar(id: string) {
    await supabase.from('webinars').delete().eq('id', id)
    setWebinars(w => w.filter(x => x.id !== id))
  }

  return (
    <div className="space-y-6">
      <form onSubmit={addWebinar} className="bg-white border rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Schedule New Webinar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
            <input type="text" value={form.host} onChange={e => setForm(f => ({ ...f, host: e.target.value }))}
              placeholder="Dr. Jane Smith" className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time *</label>
            <input type="datetime-local" value={form.scheduled_at} onChange={e => setForm(f => ({ ...f, scheduled_at: e.target.value }))}
              required className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Join URL (Zoom/Meet)</label>
            <input type="url" value={form.join_url} onChange={e => setForm(f => ({ ...f, join_url: e.target.value }))}
              placeholder="https://zoom.us/j/..." className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3} className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>
        </div>
        <button type="submit" disabled={adding}
          className="flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-50 transition">
          <Plus size={16} /> {adding ? 'Scheduling...' : 'Schedule Webinar'}
        </button>
      </form>

      <div className="space-y-3">
        {webinars.map(w => (
          <div key={w.id} className="bg-white border rounded-xl p-4 flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-gray-900 text-sm">{w.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{new Date(w.scheduled_at).toLocaleString()} {w.host && `· ${w.host}`}</p>
              {w.join_url && <a href={w.join_url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline">{w.join_url}</a>}
            </div>
            <button onClick={() => deleteWebinar(w.id)} className="text-gray-400 hover:text-red-500 transition flex-shrink-0">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {webinars.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No webinars yet.</p>}
      </div>
    </div>
  )
}
