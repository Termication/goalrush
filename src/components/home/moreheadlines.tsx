'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Flame, 
  Clock, 
  ArrowRight, 
  Loader2, 
  TrendingUp, 
  Sparkles, 
  Zap, 
  Newspaper,
  BarChart,
  Users,
  Target,
  CalendarDays
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Article {
  _id?: string
  title: string
  imageUrl: string
  slug: string
  createdAt: string
  isFeatured?: boolean
  summary?: string
  category?: string
  author?: string
  readTime?: number
  views?: number
}

export default function MoreHeadlinesSection() {
  const [articles, setArticles] = useState<Article[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isPaginating, setIsPaginating] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('latest')
  const limit = 12

  // Filter articles based on active filter
  const filteredArticles = articles.filter(article => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'trending') return article.isFeatured
    if (activeFilter === 'recent') {
      const articleDate = new Date(article.createdAt)
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return articleDate > oneWeekAgo
    }
    return true
  })

  // Sort articles
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    if (sortBy === 'trending') {
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
    }
    return 0
  })

  const fetchArticles = async (currentPage: number) => {
    currentPage === 1 ? setIsInitialLoading(true) : setIsPaginating(true)

    try {
      const res = await fetch(`/api/articles?page=${currentPage}&limit=${limit}`)
      const json = await res.json()

      const newArticles = (json.articles || []) as Article[]
      
      setArticles((prev) => {
        const existingSlugs = new Set(prev.map((a) => a.slug))
        const filtered = newArticles.filter((a) => !existingSlugs.has(a.slug))
        return [...prev, ...filtered]
      })
      
      if (newArticles.length < limit) {
        setHasMore(false)
      }
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isInitialLoading) return <PulseSkeleton />

  return (
    <section className="relative px-4 pt-12 pb-20 max-w-7xl mx-auto">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tr from-amber-500/5 to-pink-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header with Stats */}
      <div className="mb-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Newspaper className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center animate-pulse">
                  <Target className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                  <span className="text-gray-900 dark:text-white">More</span>
                  <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    Headlines
                  </span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Real-time tracking of breaking stories and trends
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <BarChart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {sortedArticles.length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Stories</p>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Flame className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {sortedArticles.filter(a => a.isFeatured).length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Trending</p>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {Math.floor(Math.random() * 20) + 5}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    Live
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Updates</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Stories', icon: Newspaper },
              { id: 'trending', label: 'Trending', icon: Flame },
              { id: 'recent', label: 'Last 7 Days', icon: Clock },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                  activeFilter === filter.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                )}
              >
                <filter.icon className="h-4 w-4" />
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="latest">Latest First</option>
              <option value="trending">Trending First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Featured Column */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedArticles.slice(0, 4).map((item, index) => (
              <ArticleCard key={item.slug} article={item} index={index} size="medium" />
            ))}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Trending Now Widget */}
          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Trending Now</h3>
            </div>
            <div className="space-y-4">
              {sortedArticles
                .filter(a => a.isFeatured)
                .slice(0, 3)
                .map((item, index) => (
                  <Link
                    key={item.slug}
                    href={`/news/${item.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

      {sortedArticles.length > 8 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {sortedArticles.slice(8).map((item, index) => (
            <ArticleCard key={item.slug} article={item} index={index + 8} size="small" />
          ))}
        </div>
      )}

      {/* LOAD MORE BUTTON SECTION */}
      {hasMore && (
        <div className="text-center mt-12 mb-20">
          <div className="inline-flex items-center gap-6 mb-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-700" />
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Showing {sortedArticles.length} of {articles.length}+ stories
            </span>
            <div className="h-px w-20 bg-gradient-to-r from-gray-300 dark:from-gray-700 to-transparent" />
          </div>
          
          <Button
            onClick={loadMore}
            disabled={isPaginating}
            className={cn(
              "px-8 py-6 rounded-2xl font-bold text-lg w-full max-w-md mx-auto flex items-center justify-center",
              "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
              "text-white shadow-xl hover:shadow-2xl hover:scale-105",
              "transition-all duration-300"
            )}
          >
            {isPaginating ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin mr-3" />
                Loading More...
              </>
            ) : (
              <>
                <Sparkles className="h-6 w-6 mr-3" />
                Load More Headlines
              </>
            )}
          </Button>
          
          <button
            onClick={scrollToTop}
            className="block mx-auto mt-8 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Back to top ↑
          </button>
        </div>
      )}
     
    </section>
  )
}

function ArticleCard({ article, index, size = 'medium' }: { 
  article: Article
  index: number
  size?: 'small' | 'medium' | 'large'
}) {
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    small: "h-64",
    medium: "h-80",
    large: "h-96",
  }

  const heightClass = sizeClasses[size]

  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })

  return (
    <Link
      href={`/news/${article.slug}`}
      className={cn(
        "group relative block w-full rounded-2xl overflow-hidden",
        "shadow-md hover:shadow-2xl transition-all duration-500",
        isHovered && "scale-[1.02]",
        heightClass
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Full Background Image */}
      <div className="absolute inset-0">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
            {article.category && (
                <span className="px-3 py-1.5 bg-black/40 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20">
                {article.category}
                </span>
            )}
        </div>
        
        {article.isFeatured && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
              <Zap className="h-3 w-3" />
              Trending
            </div>
          </div>
        )}

        {/* Hover Actions */}
        <div className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3",
          "opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100"
        )}>
        </div>

        {/* Text Content */}
        <div className="relative z-10 transform transition-transform duration-300 group-hover:-translate-y-1">
          <h3 className={cn(
            "font-bold text-white mb-2 leading-tight drop-shadow-sm",
            size === 'small' ? "text-lg" : "text-xl md:text-2xl"
          )}>
            {article.title}
          </h3>

          {/* Metadata Row */}
          <div className="flex items-center justify-between mt-3 text-gray-300 text-sm">
             <div className="flex items-center gap-2">
                {article.author && (
                    <span className="font-medium text-white">{article.author.split(' ')[0]}</span>
                )}
                <span>•</span>
                <div className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formattedDate}
                </div>
             </div>
             
             {/* "Read" Arrow */}
             <div className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-white font-semibold flex items-center gap-1">
                Read <ArrowRight className="h-4 w-4" />
             </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Border Glow */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-500/30 rounded-2xl transition-colors duration-500 pointer-events-none" />
    </Link>
  )
}

function PulseSkeleton() {
  return (
    <section className="px-4 pt-12 pb-20 max-w-7xl mx-auto">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
             <Skeleton key={i} className="h-80 w-full rounded-2xl bg-gray-200 dark:bg-gray-800" />
          ))}
       </div>
    </section>
  )
}