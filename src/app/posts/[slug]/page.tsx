import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';

interface PostMeta {
  title: string;
  date: string;
  category: string;
  thumbnail?: string;
}


async function getPost(slug: string): Promise<{ meta: PostMeta; contentHtml: string } | null> {
  const postsDir = path.join(process.cwd(), 'posts');
  const filePath = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  // 先頭の「# タイトル」行を除去
  let contentWithoutTitle = content.replace(/^# .+\n+/, '');
  // タイトルより下に現れる---を削除
  const titleMatch = contentWithoutTitle.match(/^# .+\n/);
  if (titleMatch) {
    const titleEndIdx = titleMatch[0].length;
    const beforeTitle = contentWithoutTitle.slice(0, titleEndIdx);
    const afterTitle = contentWithoutTitle.slice(titleEndIdx).replace(/^---\s*$/gm, '');
    contentWithoutTitle = beforeTitle + afterTitle;
  } else {
    contentWithoutTitle = contentWithoutTitle.replace(/^---\s*$/gm, '');
  }
  const processedContent = await remark().use(remarkGfm).use(html).process(contentWithoutTitle);
  return {
    meta: {
      title: data.title || '',
      date: data.date || '',
      category: data.category || '',
      thumbnail: data.thumbnail || '',
    },
    contentHtml: processedContent.toString(),
  };
}

import PostBodyWithBoxedHeadings from '../PostBodyWithBoxedHeadings';

export default async function PostPage({ params }: unknown) {
  const { slug } = params as { slug: string };
  // サーバーコンポーネントとして動作

  const post = await getPost(params.slug);
  if (!post) return notFound();
  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h1>{post.meta.title}</h1>
      <div style={{ color: '#666' }}>{post.meta.date} / {post.meta.category}</div>
      <hr style={{ margin: '16px 0' }} />
      {/* サムネイル画像を線の下に表示 */}
      <img
        src={post.meta.thumbnail ? post.meta.thumbnail : '/sample-thumb.jpg'}
        alt="記事サムネイル"
        style={{ width: '100%', maxWidth: 360, display: 'block', margin: '24px auto', borderRadius: 12 }}
      />
      {/* 記事本文：h1は囲わず、h2〜h6のみ四角で囲う */}
      <PostBodyWithBoxedHeadings html={post.contentHtml} />
    </main>
  );
}
