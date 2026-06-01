import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/home')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar role={profile?.role} />
      <main className="flex-1">{children}</main>
      <footer className="bg-green-700 text-white text-center py-4 text-sm">
        © {new Date().getFullYear()} Young Leaders Forum. All rights reserved.
      </footer>
    </div>
  )
}
