import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Post } from '@/entities/Post';
import { Comment } from '@/entities/Comment';

const { Database } = require('better-sqlite3');

let dataSource: DataSource;

export async function getDataSource() {
  if (dataSource) {
    return dataSource;
  }

  const dbPath = process.env.DATABASE_PATH || './blog.db';

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: dbPath,
    entities: [Post, Comment],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();
  return dataSource;
}