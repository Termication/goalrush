export default function OrganizationJsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GoalRush",
    url: "https://www.goal-rush.live",
    logo: "https://www.goal-rush.live/logo.png",
    description: "Your source for the latest football news, live scores, match highlights, and expert analysis from leagues around the world.",
    sameAs: [
      "https://x.com/GOAL__RUSH",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      url: "https://www.goal-rush.live/support",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
