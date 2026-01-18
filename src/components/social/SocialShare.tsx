'use client';

import { Share2, Twitter, Facebook, Linkedin, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

export default function SocialShare({ url, title, description }: SocialShareProps) {
  const [showShare, setShowShare] = useState(false);
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        onClick={() => setShowShare(!showShare)}
        variant="outline"
        size="sm"
        className="bg-gray-900 border-gray-700 hover:bg-blue-300 hover:border-indigo-500 text-gray-300"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
      
      {showShare && (
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left duration-300">
          <Button
            onClick={() => handleShare('twitter')}
            variant="ghost"
            size="icon"
            className="hover:bg-blue-500/10 hover:text-blue-400"
            title="Share on Twitter"
          >
            <Twitter className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={() => handleShare('facebook')}
            variant="ghost"
            size="icon"
            className="hover:bg-blue-600/10 hover:text-blue-600"
            title="Share on Facebook"
          >
            <Facebook className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={() => handleShare('linkedin')}
            variant="ghost"
            size="icon"
            className="hover:bg-blue-700/10 hover:text-blue-700"
            title="Share on LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={() => handleShare('whatsapp')}
            variant="ghost"
            size="icon"
            className="hover:bg-green-500/10 hover:text-green-500"
            title="Share on WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={copyToClipboard}
            variant="ghost"
            size="icon"
            className="hover:bg-indigo-500/10 hover:text-indigo-400"
            title="Copy link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
