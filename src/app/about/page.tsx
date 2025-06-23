import { HeartIcon, CheckBadgeIcon, GlobeAltIcon, SparklesIcon, DocumentChartBarIcon, NewspaperIcon, ScaleIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';

// Metadata for this page for SEO
export const metadata: Metadata = {
  title: "About GoalRush | Capturing the Heartbeat of Football",
  description: "Learn about the mission and promise of GoalRush, your new home for football news, analysis, and exclusive features built by fans, for fans.",
};


export default function AboutPage() {
  return (
    <div className="bg-base-200/60">
      {/* --- HERO SECTION --- */}
      <div className="hero h-80" style={{ backgroundImage: 'url(https://placehold.co/1600x600/000000/ffffff?text=Our+Story)' }}>
        <div className="hero-overlay bg-black bg-opacity-70"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-2xl">
            <h6 className="mb-5 text-2xl font-poppins font-extrabold">About </h6>
            <h1 className="mb-5 text-6xl font-poppins font-extrabold">GoalRush</h1>
            <p className="mb-5 text-xl font-light">Capturing the Heartbeat of Football</p>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto max-w-5xl p-6 md:p-12 -mt-16">
        <div className="bg-base-100 rounded-2xl shadow-xl p-8 md:p-12 space-y-12">
          
          {/* Introduction Section */}
          <section className="text-center">
            <p className="text-2xl font-poppins leading-relaxed text-base-content/90">
              It’s more than just a ball hitting the back of the net. It's a jolt of electricity. It's the roar of the crowd, the explosion of passion, the single moment a match turns on its head. <span className="text-primary font-bold">It's a rush.</span>
            </p>
            <div className="divider my-8"></div>
            <p className="text-lg text-base-content/80">
              That feeling is the reason we created GoalRush. Welcome to your new home for football news and analysis, built by dedicated fans, for dedicated fans. We live and breathe the beautiful game, and our mission is simple: to deliver the stories that matter with the speed and energy that football deserves. We cut through the noise to bring you authentic, insightful, and immediate coverage from every corner of the globe.
            </p>
          </section>

          {/* What You'll Find Section */}
          <section>
             <h2 className="text-4xl font-poppins font-bold text-center mb-10">What You'll Find on GoalRush</h2>
             <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-start space-x-4">
                    <NewspaperIcon className="h-10 w-10 text-accent mt-1"/>
                    <div>
                        <h3 className="text-xl font-poppins font-semibold">Breaking News & Live Scores</h3>
                        <p className="text-base-content/70">From the latest transfer sagas and managerial changes to instant goal alerts from the biggest leagues, we keep you in the know, as it happens.</p>
                    </div>
                </div>
                 <div className="flex items-start space-x-4">
                    <DocumentChartBarIcon className="h-10 w-10 text-accent mt-1"/>
                    <div>
                        <h3 className="text-xl font-poppins font-semibold">In-Depth Match Analysis</h3>
                        <p className="text-base-content/70">We go beyond the final score. Our team provides tactical breakdowns, player ratings, and post-match insights that explore the why and how behind every result.</p>
                    </div>
                </div>
                 <div className="flex items-start space-x-4">
                    <SparklesIcon className="h-10 w-10 text-accent mt-1"/>
                    <div>
                        <h3 className="text-xl font-poppins font-semibold">Exclusive Features & Editorials</h3>
                        <p className="text-base-content/70">From profiling rising stars to debating the greatest moments in football history, our feature articles offer a unique and passionate perspective on the game you love.</p>
                    </div>
                </div>
                 <div className="flex items-start space-x-4">
                    <GlobeAltIcon className="h-10 w-10 text-accent mt-1"/>
                    <div>
                        <h3 className="text-xl font-poppins font-semibold">A Global Pitch</h3>
                        <p className="text-base-content/70">While we focus on South African football, our coverage spans the globe. Whether your passion lies with European giants or the drama of South American football, GoalRush is your ticket to the game.</p>
                    </div>
                </div>
             </div>
          </section>

           {/* Our Promise Section */}
          <section>
             <h2 className="text-4xl font-poppins font-bold text-center mb-10">Our Promise to You</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="card bg-base-200/50 p-6">
                    <HeartIcon className="h-12 w-12 text-primary mx-auto mb-4"/>
                    <h3 className="text-2xl font-poppins font-bold">Passion-Driven</h3>
                    <p className="mt-2 text-base-content/80">We're not just reporters; we're lifelong supporters. Our love for the game fuels every single article we write.</p>
                </div>
                <div className="card bg-base-200/50 p-6">
                    <CheckBadgeIcon className="h-12 w-12 text-primary mx-auto mb-4"/>
                    <h3 className="text-2xl font-poppins font-bold">Accuracy First</h3>
                    <p className="mt-2 text-base-content/80">In a world of clickbait and rumours, we are committed to providing reliable, well-sourced journalism you can trust.</p>
                </div>
                 <div className="card bg-base-200/50 p-6">
                    <GlobeAltIcon className="h-12 w-12 text-primary mx-auto mb-4"/>
                    <h3 className="text-2xl font-poppins font-bold">For Every Fan</h3>
                    <p className="mt-2 text-base-content/80">We are building an inclusive community for every fan, regardless of the badge on your shirt or the league you follow.</p>
                </div>
             </div>
          </section>

           {/* Closing Section */}
          <section className="text-center border-t border-base-content/10 pt-8">
            <p className="text-lg">Thank you for visiting. Explore the latest headlines, dive into our features, and follow us on social media to become part of the community.</p>
          </section>
        </div>
      </div>
    </div>
  )
}