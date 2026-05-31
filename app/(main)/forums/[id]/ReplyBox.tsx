'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ReplyBox({ threadId }: { threadId: string }) {
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleReply(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    await supabase.from('forum_replies').insert({ thread_id: threadId, author_id: user.id, body })
    try { await supabase.rpc('increment_reply_count', { thread_id: threadId }) } catch {}
    setBody('')
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleReply} className="bg-white border rounded-2xl p-4 space-y-3">
      <h3 className="font-semibold text-gray-700 text-sm">Leave a reply</h3>
      <textarea value={body} onChange={e => setBody(e.target.value)}
        required rows={4} placeholder="Write your reply..."
        className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
      <button type="submit" disabled={loading}
        className="bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-50 transition">
        {loading ? 'Posting...' : 'Reply'}
      </button>
    </form>
  )
}
