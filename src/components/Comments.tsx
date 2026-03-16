'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: number;
  content: string;
  author: string;
  createdAt: string;
}

interface CommentsProps {
  postId: number;
}

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ author: '', content: '' });

  useEffect(() => {
    fetchComments();
  }, [postId]);

  async function fetchComments() {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (err) {
      console.error('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.author.trim() || !formData.content.trim()) {
      setError('Author and content are required.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, postId }),
      });

      if (response.ok) {
        setFormData({ author: '', content: '' });
        fetchComments();
      } else {
        const result = await response.json();
        setError(result.error || 'Failed to submit comment');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>
      
      {loading ? (
        <p className="text-gray-500">Loading comments...</p>
      ) : (
        <div className="space-y-4 mb-8">
          {comments.length === 0 && <p className="text-gray-500 italic">No comments yet. Be the first!</p>}
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-gray-900">{comment.author}</span>
                <span className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <h4 className="text-lg font-semibold">Leave a Comment</h4>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div>
          <input
            type="text"
            placeholder="Your Name"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Your Comment"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
}