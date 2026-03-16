import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { getDataSource } from '../src/lib/database';
import { Comment } from '../src/entities/Comment';
import { Post } from '../src/entities/Post';

describe('Comment API', () => {
  let postId: number;

  beforeAll(async () => {
    const ds = await getDataSource();
    const postRepo = ds.getRepository(Post);
    const post = postRepo.create({
      title: 'Test Post for Comments',
      slug: 'test-post-comments',
      content: 'Content',
      excerpt: 'Excerpt',
      author: 'Test Author',
    });
    const savedPost = await postRepo.save(post);
    postId = savedPost.id;
  });

  afterAll(async () => {
    const ds = await getDataSource();
    const commentRepo = ds.getRepository(Comment);
    await commentRepo.delete({ post: { id: postId } as any });
    const postRepo = ds.getRepository(Post);
    await postRepo.delete({ id: postId });
    await ds.destroy();
  });

  it('should create a new comment', async () => {
    const ds = await getDataSource();
    const commentRepo = ds.getRepository(Comment);
    
    const comment = commentRepo.create({
      content: 'This is a test comment',
      author: 'Test Commenter',
      createdAt: new Date(),
      post: { id: postId } as any,
    });

    const saved = await commentRepo.save(comment);
    expect(saved).toHaveProperty('id');
    expect(saved.content).toBe('This is a test comment');
  });

  it('should fetch comments for a post', async () => {
    const ds = await getDataSource();
    const commentRepo = ds.getRepository(Comment);

    const comments = await commentRepo.find({
        where: { post: { id: postId } as any },
        order: { createdAt: 'DESC' },
    });
    
    expect(Array.isArray(comments)).toBe(true);
  });
});