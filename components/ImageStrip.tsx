import Image from 'next/image'

type Slide = { id: string; title: string | null; caption: string | null; image_url: string }

export default function ImageStrip({ slides, offset = 0 }: { slides: Slide[], offset?: number }) {
  if (!slides.length) return null

  // Pick a subset starting from offset, wrap around
  const count = Math.min(3, slides.length)
  const picked = Array.from({ length: count }, (_, i) => slides[(offset + i) % slides.length])

  if (picked.length === 1) {
    return (
      <div className="relative w-full h-64 md:h-80 overflow-hidden">
        <Image src={picked[0].image_url} alt={picked[0].title ?? 'YLF'} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        {picked[0].title && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white text-2xl font-bold text-center px-6">{picked[0].title}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`grid w-full h-64 md:h-80 overflow-hidden ${picked.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
      {picked.map((slide, i) => (
        <div key={slide.id} className="relative overflow-hidden group">
          <Image src={slide.image_url} alt={slide.title ?? 'YLF'} fill
            className="object-cover group-hover:scale-105 transition duration-700" />
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition duration-300" />
          {i === Math.floor(picked.length / 2) && slide.caption && (
            <div className="absolute inset-0 flex items-end p-4">
              <p className="text-white text-sm font-medium">{slide.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
