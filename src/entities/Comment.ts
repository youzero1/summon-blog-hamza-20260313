import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,JoinColumn } from 'typeorm';
import { Post } from './Post';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  author: string;

  @Column({ type: 'datetime' })
  createdAt: Date;

  @ManyToOne(() => Post, post => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn()
  post: Post;
}