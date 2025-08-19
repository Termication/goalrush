import Footer from "@/components/common/footer"
import HomePage from "@/components/home/hero-section"
import MoreHeadlinesSection from "@/components/home/moreheadlines"
import LaligaSection from "@/components/home/laligaSection"
import PremierLeagueSection from "@/components/home/premierLeagueSection"
import PremierLeagueTable from "@/components/home/PremierLeagueTable";


export default function Home() {
  return (
    <main className="w-full min-h-screen flex flex-col pt-0">
      <HomePage />
      <PremierLeagueTable />
      <LaligaSection />
      <PremierLeagueSection />
      <MoreHeadlinesSection />
    </main>
  )
}
