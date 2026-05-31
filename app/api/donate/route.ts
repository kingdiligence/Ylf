import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Stripe not yet configured — return a placeholder
  // To enable: npm install stripe, add STRIPE_SECRET_KEY to .env.local
  const { amount } = await request.json()

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured yet' }, { status: 503 })
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Stripe = require('stripe')
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'Donation to Young Leaders Forum' },
        unit_amount: Math.round(amount * 100),
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/donate/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/donate`,
  })

  return NextResponse.json({ url: session.url })
}
