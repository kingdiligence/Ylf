import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ReplyBox from './ReplyBox'

export default async function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: thread } = await supabase
    .from('forum_threads')
    .select('id, title, body, created_at, profiles(full_name)')
    .eq('id', id)
    .single()

  if (!thread) notFound()

  const { data: replies } = await supabase
    .from('forum_replies')
    .select('id, body, created_at, profiles(full_name)')
    .eq('thread_id', id)
    .order('created_at')

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-2xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{thread.title}</h1>
        {/* @ts-expect-error supabase join type */}
        <p className="text-gray-400 text-sm mt-1">by {thread.profiles?.full_name ?? 'Anonymous'} · {new Date(thread.created_at).toLocaleDateString()}</p>
        <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-wrap">{thread.body}</p>
      </div>

      <h2 className="font-semibold text-gray-700 mb-4">{replies?.length ?? 0} Replies</h2>

      <div className="space-y-3 mb-8">
        {replies?.map(reply => (
          <div key={reply.id} className="bg-white border rounded-xl p-4">
            {/* @ts-expect-error supabase join type */}
            <p className="text-xs text-gray-400 mb-1">{reply.profiles?.full_name ?? 'Anonymous'} · {new Date(reply.created_at).toLocaleDateString()}</p>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{reply.body}</p>
          </div>
        ))}
      </div>

      <ReplyBox threadId={id} />
    </div>
  )
}
