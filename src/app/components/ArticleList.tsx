'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ArticleSearchBox from './ArticleSearchBox';
import ProfileCard from './ProfileCard';
import styles from './ResponsiveArticleList.module.css';
import PopularArticles from './PopularArticles';

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
  // 検索フィルタ
  const filtered = posts.filter(post => {
    const q = query.toLowerCase();
    const catStr = Array.isArray(post.category)
      ? post.category.join(' ')
      : typeof post.category === 'string'
        ? post.category
        : '';
    return (
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      catStr.toLowerCase().includes(q)
    );
  });

  // 人気記事データ（実際の記事データから生成）
  const popularArticles: import('./PopularArticles').PopularArticle[] = posts.slice(0, 3).map(post => ({
    title: post.title,
    slug: post.slug,
    views: Math.floor(Math.random() * 1000) + 100, // 実際のビュー数データがない場合の仮の値
    thumbnail: post.thumbnail
  }));

  return (
    <div className={styles.container}>
      <main className={styles.main}>

        {filtered.length === 0 ? (
          <div style={{ color: '#111', fontWeight: 500, fontSize: '1.1em', textAlign: 'center', margin: '32px 0' }}>
            記事がありません
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginTop: 20 }}>
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
                  <Image unoptimized
                    src={post.thumbnail || '/sample-thumb.jpg'}
                    alt={post.title + 'のサムネイル'}
                    width={80}
                    height={80}
                    style={{ borderRadius: 6, objectFit: 'cover', background: '#eee' }}
                  />
                  <div>
                    <div style={{ color: '#65331A', fontSize: '0.95em', marginBottom: 2 }}>
                      <span style={{ marginRight: 8 }}>{post.date}</span>
                      {(() => {
                        // カテゴリが配列ならそのまま、文字列ならカンマ・スペースで分割
                        const cats = Array.isArray(post.category)
                          ? post.category
                          : typeof post.category === 'string'
                            ? post.category.split(/[,\s]+/).filter(Boolean)
                            : [];
                        return cats.map((cat: string, idx: number) => (
                          <span
                            key={cat + idx}
                            style={{
                              background: '#fbe9e7',
                              color: '#b71c1c',
                              borderRadius: 4,
                              padding: '2px 7px',
                              fontSize: '0.9em',
                              marginLeft: idx === 0 ? 2 : 6,
                              marginRight: 0,
                              display: 'inline-block',
                              fontWeight: 600,
                            }}
                          >
                            {cat}
                          </span>
                        ));
                      })()}
                    </div>
                    <Link href={`/posts/${post.slug}`} style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: 4, color: '#b71c1c', textDecoration: 'underline', display: 'inline-block' }} aria-label={`${post.title} の記事ページへ移動`}>
                      {post.title}
                    </Link>
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
        )}
        {/* スマホ時のみ下に検索・人気記事を表示 */}
        <div className={styles.mobileOnly}>
          <ArticleSearchBox query={query} setQuery={setQuery} />
          <div style={{ marginTop: 24 }}>
            <PopularArticles posts={popularArticles} />
            <div style={{ marginTop: 24 }}>
              <ProfileCard />
            </div>
          </div>
        </div>
      </main>

      {/* PC時のみ右側に表示 */}
      <aside className={styles.aside}>
        <div className={styles.desktopOnly}>
          <ArticleSearchBox query={query} setQuery={setQuery} />
          <div style={{ marginTop: 24 }}>
            <PopularArticles posts={popularArticles} />
            <div style={{ marginTop: 24 }}>
              <ProfileCard />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
