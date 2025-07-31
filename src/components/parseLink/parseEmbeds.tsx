export function parseEmbeds(html: string): string {
  // YouTube
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/g;
  html = html.replace(youtubeRegex, (match, videoId) => {
    return `
      <div class="my-6 w-full aspect-video">
        <iframe
          src="https://www.youtube.com/embed/${videoId}"
          frameborder="0"
          allowfullscreen
          class="w-full h-full rounded-lg"
        ></iframe>
      </div>
    `;
  });

  // Vimeo
  const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/g;
  html = html.replace(vimeoRegex, (match, videoId) => {
    return `
      <div class="my-6 aspect-w-16 aspect-h-9">
        <iframe
          src="https://player.vimeo.com/video/${videoId}"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
          class="w-full h-full"
        ></iframe>
      </div>
    `;
  });

  return html;
}
