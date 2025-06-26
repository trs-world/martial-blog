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

import Sidebar from "../components/Sidebar";
import styles from "../components/ResponsiveArticleList.module.css";

export default function PostsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const category = typeof searchParams.category === 'string' ? searchParams.category : Array.isArray(searchParams.category) ? searchParams.category[0] : undefined;
  let posts = getPosts();
  if (category) {
    posts = posts.filter(post => post.category === category);
  }
  return (
    <div className={styles.container} style={{maxWidth: '1000px', margin: '32px auto 0 auto', padding: '0 12px'}}>
      <main className={styles.main}>
        <h1 style={{ textAlign: 'center', marginTop: 20, marginBottom: 24 }}>記事一覧</h1>
        <ArticleListClickable posts={posts} />
        {/* モバイル時のみ下部にSidebarを表示 */}
        <div className={styles.mobileOnly}>
          <Sidebar />
        </div>
      </main>
      {/* PC時のみ右側にSidebarを表示 */}
      <aside className={styles.aside}>
        <div className={styles.desktopOnly}>
          <Sidebar />
        </div>
      </aside>
    </div>
  );
}
