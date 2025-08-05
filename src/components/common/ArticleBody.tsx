'use client';

import { parseEmbeds } from '@/components/parseLink/parseEmbeds';
import parse, { domToReact } from 'html-react-parser';
import TweetCard from '@/components/parseLink/xPostCard';
import InstagramEmbed from '@/components/parseLink/instagramEmbed'; 
import Quote from "@/components/parseLink/quotes"


// This component takes the raw HTML body of an article and renders it,
// replacing any embed links with their corresponding React components.
export default function ArticleBody({ body }: { body: string }) {
  return (
    <div className="prose dark:prose-invert max-w-none prose-lg">
      {parse(parseEmbeds(body), {
        replace: (domNode: any) => {
          if (domNode.name === 'tweet-embed' && domNode.attribs?.['data-id']) {
            return <TweetCard tweetId={domNode.attribs['data-id']} />;
          }
    
          if (domNode.name === 'iframe' && domNode.attribs?.src?.includes('youtube.com/embed')) {
            return (
              <div className="my-6 w-full aspect-video">
                <iframe
                  src={domNode.attribs.src}
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                />
              </div>
            );
          }
    
          if (domNode.name === 'iframe' && domNode.attribs?.src?.includes('player.vimeo.com/video')) {
            return (
              <div className="my-6 aspect-w-16 aspect-h-9">
                <iframe
                  src={domNode.attribs.src}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            );
          }
    
          if (domNode.name === 'instagram-embed' && domNode.attribs?.['data-url']) {
            return <InstagramEmbed url={domNode.attribs['data-url']} />;
          }

          // ✅ Blockquote to <Quote> component
          if (domNode.name === 'blockquote') {
            const children = domToReact(domNode.children);

            // Look for a <figcaption> child to extract author
            const authorNode = domNode.children.find(
              (child: any) =>
                child.name === 'figcaption' || // <figcaption>
                (child.type === 'tag' &&
                  child.name === 'p' &&
                  child.children?.[0]?.data?.startsWith('—')) // Optional fallback
            );

            let author;
            if (authorNode) {
              author = authorNode.children?.[0]?.data?.replace(/^—\s*/, '');
            }

            return <Quote author={author}>{children}</Quote>;
          }
        },
      })}
    </div>
  );
}
