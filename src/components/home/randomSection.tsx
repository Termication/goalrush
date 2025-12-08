'use client'

import { useEffect, useState, useMemo } from "react"
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

// 1. Define Categories and Icons
const CATEGORIES = ["UEFA", "World Cup 2026", "International", "Transfers"]
const CATEGORY_ICONS: Record<string, string> = {
  "UEFA": "/uefa-logo.png", 
  "World Cup 2026": "/world-cup.png",
  "International": "/international.png",
  "Transfers": "/transfers.png"
}

// We define a palette for each category.
type Theme = {
  primary: string;    
  accent: string;       
  darkBorder: string;   
  overlayStart: string;
}

const CATEGORY_THEMES: Record<string, Theme> = {
  "UEFA": {
    // Classic European Football Blue theme
    primary: "#003399", 
    accent: "#0099ff",  
    darkBorder: "#001a4d",
    overlayStart: "rgba(0, 26, 77, 0.85)" 
  },
  "World Cup 2026": {
    // Vibrant Green and Gold theme
    primary: "#006B3C", 
    accent: "#FBB03B",  
    darkBorder: "#004225",
    overlayStart: "rgba(0, 66, 37, 0.85)"
  },
  "International": {
    // Bold Red and Classic Blue theme
    primary: "#CE1126", 
    accent: "#3B82F6",  
    darkBorder: "#8a0015",
    overlayStart: "rgba(138, 0, 21, 0.85)"
  },
  "Transfers": {
    // "Golden Nugget" / High Value theme
    primary: "#856600", 
    accent: "#FFD700", 
    darkBorder: "#523e00",
    overlayStart: "rgba(82, 62, 0, 0.85)"
  },
  // Fallback just in case
  "default": {
    primary: "#5a255f",
    accent: "#a626aa",
    darkBorder: "#37003c",
    overlayStart: "rgba(55, 0, 60, 0.8)"
  }
}


export default function RandomCategorySection() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentCategory, setCurrentCategory] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pick random category
        const randomCat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
        setCurrentCategory(randomCat)

        // Fetch hero articles to identify duplicates
        const heroRes = await fetch('/api/articles')
        if (!heroRes.ok) throw new Error(`Hero articles fetch failed: ${heroRes.status}`)
        const heroData = await heroRes.json()
        const heroArticles: Article[] = heroData.articles || []
        
        const featured = heroArticles.find(article => article.isFeatured) || heroArticles[0]
        const headlines = heroArticles.filter(a => a.slug !== featured?.slug).slice(0, 4)
        const displayedSlugs = [featured?.slug, ...headlines.map(a => a.slug)].filter(slug => slug) as string[]

        // Fetch articles for the RANDOM category
        const catRes = await fetch(`/api/articles?category=${encodeURIComponent(randomCat)}&limit=10`)
        if (!catRes.ok) throw new Error(`${randomCat} articles fetch failed: ${catRes.status}`)
        const catData = await catRes.json()
        const allCatArticles: Article[] = catData.articles || []

        // Filter duplicates
        const filteredArticles = allCatArticles.filter(
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

  // Determine current theme based on category state
  const theme = useMemo(() => {
    return CATEGORY_THEMES[currentCategory] || CATEGORY_THEMES['default'];
  }, [currentCategory]);

  if (isLoading) {
    // (Skeleton loader remains the same)
    return (
      <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Skeleton className="h-8 w-36 sm:w-44" />
          <Skeleton className="h-6 w-20 sm:w-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="lg:col-span-2"><Skeleton className="h-56 sm:h-80 rounded-2xl" /></div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[1,2,3].map((i) => (<Skeleton key={i} className="h-32 sm:h-48 rounded-2xl" />))}
          </div>
        </div>
      </div>
    )
  }

  if (articles.length === 0) return null

  return (
    <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
        {/* Header Text with dynamic primary color */}
        <div 
            className="group text-xl sm:text-2xl md:text-3xl font-extrabold flex items-center gap-3"
            style={{ color: theme.primary }}
        >
          <Image
            src={CATEGORY_ICONS[currentCategory] || "/premier-league.png"} 
            alt={`${currentCategory} Logo`}
            width={128}
            height={128}
            className="w-24 h-24 sm:w-32 sm:h-32 object-contain transition-transform duration-300 group-hover:scale-120"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          {currentCategory} News
        </div>
        
        <Link 
          href={`/news_by_category/${currentCategory}`}
          // the link neutral black/gray for simplicity, as dynamic hover states are tricky inline
          className="text-xs sm:text-sm font-semibold text-gray-800 hover:text-black underline-offset-4 hover:underline transition"
        >
          View All {currentCategory}
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
            {/* Dynamic Border Color */}
            <Card 
                className="h-56 sm:h-80 overflow-hidden relative shadow-xl rounded-2xl border-2"
                style={{ borderColor: theme.darkBorder }}
            >
              <div className="absolute inset-0">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* DYNAMIC OVERLAY GRADIENT */}
                <div 
                    className="absolute inset-0" 
                    style={{ background: `linear-gradient(to top, ${theme.overlayStart}, transparent)` }}
                />
              </div>
              <CardContent className="p-4 sm:p-7 absolute bottom-0 w-full z-10">
                {/* Dynamic Badge Accent Color */}
                <Badge 
                    className="mb-2 sm:mb-3 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg text-xs sm:text-base font-bold tracking-wide"
                    style={{ backgroundColor: theme.accent }}
                >
                  {article.category || currentCategory}
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
               {/* Dynamic Border Accent Color */}
              <Card 
                  className="h-32 sm:h-48 overflow-hidden relative rounded-2xl border shadow-md hover:shadow-xl transition-shadow"
                  style={{ borderColor: theme.accent }}
              >
                <div className="absolute inset-0">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                   
                  <div 
                     className="absolute inset-0" 
                     style={{ background: `linear-gradient(to top, ${theme.overlayStart.replace('0.85', '0.7')}, transparent)` }}
                   />
                </div>
                <CardContent className="p-3 sm:p-5 relative z-10">
                   {/* Dynamic Badge Dark Color */}
                  <Badge 
                      className="mb-1 sm:mb-2 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold tracking-wide"
                      style={{ backgroundColor: theme.darkBorder }}
                  >
                    {article.category || currentCategory}
                  </Badge>
                
                  <h3 className="font-bold text-white line-clamp-2 transition-colors text-sm sm:text-lg drop-shadow-sm">
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