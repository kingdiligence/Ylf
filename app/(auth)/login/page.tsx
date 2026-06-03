'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/home')
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Left — branded gradient panel */}
      <div className="hero-gradient hidden md:flex md:w-1/2 flex-col justify-between p-12 text-white">
        <div>
          <p className="text-2xl font-bold tracking-tight">Young Leaders Forum</p>
          <p className="text-white/60 text-sm mt-1">ylf-app.vercel.app</p>
        </div>
        <div>
          <div className="inline-block bg-white/15 border border-white/25 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Future African Leaders Award · FALA
          </div>
          <h2 className="text-3xl font-bold leading-snug">
            Connect. Learn.<br />Lead the future.
          </h2>
          <p className="mt-4 text-white/70 text-sm leading-relaxed max-w-sm">
            A global community of young entrepreneurs, innovators, and policymakers driving sustainable economic growth across Africa and the world.
          </p>
        </div>
        <p className="text-white/40 text-xs">© {new Date().getFullYear()} Young Leaders Forum</p>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-16 bg-gray-50">
        {/* Mobile logo */}
        <div className="md:hidden text-center mb-8">
          <p className="text-2xl font-bold text-green-700">Young Leaders Forum</p>
          <p className="text-gray-400 text-sm mt-1">Sign in to continue</p>
        </div>

        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in to your account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-100 p-3 rounded-xl">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 disabled:opacity-50 transition">
              {loading ? 'Signing in...' : <> Sign In <ArrowRight size={16} /> </>}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-green-700 font-semibold hover:underline">Sign up</Link>
          </p>

          <div className="mt-8 pt-6 border-t text-center">
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition">← Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
