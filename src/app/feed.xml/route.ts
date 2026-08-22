import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';
import Author from '@/models/Author';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    
    // Ensure Author schema is registered for population
    const _ensureAuthor = Author;

    // Fetch the latest 30 articles
    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(30)
      .populate('author')
      .lean();

    const siteUrl = 'https://www.goal-rush.live';

    // Map articles to RSS XML items
    const rssItems = articles.map((article: any) => {
      // Safely extract author name
      const authorObj = typeof article.author === 'object' && article.author !== null ? article.author : null;
      const authorName = authorObj?.name || (typeof article.author === 'string' ? article.author : 'GoalRush Editorial Team');
      
      // Escape special characters in XML
      const title = article.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const summary = article.summary.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      return `
        <item>
          <title><![CDATA[${title}]]></title>
          <link>${siteUrl}/news/${article.slug}</link>
          <guid isPermaLink="true">${siteUrl}/news/${article.slug}</guid>
          <pubDate>${new Date(article.createdAt).toUTCString()}</pubDate>
          <description><![CDATA[${summary}]]></description>
          <dc:creator><![CDATA[${authorName}]]></dc:creator>
          ${article.imageUrl ? `<enclosure url="${article.imageUrl.replace(/&/g, '&amp;')}" type="image/jpeg" length="0" />` : ''}
        </item>
      `;
    }).join('');

    // Wrap items in the main RSS Channel wrapper
    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>GoalRush | Breaking Football News</title>
        <link>${siteUrl}</link>
        <description>The latest football news, transfers, live updates, and odds from GoalRush.</description>
        <language>en-us</language>
        <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
        ${rssItems}
      </channel>
    </rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 's-maxage=1800, stale-while-revalidate', // Cache for 30 minutes
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating feed', { status: 500 });
  }
}