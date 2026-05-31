'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send } from 'lucide-react'

type Message = {
  id: string
  body: string
  created_at: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profiles: any
}

export default function ChatBox({ initialMessages, userId }: { initialMessages: Message[], userId: string }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        async (payload) => {
          const { data } = await supabase
            .from('chat_messages')
            .select('id, body, created_at, profiles(full_name)')
            .eq('id', payload.new.id)
            .single()
          if (data) setMessages(m => [...m, data as unknown as Message])
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setSending(true)
    await supabase.from('chat_messages').insert({ body: text.trim(), author_id: userId })
    setText('')
    setSending(false)
  }

  return (
    <div className="bg-white border rounded-2xl flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className="flex gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-green-700">
              {(msg.profiles?.full_name ?? 'A')[0].toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">{msg.profiles?.full_name ?? 'Anonymous'}</p>
              <p className="text-sm text-gray-800 bg-gray-50 rounded-xl px-3 py-2 inline-block">{msg.body}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="border-t p-3 flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)}
          placeholder="Type a message..." disabled={sending}
          className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        <button type="submit" disabled={sending || !text.trim()}
          className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 disabled:opacity-50 transition">
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
