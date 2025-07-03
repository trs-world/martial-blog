"use client";
import React from "react";
import Image from "next/image";

interface PostMeta {
  title: string;
  date: string;
  category: string;
  slug: string;
  thumbnail?: string;
  excerpt: string;
}

export default function ArticleListClickable({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) {
    return <div style={{ color: '#111', fontWeight: 500, fontSize: '1.1em', textAlign: 'center', margin: '32px 0' }}>記事がありません</div>;
  }
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {posts.map((post) => (
        <li
          key={post.slug}
          className="post-card"
          style={{
            marginBottom: 24,
            marginLeft: 0,
            border: '1px solid #e0e0e0',
            borderRadius: 10,
            background: '#faf7f5',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            padding: '20px 20px 20px 0',
            transition: 'box-shadow 0.2s',
            listStyle: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingLeft: 24 }}>
            <Image unoptimized
              src={post.thumbnail || '/sample-thumb.jpg'}
              alt={post.title + 'のサムネイル'}
              width={80}
              height={80}
              style={{ borderRadius: 8, objectFit: 'cover', flexShrink: 0, background: '#eee' }}
            />
            <div>
              <div style={{ color: '#65331A', fontSize: '0.95em', marginBottom: 2 }}>
                <span style={{ marginRight: 8 }}>{post.date}</span>
                <span style={{ background: '#fbe9e7', color: '#b71c1c', borderRadius: 4, padding: '2px 7px', fontSize: '0.9em', marginLeft: 2 }}>{post.category}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.2em', marginBottom: 6, color: '#171717' }}>
                <a
                  href={`/posts/${post.slug}`}
                  style={{ color: '#b71c1c', textDecoration: 'underline', cursor: 'pointer' }}
                  aria-label={`${post.title} の記事ページへ移動`}
                >
                  {post.title}
                </a>
              </div>
              <div style={{ color: '#888', fontSize: '0.97em', marginBottom: 12, minHeight: '1.5em' }}>
                {post.excerpt}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
