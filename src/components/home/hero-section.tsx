'use client'

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

const featured = {
  title: "🇫🇷 Mbappé Joins Real Madrid!",
  summary:
    "It's official — Kylian Mbappé has signed a five-year contract with Real Madrid. The football world reacts.",
  image: "https://picsum.photos/seed/mbappe/900/600",
  slug: "mbappe-joins-real-madrid",
}

const headlines = [
  {
    title: "🔥 Premier League Fixtures Released",
    summary: "Arsenal vs Man City opens the 2025 season.",
    image: "https://picsum.photos/seed/fixtures/600/400",
    slug: "premier-league-fixtures",
  },
  {
    title: "💰 Record Transfer Rumor: Haaland to PSG?",
    summary: "Insiders suggest a €250M bid is in play.",
    image: "https://picsum.photos/seed/haaland/600/400",
    slug: "haaland-to-psg-rumor",
  },
]

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isMobile) {
    return (
      <div className="w-full min-h-screen flex flex-col">
        {/* Mobile Hero Section */}
        <div className="relative w-full h-[45vh] min-h-[280px] mb-4">
          <Image
            src={featured.image}
            alt={featured.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-5 space-y-3">
            <Badge className="w-fit px-3 py-1.5 text-xs bg-red-600 text-white rounded-full">
              Breaking News
            </Badge>
            <h1 className="text-white text-3xl font-bold leading-tight drop-shadow-lg">
              {featured.title}
            </h1>
            <p className="text-white/90 text-sm line-clamp-2">{featured.summary}</p>
            <Link
              href={`/news/${featured.slug}`}
              className="relative text-sm text-blue-200 inline-flex items-center gap-1 transition-colors hover:text-blue-100 after:absolute after:left-0 after:-bottom-0.5 after:h-[1.5px] after:w-0 after:bg-blue-100 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
            >
              Read full story <span>→</span>
            </Link>
          </div>
        </div>

        {/* Mobile Detailed Cards */}
        <div className="px-4 space-y-4">
          {headlines.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-all hover:shadow-lg"
            >
              <div className="relative w-full aspect-[16/9]">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <div className="p-4 flex flex-col space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">🏆</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{item.title}</h3>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3 mb-2">{item.summary}</p>
                <Link
                  href={`/news/${item.slug}`}
                  className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 text-sm font-medium"
                >
                  Read more <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Desktop layout
  return (
    <div className="min-h-screen px-4 py-5">
      {/* Desktop Hero */}
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6 mb-12">
        <div className="flex flex-col justify-center">
          <Badge className="animate-pulse mb-4 px-4 py-1 text-sm bg-red-600 text-white hover:bg-red-700">
            Breaking News
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{featured.title}</h1>
          <p className="text-lg text-muted-foreground mb-4">{featured.summary}</p>
          <Link
            href={`/news/${featured.slug}`}
            className="text-primary font-medium inline-flex items-center gap-1"
          >
            <span className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-[1.5px] after:w-0 after:bg-primary after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
              Read full story
            </span>
            <span>→</span>
          </Link>
        </div>
        <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-xl overflow-hidden shadow">
          <Image src={featured.image} alt={featured.title} fill className="object-cover" />
        </div>
      </div>

      {/* Desktop Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {headlines.map((item, idx) => (
          <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="relative w-full h-40">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-3">{item.summary}</p>
              <Link
                href={`/news/${item.slug}`}
                className="relative text-sm text-primary after:absolute after:left-0 after:-bottom-0.5 after:h-[1.5px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                Read more →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
