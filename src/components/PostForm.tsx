'use client';

import { useState, useEffect } from 'react';
import { slugify } from '@/lib/utils';

interface PostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
}

interface PostFormProps {
  onSubmit: (data: PostFormData) => void;
  loading: boolean;
  submitLabel: string;
  initialData?: PostFormData;
}

export default function PostForm({
  onSubmit,
  loading,
  submitLabel,
  initialData,
}: PostFormProps) {
  const [formData, setFormData] = useState<PostFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    author: initialData?.author || '',
  });
  const [autoSlug, setAutoSlug] = useState(!initialData?.slug);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        slug: initialData.slug,
        content: initialData.content,
        excerpt: initialData.excerpt,
        author: initialData.author,
      });
      setAutoSlug(false);
    }
  }, [initialData]);

  function handleTitleChange(value: string) {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: autoSlug ? slugify(value) : prev.slug,
    }));
  }

  function handleSlugChange(value: string) {
    setAutoSlug(false);
    setFormData((prev) => ({ ...prev, slug: value }));
  }

  function handleChange(field: keyof PostFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="Enter post title"
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
          Slug <span className="text-red-500">*</span>
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            /posts/
          </span>
          <input
            id="slug"
            type="text"
            value={formData.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="post-url-slug"
            pattern="[a-z0-9-]+"
            title="Only lowercase letters, numbers and hyphens"
            required
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">Auto-generated from title. Only lowercase letters, numbers, and hyphens.</p>
      </div>

      {/* Author */}
      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
          Author <span className="text-red-500">*</span>
        </label>
        <input
          id="author"
          type="text"
          value={formData.author}
          onChange={(e) => handleChange('author', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="Author name"
          required
        />
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
          Excerpt <span className="text-red-500">*</span>
        </label>
        <textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => handleChange('excerpt', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y"
          placeholder="Brief description of the post (shown on listing pages)"
          rows={3}
          required
        />
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content <span className="text-red-500">*</span>
        </label>
        <div className="text-xs text-gray-400 mb-2">
          Supports Markdown: # Heading, **bold**, *italic*, `code`, ```code block```, - list, [link](url)
        </div>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y font-mono text-sm"
          placeholder="Write your post content here (Markdown supported)..."
          rows={20}
          required
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 12 0 12 0v4a8 8 0 00-8 8H4z" />
            </svg>
          )}
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
