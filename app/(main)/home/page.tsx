import { createClient } from '@/lib/supabase/server'
import Slideshow from '@/components/Slideshow'
import ImageStrip from '@/components/ImageStrip'
import CountdownTimer from '@/components/CountdownTimer'
import Link from 'next/link'
import { MessageSquare, Users, Video, Heart, ArrowRight, Calendar, TrendingUp } from 'lucide-react'

const features = [
  { icon: Users, label: 'Forums', href: '/forums', desc: 'Join discussions on entrepreneurship, policy, and innovation.', color: 'bg-green-50 text-green-700 group-hover:bg-green-100' },
  { icon: MessageSquare, label: 'Live Chat', href: '/chat', desc: 'Connect in real-time with leaders across the globe.', color: 'bg-blue-50 text-blue-700 group-hover:bg-blue-100' },
  { icon: Video, label: 'Webinars', href: '/webinars', desc: 'Attend exclusive sessions with renowned economists and CEOs.', color: 'bg-purple-50 text-purple-700 group-hover:bg-purple-100' },
  { icon: Heart, label: 'Donate', href: '/donate', desc: 'Support the next generation of African leaders.', color: 'bg-rose-50 text-rose-700 group-hover:bg-rose-100' },
]

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: slides }, { data: profile }, { data: nextWebinar }, { data: recentThreads }, { data: upcomingWebinars }] = await Promise.all([
    supabase.from('slides').select('id, title, caption, image_url').eq('active', true).order('display_order'),
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return { data: null }
      return supabase.from('profiles').select('full_name').eq('id', user.id).single()
    }),
    supabase.from('webinars').select('title, scheduled_at, join_url').eq('active', true)
      .gt('scheduled_at', new Date().toISOString()).order('scheduled_at').limit(1).single(),
    supabase.from('forum_threads').select('id, title, created_at, reply_count, profiles(full_name)').order('created_at', { ascending: false }).limit(5),
    supabase.from('webinars').select('id, title, scheduled_at, host').eq('active', true).gt('scheduled_at', new Date().toISOString()).order('scheduled_at').limit(3),
  ])

  const allSlides = slides ?? []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firstName = (profile as any)?.data?.full_name?.split(' ')[0] ?? (profile as any)?.full_name?.split(' ')[0]

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

      {/* What's Happening */}
      <section className="bg-white border-t py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">What&apos;s Happening</h2>
              <p className="text-gray-400 text-sm mt-1">Latest activity in the community</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Recent forum threads */}
            <div className="bg-gray-50 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <TrendingUp size={16} className="text-green-700" /> Recent Discussions
                </div>
                <Link href="/forums" className="text-xs text-green-700 font-medium hover:underline">View all →</Link>
              </div>
              <div className="space-y-3">
                {recentThreads && recentThreads.length > 0 ? recentThreads.map(thread => (
                  <Link key={thread.id} href={`/forums/${thread.id}`}
                    className="flex items-start gap-3 bg-white rounded-xl p-3 hover:shadow-sm hover:border-green-200 border border-transparent transition">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare size={14} className="text-green-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{thread.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {(thread as any).profiles?.full_name ?? 'Anonymous'} · {thread.reply_count} replies
                      </p>
                    </div>
                  </Link>
                )) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">No discussions yet.</p>
                    <Link href="/forums/new" className="mt-2 inline-block text-green-700 text-sm font-medium hover:underline">
                      Start the first one →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming webinars */}
            <div className="bg-gray-50 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <Calendar size={16} className="text-purple-600" /> Upcoming Webinars
                </div>
                <Link href="/webinars" className="text-xs text-green-700 font-medium hover:underline">View all →</Link>
              </div>
              <div className="space-y-3">
                {upcomingWebinars && upcomingWebinars.length > 0 ? upcomingWebinars.map(w => (
                  <div key={w.id} className="bg-white rounded-xl p-3 border border-transparent">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Video size={14} className="text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{w.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(w.scheduled_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          {w.host && ` · ${w.host}`}
                        </p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">No upcoming webinars.</p>
                    <Link href="/webinars" className="mt-2 inline-block text-green-700 text-sm font-medium hover:underline">
                      Check past sessions →
                    </Link>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Quick CTA row */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/forums/new"
              className="flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-800 transition">
              <MessageSquare size={15} /> Start a discussion
            </Link>
            <Link href="/chat"
              className="flex items-center gap-2 bg-white border text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:border-green-400 transition">
              <Users size={15} /> Join the chat
            </Link>
            <Link href="/donate"
              className="flex items-center gap-2 bg-white border text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:border-green-400 transition">
              <Heart size={15} /> Donate
            </Link>
          </div>
        </div>
      </section>

      {/* Third image strip */}
      {allSlides.length > 2 && <ImageStrip slides={allSlides} offset={2} />}
    </div>
  )
}
