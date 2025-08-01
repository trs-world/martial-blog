'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ArticleSearchBox from './ArticleSearchBox';
import ProfileCard from './ProfileCard';
import styles from './ResponsiveArticleList.module.css';


type PostMeta = {
  title: string;
  date: string;
  category: string;
  slug: string;
  thumbnail?: string;
  excerpt: string;
  content?: string; // 検索用に本文全体を保持（オプショナル）
};

interface ArticleListProps {
  posts: PostMeta[];
  allPosts?: PostMeta[]; // 検索用の全記事データ
  currentPage?: number;
  totalPages?: number;
  basePath?: string;
}

export default function ArticleList({ posts, allPosts, currentPage = 1, totalPages = 1, basePath = '/' }: ArticleListProps) {
  const [query, setQuery] = useState('');
  
  // 検索フィルタ（検索時は全記事、非検索時はページ内記事を対象）
  const targetPosts = query.trim() ? (allPosts || posts) : posts;
  const filtered = targetPosts.filter(post => {
    // 検索クエリが空の場合は全ての記事を表示
    if (!query.trim()) {
      return true;
    }
    
    const q = query.toLowerCase();
    // 最初の文章30文字以内を取得（excerptから初期30文字を抽出）
    const first30Chars = post.excerpt ? post.excerpt.substring(0, 30) : '';
    
    return (
      post.title.toLowerCase().includes(q) ||
      first30Chars.toLowerCase().includes(q)
    );
  });



  // ページネーションボタンのスタイル
  const paginationButtonStyle = {
    padding: '12px 24px',
    backgroundColor: '#b71c1c',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    fontSize: '0.95em',
    transition: 'all 0.2s ease',
    display: 'inline-block',
    border: 'none',
    cursor: 'pointer',
  };

  const disabledButtonStyle = {
    ...paginationButtonStyle,
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
    pointerEvents: 'none' as const,
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* スマホ時のみ上部に検索機能を表示 */}
        <div className={styles.mobileOnly} style={{ marginTop: '30px' }}>
          <ArticleSearchBox query={query} setQuery={setQuery} />
        </div>

        {filtered.length === 0 ? (
          <div style={{ color: '#111', fontWeight: 500, fontSize: '1.1em', textAlign: 'center', margin: '32px 0' }}>
            記事がありません
          </div>
        ) : (
          <>
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
                  <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: 6,
                    overflow: 'hidden',
                    background: '#eee',
                    flexShrink: 0
                  }}>
                    <Image unoptimized
                      src={post.thumbnail || '/sample-thumb.jpg'}
                      alt={post.title + 'のサムネイル'}
                      width={80}
                      height={80}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        objectPosition: 'center'
                      }}
                    />
                  </div>
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

            {/* ページネーションボタン（検索時は非表示） */}
            {totalPages > 1 && !query.trim() && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '16px', 
                marginTop: '40px',
                marginBottom: '20px'
              }}>
                {currentPage > 1 ? (
                  <Link 
                    href={`${basePath}${basePath.includes('?') ? '&' : '?'}page=${currentPage - 1}`}
                    style={paginationButtonStyle}
                  >
                    ← 前のページ
                  </Link>
                ) : (
                  <span style={disabledButtonStyle}>← 前のページ</span>
                )}
                
                <span style={{ 
                  color: '#666', 
                  fontSize: '0.95em',
                  fontWeight: '500'
                }}>
                  {currentPage} / {totalPages}
                </span>
                
                {currentPage < totalPages ? (
                  <Link 
                    href={`${basePath}${basePath.includes('?') ? '&' : '?'}page=${currentPage + 1}`}
                    style={paginationButtonStyle}
                  >
                    次のページ →
                  </Link>
                ) : (
                  <span style={disabledButtonStyle}>次のページ →</span>
                )}
              </div>
            )}
          </>
        )}
        {/* スマホ時のみ下部にプロフィールカードを表示 */}
        <div className={styles.mobileOnly}>
          <div style={{ marginTop: 24 }}>
            <ProfileCard />
          </div>
        </div>
      </main>

      {/* PC時のみ右側に表示 */}
      <aside className={styles.aside}>
        <div className={styles.desktopOnly}>
          <ArticleSearchBox query={query} setQuery={setQuery} />
          <div style={{ marginTop: 24 }}>
            {/* <PopularArticles posts={popularArticles} /> */}
            <div style={{ marginTop: 24 }}>
              <ProfileCard />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
