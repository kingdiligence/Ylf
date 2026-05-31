import { createClient } from '@/lib/supabase/server'
import WebinarManager from './WebinarManager'

export default async function WebinarsAdminPage() {
  const supabase = await createClient()
  const { data: webinars } = await supabase.from('webinars').select('*').order('scheduled_at', { ascending: false })
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Webinar Manager</h1>
      <WebinarManager initialWebinars={webinars ?? []} />
    </div>
  )
}
