import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface Article {
  _id: string;
  title: string;
  slug: string;
  imageUrl: string;
  category: string;
  createdAt?: string;
}

interface ReadNextSectionProps {
  relatedArticles: Article[];
}

export default function ReadNextSection({ relatedArticles }: ReadNextSectionProps) {
  if (!relatedArticles || relatedArticles.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
      {/* Header with icon */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white dark:text-white">
          CONTINUE READING
        </h2>
      </div>

      {/* Mobile: horizontal scroll carousel */}
      <div className="block sm:hidden">
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
          {relatedArticles.map((article) => (
            <Link
              href={`/news/${article.slug}`}
              key={article._id}
              className="group flex-none w-64 snap-start"
            >
              <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg bg-gray-900">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 256px, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3">
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                    {article.category}
                  </Badge>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold leading-tight line-clamp-2 group-hover:text-indigo-300 transition-colors">
                    {article.title}
                  </h3>
                  
                </div>

                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop: grid layout */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedArticles.map((article) => (
          <Link
            href={`/news/${article.slug}`}
            key={article._id}
            className="group block"
          >
            <div className="relative h-56 rounded-2xl overflow-hidden shadow-lg bg-gray-900 border border-gray-200 dark:border-gray-800 group-hover:border-indigo-400 dark:group-hover:border-indigo-600 transition-all duration-300">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute top-3 left-3">
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                  {article.category}
                </Badge>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2 group-hover:text-indigo-300 transition-colors">
                  {article.title}
                </h3>
              </div>

              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}