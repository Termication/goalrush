'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface Article {
  _id: string
  title: string
  summary: string
  imageUrl: string
  slug: string
  category?: string
  createdAt: string
}

export default function LaligaSection() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLaLigaArticles = async () => {
      try {
        const res = await fetch('/api/articles?category=laliga&limit=4')
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        
        const data = await res.json()
        setArticles(data.articles?.slice(0, 4) || [])
      } catch (err) {
        console.error('Failed to fetch La Liga articles:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLaLigaArticles()
  }, [])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-6 w-20" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-80 rounded-xl" />
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1,2,3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (articles.length === 0) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">La Liga News</h2>
        <Link 
          href="/news/category/laliga"
          className="text-sm font-medium text-primary hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Featured Article */}
        {articles.slice(0, 1).map((article) => (
          <Link 
            href={`/news/${article.slug}`} 
            key={`featured-${article.slug}`}
            className="lg:col-span-2 group"
          >
            <Card className="h-full overflow-hidden relative">
              <div className="absolute inset-0">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
              <CardContent className="p-6 absolute bottom-0 w-full z-10">
                <Badge className="mb-3 bg-red-600 text-white">
                  {article.category || 'La Liga'}
                </Badge>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-200 line-clamp-2">
                  {article.summary}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}

        {/* Secondary Articles */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {articles.slice(1, 4).map((article) => (
            <Link 
              href={`/news/${article.slug}`} 
              key={article.slug}
              className="group"
            >
              <Card className="h-full overflow-hidden relative">
                
                <div className="absolute inset-0">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <CardContent className="p-4 relative z-10">
                  <Badge className="mb-2 bg-red-600 text-white text-xs">
                    {article.category || 'La Liga'}
                  </Badge>
                  <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}