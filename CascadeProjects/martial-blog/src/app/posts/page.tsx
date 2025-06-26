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

export default function PostsPage() {
  const posts = getPosts();
  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h1 style={{ textAlign: 'center' }}>記事一覧</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map((post) => (
          <li
            key={post.slug}
            className="post-card"
            style={{
              marginBottom: 24,
              border: '1px solid #e0e0e0',
              borderRadius: 10,
              background: '#faf7f5',
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
              padding: 12,
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
                style={{ borderRadius: 8, objectFit: 'cover', flexShrink: 0, background: '#eee' }}
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
    </main>
  );
}
