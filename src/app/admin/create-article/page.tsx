'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

export default function CreateArticlePage() {
  // State to hold the form data
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    body: '',
    imageUrl: '',
    category: '',
    isFeatured: false,
  });

  // State to manage loading and feedback messages
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handler for form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Handle checkbox separately
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
        setFormData(prev => ({ ...prev, [name]: e.target.checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handler for form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default browser form submission
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create article');
      }
      
      setSuccess('Article created successfully!');
      // Reset the form after successful submission
      setFormData({
        title: '',
        summary: '',
        body: '',
        imageUrl: '',
        category: '',
        isFeatured: false,
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-base-200 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl font-poppins font-bold mb-6">Create New Article</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Mbappé Joins Real Madrid!"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Summary */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Summary (Subtitle)</span>
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  className="textarea textarea-bordered h-24"
                  placeholder="A short summary of the article..."
                  required
                ></textarea>
              </div>

              {/* Body */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Body</span>
                </label>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  className="textarea textarea-bordered h-48"
                  placeholder="Write the full article content here..."
                  required
                ></textarea>
              </div>

              {/* Image URL */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Image URL</span>
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Category */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Category</span>
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Premier League, Transfers"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              
              {/* Is Featured */}
               <div className="form-control">
                <label className="label cursor-pointer w-fit space-x-2">
                  <input 
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="checkbox checkbox-primary" 
                  />
                  <span className="label-text">Feature this article on the homepage?</span> 
                </label>
              </div>

              {/* Feedback Messages */}
              {success && <div className="alert alert-success">{success}</div>}
              {error && <div className="alert alert-error">{error}</div>}

              {/* Submit Button */}
              <div className="card-actions justify-end">
                <button
                  type="submit"
                  className="btn btn-primary w-full md:w-auto"
                  disabled={isLoading}
                >
                  {isLoading ? <span className="loading loading-spinner"></span> : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
