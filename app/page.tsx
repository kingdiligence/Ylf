import Link from 'next/link'
import { Users, MessageSquare, Video, Heart, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="bg-green-700 text-white px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight">Young Leaders Forum</span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-green-200 transition">Sign in</Link>
          <Link href="/signup" className="text-sm font-medium bg-white text-green-700 px-4 py-1.5 rounded-full hover:bg-green-50 transition">Join now</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-green-700 text-white py-24 px-6 text-center flex-shrink-0">
        <h1 className="text-4xl md:text-6xl font-bold max-w-4xl mx-auto leading-tight">
          Empowering Young Leaders Across Africa and the World
        </h1>
        <p className="mt-6 text-green-100 text-lg md:text-xl max-w-2xl mx-auto">
          A global platform where ambitious entrepreneurs connect, learn, and take collective action to drive economic growth and shared prosperity.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Link href="/signup"
            className="flex items-center gap-2 bg-white text-green-700 px-8 py-3.5 rounded-full font-semibold hover:bg-green-50 transition text-lg">
            Join the Forum <ArrowRight size={18} />
          </Link>
          <Link href="/login"
            className="flex items-center gap-2 border border-white/40 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/10 transition text-lg">
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">Everything you need to connect and grow</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, label: 'Forums', desc: 'Discuss entrepreneurship, policy, and innovation with leaders worldwide.' },
              { icon: MessageSquare, label: 'Live Chat', desc: 'Connect in real-time with young leaders across the globe.' },
              { icon: Video, label: 'Webinars', desc: 'Attend exclusive sessions with economists, CEOs, and policymakers.' },
              { icon: Heart, label: 'Donate', desc: 'Support programs that fund the next generation of African leaders.' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="text-center p-6 rounded-2xl bg-green-50">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={26} className="text-green-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{label}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              <div key={title} className="bg-white rounded-2xl p-6 border">
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-green-700 text-white py-16 px-6">
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
              <span key={v} className="bg-white/20 text-white text-sm px-4 py-2 rounded-full">{v}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 px-6 text-center border-t">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Ready to join the movement?</h2>
        <p className="text-gray-500 mt-3 text-lg">Join thousands of young leaders building a better future.</p>
        <Link href="/signup"
          className="mt-8 inline-flex items-center gap-2 bg-green-700 text-white px-10 py-4 rounded-full font-semibold hover:bg-green-800 transition text-lg">
          Get started for free <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-green-700 text-white text-center py-5 text-sm mt-auto">
        © {new Date().getFullYear()} Young Leaders Forum. All rights reserved.
      </footer>
    </div>
  )
}
