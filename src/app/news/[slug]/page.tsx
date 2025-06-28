// app/news/[slug]/page.tsx

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
  image: string
  body: string
  category?: string
  publishedAt?: string
}

const dummyData: Record<string, Article> = {
  'mbappe-joins-real-madrid': {
    title: '🇫🇷 Mbappé Joins Real Madrid!',
    summary: "It's official — Kylian Mbappé has signed a five-year contract with Real Madrid.",
    image: 'https://picsum.photos/seed/mbappe/900/600',
    body: `<p>Real Madrid has confirmed the signing of Kylian Mbappé, bringing months of speculation to a close...</p>`
  },
  'premier-league-fixtures': {
    title: '🔥 Premier League Fixtures Released',
    summary: 'Arsenal vs Man City opens the 2025 season.',
    image: 'https://picsum.photos/seed/fixtures/900/600',
    body: `<p>The Premier League has released the fixtures for the 2025 season, and fans are buzzing...</p>`
  },
  'haaland-psg-transfer': {
    title: '💰 Record Transfer Rumor: Haaland to PSG?',
    summary: 'Insiders suggest a €250M bid is in play.',
    image: 'https://picsum.photos/seed/haaland/900/600',
    body: `<p>Sources close to PSG have revealed a potential record-breaking deal in the works...</p>`
  }
}

export default function NewsPage() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<Article | null>(null)

  useEffect(() => {
    if (slug && dummyData[slug]) {
      setArticle(dummyData[slug])
    }
  }, [slug])

  if (!article) {
    return <Skeleton className="h-screen w-full" />
  }

  return (
    <main className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
      </div>
      <div className="mb-4">
        <Badge>{article.category || 'Football'}</Badge>
      </div>
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <p className="text-muted-foreground mb-4">{article.summary}</p>
      <div className="relative w-full h-64 mb-6 rounded overflow-hidden">
        <Image
          src={article.image}
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
