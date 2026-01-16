'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Improved email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    // TODO: Replace with actual API call in production
    // Example: await fetch('/api/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) })
    setTimeout(() => {
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg p-6 md:p-8">
      <div className="max-w-2xl mx-auto text-center">
        <Mail className="h-12 w-12 mx-auto mb-4 text-indigo-300" />
        <h3 className="text-2xl font-poppins font-bold text-white mb-2">
          Stay Updated with GoalRush
        </h3>
        <p className="text-gray-300 mb-6">
          Get the latest football news, match updates, and exclusive content delivered straight to your inbox.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
        
        <p className="text-xs text-gray-400 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
}
