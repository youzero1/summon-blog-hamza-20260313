import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Post } from '@/entities/Post';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slugOrId: string } }
) {
  try {
    const ds = await getDataSource();
    const postRepo = ds.getRepository(Post);

    const post = await postRepo.findOne({ where: { slug: params.slugOrId } });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('GET /api/posts/[slug] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slugOrId: string } }
) {
  try {
    const body = await request.json();
    const { title, slug, content, excerpt, author } = body;

    if (!title || !slug || !content || !excerpt || !author) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const ds = await getDataSource();
    const postRepo = ds.getRepository(Post);

    // Try by ID first, then by slug
    const id = parseInt(params.slugOrId, 10);
    let post: Post | null = null;

    if (!isNaN(id)) {
      post = await postRepo.findOne({ where: { id } });
    } else {
      post = await postRepo.findOne({ where: { slug: params.slugOrId } });
    }

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check for duplicate slug (exclude current post)
    if (slug !== post.slug) {
      const existing = await postRepo.findOne({ where: { slug } });
      if (existing) {
        return NextResponse.json(
          { error: 'A post with this slug already exists' },
          { status: 409 }
        );
      }
    }

    post.title = title;
    post.slug = slug;
    post.content = content;
    post.excerpt = excerpt;
    post.author = author;

    const updated = await postRepo.save(post);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/posts/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slugOrId: string } }
) {
  try {
    const ds = await getDataSource();
    const postRepo = ds.getRepository(Post);

    const id = parseInt(params.slugOrId, 10);
    let post: Post | null = null;

    if (!isNaN(id)) {
      post = await postRepo.findOne({ where: { id } });
    } else {
      post = await postRepo.findOne({ where: { slug: params.slugOrId } });
    }

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await postRepo.remove(post);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/posts/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
