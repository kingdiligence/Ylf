import Link from 'next/link'
import { Users, MessageSquare, Video, Heart, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import CountdownTimer from '@/components/CountdownTimer'
import ImageStrip from '@/components/ImageStrip'

export default async function LandingPage() {
  const supabase = await createClient()

  const [{ data: slides }, { data: nextWebinar }] = await Promise.all([
    supabase.from('slides').select('id, title, caption, image_url').eq('active', true).order('display_order'),
    supabase.from('webinars').select('title, scheduled_at, join_url').eq('active', true)
      .gt('scheduled_at', new Date().toISOString()).order('scheduled_at').limit(1).single(),
  ])

  const allSlides = slides ?? []

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-white drop-shadow">Young Leaders Forum</span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-white/90 hover:text-white transition">Sign in</Link>
          <Link href="/signup" className="text-sm font-medium bg-white text-green-800 px-4 py-1.5 rounded-full hover:bg-green-50 transition">Join now</Link>
        </div>
      </nav>

      {/* Hero — animated gradient */}
      <section className="hero-gradient relative text-white pt-32 pb-20 px-6 text-center">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block bg-white/15 border border-white/25 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Future African Leaders Award · FALA
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Empowering Young Leaders<br className="hidden md:block" /> Across Africa and the World
          </h1>
          <p className="mt-6 text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
            A global platform where ambitious entrepreneurs connect, learn, and take collective action to drive economic growth and shared prosperity.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link href="/signup"
              className="flex items-center gap-2 bg-white text-green-800 px-8 py-3.5 rounded-full font-semibold hover:bg-green-50 transition text-lg shadow-lg">
              Join the Forum <ArrowRight size={18} />
            </Link>
            <Link href="/login"
              className="flex items-center gap-2 border border-white/40 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/10 transition text-lg">
              Sign in
            </Link>
          </div>

          {/* Countdown timer */}
          {nextWebinar && (
            <div className="mt-12">
              <CountdownTimer webinar={nextWebinar} />
            </div>
          )}
        </div>
      </section>

      {/* First image strip */}
      {allSlides.length > 0 && <ImageStrip slides={allSlides} offset={0} />}

      {/* Features */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3">Everything you need to connect and grow</h2>
          <p className="text-gray-400 text-center mb-12">One platform. Thousands of leaders. Infinite possibilities.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, label: 'Forums', desc: 'Discuss entrepreneurship, policy, and innovation with leaders worldwide.', color: 'bg-green-50 text-green-700' },
              { icon: MessageSquare, label: 'Live Chat', desc: 'Connect in real-time with young leaders across the globe.', color: 'bg-blue-50 text-blue-700' },
              { icon: Video, label: 'Webinars', desc: 'Attend exclusive sessions with economists, CEOs, and policymakers.', color: 'bg-purple-50 text-purple-700' },
              { icon: Heart, label: 'Donate', desc: 'Support programs that fund the next generation of African leaders.', color: 'bg-rose-50 text-rose-700' },
            ].map(({ icon: Icon, label, desc, color }) => (
              <div key={label} className="text-center p-6 rounded-2xl bg-gray-50 hover:shadow-md transition">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${color}`}>
                  <Icon size={26} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{label}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second image strip */}
      {allSlides.length > 1 && <ImageStrip slides={allSlides} offset={1} />}

      {/* About */}
      <section className="bg-gray-50 py-20 px-6 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">Our Mission</h2>
          <p className="text-gray-600 text-lg text-center leading-relaxed">
            Young Leaders Forum is a dynamic international forum dedicated to empowering young business owners and entrepreneurs to build thriving enterprises that drive sustainable economic growth, innovation, and shared prosperity across nations.
          </p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Build Powerful Networks', desc: 'Connect with entrepreneurs, mentors, investors, and policymakers across continents.' },
              { title: 'Knowledge & Capacity Building', desc: 'Access training, webinars, and resources on business, leadership, and growth.' },
              { title: 'Drive Innovation', desc: 'Tackle global challenges through entrepreneurship and collaborative projects.' },
              { title: 'Policy Advocacy', desc: 'Advocate for youth-friendly policies and stronger entrepreneurial ecosystems.' },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border hover:border-green-300 hover:shadow-sm transition">
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Third image strip */}
      {allSlides.length > 2 && <ImageStrip slides={allSlides} offset={2} />}

      {/* Core Values */}
      <section className="hero-gradient text-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">Core Values</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Collaboration over competition',
              'Action and results over talk',
              'Integrity and ethical leadership',
              'Global mindset with global impact',
              'Resilience and continuous learning',
            ].map(v => (
              <span key={v} className="bg-white/20 text-white text-sm px-4 py-2 rounded-full border border-white/20 hover:bg-white/30 transition">{v}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 px-6 text-center border-t">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Ready to join the movement?</h2>
        <p className="text-gray-500 mt-3 text-lg">Join young leaders building a better future across Africa and the world.</p>
        <Link href="/signup"
          className="mt-8 inline-flex items-center gap-2 bg-green-700 text-white px-10 py-4 rounded-full font-semibold hover:bg-green-800 transition text-lg shadow-md">
          Get started for free <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white text-center py-5 text-sm mt-auto">
        © {new Date().getFullYear()} Young Leaders Forum. All rights reserved.
      </footer>
    </div>
  )
}
