import { NextResponse } from 'next/server'

export async function POST() {
  // Stripe not yet configured — add STRIPE_SECRET_KEY to Vercel env vars to enable
  return NextResponse.json({ error: 'Donations coming soon' }, { status: 503 })
}
