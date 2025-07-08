'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Pencil, Tag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// --- TYPES ---
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
  const { data: session, status } = useSession();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // --- Fetch articles ---
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

  // --- Delete article ---
  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      const res = await fetch(`/api/articles/by-id/${selectedId}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Article deleted');
        setArticles(prev => prev.filter(article => article._id !== selectedId));
      } else {
        toast.error(json.error || 'Failed to delete article');
      }
    } catch (err) {
      toast.error('Unexpected error while deleting article');
      console.error('Error deleting article:', err);
    } finally {
      setDialogOpen(false);
      setSelectedId(null);
    }
  };

  // --- Session protection ---
  if (status === 'loading') return <main className="p-8 text-center">Checking session...</main>;
  if (status === 'unauthenticated') redirect('/login');
  if (loading) return <p className="text-center mt-10">Loading articles...</p>;

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Manage Articles</h1>

      <div className="grid gap-4">
        {articles.map((article) => (
          <Card key={article._id} className="group transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {article.title}
                <span className="text-xs text-gray-400 font-normal">
                  {new Date(article.createdAt).toLocaleString('en-ZA', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-muted-foreground text-sm">{article.summary}</p>
              <p className="text-xs text-gray-400">Category: {article.category}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                <Link href={`/manage/manage-articles/${article._id}`}>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="transition-all duration-200 hover:scale-105 hover:bg-secondary/90"
                  >
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </Button>
                </Link>

                <Dialog open={dialogOpen && selectedId === article._id} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedId(article._id);
                        setDialogOpen(true);
                      }}
                      className="transition-all duration-200 hover:scale-105 hover:bg-destructive/90"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete this article?</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm">
                      Are you sure you want to delete <strong>{article.title}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                      >
                        Confirm Delete
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  size="sm"
                  variant="outline"
                  className="transition-all duration-200 hover:scale-105 hover:border-primary hover:text-primary"
                >
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
