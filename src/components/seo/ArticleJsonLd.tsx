interface ArticleJsonLdProps {
  title: string;
  description: string;
  imageUrl: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  slug: string;
}

export default function ArticleJsonLd({
  title,
  description,
  imageUrl,
  datePublished,
  dateModified,
  authorName = "GoalRush Team",
  slug,
}: ArticleJsonLdProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description: description,
    image: imageUrl,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: authorName,
      url: "https://www.goal-rush.live",
    },
    publisher: {
      "@type": "Organization",
      name: "GoalRush",
      url: "https://www.goal-rush.live",
      logo: {
        "@type": "ImageObject",
        url: "https://www.goal-rush.live/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.goal-rush.live/news/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
