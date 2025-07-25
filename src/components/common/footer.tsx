import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">GoalRush</h2>
          <p className="text-sm mt-2 text-gray-400">Latest football news, scores, and transfer updates — all in one place.</p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/articles" className="hover:text-white">Articles</Link></li>
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/tags/premier-league" className="hover:text-white">Premier League</Link></li>
            <li><Link href="/tags/transfers" className="hover:text-white">Transfers</Link></li>
            <li><Link href="/tags/analysis" className="hover:text-white">Analysis</Link></li>
            <li><Link href="/tags/international" className="hover:text-white">International</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <Link href="#" aria-label="Facebook" className="hover:text-white">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="Twitter" className="hover:text-white">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="Instagram" className="hover:text-white">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="LinkedIn" className="hover:text-white">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} GoalRush. All rights reserved.
      </div>
    </footer>
  );
}
