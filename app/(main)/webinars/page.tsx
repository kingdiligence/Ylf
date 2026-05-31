import { createClient } from '@/lib/supabase/server'
import { Video, Calendar, ExternalLink } from 'lucide-react'

export default async function WebinarsPage() {
  const supabase = await createClient()
  const { data: webinars } = await supabase
    .from('webinars')
    .select('*')
    .eq('active', true)
    .order('scheduled_at')

  const now = new Date()
  const upcoming = webinars?.filter(w => new Date(w.scheduled_at) >= now) ?? []
  const past = webinars?.filter(w => new Date(w.scheduled_at) < now) ?? []

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Webinars</h1>

      {upcoming.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Upcoming</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map(w => (
              <div key={w.id} className="bg-white border border-green-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Video size={22} className="text-green-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{w.title}</h3>
                    {w.host && <p className="text-sm text-gray-500">Hosted by {w.host}</p>}
                    <div className="flex items-center gap-1 text-green-700 text-sm mt-2">
                      <Calendar size={14} />
                      {new Date(w.scheduled_at).toLocaleString()}
                    </div>
                    {w.description && <p className="text-sm text-gray-600 mt-2">{w.description}</p>}
                    {w.join_url && (
                      <a href={w.join_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-3 bg-green-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-800 transition">
                        Join Webinar <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Past Sessions</h2>
          <div className="space-y-3">
            {past.map(w => (
              <div key={w.id} className="bg-white border rounded-xl p-4 flex items-center gap-4 opacity-70">
                <Video size={18} className="text-gray-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700 text-sm">{w.title}</p>
                  <p className="text-xs text-gray-400">{new Date(w.scheduled_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!webinars?.length && (
        <div className="text-center py-16 text-gray-400">No webinars scheduled yet. Check back soon.</div>
      )}
    </div>
  )
}
