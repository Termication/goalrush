'use client';

import { parseEmbeds } from '@/components/parseLink/parseEmbeds';
import parse, { domToReact, Element, HTMLReactParserOptions } from 'html-react-parser';
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

  // We define the parser options here so we can recursively call them for nested elements (like tables)
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        const { name, attribs } = domNode;

        // --- Custom Image Render ---
        if (name === 'img') {
          // Extract 'style' and 'class' to prevent React string/object runtime crashes
          const { style, class: originalClass, ...safeAttribs } = attribs;
          
          return (
            <img
              {...safeAttribs}
              className="rounded-2xl shadow-xl mx-auto border border-gray-800 my-6 w-auto h-auto max-h-[600px] object-cover"
              loading="lazy"
            />
          );
        }

        // --- Custom Table Render ---
        if (name === 'table') {
          // Extract 'style' and 'class' from tables as well
          const { style, class: originalClass, ...safeAttribs } = attribs;

          return (
            <div className="overflow-x-auto w-full my-8 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151515] shadow-sm">
              <table {...safeAttribs} className="w-full text-left border-collapse min-w-[600px] m-0">
                {/* We pass 'options' to domToReact so child rows/cells process properly */}
                {domToReact(domNode.children as any, options)}
              </table>
            </div>
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
  };

  // Render the processed HTML with custom components for embeds
  return (
    <div className="prose dark:prose-invert max-w-none prose-lg 

      /* Heading Styles */
      [&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:mb-6 [&_h1]:mt-10 [&_h1]:leading-tight [&_h1]:text-gray-900 dark:[&_h1]:text-gray-100
      [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:leading-tight [&_h2]:text-gray-900 dark:[&_h2]:text-gray-100
      [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-4 [&_h3]:mt-8 [&_h3]:text-gray-900 dark:[&_h3]:text-gray-100
      [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mb-4 [&_h4]:mt-8 [&_h4]:text-gray-900 dark:[&_h4]:text-gray-100

      /* General Styles */
      [&_blockquote]:border-l-4 
      [&_blockquote]:pl-4 
      [&_blockquote]:italic 
      [&_blockquote]:text-muted-foreground 
      [&_blockquote]:border-muted 
      [&_a]:text-indigo-500 
      [&_a:hover]:underline
      [&_ul]:list-disc
      [&_ol]:list-decimal
      [&_li]:my-2
      [&_li]:ml-6
      
      /* Beautiful Table Styling */
      [&_th]:bg-gray-900 dark:[&_th]:bg-gray-900
      [&_th]:p-4 [&_th]:font-semibold [&_th]:text-blue-700 dark:[&_th]:text-blue-700 
      [&_th]:border-b dark:[&_th]:border-gray-800
      
      [&_td]:bg-gray-900 dark:[&_td]:bg-gray-900
      [&_td]:text-white dark:[&_td]:text-white
      [&_td]:p-4 [&_td]:border-b dark:[&_td]:border-gray-800
      [&_tr:last-child_td]:border-b-0
      [&_tr:hover]:bg-gray-900 dark:[&_tr:hover]:bg-gray-900
      [&_tr]:transition-colors
      ">
      {parse(processedHtml, options)}
    </div>
  );
}