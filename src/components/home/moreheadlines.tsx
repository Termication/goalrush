'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import MoreHeadlinesSkeleton from '@/components/skeletons/MoreHeadlinesSkeleton'

interface Article {
  _id?: string
  title: string
  imageUrl: string
  slug: string
  createdAt: string
  isFeatured?: boolean
}

export default function MoreHeadlinesSection() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const limit = 12

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(`/api/articles?page=1&limit=${limit}`)
        const json = await res.json()

        if (res.ok) {
          // Exclude featured and limit to 12
          const nonFeatured = (json.articles || []).filter((a: Article) => !a.isFeatured).slice(0, limit)
          setArticles(nonFeatured)
        }
      } catch (err) {
        console.error('Error fetching more headlines:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  if (loading) return <MoreHeadlinesSkeleton />

  return (
    <section className="px-4 py-0 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold">More Headlines</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articles.map((item) => (
          <Link
            key={item.slug}
            href={`/news/${item.slug}`}
            className="card card-compact bg-base-100 border rounded-md shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 ease-in-out cursor-pointer group"
          >
            <div className="card-body flex-row items-center space-x-3 p-2">
              <div className="w-14 h-14 rounded-md overflow-hidden relative flex-shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1">
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
    </section>
  )
}
