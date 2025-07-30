import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PostMeta } from '../../lib/posts';

interface RelatedArticlesProps {
  posts: PostMeta[];
  category: string;
}

export default function RelatedArticles({ posts, category }: RelatedArticlesProps) {
  if (posts.length === 0) {
    return null;
  }

  // gridStyleは使用しないため削除

  const cardStyle: React.CSSProperties = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#faf7f5',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <>
      <style>{`
        .related-articles-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        
        @media (max-width: 768px) {
          .related-articles-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }
        
        @media (max-width: 480px) {
          .related-articles-grid {
            gap: 12px;
          }
        }
        
        .related-article-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      `}</style>
      
      <section style={{ marginTop: '48px', paddingTop: '32px', borderTop: '2px solid #e0e0e0' }}>
        <div className="related-articles-grid">
          {posts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/posts/${post.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <article style={cardStyle} className="related-article-card">
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                  <Image
                    src={post.thumbnail || '/sample-thumb.jpg'}
                    alt={post.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                </div>
                <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{
                    fontSize: '0.9em',
                    fontWeight: '600',
                    color: '#333',
                    margin: '0 0 8px 0',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flex: 1
                  }}>
                    {post.title}
                  </h4>
                  <div style={{
                    fontSize: '0.75em',
                    color: '#666',
                    marginTop: 'auto'
                  }}>
                    {post.date}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
