'use client';

import { Share2, Twitter, Facebook, Linkedin, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export default function SocialShare({ url, title, description, className }: SocialShareProps) {
  const [showShare, setShowShare] = useState(false);
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied!');
      setShowShare(false);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  // Handles the toggle without triggering parent links
  const toggleShare = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    setShowShare(!showShare);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap relative z-20">
      {/* 🟢 DYNAMIC BUTTON: Uses class if provided, else uses default */}
      <button
        onClick={toggleShare}
        className={className || "flex items-center justify-center px-3 py-2 text-sm font-medium transition-colors bg-gray-900 border border-gray-700 rounded-md hover:bg-blue-900/50 hover:border-indigo-500 text-black-300"}
      >
        <Share2 className={`h-4 w-4 ${className ? "text-white" : "mr-2"}`} />
        {/* Only show "Share" text if using the default style */}
        {!className && "Share"}
      </button>
      
      {showShare && (
        <div 
            className="flex items-center gap-1 animate-in fade-in slide-in-from-left duration-300 bg-gray-400 backdrop-blur-md rounded-full px-2 py-1 border border-white-500"
            onClick={(e) => e.stopPropagation()}
        >
          <Button onClick={() => handleShare('twitter')} variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-500/20 hover:text-blue-400 rounded-full"><Twitter className="h-4 w-4" /></Button>
          <Button onClick={() => handleShare('facebook')} variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-600/20 hover:text-blue-600 rounded-full"><Facebook className="h-4 w-4" /></Button>
          <Button onClick={() => handleShare('whatsapp')} variant="ghost" size="icon" className="h-8 w-8 hover:bg-green-500/20 hover:text-green-500 rounded-full"><MessageCircle className="h-4 w-4" /></Button>
          <Button onClick={copyToClipboard} variant="ghost" size="icon" className="h-8 w-8 hover:bg-indigo-500/20 hover:text-indigo-400 rounded-full"><LinkIcon className="h-4 w-4" /></Button>
        </div>
      )}
    </div>
  );
}