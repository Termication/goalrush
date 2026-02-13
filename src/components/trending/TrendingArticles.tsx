'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, ArrowUpRight, Clock, User, Sparkles, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface Article {
  _id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  slug: string;
  createdAt: string;
  isTrending?: boolean;
  isFeatured?: boolean;
  author?: string;
  readTime?: number;
}

const TRENDING_LIMIT = 4;

export default function TrendingArticles() {
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingArticles = async () => {
      try {
        const res = await fetch(`/api/articles?limit=50`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            const allArticles: Article[] = json.data || json.articles || [];
            const trending = allArticles
              .filter((article) => article.isFeatured || article.isTrending)
              .slice(0, TRENDING_LIMIT);
            setTrendingArticles(trending);
          }
        }
      } catch (err) {
        console.error('Failed to fetch trending articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingArticles();
  }, []);

  if (loading) {
    return <DarkGradientSkeletonLoader />;
  }

  if (trendingArticles.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Trending Now
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Discover what's capturing attention worldwide
            </p>
          </div>
        </div>
        
        <Link 
          href="/news_page" 
          className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      
      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trendingArticles.map((article, index) => (
          <GradientCard 
            key={article._id} 
            article={article} 
            index={index} 
          />
        ))}
      </div>
    </section>
  );
}

// Gradient Design 
function GradientCard({ article, index }: { article: Article; index: number }) {
  const gradientColors = [
    'from-indigo-500 via-purple-500 to-pink-500',
    'from-blue-500 via-indigo-500 to-purple-500',
    'from-purple-500 via-fuchsia-500 to-pink-500',
    'from-indigo-500 via-blue-500 to-cyan-500',
  ];

  const currentGradient = gradientColors[index % gradientColors.length];

  return (
    <Link href={`/news/${article.slug}`} className="block h-full group">
      <Card className="relative h-[380px] sm:h-[420px] w-full overflow-hidden rounded-3xl border-0 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentGradient} opacity-90 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Image Overlay */}
        <div className="absolute inset-0 opacity-50 group-hover:opacity-30 transition-opacity duration-500">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover mix-blend-overlay"
            priority={index < 2}
          />
        </div>

        {/* Content */}
        <div className="relative h-full p-6 sm:p-8 flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex flex-col gap-2">
                <Badge className="w-fit bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30 transition-colors">
                  {article.category}
                </Badge>
                {article.isTrending && (
                  <div className="flex items-center gap-1 text-xs">
                    <Sparkles className="h-3 w-3" />
                    <span className="text-white/80">Trending</span>
                  </div>
                )}
              </div>
              <div className="text-4xl font-black text-white/30">
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold leading-tight mb-4 line-clamp-3">
              {article.title}
            </h3>

            <p className="text-white/80 text-sm sm:text-base line-clamp-2">
              {article.summary}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-white/20">
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 sm:h-4 sm:4" />
                {article.readTime || 5} min
              </div>
              {article.author && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3 sm:h-4 sm:4" />
                  <span className="hidden sm:inline">{article.author}</span>
                </div>
              )}
            </div>
            
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white/30 group-hover:w-11 group-hover:h-11 sm:group-hover:w-14 sm:group-hover:h-14 transition-all duration-300">
              <ArrowUpRight className="h-4 w-4 sm:h-5 sm:5" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}


function DarkGradientSkeletonLoader() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Header Skeleton */}
      <div className="flex items-end justify-between mb-8">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="hidden sm:block h-5 w-20" />
      </div>
      
      {/* Cards Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className="relative h-[380px] sm:h-[420px] w-full overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-800/50"
          >
            <div className="relative h-full p-6 sm:p-8 flex flex-col justify-between">
              {/* Top Section */}
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className="space-y-2">
                    {/* Badge Skeleton */}
                    <Skeleton className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
                    {/* Trending Label Skeleton */}
                    <Skeleton className="h-3 w-16 bg-gray-200 dark:bg-gray-700" />
                  </div>
                  {/* Number Index Skeleton */}
                  <Skeleton className="h-10 w-12 bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Title Skeleton lines */}
                <div className="space-y-3 mb-6">
                  <Skeleton className="h-6 w-full bg-gray-300 dark:bg-gray-600" />
                  <Skeleton className="h-6 w-[90%] bg-gray-300 dark:bg-gray-600" />
                  <Skeleton className="h-6 w-[60%] bg-gray-300 dark:bg-gray-600" />
                </div>

                {/* Summary Skeleton lines */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-[80%] bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>

              {/* Bottom Section */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  {/* Read Time */}
                  <Skeleton className="h-4 w-12 bg-gray-200 dark:bg-gray-700" />
                  {/* Author */}
                  <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-700" />
                </div>
                
                {/* Arrow Circle Skeleton */}
                <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}