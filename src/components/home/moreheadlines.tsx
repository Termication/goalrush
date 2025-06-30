'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Article {
  title: string
  imageUrl: string
  slug: string
  createdAt: string
  isFeatured?: boolean
}

export default function MoreHeadlinesSection() {
  const [headlines, setHeadlines] = useState<Article[]>([])

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/articles')
        const json = await res.json()
        if (res.ok) {
          // filter out the featured article and limit to 6
          const data = json.articles || []
          const nonFeatured = data.filter((a: Article) => !a.isFeatured).slice(0, 6)
          setHeadlines(nonFeatured)
        }
      } catch (err) {
        console.error('Failed to fetch more headlines:', err)
      }
    }

    fetchArticles()
  }, [])

  return (
    <section className="px-4 py-6">
      <h2 className="text-lg font-bold mb-4">More Headlines</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {headlines.map((item, idx) => (
          <Link
            key={idx}
            href={`/news/${item.slug}`}
            className="card card-compact bg-base-100 border rounded-md shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 ease-in-out cursor-pointer"
          >
            <div className="card-body flex-row items-center space-x-3 p-2">
              <div className="w-12 h-12 rounded overflow-hidden relative flex-shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-sm font-semibold leading-snug line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* More Button */}
      <div className="mt-6 text-center">
        <Link href="/news" className="btn btn-soft btn-primary">
          More News →
        </Link>
      </div>
    </section>
  )
}
