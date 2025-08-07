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
  isFeatured?: boolean
}

export default function PremierLeagueSection() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch articles displayed in hero section
        const heroRes = await fetch('/api/articles')
        if (!heroRes.ok) throw new Error(`Hero articles fetch failed: ${heroRes.status}`)
        const heroData = await heroRes.json()
        const heroArticles: Article[] = heroData.articles || []
        
        // 2. Identify articles currently displayed in hero section
        const featured = heroArticles.find(article => article.isFeatured) || heroArticles[0]
        const headlines = heroArticles.filter(a => a.slug !== featured?.slug).slice(0, 4)
        const displayedSlugs = [
          featured?.slug, 
          ...headlines.map(a => a.slug)
        ].filter(slug => slug) as string[]

        // 3. Fetch all Premier League articles
        const plRes = await fetch('/api/articles?category=Premier League&limit=10')
        if (!plRes.ok) throw new Error(`Premier League articles fetch failed: ${plRes.status}`)
        const plData = await plRes.json()
        const allPLArticles: Article[] = plData.articles || []

        // 4. Filter out articles currently displayed in hero section
        const filteredArticles = allPLArticles.filter(
          article => !displayedSlugs.includes(article.slug)
        ).slice(0, 4)

        setArticles(filteredArticles)
      } catch (err) {
        console.error('Failed to fetch articles:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Skeleton className="h-8 w-36 sm:w-44" />
          <Skeleton className="h-6 w-20 sm:w-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-56 sm:h-80 rounded-2xl" />
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[1,2,3].map((i: number) => (
              <Skeleton key={i} className="h-32 sm:h-48 rounded-2xl" />
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
    <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
        <div className="group text-xl sm:text-2xl md:text-3xl font-extrabold text-[#5a255f] flex items-center gap-3">
          <Image
            src="/premier-league.png"
            alt="Premier League Logo"
            width={128}
            height={128}
            className="w-24 h-24 sm:w-32 sm:h-32 object-contain transition-transform duration-300 group-hover:scale-120"
            priority
          />
          Headlines
        </div>
        <Link 
          href="/news_by_category/premierleague"
          className="text-xs sm:text-sm font-semibold text-[#37003c] border-b-2 border-[#37003c] hover:text-[#a626aa] hover:border-[#a626aa] transition"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Featured Article */}
        {articles.slice(0, 1).map((article: Article) => (
          <Link 
            href={`/news/${article.slug}`} 
            key={`featured-${article.slug}`}
            className="lg:col-span-2 group"
          >
            <Card className="h-56 sm:h-80 overflow-hidden relative shadow-xl rounded-2xl border-2 border-[#37003c]">
              <div className="absolute inset-0">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#37003c]/80 to-transparent" />
              </div>
              <CardContent className="p-4 sm:p-7 absolute bottom-0 w-full z-10">
                <Badge className="mb-2 sm:mb-3 bg-[#a626aa] text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg text-xs sm:text-base font-bold tracking-wide">
                  {article.category || 'Premier League'}
                </Badge>
                <h3 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white mb-1 sm:mb-2 drop-shadow">
                  {article.title}
                </h3>
                <p className="text-gray-200 line-clamp-2 text-xs sm:text-lg">
                  {article.summary}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}

        {/* Secondary Articles */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {articles.slice(1, 4).map((article: Article) => (
            <Link 
              href={`/news/${article.slug}`} 
              key={article.slug}
              className="group"
            >
              <Card className="h-32 sm:h-48 overflow-hidden relative rounded-2xl border border-[#a626aa] shadow-md hover:shadow-xl transition-shadow">
                <div className="absolute inset-0">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#a626aa]/70 to-transparent" />
                </div>
                <CardContent className="p-3 sm:p-5 relative z-10">
                  <Badge className="mb-1 sm:mb-2 bg-[#37003c] text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold tracking-wide">
                    {article.category || 'Premier League'}
                  </Badge>
                  <h3 className="font-bold text-[#37003c] line-clamp-2 group-hover:text-[#a626aa] transition-colors text-sm sm:text-lg">
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