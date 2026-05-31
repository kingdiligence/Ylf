'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Member = { id: string; full_name: string | null; country: string | null; role: string; created_at: string }

export default function MemberManager({ initialMembers }: { initialMembers: Member[] }) {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const supabase = createClient()

  async function updateRole(id: string, role: string) {
    await supabase.from('profiles').update({ role }).eq('id', id)
    setMembers(m => m.map(x => x.id === id ? { ...x, role } : x))
  }

  const roleBadge = (role: string) => {
    if (role === 'admin') return 'bg-red-100 text-red-700'
    if (role === 'moderator') return 'bg-blue-100 text-blue-700'
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="bg-white border rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left px-5 py-3 font-medium text-gray-600">Name</th>
            <th className="text-left px-5 py-3 font-medium text-gray-600">Country</th>
            <th className="text-left px-5 py-3 font-medium text-gray-600">Joined</th>
            <th className="text-left px-5 py-3 font-medium text-gray-600">Role</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {members.map(m => (
            <tr key={m.id} className="hover:bg-gray-50">
              <td className="px-5 py-3 font-medium text-gray-900">{m.full_name ?? 'Unnamed'}</td>
              <td className="px-5 py-3 text-gray-500">{m.country ?? '—'}</td>
              <td className="px-5 py-3 text-gray-500">{new Date(m.created_at).toLocaleDateString()}</td>
              <td className="px-5 py-3">
                <select value={m.role} onChange={e => updateRole(m.id, e.target.value)}
                  className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 ${roleBadge(m.role)}`}>
                  <option value="member">member</option>
                  <option value="moderator">moderator</option>
                  <option value="admin">admin</option>
                </select>
              </td>
            </tr>
          ))}
          {members.length === 0 && (
            <tr><td colSpan={4} className="px-5 py-10 text-center text-gray-400">No members yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
