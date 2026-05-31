import { createClient } from '@/lib/supabase/server'
import Slideshow from '@/components/Slideshow'
import Link from 'next/link'
import { MessageSquare, Users, Video, Heart } from 'lucide-react'

const features = [
  { icon: Users, label: 'Forums', href: '/forums', desc: 'Join discussions on entrepreneurship, policy, and innovation.' },
  { icon: MessageSquare, label: 'Live Chat', href: '/chat', desc: 'Connect in real-time with leaders across the globe.' },
  { icon: Video, label: 'Webinars', href: '/webinars', desc: 'Attend exclusive sessions with renowned economists and CEOs.' },
  { icon: Heart, label: 'Donate', href: '/donate', desc: 'Support the next generation of African leaders.' },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: slides } = await supabase
    .from('slides')
    .select('id, title, caption, image_url')
    .eq('active', true)
    .order('display_order')

  return (
    <div>
      <Slideshow slides={slides ?? []} />

      {/* Hero text */}
      <section className="bg-green-700 text-white py-16 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold max-w-3xl mx-auto leading-tight">
          Empowering Young Leaders Across Africa and the World
        </h1>
        <p className="mt-4 text-green-100 text-lg max-w-2xl mx-auto">
          Young Leaders Forum is a global platform where ambitious entrepreneurs connect, learn, and take collective action to drive economic growth.
        </p>
      </section>

      {/* Features grid */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map(({ icon: Icon, label, href, desc }) => (
          <Link key={href} href={href}
            className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md hover:border-green-300 transition group">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition">
              <Icon size={24} className="text-green-700" />
            </div>
            <h3 className="font-semibold text-gray-900">{label}</h3>
            <p className="text-gray-500 text-sm mt-1">{desc}</p>
          </Link>
        ))}
      </section>

      {/* Mission */}
      <section className="bg-white border-t py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Our Core Values</h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {[
              'Collaboration over competition',
              'Action and results over talk',
              'Integrity and ethical leadership',
              'Global mindset with global impact',
              'Resilience and continuous learning',
            ].map(v => (
              <div key={v} className="flex items-start gap-3 bg-green-50 rounded-xl p-4">
                <span className="text-green-700 font-bold mt-0.5">→</span>
                <span className="text-gray-700 text-sm">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
