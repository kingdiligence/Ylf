import { createClient } from '@/lib/supabase/server'
import SlideManager from './SlideManager'

export default async function SlidesAdminPage() {
  const supabase = await createClient()
  const { data: slides } = await supabase
    .from('slides')
    .select('*')
    .order('display_order')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Slideshow Manager</h1>
      <p className="text-gray-500 text-sm mb-6">Upload images for the home page slideshow. Paste a public image URL (from Google Drive, Imgur, or any public host).</p>
      <SlideManager initialSlides={slides ?? []} />
    </div>
  )
}
