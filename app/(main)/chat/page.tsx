import { createClient } from '@/lib/supabase/server'
import ChatBox from './ChatBox'

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: messages } = await supabase
    .from('chat_messages')
    .select('id, body, created_at, profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(50)

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Live Chat</h1>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <ChatBox initialMessages={(messages ?? []).reverse() as any} userId={user?.id ?? ''} />
    </div>
  )
}
