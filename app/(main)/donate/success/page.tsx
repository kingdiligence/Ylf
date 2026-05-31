import Link from 'next/link'

export default function DonateSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">🙏</div>
        <h1 className="text-2xl font-bold text-gray-900">Thank you for your donation!</h1>
        <p className="text-gray-500 mt-2">Your support helps empower the next generation of African leaders.</p>
        <Link href="/" className="mt-6 inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-800 transition">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
