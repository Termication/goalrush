import Footer from "@/components/common/footer"
import HomePage from "@/components/home/hero-section"
import MoreHeadlinesSection from "@/components/home/moreheadlines"
import LaligaSection from "@/components/home/laligaSection"
import PremierLeagueSection from "@/components/home/premierLeagueSection"

export default function Home() {
  return (
    <main className="w-full min-h-screen flex flex-col pt-0">
      <HomePage />
      <LaligaSection />
      <PremierLeagueSection />
      <MoreHeadlinesSection />
    </main>
  )
}
