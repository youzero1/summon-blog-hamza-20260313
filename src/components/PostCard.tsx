import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
      {/* Color Bar */}
      <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600" />

      <div className="p-6 flex flex-col flex-1">
        {/* Author & Date */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-semibold text-xs">
              {post.author.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 truncate">
              <span className="font-medium text-gray-700">{post.author}</span>
              {' · '}
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
          <Link
            href={`/posts/${post.slug}`}
            className="hover:text-blue-600 transition-colors duration-200"
          >
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm line-clamp-3 flex-1 mb-4">
          {post.excerpt}
        </p>

        {/* Read More */}
        <Link
          href={`/posts/${post.slug}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-semibold group mt-auto"
        >
          Read more
          <svg
            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
