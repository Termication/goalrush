'use client';

import { useEffect, useState, ChangeEvent, FormEvent, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, UploadCloud } from 'lucide-react';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { redirect } from 'next/navigation';

export default function EditArticlePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    body: '',
    imageUrl: '',
    category: '',
    isFeatured: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const featuredImageRef = useRef<HTMLInputElement | null>(null);

  // Fetch the article details
  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      setLoadingArticle(true);
      try {
        const res = await fetch(`/api/articles/by-id/${id}`);
        if (!res.ok) throw new Error('Failed to fetch article');
        const json = await res.json();
        const { title, summary, body, imageUrl, category, isFeatured } = json.article;
        setFormData({ title, summary, body, imageUrl, category, isFeatured });
      } catch (err: any) {
        setError(err.message || 'Error loading article data.');
      } finally {
        setLoadingArticle(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBodyChange = (html: string) => {
    setFormData(prev => ({ ...prev, body: html }));
  };

  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    setFormData(prev => ({ ...prev, isFeatured: Boolean(checked) }));
  };

  const handleFeaturedImageUpload = async (file: File) => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    setIsLoading(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setFormData(prev => ({ ...prev, imageUrl: json.data.secure_url }));
      } else {
        throw new Error(json.error || 'Upload failed');
      }
    } catch (err: any) {
      setError(`Image Upload Failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFeaturedImageUpload(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      setError("Please upload a featured image before updating.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/articles/by-id/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update article');
      }

      setSuccess('Article updated successfully!');
      router.push('/admin/articles');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') return <main className="p-8">Checking session...</main>;
  if (status === 'unauthenticated') redirect('/login');
  if (loadingArticle) return <main className="p-8">Loading article...</main>;

  return (
    <main className="bg-slate-100 dark:bg-slate-900 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Edit Article</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea id="summary" name="summary" value={formData.summary} onChange={handleInputChange} required />
              </div>

              {formData.body !== '' && (
                <div className="space-y-2">
                  <Label>Body</Label>
                  <RichTextEditor content={formData.body} onChange={handleBodyChange} />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Featured Image</Label>
                  <input ref={featuredImageRef} type="file" accept="image/*" onChange={onFileSelect} className="hidden" />
                  <div className="border border-dashed p-4 rounded-lg text-center">
                    {formData.imageUrl ? (
                      <div className="flex flex-col items-center gap-2">
                        <img src={formData.imageUrl} alt="Preview" className="h-24 w-auto rounded-md" />
                        <Button type="button" variant="link" onClick={() => featuredImageRef.current?.click()}>Change</Button>
                      </div>
                    ) : (
                      <Button type="button" variant="outline" onClick={() => featuredImageRef.current?.click()}>
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Upload
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" value={formData.category} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="isFeatured" name="isFeatured" checked={formData.isFeatured} onCheckedChange={handleCheckboxChange} />
                <Label htmlFor="isFeatured">Feature on homepage</Label>
              </div>

              {success && (
                <Alert variant="default">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
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

            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto ml-auto">
                {isLoading ? 'Updating...' : 'Update Article'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </main>
  );
}
