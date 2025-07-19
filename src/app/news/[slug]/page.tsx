'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MoveLeft, Calendar, Tag } from 'lucide-react';

// Define the structure of an article
interface Article {
  _id: string;
  title: string;
  summary: string;
  imageUrl: string;
  body: string;
  category: string;
  slug: string;
  createdAt: string;
}

// --- Skeleton Component for this page ---
const ArticlePageSkeleton = () => (
  <main className="max-w-4xl mx-auto p-4 animate-pulse">
    <Skeleton className="h-10 w-32 mb-6" />
    <Skeleton className="h-8 w-40 mb-4" />
    <Skeleton className="h-12 w-full mb-2" />
    <Skeleton className="h-12 w-3/4 mb-4" />
    <Skeleton className="h-6 w-48 mb-6" />
    <Skeleton className="relative w-full h-80 mb-6 rounded-lg" />
    <div className="space-y-4">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-5/6" />
      <Skeleton className="h-5 w-full mt-4" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
    </div>
  </main>
);

export default function NewsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleData = async () => {
      if (!slug) return;
      setLoading(true);

      try {
        const [articleRes, relatedRes] = await Promise.all([
          fetch(`/api/articles/by-slug/${slug}`),
          fetch(`/api/articles?limit=4`)
        ]);

        // --- Handle the main article response ---
        if (articleRes.ok) {
          const articleJson = await articleRes.json();
          if (articleJson.success) {
            setArticle(articleJson.data);
          }
        }

        // --- FIX: Handle the related articles response robustly ---
        if (relatedRes.ok) {
          const relatedJson = await relatedRes.json();
          if (relatedJson.success) {
            // Check for articles under 'data' (new API) or 'articles' (old API)
            const articlesList = relatedJson.data || relatedJson.articles || [];
            
            const filteredRelated = articlesList.filter(
              (a: Article) => a.slug !== slug
            ).slice(0, 3);
            setRelatedArticles(filteredRelated);
          }
        }

      } catch (err) {
        console.error('Fetch operation failed:', err);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [slug]);

  if (loading) {
    return <ArticlePageSkeleton />;
  }

  if (!article) {
    return (
      <main className="max-w-4xl mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold">Article Not Found</h1>
        <p className="text-muted-foreground">The article you are looking for does not exist or may have been moved.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/">← Back to Home</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <Button asChild variant="outline" className="group">
          <Link href="/">
            <MoveLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to News
          </Link>
        </Button>
      </div>

      <header className="mb-6">
        <Badge className="mb-4">{article.category || 'News'}</Badge>
        <h1 className="text-4xl md:text-5xl font-poppins font-extrabold mb-3 leading-tight">{article.title}</h1>
        <div className="flex items-center text-sm text-muted-foreground space-x-4">
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
        </div>
      </header>
      
      
      <article
        className="max-w-none"
        dangerouslySetInnerHTML={{ __html: article.body }}
      />

      {/* --- Read Next Section --- */}
      {relatedArticles.length > 0 && (
        <section className="mt-16 pt-8 border-t">
          <h2 className="text-2xl font-poppins font-bold mb-6">Read Next</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((related) => (
              <Link href={`/news/${related.slug}`} key={related._id} className="block group">
                <Card className="overflow-hidden h-full group-hover:shadow-xl transition-shadow duration-300">
                  <div className="relative w-full h-40">
                    <Image src={related.imageUrl} alt={related.title} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="mb-2">{related.category}</Badge>
                    <h3 className="text-md font-semibold leading-tight h-16 group-hover:text-primary transition-colors">
                      {related.title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
