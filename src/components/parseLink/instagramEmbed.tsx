'use client';

import { useEffect } from 'react';

// This component uses Instagram's official embedding script for stability.
export default function InstagramEmbed({ url }: { url: string }) {
  useEffect(() => {

    const scriptId = 'instagram-embed-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    // If the script doesn't exist, create and append it
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = '//www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    }

    // When the script is loaded, it looks for elements with the class 'instagram-media'
    // and processes them. We need to tell it to re-process whenever a new embed is added.
    script.onload = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };

    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }

  }, [url]);

  return (
    <div className="flex justify-center my-6">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ maxWidth: '540px', width: 'calc(100% - 2px)' }}
      >
        {/* The content inside is just a fallback */}
      </blockquote>
    </div>
  );
}

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}
