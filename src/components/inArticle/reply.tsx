'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus } from 'lucide-react';

interface Article {
  _id: string;
}

// This component is used in the admin manage page to link to the reply page for a specific article`
export default function ReplyArticle({ article }: { article: Article }) {
  return (
    <Link href={`/admin/manage/reply/${article._id}`}>
      <Button
        size="sm"
        variant="outline"
        className="transition-all duration-200 hover:scale-105 border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
      >
        <MessageSquarePlus className="w-4 h-4 mr-2" /> Reply
      </Button>
    </Link>
  );
}