'use client';

import { useEffect } from 'react';

// This component uses Twitter's official embedding script for maximum stability.
export default function TweetCard({ tweetId }: { tweetId: string }) {
  useEffect(() => {
    // A global script loader to ensure the Twitter/x widget script is only added once.
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    document.body.appendChild(script);

    // When the script is loaded, it looks for elements with the class 'twitter-tweet'
    script.onload = () => {
      if (window.twttr) {
        window.twttr.widgets.load();
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [tweetId]);

  return (
    <div className="flex justify-center my-6">
      <blockquote className="twitter-tweet" data-theme="light">
        <a href={`https://twitter.com/user/status/${tweetId}`}>
          Loading Tweet...
        </a>
      </blockquote>
    </div>
  );
}

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: () => void;
      };
    };
  }
}
