'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import AdBanner from '@/components/ads/AdBanner';
import { Clock, BookOpen, TrendingUp, ArrowRight, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import SocialShare from '@/components/social/SocialShare';

interface AuthorData {
  _id?: string;
  name: string;
  slug?: string;
  avatarUrl?: string;
  role?: string;
}

interface Article {
  _id: string;
  title: string;
  summary: string;
  imageUrl: string;
  slug: string;
  category?: string;
  readTime?: number;
  createdAt?: string;
  author?: string | AuthorData;
  views?: number;
  isFeatured?: boolean;
  isTrending?: boolean;
}

const PAGE_SIZE = 12;

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextArticle, setNextArticle] = useState<Article | null>(null);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/articles?page=${page}&limit=${PAGE_SIZE}`);
        const json = await res.json();

        if (json.success) {
          const articlesList = json.articles || [];
          setArticles(articlesList);

          const total = json.total || 0;
          setTotalPages(Math.max(1, Math.ceil(total / PAGE_SIZE)));

          const featured = articlesList.find((a: Article) => a.isFeatured);
          setFeaturedArticle(featured || articlesList[0] || null);

          const readSlugs = JSON.parse(localStorage.getItem('readArticles') || '[]') as string[];
          const unread = articlesList.find((a: Article) => !readSlugs.includes(a.slug));
          setNextArticle(unread || articlesList[0] || null);
        }
      } catch (err) {
        console.error('Failed to fetch articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page]);

  const markAsRead = (slug: string) => {
    const stored = JSON.parse(localStorage.getItem('readArticles') || '[]') as string[];
    if (!stored.includes(slug)) {
      const updated = [...stored, slug];
      localStorage.setItem('readArticles', JSON.stringify(updated));
    }
  };

  const handlePrev = () => {
    if (page > 1) setPage(p => p - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(p => p + 1);
  };

  const gradientOverlays = [
    'bg-gradient-to-t from-black/90 via-black/50 to-transparent',
    'bg-gradient-to-t from-black/85 via-black/45 to-transparent',
    'bg-gradient-to-t from-black/80 via-black/40 to-transparent',
    'bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent',
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl animate-pulse">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Breaking News
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
              News<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Portal</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              Discover breaking stories and in-depth analysis from around the world.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
                <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {totalPages * PAGE_SIZE}+
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Stories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Reading Banner */}
        {nextArticle && !loading && (
          <div className="mb-12 relative">
            <div className="absolute -top-3 left-6 z-10">
              <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-bold shadow-lg">
                <BookOpen className="h-3 w-3" />
                CONTINUE READING
              </div>
            </div>
            
            <Link
              href={`/news/${nextArticle.slug}`}
              onClick={() => markAsRead(nextArticle.slug)}
              className="block group"
            >
              <div className="relative h-[300px] rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300">
                <div className="absolute inset-0">
                  <Image
                    src={nextArticle.imageUrl}
                    alt={nextArticle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                </div>

                <div className="relative h-full p-8 flex items-center">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1.5 text-sm text-gray-300">
                        <Clock className="h-4 w-4" />
                        {nextArticle.readTime || 5} min read
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-green-400 font-medium">
                        <User className="h-4 w-4" />
                        <span>
                          By {
                            typeof nextArticle.author === 'object' && nextArticle.author !== null 
                              ? (nextArticle.author.name || 'Editorial Team') 
                              : (nextArticle.author || 'Editorial Team')
                          }
                        </span>
                      </div>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      {nextArticle.title}
                    </h3>
                    
                    <div className="flex items-center gap-4">
                      <div className="px-5 py-2.5 bg-gradient-to-r from-white/25 to-white/15 backdrop-blur-sm rounded-full text-white font-medium hover:from-white/35 hover:to-white/25 transition-all duration-300">
                        Resume Reading
                      </div>
                      <div className="text-gray-300 flex items-center gap-1 group-hover:text-white transition-colors">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Ad Banner */}
        <div className="mb-12">
          <AdBanner dataAdSlot="9418924432" />
        </div>

        {/* Main Articles Grid */}
        {loading ? (
          <ArticlesSkeleton />
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Latest Stories
                <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                  ({articles.length})
                </span>
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Updated daily</span>
                <span className="sm:hidden">Daily</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {articles.map((article, index) => (
                <ArticleCard 
                  key={article._id} 
                  article={article} 
                  index={index}
                  markAsRead={markAsRead}
                  gradientOverlay={gradientOverlays[index % gradientOverlays.length]}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8 border-t border-gray-200 dark:border-gray-800">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, totalPages * PAGE_SIZE)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalPages * PAGE_SIZE}</span> articles
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={handlePrev}
                  disabled={page === 1}
                  variant="outline"
                  className="gap-2 rounded-xl px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        variant={page === pageNum ? "default" : "ghost"}
                        className={cn(
                          "h-10 w-10 rounded-xl",
                          page === pageNum && "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                        )}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  onClick={handleNext}
                  disabled={page === totalPages}
                  variant="outline"
                  className="gap-2 rounded-xl px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

// Article Card Component with Author Integration
function ArticleCard({ article, index, markAsRead, gradientOverlay }: { 
  article: Article; 
  index: number; 
  markAsRead: (slug: string) => void;
  gradientOverlay: string;
}) {
  const authorObj = typeof article.author === 'object' && article.author !== null ? article.author : null;
  // Fallback to "Editorial Team" if no author is found
  const authorName = authorObj?.name || (typeof article.author === 'string' ? article.author : 'Editorial Team');
  const authorAvatar = authorObj?.avatarUrl;
  const authorSlug = authorObj?.slug;

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group">
      <Link
        href={`/news/${article.slug}`}
        onClick={() => markAsRead(article.slug)}
        className="absolute inset-0 z-0"
      >
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className={`absolute inset-0 ${gradientOverlay} group-hover:from-black/95 group-hover:via-black/60 transition-all duration-500`} />
      </Link>

      <div className="relative h-full p-6 flex flex-col justify-end z-10 pointer-events-none">
        {/* Top Badges & Share */}
        <div className="flex items-center justify-between mb-4 pointer-events-auto">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
              {article.category || "News"}
            </div>
            {article.isTrending && (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-bold rounded-full">
                <TrendingUp className="h-3 w-3" />
                TRENDING
              </div>
            )}
          </div>
          
          <div className="z-20">
            <SocialShare
              url={`https://www.goal-rush.live/news/${article.slug}`}
              title={article.title}
              description={article.summary}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors flex items-center justify-center"
            />
          </div>
        </div>

        {/* Title */}
        <Link href={`/news/${article.slug}`} className="pointer-events-auto">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 line-clamp-2 group-hover:line-clamp-3 transition-all duration-300">
            {article.title}
          </h3>
        </Link>
        
        {/* Summary */}
        <p className="text-gray-300 text-sm md:text-base mb-4 line-clamp-2 group-hover:line-clamp-3 transition-all duration-300">
          {article.summary}
        </p>

        {/* Footer Info with Author */}
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div className="flex items-center gap-3 pointer-events-auto">
            {authorName && (
              authorSlug ? (
                <Link 
                  href={`/authors/${authorSlug}`} 
                  className="flex items-center gap-2 group/author hover:opacity-90"
                >
                  <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-md border border-white/20">
                    {authorAvatar ? (
                      <Image src={authorAvatar} alt={authorName} fill className="object-cover" />
                    ) : (
                      authorName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-200 group-hover/author:text-green-400 transition-colors">
                    {authorName.length > 16 ? authorName.substring(0, 16) + '...' : authorName}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {authorName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-300">
                    {authorName.length > 16 ? authorName.substring(0, 16) + '...' : authorName}
                  </span>
                </div>
              )
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm text-gray-300">
              <Clock className="h-4 w-4" />
              {article.readTime || 5} min
            </div>
            <Link 
              href={`/news/${article.slug}`} 
              className="flex items-center gap-1 text-white font-medium hover:text-indigo-300 transition-colors pointer-events-auto"
            >
              <span>Read</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton Loader
function ArticlesSkeleton() {
  const gradients = [
    'from-gray-800 to-gray-900',
    'from-gray-800 to-gray-900',
    'from-gray-800 to-gray-900',
    'from-gray-800 to-gray-900',
    'from-gray-800 to-gray-900',
    'from-gray-800 to-gray-900',
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className={cn(
            "relative h-[400px] w-full overflow-hidden rounded-2xl bg-gradient-to-br",
            gradients[i % gradients.length]
          )}
        >
          <div className="relative h-full p-6 flex flex-col justify-end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-20 bg-gradient-to-r from-gray-700 to-gray-800" />
                  <Skeleton className="h-6 w-16 bg-gradient-to-r from-gray-700 to-gray-800" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-800" />
              </div>

              <Skeleton className="h-7 w-full bg-gradient-to-r from-gray-700 to-gray-800" />
              <Skeleton className="h-7 w-5/6 bg-gradient-to-r from-gray-700 to-gray-800" />
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-gradient-to-r from-gray-700 to-gray-800" />
                <Skeleton className="h-4 w-2/3 bg-gradient-to-r from-gray-700 to-gray-800" />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-800" />
                  <Skeleton className="h-4 w-24 bg-gradient-to-r from-gray-700 to-gray-800" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-12 bg-gradient-to-r from-gray-700 to-gray-800" />
                  <Skeleton className="h-4 w-16 bg-gradient-to-r from-gray-700 to-gray-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}