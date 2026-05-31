import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MessageSquare, Plus } from 'lucide-react'

export default async function ForumsPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('forum_categories')
    .select('id, name, description')
    .order('display_order')

  const { data: threads } = await supabase
    .from('forum_threads')
    .select('id, title, created_at, reply_count, category_id, profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Forums</h1>
        <Link href="/forums/new"
          className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition">
          <Plus size={16} /> New Thread
        </Link>
      </div>

      {categories && categories.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {categories.map(cat => (
            <div key={cat.id} className="bg-green-50 border border-green-100 rounded-xl p-4">
              <h3 className="font-semibold text-green-900 text-sm">{cat.name}</h3>
              {cat.description && <p className="text-green-700 text-xs mt-1">{cat.description}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {threads && threads.length > 0 ? threads.map(thread => (
          <Link key={thread.id} href={`/forums/${thread.id}`}
            className="flex items-start gap-4 bg-white border rounded-xl p-4 hover:shadow-sm hover:border-green-300 transition">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MessageSquare size={18} className="text-green-700" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{thread.title}</h3>
              <p className="text-gray-400 text-xs mt-0.5">
                {/* @ts-expect-error supabase join type */}
                by {thread.profiles?.full_name ?? 'Anonymous'} · {thread.reply_count} replies · {new Date(thread.created_at).toLocaleDateString()}
              </p>
            </div>
          </Link>
        )) : (
          <div className="text-center py-16 text-gray-400">
            No threads yet. Be the first to start a discussion.
          </div>
        )}
      </div>
    </div>
  )
}
