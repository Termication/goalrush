import Footer from "@/components/common/footer"
import HomePage from "@/components/home/hero-section"
import MoreHeadlinesSection from "@/components/home/moreheadlines"
import LaligaSection from "@/components/home/laligaSection"
import PremierLeagueSection from "@/components/home/premierLeagueSection"
import RandomCategorySection from "@/components/home/randomSection"
import PremierLeagueTable from "@/components/home/PremierLeagueTable";
import AdBanner from "@/components/ads/AdBanner"
import NewsletterSubscribe from "@/components/newsletter/NewsletterSubscribe"
import TrendingArticles from "@/components/trending/TrendingArticles"
import RandomLeftTable from "@/components/home/RandomLeftTable"
import RandomRightTable from "@/components/home/RandomRightTable"



export default function Home() {
  return (
    <main className="w-full min-h-screen flex flex-col pt-0">
      <HomePage />


      {/* --- RANDOM LEFT TABLE (La Liga or UEFA) --- */}
      <RandomLeftTable />
      {/* ----------------------------- */}

      {/* --- RANDOM RIGHT TABLE (Premier League or Bundesliga) --- */}
      <RandomRightTable />
      {/* ----------------------------- */}
      
      {/* --- TRENDING ARTICLES --- */}
      <TrendingArticles />
      {/* ----------------------------- */}
      
      <RandomCategorySection />

      {/* --- AD UNIT --- */}
      <AdBanner dataAdSlot="9611330277" />
      {/* ----------------------------- */}

      <LaligaSection />

      {/* --- AD UNIT --- */}
      <AdBanner dataAdSlot="9228186898" />
      {/* ----------------------------- */}

      <PremierLeagueSection />


      {/* --- AD UNIT --- */}
      <AdBanner dataAdSlot="7835214172" />
      {/* ----------------------------- */}

      <MoreHeadlinesSection />


      {/* --- NEWSLETTER SUBSCRIPTION --- */}
      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        <NewsletterSubscribe />
      </div>
      {/* ----------------------------- */}
    </main>
  )
}
