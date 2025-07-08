'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Pencil, Tag } from 'lucide-react';

interface Article {
  _id: string;
  title: string;
  summary: string;
  slug: string;
  category: string;
  createdAt: string;
  seoTags?: string[];
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/articles');
        const json = await res.json();
        if (json.success) {
          setArticles(json.articles || []);
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this article?');
    if (!confirm) return;

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setArticles(prev => prev.filter(article => article._id !== id));
      }
    } catch (err) {
      console.error('Error deleting article:', err);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading articles...</p>;
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Manage Articles</h1>

      <div className="grid gap-4">
        {articles.map((article) => (
          <Card key={article._id}>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground text-sm">{article.summary}</p>
              <p className="text-xs text-gray-400">Category: {article.category}</p>
              <div className="flex gap-2 mt-2">
                <Link href={`/manage/manage-articles/${article._id}`}>
                  <Button size="sm" variant="secondary">
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </Button>
                </Link>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(article._id)}>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
                <Button size="sm" variant="outline">
                  <Tag className="w-4 h-4 mr-2" /> SEO
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}