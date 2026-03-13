import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Post } from '@/entities/Post';
import path from 'path';

const DATABASE_PATH = process.env.DATABASE_PATH || '/tmp/blog.db';

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: DATABASE_PATH,
    entities: [Post],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();
  await seedDatabase(dataSource);

  return dataSource;
}

async function seedDatabase(ds: DataSource): Promise<void> {
  const postRepo = ds.getRepository(Post);
  const count = await postRepo.count();

  if (count === 0) {
    const samplePosts = [
      {
        title: 'Getting Started with Next.js 14',
        slug: 'getting-started-with-nextjs-14',
        content: `# Getting Started with Next.js 14\n\nNext.js 14 brings exciting new features and improvements that make building full-stack React applications even more powerful and efficient.\n\n## What's New in Next.js 14\n\nNext.js 14 introduces several key improvements:\n\n- **Turbopack** is now stable for development, offering significantly faster refresh times\n- **Server Actions** are now stable, allowing you to run server-side code directly from your components\n- **Partial Prerendering** (experimental) combines static and dynamic rendering on the same page\n\n## The App Router\n\nThe App Router, introduced in Next.js 13, has become the recommended way to build Next.js applications. It leverages React Server Components by default, which means:\n\n1. Less JavaScript sent to the client\n2. Better initial page load performance\n3. Improved SEO through server-side rendering\n\n## Getting Started\n\nTo create a new Next.js 14 project, run:\n\n\`\`\`bash\nnpx create-next-app@latest my-app\n\`\`\`\n\nThis will walk you through a setup wizard where you can choose TypeScript, ESLint, Tailwind CSS, and more.\n\n## Conclusion\n\nNext.js 14 continues to push the boundaries of what's possible with React. Whether you're building a simple blog or a complex enterprise application, Next.js 14 has the tools you need to succeed.`,
        excerpt: 'Discover the exciting new features in Next.js 14, including stable Turbopack, Server Actions, and the powerful App Router that makes building full-stack React applications a breeze.',
        author: 'Jane Smith',
      },
      {
        title: 'Building REST APIs with TypeORM and SQLite',
        slug: 'building-rest-apis-with-typeorm-sqlite',
        content: `# Building REST APIs with TypeORM and SQLite\n\nTypeORM is a powerful Object-Relational Mapper (ORM) for TypeScript and JavaScript. Combined with SQLite, it provides an excellent foundation for building lightweight but powerful REST APIs.\n\n## Why TypeORM?\n\nTypeORM offers several advantages:\n\n- **Decorator-based** entity definitions that integrate seamlessly with TypeScript\n- **Multiple database support** including SQLite, PostgreSQL, MySQL, and more\n- **Active Record and Data Mapper** patterns\n- **Automatic migrations** and schema synchronization\n\n## Setting Up TypeORM with SQLite\n\nFirst, install the required packages:\n\n\`\`\`bash\nnpm install typeorm better-sqlite3 reflect-metadata\nnpm install -D @types/better-sqlite3\n\`\`\`\n\n## Defining Entities\n\nEntities in TypeORM are classes that map to database tables:\n\n\`\`\`typescript\n@Entity()\nexport class User {\n  @PrimaryGeneratedColumn()\n  id: number;\n\n  @Column()\n  name: string;\n\n  @Column({ unique: true })\n  email: string;\n}\n\`\`\`\n\n## Creating a Data Source\n\nThe DataSource is the main entry point for TypeORM operations:\n\n\`\`\`typescript\nconst dataSource = new DataSource({\n  type: 'better-sqlite3',\n  database: './data.db',\n  entities: [User],\n  synchronize: true,\n});\n\`\`\`\n\n## CRUD Operations\n\nWith TypeORM, performing CRUD operations is straightforward:\n\n\`\`\`typescript\n// Create\nconst user = userRepo.create({ name: 'John', email: 'john@example.com' });\nawait userRepo.save(user);\n\n// Read\nconst users = await userRepo.find();\n\n// Update\nuser.name = 'Jane';\nawait userRepo.save(user);\n\n// Delete\nawait userRepo.remove(user);\n\`\`\`\n\n## Conclusion\n\nTypeORM with SQLite provides a powerful yet simple solution for data persistence in Node.js applications. Its TypeScript integration and decorator-based API make it a natural fit for modern TypeScript projects.`,
        excerpt: 'Learn how to build powerful REST APIs using TypeORM and SQLite. Discover entity definitions, CRUD operations, and best practices for data persistence in TypeScript applications.',
        author: 'John Doe',
      },
      {
        title: 'Mastering Tailwind CSS for Modern Web Design',
        slug: 'mastering-tailwind-css-modern-web-design',
        content: `# Mastering Tailwind CSS for Modern Web Design\n\nTailwind CSS has revolutionized the way developers style their web applications. Its utility-first approach offers unprecedented flexibility and speed in building modern user interfaces.\n\n## What is Tailwind CSS?\n\nTailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs directly in your markup. Unlike component-based frameworks like Bootstrap, Tailwind gives you the building blocks to create unique designs without fighting against predefined styles.\n\n## Key Benefits\n\n### 1. Rapid Development\nWith Tailwind, you can style elements directly in your HTML without context-switching to CSS files. This dramatically speeds up the development process.\n\n### 2. Consistent Design\nTailwind's design system includes a carefully crafted default color palette, spacing scale, and typography that ensures visual consistency across your application.\n\n### 3. Responsive Design Made Easy\nBuilding responsive layouts is intuitive with Tailwind's breakpoint prefixes:\n\n\`\`\`html\n<div class=\"w-full md:w-1/2 lg:w-1/3\">\n  Responsive column\n</div>\n\`\`\`\n\n### 4. Dark Mode Support\nTailwind has built-in dark mode support with the \`dark:\` variant:\n\n\`\`\`html\n<div class=\"bg-white dark:bg-gray-900 text-black dark:text-white\">\n  Adapts to dark mode\n</div>\n\`\`\`\n\n## Performance\n\nTailwind uses PurgeCSS in production to remove unused styles, resulting in extremely small CSS bundles. Most production sites using Tailwind end up with less than 10kb of CSS.\n\n## Customization\n\nTailwind is highly customizable through its configuration file:\n\n\`\`\`javascript\n// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        brand: '#FF6B6B',\n      },\n    },\n  },\n};\n\`\`\`\n\n## Conclusion\n\nTailwind CSS represents a paradigm shift in CSS methodologies. Once you embrace utility-first styling, it's hard to go back to traditional CSS approaches. Give it a try in your next project!`,
        excerpt: 'Explore the power of Tailwind CSS utility-first approach to web design. Learn about responsive design, dark mode, customization, and how Tailwind can dramatically speed up your development workflow.',
        author: 'Sarah Johnson',
      },
    ];

    for (const postData of samplePosts) {
      const post = postRepo.create(postData);
      await postRepo.save(post);
    }
  }
}
