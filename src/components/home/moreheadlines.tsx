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
  const [articles, setArticles] = useState<Article[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const limit = 6

  const fetchArticles = async (page: number) => {
    try {
      const res = await fetch(`/api/articles?page=${page}&limit=${limit}`)
      const json = await res.json()

      if (res.ok) {
        const newArticles = (json.articles || []).filter((a: Article) => !a.isFeatured)
        setArticles((prev) => [...prev, ...newArticles])
        const more = page < json.totalPages
        setHasMore(more)
      }
    } catch (err) {
      console.error('Pagination fetch error:', err)
    }
  }

  useEffect(() => {
    fetchArticles(page)
  }, [page])

  const loadMore = () => {
    setPage((prev) => prev + 1)
  }

  return (
    <section className="px-4 py-6">
      <h2 className="text-lg font-bold mb-4">More Headlines</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {articles.map((item, idx) => (
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

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-6 text-center">
          <button onClick={loadMore} className="btn btn-primary">
            Load More →
          </button>
        </div>
      )}
    </section>
  )
}
