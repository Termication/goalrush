'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MoveLeft, Calendar } from 'lucide-react';
import ArticleBody from '@/components/common/ArticleBody';
import AdBanner from '@/components/ads/AdBanner';
import SocialShare from '@/components/social/SocialShare';
import ArticleJsonLd from '@/components/seo/ArticleJsonLd';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import NewsletterSubscribe from '@/components/newsletter/NewsletterSubscribe';

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

// --- Skeleton Component for this page (Dark Theme) ---
const ArticlePageSkeleton = () => (
  <main className="bg-[#191a1a] text-white min-h-screen">
    <div className="max-w-4xl mx-auto p-4 animate-pulse">
      <Skeleton className="h-10 w-32 mb-6 bg-gray-800" />
      <Skeleton className="h-8 w-40 mb-4 bg-gray-800" />
      <Skeleton className="h-12 w-full mb-2 bg-gray-700" />
      <Skeleton className="h-12 w-3/4 mb-4 bg-gray-700" />
      <Skeleton className="h-6 w-48 mb-6 bg-gray-700" />
      <Skeleton className="relative w-full h-80 mb-6 rounded-lg bg-gray-800" />
      <div className="space-y-4">
        <Skeleton className="h-5 w-full bg-gray-700" />
        <Skeleton className="h-5 w-full bg-gray-700" />
        <Skeleton className="h-5 w-5/6 bg-gray-700" />
      </div>
    </div>
  </main>
);

export default function NewsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

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
          fetch(`/api/articles?limit=4`),
        ]);

        if (articleRes.ok) {
          const articleJson = await articleRes.json();
          if (articleJson.success) {
            setArticle(articleJson.data);
          }
        }

        if (relatedRes.ok) {
          const relatedJson = await relatedRes.json();
          if (relatedJson.success) {
        
            const articlesList = relatedJson.data || relatedJson.articles || [];
            const filteredRelated = articlesList
              .filter((a: Article) => a.slug !== slug)
              .slice(0, 3);
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
      <main className="bg-[#191a1a] text-white min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-100">Article Not Found</h1>
        <p className="text-gray-400">
          The article you are looking for does not exist or may have been moved.
        </p>
        <Button asChild variant="link" className="mt-4 text-indigo-400 hover:text-indigo-300">
          <Link href="/">← Back to Home</Link>
        </Button>
      </main>
    );
  }

  return (
    <>
      {/* Dynamic Meta Tags */}
      <Head>
        <title>{article.title} | GoalRush</title>
        <meta name="description" content={article.summary} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.summary} />
        <meta property="og:image" content={article.imageUrl} />
        <meta property="og:url" content={`https://www.goal-rush.live/news/${article.slug}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.summary} />
        <meta name="twitter:image" content={article.imageUrl} />
        <link rel="canonical" href={`https://www.goal-rush.live/news/${article.slug}`} />
      </Head>
      
      {/* JSON-LD Structured Data for SEO */}
      <ArticleJsonLd
        title={article.title}
        description={article.summary}
        imageUrl={article.imageUrl}
        datePublished={article.createdAt}
        slug={article.slug}
      />
      
      {/* Breadcrumb Structured Data */}
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://www.goal-rush.live' },
          { name: article.category || 'News', url: `https://www.goal-rush.live/news_by_category/${article.category?.toLowerCase()}` },
          { name: article.title, url: `https://www.goal-rush.live/news/${article.slug}` },
        ]}
      />
      
      <main className="bg-[#191a1a] text-white min-h-screen">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <div className="mb-6">
          <Button
            asChild
            variant="outline"
            className="group bg-gray-900 border-gray-700 hover:bg-gray-800 hover:border-gray-600"
          >
            <Link href="/">
              <MoveLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to News
            </Link>
          </Button>
        </div>

        <header className="mb-6">
          <Badge className="mb-4 bg-indigo-500 text-white">
            {article.category || 'News'}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-poppins font-extrabold mb-3 leading-tight text-gray-100">
            {article.title}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-400 space-x-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(article.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
            <SocialShare 
              url={`https://www.goal-rush.live/news/${article.slug}`}
              title={article.title}
              description={article.summary}
            />
          </div>
        </header>


        <ArticleBody body={article.body} />

        {/* --- IN-ARTICLE AD --- */}
        <div className="my-8">
            <AdBanner 
                dataAdSlot="3636114718" 
                dataAdFormat="fluid" 
                dataFullWidthResponsive={true} 
            />
        </div>

        {/* --- Newsletter Subscription --- */}
        <div className="my-12">
          <NewsletterSubscribe />
        </div>

        {/* --- Read Next Section --- */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 pt-8 border-t border-gray-800">
            <h2 className="text-2xl font-poppins font-bold mb-6 text-gray-100">
              Read Next
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link
                  href={`/news/${related.slug}`}
                  key={related._id}
                  className="block group"
                >
                  <Card className="overflow-hidden h-full bg-gray-900 border-gray-800 group-hover:border-indigo-500 transition-all duration-30">
                    <div className="relative w-full h-40">
                      <Image
                        src={related.imageUrl}
                        alt={related.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <Badge
                        variant="secondary"
                        className="mb-2 bg-gray-800 text-gray-300"
                      >
                        {related.category}
                      </Badge>
                      <h3 className="text-md font-semibold leading-tight h-16 text-gray-100 group-hover:text-indigo-400 transition-colors">
                        {related.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
    </>
  );
}

