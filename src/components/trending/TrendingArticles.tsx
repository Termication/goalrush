'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Article {
  _id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  slug: string;
  createdAt: string;
}

export default function TrendingArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingArticles = async () => {
      try {
        const res = await fetch('/api/articles?limit=5');
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            const articlesList = json.data || json.articles || [];
            setArticles(articlesList.slice(0, 5));
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
    return (
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-6 w-6 text-indigo-500" />
          <h2 className="text-3xl font-poppins font-bold">Trending Now</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-6 w-6 text-indigo-500" />
        <h2 className="text-3xl font-poppins font-bold">Trending Now</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {articles.map((article, index) => (
          <Link
            href={`/news/${article.slug}`}
            key={article._id}
            className="group"
          >
            <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 border-gray-200">
              <div className="relative w-full h-40">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-indigo-600 text-white px-2 py-1 rounded text-xs font-bold">
                  #{index + 1}
                </div>
              </div>
              <CardContent className="p-3">
                <Badge variant="secondary" className="mb-2 text-xs">
                  {article.category}
                </Badge>
                <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {article.title}
                </h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
