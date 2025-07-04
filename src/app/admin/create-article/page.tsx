'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';
import { RichTextEditor } from '@/components/common/RichTextEditor';



export default function CreateArticlePage() {

  const { data: session, status } = useSession();
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    body: '', // store HTML from the RichTextEditor
    imageUrl: '',
    category: '',
    isFeatured: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handler for standard input and textarea fields
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handler specifically for the RichTextEditor component
  const handleBodyChange = (html: string) => {
    setFormData(prev => ({...prev, body: html}));
  };

  // Handler for the checkbox component
  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    setFormData(prev => ({ ...prev, isFeatured: Boolean(checked) }));
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

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
      // Reset form, including the body which will clear the editor
      setFormData({
        title: '', summary: '', body: '', imageUrl: '', category: '', isFeatured: false,
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

    if (status === 'loading') {
    return (
        <main className="flex items-center justify-center min-h-screen">
            <p>Loading...</p>
        </main>
    );
  }

  // If the user is not authenticated, redirect them to the login page.
  if (status === 'unauthenticated') {
    redirect('/login');
  }

  // If the user is authenticated, render the page content.
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
                  <Label htmlFor="imageUrl">Featured Image URL</Label>
                  <Input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleInputChange} placeholder="https://example.com/image.jpg" required />
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
