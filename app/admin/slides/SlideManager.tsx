'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Trash2, GripVertical, Plus } from 'lucide-react'
import Image from 'next/image'

type Slide = { id: string; title: string | null; caption: string | null; image_url: string; active: boolean; display_order: number }

export default function SlideManager({ initialSlides }: { initialSlides: Slide[] }) {
  const [slides, setSlides] = useState<Slide[]>(initialSlides)
  const [form, setForm] = useState({ title: '', caption: '', image_url: '' })
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function addSlide(e: React.FormEvent) {
    e.preventDefault()
    if (!form.image_url.trim()) return
    setAdding(true)
    const { data, error } = await supabase.from('slides').insert({
      title: form.title || null,
      caption: form.caption || null,
      image_url: form.image_url,
      display_order: slides.length,
    }).select().single()
    if (error) { setError(error.message); setAdding(false); return }
    setSlides(s => [...s, data])
    setForm({ title: '', caption: '', image_url: '' })
    setAdding(false)
  }

  async function toggleSlide(id: string, active: boolean) {
    await supabase.from('slides').update({ active }).eq('id', id)
    setSlides(s => s.map(sl => sl.id === id ? { ...sl, active } : sl))
  }

  async function deleteSlide(id: string) {
    await supabase.from('slides').delete().eq('id', id)
    setSlides(s => s.filter(sl => sl.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Add form */}
      <form onSubmit={addSlide} className="bg-white border rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Add New Slide</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
            <input type="url" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
              required placeholder="https://..." className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="FALA 2024 Awards" className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
            <input type="text" value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
              placeholder="Future African Leaders Award Ceremony" className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
        <button type="submit" disabled={adding}
          className="flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-50 transition">
          <Plus size={16} /> {adding ? 'Adding...' : 'Add Slide'}
        </button>
      </form>

      {/* Slide list */}
      <div className="space-y-3">
        {slides.map(slide => (
          <div key={slide.id} className="bg-white border rounded-xl p-4 flex items-center gap-4">
            <GripVertical size={16} className="text-gray-300 flex-shrink-0" />
            <div className="w-20 h-12 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <Image src={slide.image_url} alt={slide.title ?? 'slide'} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900 truncate">{slide.title ?? 'Untitled'}</p>
              {slide.caption && <p className="text-xs text-gray-400 truncate">{slide.caption}</p>}
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={slide.active} onChange={e => toggleSlide(slide.id, e.target.checked)}
                className="accent-green-700" />
              Active
            </label>
            <button onClick={() => deleteSlide(slide.id)}
              className="text-gray-400 hover:text-red-500 transition flex-shrink-0">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {slides.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No slides yet. Add your first one above.</p>}
      </div>
    </div>
  )
}
