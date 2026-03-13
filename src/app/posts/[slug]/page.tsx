import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import PostContent from '@/components/PostContent';

export const dynamic = 'force-dynamic';

async function getPost(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const response = await fetch(`${baseUrl}/api/posts/${slug}`, {
      cache: 'no-store',
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Failed to fetch post');
    return response.json();
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) {
    return { title: 'Post Not Found | NextBlog' };
  }
  return {
    title: `${post.title} | NextBlog`,
    description: post.excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.createdAt,
      authors: [post.author],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 group"
      >
        <svg
          className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to all posts
      </Link>

      {/* Post Header */}
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {post.author.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-800">{post.author}</p>
              <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          {post.updatedAt !== post.createdAt && (
            <span className="text-sm text-gray-400">
              Updated: {formatDate(post.updatedAt)}
            </span>
          )}
        </div>
      </header>

      {/* Excerpt */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg">
        <p className="text-blue-800 italic">{post.excerpt}</p>
      </div>

      {/* Post Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <PostContent content={post.content} />
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          ← Back to Home
        </Link>
      </div>
    </article>
  );
}
