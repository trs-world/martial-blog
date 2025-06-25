'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';

import Image from 'next/image';

export type PopularArticle = {
  title: string;
  slug: string;
  views: number;
  thumbnail?: string;
};

export default function PopularArticles({ posts }: { posts: PopularArticle[] }) {
  // ビュー数が多い順トップ3
  const top3 = useMemo(() =>
    [...posts].sort((a, b) => b.views - a.views).slice(0, 3),
    [posts]
  );
  return (
    <section style={{ marginTop: 36, background: 'transparent' }}>
      <div style={{ background: '#faf7f5', border: '1px solid #e0e0e0', borderRadius: 10, padding: 36, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ fontWeight: 'bold', color: '#b71c1c', fontSize: '1.08em', marginBottom: 12 }}>
          人気の記事
        </div>
        <ol style={{ padding: 0, margin: 0, listStyle: 'none' }}>
          {top3.map((article) => (
            <li key={article.slug} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Link href={`/posts/${article.slug}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <Image
                  src={article.thumbnail || '/sample-thumb.jpg'}
                  alt={article.title + 'のサムネイル'}
                  width={48}
                  height={48}
                  style={{ borderRadius: 6, objectFit: 'cover', background: '#eee', marginRight: 8 }}
                />
                <span style={{ color: '#b71c1c', fontWeight: 500, fontSize: '1em', lineHeight: 1.2 }}>{article.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
