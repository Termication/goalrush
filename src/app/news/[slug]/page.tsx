'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface Article {
  title: string
  summary: string
  imageUrl: string
  body: string
  category?: string
}

export default function NewsPage() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${slug}`)
        const json = await res.json()
        if (res.ok) {
          setArticle(json.data)
        }
      } catch (err) {
        console.error('Error fetching article:', err)
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchArticle()
  }, [slug])

  if (loading || !article) {
    return <Skeleton className="h-screen w-full" />
  }

  return (
    <main className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
      </div>
      <div className="mb-4">
        <Badge>{article.category || 'News'}</Badge>
      </div>
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <p className="text-muted-foreground mb-4">{article.summary}</p>
      <div className="relative w-full h-64 mb-6 rounded overflow-hidden">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover"
        />
      </div>
      <article className="prose dark:prose-invert prose-sm sm:prose-base max-w-none">
        <div dangerouslySetInnerHTML={{ __html: article.body }} />
      </article>
    </main>
  )
}
