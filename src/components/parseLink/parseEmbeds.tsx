export function parseEmbeds(html: string): string {

  // Remove existing embed links to prevent duplication
  const embedLinkPatterns = [
    /<p[^>]*>(\s*<a[^>]+href="(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})"[^>]*>.*?<\/a>\s*)<\/p>/g,
    /<p[^>]*>(\s*<a[^>]+href="(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)"[^>]*>.*?<\/a>\s*)<\/p>/g,
    /<p[^>]*>(\s*<a[^>]+href="(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/[^/]+\/status\/(\d+)"[^>]*>.*?<\/a>\s*)<\/p>/g,
    /<p[^>]*>(\s*<a[^>]+href="(https?:\/\/(?:www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+\/?)"[^>]*>.*?<\/a>\s*)<\/p>/g
  ];

  embedLinkPatterns.forEach(pattern => {
    html = html.replace(pattern, '$1');
  });

  // YouTube
  const youtubeRegex =
    /<a[^>]+href="(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})"[^>]*>.*?<\/a>/g;
  html = html.replace(youtubeRegex, (_m, videoId) =>
    `<div class="embed-container"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen class="w-full h-full rounded-lg"></iframe></div>`
  );

  // Vimeo
  const vimeoRegex =
    /<a[^>]+href="(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)"[^>]*>.*?<\/a>/g;
  html = html.replace(vimeoRegex, (_m, videoId) =>
    `<div class="embed-container"><iframe src="https://player.vimeo.com/video/${videoId}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen class="w-full h-full"></iframe></div>`
  );

  // Twitter/X
  const twitterRegex =
    /<a[^>]+href="(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/[^/]+\/status\/(\d+)"[^>]*>.*?<\/a>/g;
  html = html.replace(twitterRegex, (_m, tweetId) =>
    `<div class="embed-container"><tweet-embed data-id="${tweetId}"></tweet-embed></div>`
  );

  // Instagram
  const instaRegex =
    /<a[^>]+href="(https?:\/\/(?:www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+\/?)"[^>]*>.*?<\/a>/g;
  html = html.replace(instaRegex, (_m, url) =>
    `<div class="embed-container"><instagram-embed data-url="${url}"></instagram-embed></div>`
  );

  return html;
}