'use client';

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useRouter, useParams, redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, MoveLeft, Tag } from 'lucide-react';


import { RichTextEditor } from '@/components/common/RichTextEditor';

interface Article {
  _id: string;
  title: string;
  summary: string;
  category: string;
}

export default function ReplyArticlePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  
  // State for Title and Summary of the Reply
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
  });
  
  // State for the Rich Text Editor content
  const [content, setContent] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // --- Handle standard input changes ---
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Fetch original article context ---
  useEffect(() => {
    if (status !== 'authenticated' || !id) return;

    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/by-id/${id}`);
        const json = await res.json();
        if (json.success) {
          setArticle(json.article);
        } else {
          setError('Article not found.');
        }
      } catch (err: any) {
        setError(err.message || 'Error loading article context.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [status, id]);

  // --- SUBMIT LOGIC ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Reply body content cannot be empty. Please click outside the editor to save the text before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // Send the title, summary, and body to the backend as a single object
    const newThreadPayload = {
      title: formData.title,
      summary: formData.summary,
      body: content
    };

    try {
      const res = await fetch(`/api/articles/by-id/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newThreadReply: newThreadPayload }),
      });
      const json = await res.json();
      
      if (res.ok && json.success) {
        setSuccess('Live update added to thread successfully!');
        toast.success('Live update added to thread!');
        // Redirect back to manage list after success
        setTimeout(() => router.push('/admin/manage/edit'), 1500);
      } else {
        throw new Error(json.error || 'Failed to add update');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- AUTH CHECK ---
  if (status === 'loading') {
    return <main className="flex items-center justify-center min-h-screen">Loading session...</main>;
  }

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  if (isLoading) {
    return <main className="flex items-center justify-center min-h-screen">Loading article context...</main>;
  }

  return (
    <main className="bg-slate-100 dark:bg-slate-900 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Button asChild variant="outline" className="group">
            <Link href="/admin/manage/edit">
              <MoveLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Manage
            </Link>
          </Button>
        </div>

        {/* Main Editor Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="font-poppins text-2xl">Add Live Update (Thread)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Write a live update. It will be added to the timeline below the main article.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="title">Update Title (Optional)</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  placeholder="e.g., Goal! 1-0" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Brief Summary (Optional)</Label>
                <Textarea 
                  id="summary" 
                  name="summary" 
                  value={formData.summary} 
                  onChange={handleInputChange} 
                  placeholder="A quick summary of this specific update..." 
                />
              </div>

              <div className="space-y-2">
                <Label>Update Body *</Label>
                <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden bg-white">
                  {/* RichTextEditor Usage */}
                  <RichTextEditor 
                    content={content} 
                    onChange={setContent} 
                  />
                </div>
              </div>

              {/* Status Messages */}
              {success && (
                <Alert variant="default" className="border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>

            <CardFooter className="bg-gray-50 dark:bg-gray-800/50 rounded-b-xl border-t border-gray-100 dark:border-gray-800 p-6">
               <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto ml-auto bg-indigo-600 hover:bg-indigo-700 text-white">
                  {isSubmitting ? 'Publishing Update...' : 'Publish Update'}
                </Button>
            </CardFooter>
          </Card>
        </form>

        {/* --- ORIGINAL ARTICLE CONTEXT (Displayed at the bottom) --- */}
        {article && (
          <div className="mt-8 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm opacity-90">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
              <Tag className="w-4 h-4" /> Original Article Context
            </h3>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {article.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {article.summary}
            </p>
            <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-full">
              {article.category}
            </span>
          </div>
        )}

      </div>
    </main>
  );
}