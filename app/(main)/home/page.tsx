import { createClient } from '@/lib/supabase/server'
import Slideshow from '@/components/Slideshow'
import ImageStrip from '@/components/ImageStrip'
import CountdownTimer from '@/components/CountdownTimer'
import Link from 'next/link'
import { MessageSquare, Users, Video, Heart, ArrowRight } from 'lucide-react'

const features = [
  { icon: Users, label: 'Forums', href: '/forums', desc: 'Join discussions on entrepreneurship, policy, and innovation.', color: 'bg-green-50 text-green-700 group-hover:bg-green-100' },
  { icon: MessageSquare, label: 'Live Chat', href: '/chat', desc: 'Connect in real-time with leaders across the globe.', color: 'bg-blue-50 text-blue-700 group-hover:bg-blue-100' },
  { icon: Video, label: 'Webinars', href: '/webinars', desc: 'Attend exclusive sessions with renowned economists and CEOs.', color: 'bg-purple-50 text-purple-700 group-hover:bg-purple-100' },
  { icon: Heart, label: 'Donate', href: '/donate', desc: 'Support the next generation of African leaders.', color: 'bg-rose-50 text-rose-700 group-hover:bg-rose-100' },
]

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: slides }, { data: profile }, { data: nextWebinar }] = await Promise.all([
    supabase.from('slides').select('id, title, caption, image_url').eq('active', true).order('display_order'),
    supabase.auth.getUser().then(({ data: { user } }) =>
      user ? supabase.from('profiles').select('full_name').eq('id', user.id).single() : { data: null }
    ),
    supabase.from('webinars').select('title, scheduled_at, join_url').eq('active', true)
      .gt('scheduled_at', new Date().toISOString()).order('scheduled_at').limit(1).single(),
  ])

  const allSlides = slides ?? []
  const firstName = profile?.data?.full_name?.split(' ')[0]

  return (
    <div>
      {/* Slideshow */}
      <Slideshow slides={allSlides} />

      {/* Hero banner */}
      <section className="hero-gradient text-white py-14 px-4 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          {firstName && (
            <p className="text-white/70 text-sm mb-2">Welcome back, <span className="text-white font-semibold">{firstName}</span></p>
          )}
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Empowering Young Leaders<br className="hidden md:block" /> Across Africa and the World
          </h1>
          <p className="mt-4 text-white/80 text-lg max-w-2xl mx-auto">
            Connect, learn, and take collective action to drive economic growth and shared prosperity.
          </p>
          {nextWebinar && (
            <div className="mt-8">
              <CountdownTimer webinar={nextWebinar} />
            </div>
          )}
        </div>
      </section>

      {/* First image strip */}
      {allSlides.length > 0 && <ImageStrip slides={allSlides} offset={0} />}

      {/* Feature cards */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map(({ icon: Icon, label, href, desc, color }) => (
          <Link key={href} href={href}
            className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md hover:border-green-300 transition group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition ${color}`}>
              <Icon size={24} />
            </div>
            <h3 className="font-semibold text-gray-900">{label}</h3>
            <p className="text-gray-500 text-sm mt-1">{desc}</p>
            <div className="mt-3 flex items-center gap-1 text-green-700 text-xs font-medium opacity-0 group-hover:opacity-100 transition">
              Go to {label} <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </section>

      {/* Second image strip */}
      {allSlides.length > 1 && <ImageStrip slides={allSlides} offset={1} />}

      {/* Core values */}
      <section className="bg-white border-t py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Our Core Values</h2>
          <p className="text-gray-400 mt-2 mb-8">The principles that guide every young leader in our community</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {[
              'Collaboration over competition',
              'Action and results over talk',
              'Integrity and ethical leadership',
              'Global mindset with global impact',
              'Resilience and continuous learning',
            ].map(v => (
              <div key={v} className="flex items-start gap-3 bg-green-50 hover:bg-green-100 rounded-xl p-4 transition">
                <span className="text-green-700 font-bold mt-0.5">→</span>
                <span className="text-gray-700 text-sm">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Third image strip */}
      {allSlides.length > 2 && <ImageStrip slides={allSlides} offset={2} />}
    </div>
  )
}
