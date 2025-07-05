'use client'

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface Article {
  title: string
  summary: string
  imageUrl: string
  slug: string
  category?: string
  isFeatured?: boolean
}

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

useEffect(() => {
  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const text = await res.text(); // read raw text
      if (!text) throw new Error('Empty response');

      const data = JSON.parse(text);
      setArticles(data.articles || []);
    } catch (err) {
      console.error('Failed to fetch articles:', err);
    }
  };

  fetchArticles();
}, []);


  const featured = articles.find((article) => article.isFeatured) || articles[0]
  const headlines = articles.filter((a) => a.slug !== featured?.slug).slice(0, 3)


  if (!featured) return null

  // Mobile layout
  if (isMobile) {
    return (
    <div className="space-y-12 p-4 md:p-6 lg:p-8">
      <Link href={`/news/${featured.slug}`} className="block group max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-xl shadow-lg 
                        lg:grid lg:grid-cols-5 lg:gap-1">
          
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

          <div className="absolute bottom-0 left-0 p-6 text-white 
                          lg:static lg:col-start-1 lg:col-span-3 lg:row-start-1 
                          lg:bg-black/60 lg:backdrop-blur-sm lg:m-6 lg:rounded-xl lg:self-center">
            
            <Badge className="mb-3 px-3 py-1 text-xs bg-red-600 text-white rounded-full border-none">
              Breaking News
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

      {/* --- UNIFIED RESPONSIVE HEADLINES GRID --- */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
        {headlines.map((item, idx) => (
          <Link href={`/news/${item.slug}`} key={idx} className="block group">
            <Card className="overflow-hidden h-full group-hover:shadow-2xl transition-shadow duration-300">
              <div className="relative w-full h-48">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <Badge variant="secondary" className="mb-2">{item.category}</Badge>
                <h3 className="text-lg font-semibold leading-tight h-20 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{item.summary}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
  }

  // Desktop layout
  return (
    <div className="min-h-screen px-4 py-5">
      {/* Desktop Hero */}
    <Link
        href={`/news/${featured.slug}`}
        className="group max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 mb-12 cursor-pointer"
      >
        <div className="flex flex-col justify-center">
          <Badge className="mb-4 px-4 py-1 text-sm bg-red-600 text-white w-fit">
            <span className="animate-typing">Breaking News</span>
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
            {featured.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">{featured.summary}</p>
          
          <Button
            variant="default"
            className="w-fit"
          >
            Read Full Story
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Image Side */}
        <div className="relative h-80 md:h-96 w-full rounded-xl overflow-hidden shadow-lg">
          <Image
            src={featured.imageUrl}
            alt={featured.title}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Desktop Cards */}
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
      {headlines.map((item, idx) => (
        // The Link entire Card
        <Link href={`/news/${item.slug}`} key={idx} className="block group">
          <Card className="overflow-hidden h-full group-hover:shadow-2xl transition-shadow duration-300">
            <div className="relative w-full h-40">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{item.summary}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
    </div>
  )
}
