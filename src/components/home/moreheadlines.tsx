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
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isPaginating, setIsPaginating] = useState(false)
  const limit = 12

  const fetchArticles = async (currentPage: number) => {
    currentPage === 1 ? setIsInitialLoading(true) : setIsPaginating(true)

    try {
      const res = await fetch(`/api/articles?page=${currentPage}&limit=${limit}`)
      const json = await res.json()

    const newArticles = (json.articles || []) as Article[];

    setArticles((prev) => {
      const existingSlugs = new Set(prev.map((a) => a.slug));
      return [...prev, ...newArticles.filter((a) => !existingSlugs.has(a.slug))];
    });
        } catch (err) {
          console.error('Pagination fetch error:', err)
        } finally {
          setIsInitialLoading(false)
          setIsPaginating(false)
        }
      }

  useEffect(() => {
    fetchArticles(page)
  }, [page])

  const loadMore = () => {
    setPage((prev) => prev + 1)
  }

  if (isInitialLoading) return <MoreHeadlinesSkeleton />

  return (
    <section className="px-4 pt-2 pb-2 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">More Headlines</h2>

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

        {/* Inline pagination skeletons */}
        {isPaginating &&
          Array.from({ length: 2 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="flex items-center space-x-4 p-3 border rounded-lg">
              <Skeleton className="w-14 h-14 rounded-md flex-shrink-0" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-3 w-24 mt-1" />
              </div>
            </div>
          ))}
      </div>

      {hasMore && !isPaginating && (
        <div className="mt-6 text-center">
          <Button onClick={loadMore} variant="secondary">
            Load More Headlines
          </Button>
        </div>
      )}
    </section>
  )
}
