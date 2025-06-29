'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ArticleSearchBox from './ArticleSearchBox';
import PopularArticles from './PopularArticles';
import styles from './ResponsiveArticleList.module.css';

type PostMeta = {
  title: string;
  date: string;
  category: string;
  slug: string;
  thumbnail?: string;
  excerpt: string;
};

export default function ArticleList({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState('');
  const filtered = posts.filter(post => {
    const q = query.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q)
    );
  });

  // 人気記事データ（本来はpropsやAPIから取得）
  const popularArticles = [
    { title: '最強の打撃テクニック', slug: 'best-striking', views: 1280, thumbnail: '/sample-thumb.jpg' },
    { title: '寝技で勝つ！', slug: 'grappling-win', views: 1032, thumbnail: '/sample-thumb.jpg' },
    { title: '初心者向け護身術', slug: 'self-defense-beginner', views: 980, thumbnail: '/sample-thumb.jpg' }
  ];

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 style={{ textAlign: 'center', marginTop: 0, marginBottom: 24 }}>記事一覧</h1>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {filtered.map((post) => (
            <li
              key={post.slug}
              className="post-card"
              style={{
                marginBottom: 24,
                border: '1px solid #e0e0e0',
                borderRadius: 10,
                background: '#faf7f5',
                boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                padding: 20,
                transition: 'box-shadow 0.2s',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Image
                  src={post.thumbnail || '/sample-thumb.jpg'}
                  alt={post.title + 'のサムネイル'}
                  width={80}
                  height={80}
                  style={{ borderRadius: 6, objectFit: 'cover', background: '#eee' }}
                />
                <div>
                  <div style={{ color: '#65331A', fontSize: '0.95em', marginBottom: 2 }}>
                    <span style={{ marginRight: 8 }}>{post.date}</span>
                    <span style={{ background: '#fbe9e7', color: '#b71c1c', borderRadius: 4, padding: '2px 7px', fontSize: '0.9em', marginLeft: 2 }}>{post.category}</span>
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: 4 }}>{post.title}</div>
                  <div style={{ color: '#888', fontSize: '0.97em', marginBottom: 12, minHeight: '1.5em' }}>
                    {post.excerpt}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link href={`/posts/${post.slug}`} style={{ color: '#b71c1c', fontWeight: 500, fontSize: '0.98em', textDecoration: 'underline', opacity: 0.85 }}>記事を読む</Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {/* スマホ時のみ下に検索・人気記事を表示 */}
        <div className={styles.mobileOnly}>
          <ArticleSearchBox query={query} setQuery={setQuery} />
          <div style={{ marginTop: 24 }}>
            <PopularArticles posts={popularArticles} />
          </div>
        </div>
      </main>
      {/* PC時のみ右側に表示 */}
      <aside className={styles.aside}>
        <div className={styles.desktopOnly}>
          <ArticleSearchBox query={query} setQuery={setQuery} />
          <div style={{ marginTop: 24 }}>
            <PopularArticles posts={popularArticles} />
          </div>
        </div>
      </aside>
    </div>
  );
}
