import { createClient } from '@/lib/supabase/server'
import MemberManager from './MemberManager'

export default async function MembersAdminPage() {
  const supabase = await createClient()
  const { data: members } = await supabase
    .from('profiles')
    .select('id, full_name, country, role, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Member Manager</h1>
      <MemberManager initialMembers={members ?? []} />
    </div>
  )
}
