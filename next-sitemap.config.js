module.exports = {
  siteUrl: "https://www.goal-rush.live",
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ['/admin/*', '/login', '/manage/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/login', '/manage'],
      },
    ],
    additionalSitemaps: [
      'https://www.goal-rush.live/sitemap.xml',
    ],
  },
};
