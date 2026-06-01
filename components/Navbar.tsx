'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/home', label: 'Home' },
  { href: '/forums', label: 'Forums' },
  { href: '/chat', label: 'Chat' },
  { href: '/webinars', label: 'Webinars' },
  { href: '/donate', label: 'Donate' },
]

export default function Navbar({ role }: { role?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="bg-green-700 text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold tracking-tight">YLF</Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link
              key={l.href} href={l.href}
              className={cn('text-sm font-medium hover:text-green-200 transition',
                pathname === l.href && 'text-green-200 underline underline-offset-4'
              )}
            >
              {l.label}
            </Link>
          ))}
          {role === 'admin' && (
            <Link href="/admin" className="text-sm font-medium bg-green-900 px-3 py-1 rounded-full hover:bg-green-950 transition">
              Admin
            </Link>
          )}
          <button onClick={handleLogout} className="text-sm font-medium hover:text-green-200 transition">
            Sign out
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-green-800 px-4 pb-4 space-y-2">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium hover:text-green-200">
              {l.label}
            </Link>
          ))}
          {role === 'admin' && (
            <Link href="/admin" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-green-300">
              Admin Panel
            </Link>
          )}
          <button onClick={handleLogout} className="block py-2 text-sm font-medium hover:text-green-200">
            Sign out
          </button>
        </div>
      )}
    </nav>
  )
}
