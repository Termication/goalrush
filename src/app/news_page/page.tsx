'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface Article {
  _id: string;
  title: string;
  summary: string;
  imageUrl: string;
  slug: string;
}

const PAGE_SIZE = 12;

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/articles?page=${page}&limit=${PAGE_SIZE}`);
        const json = await res.json();

        if (json.success) {
          setArticles(json.articles);
          const total = json.total || 0;
          setTotalPages(Math.max(1, Math.ceil(total / PAGE_SIZE)));
        }
      } catch (err) {
        console.error('Failed to fetch articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-neutral-800 mb-8 text-center">Latest Headlines</h1>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article._id}
                href={`/news/${article.slug}`}
                className="card bg-base-100 shadow-md image-full hover:scale-[1.01] transition"
              >
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
                  <h2 className="card-title text-yellow-300 line-clamp-2">{article.title}</h2>
                  <p className="text-blue-100 text-sm line-clamp-3">{article.summary}</p>
                  <div className="card-actions justify-end mt-auto">
                    <span className="btn btn-sm btn-primary">Read More</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-10">
            <Button
              onClick={handlePrev}
              disabled={page === 1}
              variant="outline"
              className="rounded"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>
            <Button
              onClick={handleNext}
              disabled={page === totalPages}
              variant="outline"
              className="rounded"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
