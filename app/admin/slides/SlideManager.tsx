'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Trash2, GripVertical, Upload, X } from 'lucide-react'
import Image from 'next/image'

type Slide = { id: string; title: string | null; caption: string | null; image_url: string; active: boolean; display_order: number }

export default function SlideManager({ initialSlides }: { initialSlides: Slide[] }) {
  const [slides, setSlides] = useState<Slide[]>(initialSlides)
  const [form, setForm] = useState({ title: '', caption: '' })
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setError('')
  }

  function clearFile() {
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function addSlide(e: React.FormEvent) {
    e.preventDefault()
    if (!file) { setError('Please select an image'); return }
    setUploading(true)
    setError('')
    setProgress('Uploading image...')

    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('slides')
      .upload(path, file, { contentType: file.type })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      setProgress('')
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('slides').getPublicUrl(path)

    setProgress('Saving slide...')
    const { data, error: insertError } = await supabase.from('slides').insert({
      title: form.title || null,
      caption: form.caption || null,
      image_url: publicUrl,
      display_order: slides.length,
    }).select().single()

    if (insertError) {
      setError(insertError.message)
    } else {
      setSlides(s => [...s, data])
      setForm({ title: '', caption: '' })
      clearFile()
    }

    setUploading(false)
    setProgress('')
  }

  async function toggleSlide(id: string, active: boolean) {
    await supabase.from('slides').update({ active }).eq('id', id)
    setSlides(s => s.map(sl => sl.id === id ? { ...sl, active } : sl))
  }

  async function deleteSlide(id: string, imageUrl: string) {
    // Extract storage path from URL
    const path = imageUrl.split('/slides/')[1]
    if (path) await supabase.storage.from('slides').remove([path])
    await supabase.from('slides').delete().eq('id', id)
    setSlides(s => s.filter(sl => sl.id !== id))
  }

  return (
    <div className="space-y-6">
      <form onSubmit={addSlide} className="bg-white border rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Add New Slide</h2>
        {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

        {/* File upload area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image *</label>
          {preview ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100 group">
              <Image src={preview} alt="Preview" fill className="object-cover" />
              <button type="button" onClick={clearFile}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                <X size={14} />
              </button>
              <p className="absolute bottom-2 left-2 text-xs text-white bg-black/40 px-2 py-1 rounded-full">{file?.name}</p>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50 transition">
              <Upload size={24} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Click to upload image</span>
              <span className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP up to 5MB</span>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange} className="hidden" />
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="FALA 2024 Awards"
              className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
            <input type="text" value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
              placeholder="Future African Leaders Award Ceremony"
              className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>

        <button type="submit" disabled={uploading || !file}
          className="flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-50 transition">
          <Upload size={16} />
          {uploading ? progress || 'Uploading...' : 'Upload Slide'}
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
            <button onClick={() => deleteSlide(slide.id, slide.image_url)}
              className="text-gray-400 hover:text-red-500 transition flex-shrink-0">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {slides.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No slides yet. Upload your first one above.</p>}
      </div>
    </div>
  )
}
