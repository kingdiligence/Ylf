import { createClient } from '@/lib/supabase/server'
import { Users, MessageSquare, Heart, Video } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: members },
    { count: threads },
    { count: donations },
    { count: webinars },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('forum_threads').select('*', { count: 'exact', head: true }),
    supabase.from('donations').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('webinars').select('*', { count: 'exact', head: true }).eq('active', true),
  ])

  const stats = [
    { label: 'Members', value: members ?? 0, icon: Users, color: 'bg-blue-50 text-blue-700' },
    { label: 'Forum Threads', value: threads ?? 0, icon: MessageSquare, color: 'bg-green-50 text-green-700' },
    { label: 'Donations', value: donations ?? 0, icon: Heart, color: 'bg-rose-50 text-rose-700' },
    { label: 'Active Webinars', value: webinars ?? 0, icon: Video, color: 'bg-purple-50 text-purple-700' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border rounded-2xl p-6">
        <h2 className="font-semibold text-gray-700 mb-2">Quick links</h2>
        <ul className="text-sm text-gray-500 space-y-1">
          <li>→ Go to <a href="/admin/slides" className="text-green-700 hover:underline">Slideshow</a> to upload images</li>
          <li>→ Go to <a href="/admin/webinars" className="text-green-700 hover:underline">Webinars</a> to schedule sessions</li>
          <li>→ Go to <a href="/admin/forums" className="text-green-700 hover:underline">Forums</a> to manage categories</li>
          <li>→ Go to <a href="/admin/members" className="text-green-700 hover:underline">Members</a> to manage roles</li>
        </ul>
      </div>
    </div>
  )
}
