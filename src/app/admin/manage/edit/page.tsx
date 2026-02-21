'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Pencil, Tag, Clock, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { RichTextEditor } from '@/components/common/RichTextEditor';
import ReplyArticle from '@/components/common/reply';

// --- TYPES ---
interface ArticleUpdate {
  _id: string;
  title?: string;
  summary?: string;
  body: string;
  createdAt: string;
}

interface Article {
  _id: string;
  title: string;
  summary: string;
  slug: string;
  category: string;
  createdAt: string;
  seoTags?: string[];
  updates?: ArticleUpdate[];
}

export default function AdminArticlesPage() {
  const { data: session, status } = useSession();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for Main Article Deletion
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // State for Thread UI Toggles
  const [expandedThreads, setExpandedThreads] = useState<Record<string, boolean>>({});

  // State for Thread Update Editing
  const [editingUpdateId, setEditingUpdateId] = useState<string | null>(null);
  const [editUpdateContent, setEditUpdateContent] = useState('');

  // State for Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // --- Fetch articles ---
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

  useEffect(() => {
    fetchArticles();
  }, []);

  const toggleThread = (articleId: string) => {
    setExpandedThreads(prev => ({ ...prev, [articleId]: !prev[articleId] }));
  };

  // --- Delete Main Article ---
  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      const res = await fetch(`/api/articles/by-id/${selectedId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        toast.success('Article Deleted');
        setArticles(prev => prev.filter(article => article._id !== selectedId));
        
        // Adjust pagination if deleting the last item on the current page
        const newTotalItems = articles.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / ITEMS_PER_PAGE);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        }
      } else {
        toast.error(json.error || 'Failed to delete article');
      }
    } catch (err) {
      toast.error('Unexpected error while deleting article');
    } finally {
      setDialogOpen(false);
      setSelectedId(null);
    }
  };

  // --- Delete Individual Thread Update ---
  const handleDeleteUpdate = async (articleId: string, updateId: string) => {
    if (!confirm('Are you sure you want to delete this thread update?')) return;

    try {
      const res = await fetch(`/api/articles/by-id/${articleId}?updateId=${updateId}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      
      if (json.success) {
        toast.success('Thread update deleted');
        setArticles(prev => prev.map(art => {
          if (art._id === articleId) {
            return { ...art, updates: art.updates?.filter(u => u._id !== updateId) };
          }
          return art;
        }));
      } else {
        toast.error(json.error || 'Failed to delete update');
      }
    } catch (err) {
      toast.error('Unexpected error while deleting update');
    }
  };

  // --- Edit Individual Thread Update ---
  const handleSaveUpdateEdit = async (articleId: string, updateId: string) => {
    try {
      const res = await fetch(`/api/articles/by-id/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          editThreadUpdate: { 
            id: updateId, 
            body: editUpdateContent 
          } 
        }),
      });
      
      const json = await res.json();

      if (json.success) {
        toast.success('Thread update edited successfully');
        setEditingUpdateId(null);
        setArticles(prev => prev.map(art => {
          if (art._id === articleId) {
            return { 
              ...art, 
              updates: art.updates?.map(u => u._id === updateId ? { ...u, body: editUpdateContent } : u) 
            };
          }
          return art;
        }));
      } else {
        toast.error(json.error || 'Failed to edit update');
      }
    } catch (err) {
      toast.error('Unexpected error while editing update');
    }
  };

  // --- Session protection ---
  if (status === 'loading') return <main className="p-8 text-center">Checking session...</main>;
  if (status === 'unauthenticated') redirect('/login');
  if (loading) return <p className="text-center mt-10">Loading articles...</p>;


  // Pagination Calculation Logic
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentArticles = articles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Manage Articles</h1>

      <div className="grid gap-6">
        {currentArticles.map((article) => (
          <Card key={article._id} className="group transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-lg">
                {article.title}
                <span className="text-xs text-gray-400 font-normal">
                  {new Date(article.createdAt).toLocaleString('en-ZA', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm line-clamp-2">{article.summary}</p>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs text-indigo-600 bg-indigo-50 border-indigo-200">
                  {article.category}
                </Badge>
                {article.updates && article.updates.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {article.updates.length} Thread Updates
                  </Badge>
                )}
              </div>

              {/* ACTION BAR FOR MAIN ARTICLE */}
              <div className="flex flex-wrap gap-2 pt-2 pb-4 border-b border-gray-100 dark:border-gray-800">
                <Link href={`/manage/manage-articles/${article._id}`}>
                  <Button size="sm" variant="secondary" className="transition-all hover:scale-105">
                    <Pencil className="w-4 h-4 mr-2" /> Edit Main
                  </Button>
                </Link>

                <ReplyArticle article={article} />

                <Dialog open={dialogOpen && selectedId === article._id} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => { setSelectedId(article._id); setDialogOpen(true); }}
                      className="transition-all hover:scale-105"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete Main
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete this article?</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm">Are you sure you want to delete <strong>{article.title}</strong>? This removes the article and all its threads.</p>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                      <Button variant="destructive" onClick={handleDelete}>Confirm Delete</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="transition-all hover:scale-105 hover:border-primary hover:text-primary">
                      <Tag className="w-4 h-4 mr-2" /> SEO
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Update SEO Tags</DialogTitle></DialogHeader>
                    <textarea
                      className="w-full border rounded p-2 text-sm"
                      rows={3}
                      maxLength={300}
                      defaultValue={article.seoTags?.join(', ') || ''}
                      onChange={(e) => { article.seoTags = e.target.value.split(',').map(t => t.trim()).filter(Boolean); }}
                    />
                    <div className="flex justify-end mt-4">
                      <Button onClick={async () => {
                         // Note: Add SEO logic here if needed
                         toast.success("SEO update simulated.");
                      }}>Save Tags</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* RENDER THREADS (LIVE UPDATES) BENEATH MAIN ARTICLE */}
              {article.updates && article.updates.length > 0 && (
                <div className="mt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full flex justify-between items-center bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800"
                    onClick={() => toggleThread(article._id)}
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Manage Live Updates ({article.updates.length})
                    </span>
                    {expandedThreads[article._id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>

                  {expandedThreads[article._id] && (
                    <div className="mt-4 space-y-4 pl-4 border-l-2 border-indigo-200 dark:border-indigo-900">
                      {article.updates.slice().reverse().map((update) => (
                        <div key={update._id} className="p-4 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
                          
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-xs font-semibold text-indigo-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(update.createdAt).toLocaleString('en-US', {
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                            </span>

                            {/* Thread Action Buttons */}
                            <div className="flex items-center gap-2">
                              {editingUpdateId === update._id ? (
                                <>
                                  <Button size="sm" variant="outline" onClick={() => setEditingUpdateId(null)}>Cancel</Button>
                                  <Button size="sm" onClick={() => handleSaveUpdateEdit(article._id, update._id)}>Save</Button>
                                </>
                              ) : (
                                <>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" 
                                    onClick={() => {
                                      setEditingUpdateId(update._id);
                                      setEditUpdateContent(update.body);
                                    }}
                                  >
                                    <Pencil className="w-4 h-4 text-slate-500" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                                    onClick={() => handleDeleteUpdate(article._id, update._id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Editor OR Raw HTML Display */}
                          {editingUpdateId === update._id ? (
                            <div className="border rounded-md mt-2">
                              <RichTextEditor content={editUpdateContent} onChange={setEditUpdateContent} />
                            </div>
                          ) : (
                            <div className="space-y-2">
                               {update.title && <h4 className="font-bold text-slate-800 dark:text-slate-100">{update.title}</h4>}
                               {update.summary && <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{update.summary}</p>}
                               <div 
                                 className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 mt-2"
                                 dangerouslySetInnerHTML={{ __html: update.body }}
                               />
                            </div>
                          )}

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(startIndex + ITEMS_PER_PAGE, articles.length)}
            </span>{' '}
            of <span className="font-medium">{articles.length}</span> articles
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <div className="flex items-center px-4 text-sm font-medium border rounded-md bg-white dark:bg-gray-950">
               {currentPage} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

    </main>
  );
}