'use client'

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import HomePageSkeleton from "@/components/skeletons/HomePageSkeleton"
import { formatDistanceToNow } from "date-fns";

interface Article {
  title: string
  summary: string
  imageUrl: string
  slug: string
  category?: string
  isFeatured?: boolean
  createdAt: string
}

// Main HomePage Component
export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fetch articles with 3-second delay
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/articles')
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)

        const text = await res.text()
        if (!text) throw new Error('Empty response')

        const data = JSON.parse(text)

        // 3 second artificial delay
        setTimeout(() => {
          setArticles(data.articles || [])
          setIsLoading(false)
        }, 3000)
      } catch (err) {
        console.error('Failed to fetch articles:', err)
        setIsLoading(false)
      }
    }

    fetchArticles()
  }, [])

  

  // Show skeleton while loading
  if (isLoading) return <HomePageSkeleton />

  const featured = articles.find((article) => article.isFeatured) || articles[0]
  const headlines = articles.filter((a) => a.slug !== featured?.slug).slice(0, 4)

  if (!featured) return null

  // Mobile layout
  if (isMobile) {
    return (
      <div className="space-y-12 p-4 md:p-6 lg:p-8">
        <Link href={`/news/${featured.slug}`} className="block group max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-xl shadow-lg lg:grid lg:grid-cols-5 lg:gap-1">
            <div className="relative h-[60vh] lg:h-[60vh] lg:col-span-5">
              <Image
                src={featured.imageUrl}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent lg:hidden" />
            </div>

            <div className="absolute bottom-0 left-0 p-6 text-white lg:static lg:col-start-1 lg:col-span-3 lg:row-start-1 lg:bg-black/60 lg:backdrop-blur-sm lg:m-6 lg:rounded-xl lg:self-center">
              <Badge className="mb-3 px-3 py-1 text-xs bg-red-600 text-white rounded-full border-none">
                <span className="animate-typing">Breaking News</span>
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold font-poppins leading-tight drop-shadow-md">
                {featured.title}
              </h1>
              <p className="mt-2 text-white/90 text-sm md:text-base line-clamp-2">
                {featured.summary}
              </p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-300 group-hover:text-white transition-colors">
                Read full story <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </Link>

        {/* Headlines grid */}
<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
  {headlines.map((item, idx) => (
    <Link href={`/news/${item.slug}`} key={idx} className="block group">
      <Card className="overflow-hidden h-full group-hover:shadow-2xl transition-shadow duration-300 relative min-h-[300px]">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Text content at bottom of image */}
        <CardContent className="p-4 absolute bottom-0 left-0 w-full text-white">
          <Badge variant="secondary" className="mb-2 bg-white/20 text-white border-none">
            {item.category}
          </Badge>
          <h3 className="text-lg font-semibold leading-tight drop-shadow-md line-clamp-2">
            {item.title}
          </h3>
          <p className="text-sm text-white/70 mt-1 ml-1">
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </p>
        </CardContent>
      </Card>
    </Link>
  ))}
</div>
      </div>
    )
  }

  // Desktop layout
  return (
    <div className="min-h-screen px-2 py-1">
      <Link href={`/news/${featured.slug}`} className="group max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 mb-12 cursor-pointer">
        <div className="flex flex-col justify-center">
          <Badge className="mb-4 px-4 py-1 text-sm bg-red-600 text-white w-fit">
            <span className="animate-typing">Breaking News</span>
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
            {featured.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">{featured.summary}</p>
          <Button variant="default" className="w-fit">
            Read Full Story
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="relative h-80 md:h-96 w-full rounded-xl overflow-hidden shadow-lg">
          <Image
            src={featured.imageUrl}
            alt={featured.title}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        </div>
      </Link>


      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
        {headlines.map((item, idx) => (
          <div key={idx}>
            <Link href={`/news/${item.slug}`} className="block group">
              <Card className="overflow-hidden h-full group-hover:shadow-2xl transition-shadow duration-300 relative min-h-[300px]">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <CardContent className="p-4 absolute bottom-0 left-0 w-full text-white">
                  <Badge variant="secondary" className="mb-2 bg-white/20 text-white border-none">
                    {item.category}
                  </Badge>
                  <h3 className="text-lg font-semibold leading-tight drop-shadow-md">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mt-1 ml-1">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </p>
                </CardContent>
              </Card>
            </Link>

          </div>
        ))}
      </div>
      
    </div>
  )
}
