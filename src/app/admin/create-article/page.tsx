'use client';

import { useState, ChangeEvent, FormEvent, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, UploadCloud } from 'lucide-react';
import { RichTextEditor } from '@/components/common/RichTextEditor';

export default function CreateArticlePage() {
  // --- AUTHENTICATION CHECK ---
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    body: '',
    imageUrl: '',
    category: '',
    isFeatured: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const featuredImageRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBodyChange = (html: string) => {
    setFormData(prev => ({...prev, body: html}));
  };

  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    setFormData(prev => ({ ...prev, isFeatured: Boolean(checked) }));
  };
  
  // --- FEATURED IMAGE UPLOAD ---
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
      setError(`Featured Image Upload Failed: ${err.message}`);
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
        setError("Please upload a featured image before publishing.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Prepare the data to send
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create article');
      }
      
      setSuccess('Article created successfully!');
      setFormData({
        title: '', summary: '', body: '', imageUrl: '', category: '', isFeatured: false,
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- REDIRECTION LOGIC ---
  if (status === 'loading') {
    return (
        <main className="flex items-center justify-center min-h-screen">
            <p>Loading session...</p>
        </main>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  // Render the form only if authenticated
  return (
    <main className="bg-slate-100 dark:bg-slate-900 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="font-poppins text-2xl">Create New Article</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Mbappé Joins Real Madrid!" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="summary">Summary (Subtitle)</Label>
                <Textarea id="summary" name="summary" value={formData.summary} onChange={handleInputChange} placeholder="A short summary of the article..." required />
              </div>

              <div className="space-y-2">
                <Label>Body</Label>
                <RichTextEditor
                  content={formData.body}
                  onChange={handleBodyChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="featuredImage">Featured Image</Label>
                   <input
                    ref={featuredImageRef}
                    type="file"
                    accept="image/*"
                    onChange={onFileSelect}
                    className="hidden"
                  />
                  <div className="border border-dashed rounded-lg p-4 text-center">
                    {formData.imageUrl ? (
                       <div className="flex flex-col items-center gap-2">
                         <img src={formData.imageUrl} alt="Featured preview" className="h-24 w-auto rounded-md" />
                         <Button type="button" variant="link" onClick={() => featuredImageRef.current?.click()}>Change Image</Button>
                       </div>
                    ) : (
                      <Button type="button" variant="outline" onClick={() => featuredImageRef.current?.click()}>
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Upload Featured Image
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g., Premier League" required />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="isFeatured" name="isFeatured" checked={formData.isFeatured} onCheckedChange={handleCheckboxChange} />
                <Label htmlFor="isFeatured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Feature this article on the homepage?
                </Label>
              </div>

              {success && (
                <Alert variant="default">
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
            <CardFooter>
               <Button type="submit" disabled={isLoading} className="w-full md:w-auto ml-auto">
                  {isLoading ? 'Publishing...' : 'Publish Article'}
                </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </main>
  );
}
