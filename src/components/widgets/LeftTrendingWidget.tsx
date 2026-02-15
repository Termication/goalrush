'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, CalendarDays, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Article {
  _id: string;
  title: string;
  slug: string;
  imageUrl: string;
  createdAt: string;
  isFeatured?: boolean;
}

export default function LeftTrendingWidget() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(`/api/articles?limit=10`);
        if (res.ok) {
          const json = await res.json();
          const allData = json.data || json.articles || [];
          setArticles(allData.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load left trending widget');
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) return null; 
  if (articles.length === 0) return null;

  return (
    <aside 
      className={cn(

        "hidden xl:block fixed top-24 z-30",
        "left-2 w-45 2xl:left-6 2xl:w-72",
        "animate-in slide-in-from-left-6 fade-in duration-700"
      )}
    >
 
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-3 2xl:p-5 border border-gray-200 dark:border-gray-700 shadow-xl">
        
        {/* Header */}
        <div className="flex items-center gap-2 2xl:gap-3 mb-3 2xl:mb-5 pb-3 2xl:pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="p-1.5 2xl:p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg shadow-md shadow-orange-500/20">
            <TrendingUp className="h-3 w-3 2xl:h-4 2xl:w-4 text-white" />
          </div>
          <h3 className="text-base 2xl:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Trending
          </h3>
        </div>

        {/* List */}
        <div className="space-y-3 2xl:space-y-4">
          {articles.map((item, index) => (
            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
              className="group flex gap-2 2xl:gap-3 items-start p-1.5 2xl:p-2 -mx-1.5 2xl:-mx-2 rounded-xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              {/* Image & Rank */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 2xl:w-14 2xl:h-14 rounded-lg overflow-hidden relative shadow-sm">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                {/* Floating Rank Badge */}
                <div className="absolute -top-1.5 -left-1.5 2xl:-top-2 2xl:-left-2 w-4 h-4 2xl:w-5 2xl:h-5 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center shadow-sm z-10">
                  <span className="text-[9px] 2xl:text-[10px] font-bold text-gray-900 dark:text-white">
                    {index + 1}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 py-0.5">
                <h4 className="text-[11px] 2xl:text-xs font-semibold text-gray-800 dark:text-gray-200 leading-tight line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                  {item.title}
                </h4>
                
                <div className="flex items-center justify-between mt-1.5 2xl:mt-2">
                  <div className="flex items-center gap-1 text-[9px] 2xl:text-[10px] text-gray-400">
                    <CalendarDays className="h-2.5 w-2.5 2xl:h-3 2xl:w-3" />
                    <span>
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <ArrowUpRight className="h-3 w-3 text-gray-300 group-hover:text-amber-500 transition-colors opacity-0 group-hover:opacity-100" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-3 2xl:mt-5 pt-3 2xl:pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
          <Link 
            href="/news_page" 
            className="text-[10px] 2xl:text-xs font-medium text-gray-500 hover:text-amber-600 transition-colors"
          >
            View Top 50 Charts
          </Link>
        </div>
      </div>
    </aside>
  );
}