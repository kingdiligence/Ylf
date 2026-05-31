import { createClient } from '@/lib/supabase/server'
import CategoryManager from './CategoryManager'

export default async function ForumsAdminPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('forum_categories').select('*').order('display_order')
  const { data: threads } = await supabase
    .from('forum_threads')
    .select('id, title, created_at, pinned, profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(30)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Forum Manager</h1>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <CategoryManager initialCategories={categories ?? []} threads={(threads ?? []) as any} />
    </div>
  )
}
