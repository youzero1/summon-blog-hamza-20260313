import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Post } from '@/entities/Post';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '6', 10);
    const skip = (page - 1) * limit;

    const ds = await getDataSource();
    const postRepo = ds.getRepository(Post);

    const [posts, total] = await postRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
      select: ['id', 'title', 'slug', 'excerpt', 'author', 'createdAt', 'updatedAt'],
    });

    return NextResponse.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    // Check for duplicate slug
    const existing = await postRepo.findOne({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }

    const post = postRepo.create({ title, slug, content, excerpt, author });
    const saved = await postRepo.save(post);

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('POST /api/posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
