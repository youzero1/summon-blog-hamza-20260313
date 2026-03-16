import { Metadata } from 'next';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Home | NextBlog',
  description: 'Welcome to NextBlog - Read the latest articles and tutorials',
};

export const dynamic = 'force-dynamic';

const POSTS_PER_PAGE = 6;

async function getPosts(page: number) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const response = await fetch(
      `${baseUrl}/api/posts?page=${page}&limit=${POSTS_PER_PAGE}`,
      { cache: 'no-store' }
    );
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], total: 0, page: 1, totalPages: 0 };
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  const data = await getPosts(currentPage);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Welcome to{' '}
          <span className="text-blue-600">NextBlog</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover articles, tutorials, and insights on modern web development,
          technology, and design.
        </p>
      </div>

      {/* Posts Grid */}
      {data.posts && data.posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {data.posts.map((post: any) => (
              <div key={post.id} className="flex flex-col">
                <PostCard post={post} />
                {/* Comments Section for each post */}
                <div className="px-6 pb-6">
                    {/* 
                      This component renders the comment list and a submission form.
                      It is client-side rendered to handle user interactions dynamically.
                    */}
                    {/* <Comments postId={post.id} /> */}
                    <Link href={`/posts/${post.slug}`} className="text-blue-600 hover:underline">
                        View Comments
                    </Link>
                </div>
              </div>
            ))}
          </div>
          {data.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={data.totalPages}
              basePath="/"
            />
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            No posts yet
          </h2>
          <p className="text-gray-500">Check back later for new content!</p>
        </div>
      )}
    </div>
  );
}