'use client'

import { useState, useEffect } from 'react'
import { Video, Calendar } from 'lucide-react'

type Webinar = { title: string; scheduled_at: string; join_url: string | null }

function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return null
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { d, h, m, s }
}

export default function CountdownTimer({ webinar }: { webinar: Webinar }) {
  const [time, setTime] = useState(getTimeLeft(webinar.scheduled_at))

  useEffect(() => {
    const timer = setInterval(() => {
      const t = getTimeLeft(webinar.scheduled_at)
      setTime(t)
      if (!t) clearInterval(timer)
    }, 1000)
    return () => clearInterval(timer)
  }, [webinar.scheduled_at])

  if (!time) return null

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-5 text-white max-w-xl mx-auto">
      <div className="flex items-center justify-center gap-2 text-sm text-white/80 mb-3">
        <Video size={14} />
        <span>Next Webinar</span>
        <span className="font-semibold text-white truncate">— {webinar.title}</span>
      </div>
      <div className="flex items-center justify-center gap-3">
        {[
          { v: time.d, label: 'Days' },
          { v: time.h, label: 'Hours' },
          { v: time.m, label: 'Mins' },
          { v: time.s, label: 'Secs' },
        ].map(({ v, label }, i) => (
          <div key={label} className="flex items-center gap-3">
            {i > 0 && <span className="text-white/40 text-xl font-light">:</span>}
            <div className="text-center">
              <div className="text-3xl font-bold tabular-nums w-14 bg-white/10 rounded-xl py-2">
                {String(v).padStart(2, '0')}
              </div>
              <p className="text-xs text-white/60 mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>
      {webinar.join_url && (
        <div className="text-center mt-4">
          <a href={webinar.join_url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-green-800 text-sm font-semibold px-5 py-2 rounded-full hover:bg-green-50 transition">
            <Calendar size={14} /> Register Now
          </a>
        </div>
      )}
    </div>
  )
}
