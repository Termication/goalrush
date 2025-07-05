'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Article {
  _id: string;
  title: string;
  summary: string;
  imageUrl: string;
  slug: string;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/articles');
        const json = await res.json();
        setArticles(json.articles || []);
      } catch (err) {
        console.error('Failed to fetch articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Latest Headlines</h1>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article._id} href={`/news/${article.slug}`} className="card bg-base-100 shadow-md image-full hover:scale-[1.01] transition">
              <figure>
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  width={500}
                  height={300}
                  className="object-cover w-full h-64"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-white line-clamp-2">{article.title}</h2>
                <p className="text-white text-sm line-clamp-3">{article.summary}</p>
                <div className="card-actions justify-end mt-auto">
                  <span className="btn btn-sm btn-primary">Read More</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
