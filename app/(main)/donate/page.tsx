'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'

const presets = [10, 25, 50, 100]

export default function DonatePage() {
  const [amount, setAmount] = useState('')
  const [custom, setCustom] = useState(false)
  const [message, setMessage] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDonate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/donate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parseFloat(amount), message, anonymous }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
    else setLoading(false)
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart size={28} className="text-green-700" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Support Young Leaders</h1>
        <p className="text-gray-500 mt-2 text-sm">Your donation helps fund programs, scholarships, and events for the next generation of African leaders.</p>
      </div>

      <form onSubmit={handleDonate} className="bg-white border rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Amount (USD)</label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {presets.map(p => (
              <button key={p} type="button"
                onClick={() => { setAmount(String(p)); setCustom(false) }}
                className={`py-2 rounded-lg text-sm font-medium border transition ${amount === String(p) && !custom ? 'bg-green-700 text-white border-green-700' : 'border-gray-200 hover:border-green-400'}`}>
                ${p}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => { setCustom(true); setAmount('') }}
            className={`w-full py-2 rounded-lg text-sm border transition ${custom ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-400'}`}>
            Custom amount
          </button>
          {custom && (
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="Enter amount" min={1} step={0.01} required
              className="mt-2 w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)}
            rows={3} placeholder="Leave a message of support..."
            className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)}
            className="w-4 h-4 accent-green-700" />
          <span className="text-sm text-gray-600">Donate anonymously</span>
        </label>

        <button type="submit" disabled={loading || !amount}
          className="w-full bg-green-700 text-white py-3 rounded-lg font-medium hover:bg-green-800 disabled:opacity-50 transition">
          {loading ? 'Redirecting...' : `Donate $${amount || '...'}`}
        </button>
        <p className="text-center text-xs text-gray-400">Secure payments via Stripe</p>
      </form>
    </div>
  )
}
