import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

interface PostMeta {
  title: string;
  date: string;
  category: string;
  slug: string;
  thumbnail?: string;
  excerpt: string;
}

function getPosts(): PostMeta[] {
  const postsDir = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDir);
  return files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const filePath = path.join(postsDir, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      // 本文から最初の50文字を抜粋
      let plain = content.replace(/[#>*\-\[\]!`_>\n]/g, '').trim();
      let excerpt = plain.slice(0, 50);
      if (plain.length > 50) excerpt += '...';
      return {
        title: data.title,
        date: data.date,
        category: data.category || '',
        slug: file.replace(/\.md$/, ''),
        thumbnail: data.thumbnail || '/sample-thumb.jpg',
        excerpt,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

import Image from 'next/image';

import ArticleListClickable from "../components/ArticleListClickable";

export default function PostsPage() {
  const posts = getPosts();
  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h1 style={{ textAlign: 'center' }}>記事一覧</h1>
      <ArticleListClickable posts={posts} />
    </main>
  );
}
