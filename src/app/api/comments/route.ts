import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Comment } from '@/entities/Comment';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const ds = await getDataSource();
    const commentRepo = ds.getRepository(Comment);

    const comments = await commentRepo.find({
      where: { post: { id: parseInt(postId, 10) } as any }, // TypeORM workaround for filtering by relation ID without loading the entity
      order: { createdAt: 'DESC' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('GET /api/comments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, author, postId } = body;

    if (!content || !author || !postId) {
      return NextResponse.json(
        { error: 'Content, author, and postId are required' },
        { status: 400 }
      );
    }

    const ds = await getDataSource();
    const commentRepo = ds.getRepository(Comment);

    const comment = commentRepo.create({
      content,
      author,
      createdAt: new Date(),
      post: { id: postId } as any, // Assign the relation by ID
    });

    const saved = await commentRepo.save(comment);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('POST /api/comments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}