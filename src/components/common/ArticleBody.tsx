'use client';

import { parseEmbeds } from '@/components/parseLink/parseEmbeds';
import parse, { domToReact, Element } from 'html-react-parser';
import TweetCard from '@/components/parseLink/xPostCard';
import InstagramEmbed from '@/components/parseLink/instagramEmbed'; 
import { useEffect, useState } from 'react';

// This component takes the raw HTML body of an article and renders it,
// replacing any embed links with their corresponding React components.
export default function ArticleBody({ body }: { body: string }) {
  const [processedHtml, setProcessedHtml] = useState('');

  useEffect(() => {
    // Process embeds on client side only to avoid hydration issues
    setProcessedHtml(parseEmbeds(body));
  }, [body]);

  // Render the processed HTML with custom components for embeds
  return (
    <div className="prose dark:prose-invert max-w-none prose-lg 
      [&_blockquote]:border-l-4 
      [&_blockquote]:pl-4 
      [&_blockquote]:italic 
      [&_blockquote]:text-muted-foreground 
      [&_blockquote]:border-muted 
      [&_a]:text-blue-600 
      [&_a:hover]:underline
      [&_ul]:list-disc
      [&_ol]:list-decimal
      [&_li]:my-2
      [&_li]:ml-6
      ">

      // Parse the processed HTML and replace specific tags with custom components
      {parse(processedHtml, {
        replace: (domNode) => {
          if (domNode instanceof Element) {
            const { name, attribs } = domNode;

            if (name === 'img') {
              return (
                <img
                  {...attribs}
                  className="rounded-2xl shadow-xl mx-auto border border-gray-800 my-6 w-auto h-auto max-h-[600px] object-cover"
                  loading="lazy"
                />
              );
            }

            // Twitter/X embed
            if (name === 'tweet-embed' && attribs?.['data-id']) {
              return (
                <div className="my-6">
                  <TweetCard tweetId={attribs['data-id']} />
                </div>
              );
            }
      
            // YouTube video
            if (name === 'iframe' && attribs?.src?.includes('youtube.com/embed')) {
              return (
                <div className="my-6 w-full aspect-video">
                  <iframe
                    src={attribs.src}
                    frameBorder="0"
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                  />
                </div>
              );
            }
      
            // Vimeo video
            if (name === 'iframe' && attribs?.src?.includes('player.vimeo.com/video')) {
              return (
                <div className="my-6 aspect-w-16 aspect-h-9">
                  <iframe
                    src={attribs.src}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              );
            }
      
            // Instagram embed
            if (name === 'instagram-embed' && attribs?.['data-url']) {
              return (
                <div className="my-6">
                  <InstagramEmbed url={attribs['data-url']} />
                </div>
              );
            }
          }

          return undefined;
        },
      })}
    </div>
  );
}