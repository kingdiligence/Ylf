import Link from 'next/link'
import { LayoutDashboard, Image, MessageSquare, Video, Users, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/slides', label: 'Slideshow', icon: Image },
  { href: '/admin/forums', label: 'Forums', icon: MessageSquare },
  { href: '/admin/webinars', label: 'Webinars', icon: Video },
  { href: '/admin/members', label: 'Members', icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-gray-900 text-white flex flex-col fixed inset-y-0">
        <div className="p-5 border-b border-gray-700">
          <p className="font-bold text-green-400">YLF Admin</p>
          <p className="text-xs text-gray-400 mt-0.5">Young Leaders Forum</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition">
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-700">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white transition">
            <LogOut size={16} /> Back to site
          </Link>
        </div>
      </aside>
      <main className="ml-56 flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  )
}
