'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Article {
  _id: string;
  title: string;
  summary: string;
  imageUrl: string;
  slug: string;
  createdAt: string;
  author: string;
}

const PAGE_SIZE = 12;

export default function NewsByCategoryPage() {
  const params = useParams();
  const category = params?.category
  ? decodeURIComponent(params.category as string)
  : '';

  const formattedCategory = category.replace(/-/g, ' ');

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextArticle, setNextArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/articles?category=${encodeURIComponent(category)}&page=${page}&limit=${PAGE_SIZE}`
        );
        const json = await res.json();

        if (json.success) {
          const articles = json.articles || [];
          setArticles(articles);

          const total = json.total || 0;
          setTotalPages(Math.max(1, Math.ceil(total / PAGE_SIZE)));

          const readSlugs = JSON.parse(localStorage.getItem('readArticles') || '[]') as string[];
          const unread = articles.find((a: Article) => !readSlugs.includes(a.slug));

          setNextArticle(unread || articles[0] || null);
        }
      } catch (err) {
        console.error('Failed to fetch articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page, category]);

  const markAsRead = (slug: string) => {
    const stored = JSON.parse(localStorage.getItem('readArticles') || '[]') as string[];
    if (!stored.includes(slug)) {
      const updated = [...stored, slug];
      localStorage.setItem('readArticles', JSON.stringify(updated));
    }
  };

  // Format date as "Today at 15h00", "Yesterday at 17h00", or "Aug 12, 2023"
  const formatArticleDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Check if date is today
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.getHours().toString().padStart(2, '0')}h${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // Check if date was yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.getHours().toString().padStart(2, '0')}h${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // For older dates, return formatted date
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="mb-8 text-center">
        <div className="inline-block bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-medium mb-3">
          News Category
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 capitalize">
          {formattedCategory}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Stay updated with the latest news in {formattedCategory.toLowerCase()}
        </p>
      </div>

      {/* Continue reading card */}
      {nextArticle && !loading && (
        <div className="mb-10 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-indigo-50 to-white border border-gray-100">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-2/5 h-64 md:h-auto">
              <Image
                src={nextArticle.imageUrl}
                alt={nextArticle.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 md:w-3/5 flex flex-col">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded mr-3">
                  Continue Reading
                </span>
                <span>{formatArticleDate(nextArticle.createdAt)}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{nextArticle.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{nextArticle.summary}</p>
              <div className="mt-auto">
                <Link
                  href={`/news/${nextArticle.slug}`}
                  onClick={() => markAsRead(nextArticle.slug)}
                  className="self-start"
                >
                  <Button className="bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center">
                    Continue Reading
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
          Latest News
        </h2>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="relative h-48 bg-gray-200 animate-pulse" />
                <div className="p-5">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-3 animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded w-full mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-4/5 mb-4 animate-pulse" />
                  <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No articles found in this category</div>
            <Button onClick={() => setPage(1)}>Refresh</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <div 
                  key={article._id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-48">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                      <span>{formatArticleDate(article.createdAt)}</span>
                      <span>{article.author}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.summary}
                    </p>
                    <Link
                      href={`/news/${article.slug}`}
                      onClick={() => markAsRead(article.slug)}
                      className="inline-block"
                    >
                      <Button 
                        variant="outline" 
                        className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                      >
                        Read More
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-10 border-t border-gray-200 pt-6">
              <Button 
                onClick={() => setPage(p => p - 1)} 
                disabled={page === 1}
                variant="outline"
                className="flex items-center"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              <div className="text-sm text-gray-600">
                Page <span className="font-semibold text-indigo-600">{page}</span> of <span className="font-semibold">{totalPages}</span>
              </div>
              
              <Button 
                onClick={() => setPage(p => p + 1)} 
                disabled={page === totalPages}
                variant="outline"
                className="flex items-center"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Category highlights */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-12">
        <h3 className="text-xl font-bold text-gray-900 mb-4">More in {formattedCategory}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-indigo-100 text-indigo-800 rounded-lg p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Trending Stories</h4>
              <p className="text-sm text-gray-600">Most popular in this category</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-green-100 text-green-800 rounded-lg p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Verified Sources</h4>
              <p className="text-sm text-gray-600">Trusted information only</p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
        <p className="max-w-xl mx-auto mb-6 opacity-90">
          Get the latest {formattedCategory.toLowerCase()} news delivered to your inbox
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <Button className="bg-white text-indigo-600 hover:bg-gray-100 font-medium py-3">
            Subscribe
          </Button>
        </div>
      </div>
    </main>
  );
}