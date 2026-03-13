'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface Post {
  id: number;
  title: string;
  slug: string;
  author: string;
  excerpt: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchPosts();
    }
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const response = await fetch('/api/posts?limit=100');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        sessionStorage.setItem('admin_auth', 'true');
        setIsAuthenticated(true);
        fetchPosts();
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setPassword('');
    setPosts([]);
  }

  async function handleDelete(id: number) {
    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setPosts(posts.filter((p) => p.id !== id));
        setDeleteId(null);
        setSuccessMessage('Post deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert('Failed to delete post');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setDeleteLoading(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-500 mt-1">Enter your password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter admin password"
                required
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your blog posts</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
          {successMessage}
        </div>
      )}

      {/* Posts Table */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-500 mt-4">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h2>
          <p className="text-gray-500 mb-6">Create your first blog post!</p>
          <Link
            href="/admin/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Create Post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900 line-clamp-1">{post.title}</p>
                        <p className="text-sm text-gray-400">/{post.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-gray-600">{post.author}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-gray-500 text-sm">{formatDate(post.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/posts/${post.slug}`}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          title="View"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/admin/edit/${post.id}`}
                          className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => setDeleteId(post.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Post</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
