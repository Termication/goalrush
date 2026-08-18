import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dbConnect from '@/lib/dbConnect';
import Author, { IAuthor } from '@/models/Author';
import Article, { IArticle } from '@/models/Article';
import { Metadata } from 'next';

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata for SEO & Social Cards
export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  await dbConnect();
  
  // Ensure schema registration
  const _ = Author;
  const author = await Author.findOne({ slug }).lean() as IAuthor | null;

  if (!author) return { title: 'Author Not Found | GoalRush' };

  return {
    title: `${author.name} - ${author.role || 'Journalist'} | GoalRush`,
    description: author.bio || `Read articles written by ${author.name} on GoalRush.`,
    openGraph: {
      title: `${author.name} - GoalRush`,
      description: author.bio || `Read articles by ${author.name}`,
      images: author.avatarUrl ? [{ url: author.avatarUrl }] : [],
    },
  };
}

export default async function AuthorProfilePage({ params }: AuthorPageProps) {
  const { slug } = await params;
  await dbConnect();

  // 1. Fetch Author Details
  const author = await Author.findOne({ slug }).lean() as any;
  if (!author) notFound();

  // 2. Fetch All Articles Written by This Author
  const rawArticles = await Article.find({ author: author._id })
    .sort({ createdAt: -1 })
    .lean();

  const articles = JSON.parse(JSON.stringify(rawArticles)) as IArticle[];

  // 3. Structured Data for Google News (Person Schema)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.role || 'Writer',
    description: author.bio || '',
    image: author.avatarUrl || '',
    worksFor: {
      '@type': 'NewsMediaOrganization',
      name: 'GoalRush',
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto space-y-10">
        {/* --- AUTHOR BIO HEADER CARD --- */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative h-28 w-28 rounded-full overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 border-2 border-green-500">
            {author.avatarUrl ? (
              <Image
                src={author.avatarUrl}
                alt={author.name}
                fill
                className="object-cover"
                sizes="112px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-400">
                {author.name?.charAt(0) || 'A'}
              </div>
            )}
          </div>

          <div className="space-y-3 text-center sm:text-left flex-1">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {author.name}
              </h1>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-1">
                {author.role || 'Staff Writer'}
              </p>
            </div>

            {author.bio && (
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-2xl">
                {author.bio}
              </p>
            )}

            <div className="pt-2 text-xs text-slate-400 font-medium">
              <span>{articles.length} Published Articles</span>
            </div>
          </div>
        </div>

        {/* --- ARTICLES SECTION --- */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight border-b border-slate-200 dark:border-slate-800 pb-3">
            Articles by {author.name}
          </h2>

          {articles.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-500">No articles published by this author yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article: any) => (
                <Link
                  key={String(article._id)}
                  href={`/news/${article.slug}`}
                  className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800">
                    {article.imageUrl ? (
                      <Image
                        src={article.imageUrl}
                        alt={article.imageAlt || article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-medium">
                        GoalRush News
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-green-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                      {article.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-green-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2">
                        {article.summary}
                      </p>
                    </div>

                    <div className="text-[11px] font-medium text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {new Date(article.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}