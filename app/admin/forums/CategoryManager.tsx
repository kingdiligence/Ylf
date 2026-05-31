'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Trash2, Plus, Pin } from 'lucide-react'

type Category = { id: string; name: string; description: string | null; display_order: number }
type Thread = { id: string; title: string; created_at: string; pinned: boolean; profiles: { full_name: string | null } | null }

export default function CategoryManager({ initialCategories, threads }: { initialCategories: Category[], threads: Thread[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [threadList, setThreadList] = useState<Thread[]>(threads)
  const [form, setForm] = useState({ name: '', description: '' })
  const supabase = createClient()

  async function addCategory(e: React.FormEvent) {
    e.preventDefault()
    const { data } = await supabase.from('forum_categories').insert({
      name: form.name, description: form.description || null, display_order: categories.length
    }).select().single()
    if (data) setCategories(c => [...c, data])
    setForm({ name: '', description: '' })
  }

  async function deleteCategory(id: string) {
    await supabase.from('forum_categories').delete().eq('id', id)
    setCategories(c => c.filter(x => x.id !== id))
  }

  async function togglePin(id: string, pinned: boolean) {
    await supabase.from('forum_threads').update({ pinned }).eq('id', id)
    setThreadList(t => t.map(x => x.id === id ? { ...x, pinned } : x))
  }

  async function deleteThread(id: string) {
    await supabase.from('forum_threads').delete().eq('id', id)
    setThreadList(t => t.filter(x => x.id !== id))
  }

  return (
    <div className="space-y-8">
      {/* Categories */}
      <section>
        <h2 className="font-semibold text-gray-700 mb-4">Categories</h2>
        <form onSubmit={addCategory} className="bg-white border rounded-2xl p-5 space-y-3 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required placeholder="Category name" className="border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Short description (optional)" className="border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <button type="submit" className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition">
            <Plus size={15} /> Add Category
          </button>
        </form>
        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white border rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-gray-900">{cat.name}</p>
                {cat.description && <p className="text-xs text-gray-400">{cat.description}</p>}
              </div>
              <button onClick={() => deleteCategory(cat.id)} className="text-gray-400 hover:text-red-500 transition">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Threads */}
      <section>
        <h2 className="font-semibold text-gray-700 mb-4">Recent Threads</h2>
        <div className="space-y-2">
          {threadList.map(t => (
            <div key={t.id} className="bg-white border rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{t.title}</p>
                  <p className="text-xs text-gray-400">{t.profiles?.full_name ?? 'Anonymous'} · {new Date(t.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => togglePin(t.id, !t.pinned)}
                  className={`transition ${t.pinned ? 'text-green-700' : 'text-gray-400 hover:text-green-700'}`}>
                  <Pin size={15} />
                </button>
                <button onClick={() => deleteThread(t.id)} className="text-gray-400 hover:text-red-500 transition">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
