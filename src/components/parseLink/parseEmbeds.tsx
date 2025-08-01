export function parseEmbeds(html: string): string {
  // YouTube
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/g;
  html = html.replace(youtubeRegex, (_match, videoId) => {
    return `
      <iframe
        src="https://www.youtube.com/embed/${videoId}"
        frameborder="0"
        allowfullscreen
        class="w-full h-full rounded-lg"
      ></iframe>
    `;
  });

  // Vimeo
  const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/g;
  html = html.replace(vimeoRegex, (_match, videoId) => {
    return `
      <iframe
        src="https://player.vimeo.com/video/${videoId}"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
        class="w-full h-full"
      ></iframe>
    `;
  });

  // Twitter/X
  const twitterRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/[^/]+\/status\/(\d+)/g;
  html = html.replace(twitterRegex, (_match, tweetId) => {
    return `<tweet-embed data-id="${tweetId}"></tweet-embed>`;
  });

  // This is the crucial fix. We find all <p> tags and inspect their content.
  html = html.replace(/<p>([\s\S]*?)<\/p>/g, (match, content) => {
    if (content.includes('<iframe') || content.includes('<tweet-embed')) {
      return `<div>${content}</div>`;
    }
    

    
    // Otherwise, if it's just a normal paragraph, we leave it as is.
    return match;
  });
  
  return html;
}
