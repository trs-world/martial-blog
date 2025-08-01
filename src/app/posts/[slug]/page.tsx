import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkTwitterEmbed, { preloadTweetData } from '../../../lib/remark-twitter-embed';
import remarkToc from '../../../lib/remark-toc';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Script from 'next/script';

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
  
  // ツイートデータを事前取得
  await preloadTweetData(contentWithoutTitle);
  
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkToc)
    .use(remarkTwitterEmbed)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(contentWithoutTitle);
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
import Image from 'next/image';
import Link from 'next/link';
import RelatedArticles from '../../components/RelatedArticles';
import { getRelatedPosts, getFirstCategory } from '../../../lib/posts';

// generateMetadata function for dynamic Open Graph tags
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  
  if (!post) {
    return {
      title: 'Article Not Found - Fight Fantasy',
      description: 'The requested article could not be found.',
      metadataBase: new URL('https://martial-blog.netlify.app'),
    };
  }

  const baseUrl = 'https://martial-blog.netlify.app';
  const articleUrl = `${baseUrl}/posts/${resolvedParams.slug}`;
  
  // Ensure proper image URL construction - remove leading slash if present
  const thumbnailPath = post.meta.thumbnail?.startsWith('/') 
    ? post.meta.thumbnail.substring(1) 
    : post.meta.thumbnail;
  
  const imageUrl = thumbnailPath 
    ? `${baseUrl}/${thumbnailPath}`
    : `${baseUrl}/sample-thumb.jpg`;

  const description = `${post.meta.title} | ${post.meta.category} | Fight Fantasy - 格闘技の最新情報をお届けします。`;

  return {
    metadataBase: new URL(baseUrl),
    title: `${post.meta.title} - Fight Fantasy`,
    description: description,
    keywords: ['格闘技', 'MMA', 'キックボクシング', 'UFC', 'RIZIN', post.meta.category],
    authors: [{ name: 'Fight Fantasy' }],
    creator: 'Fight Fantasy',
    publisher: 'Fight Fantasy',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: post.meta.title,
      description: `${post.meta.title} | ${post.meta.category} | Fight Fantasy`,
      type: 'article',
      locale: 'ja_JP',
      url: articleUrl,
      siteName: 'Fight Fantasy',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.meta.title,
          type: 'image/png',
        },
      ],
      publishedTime: post.meta.date,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@FightFantasy',
      creator: '@FightFantasy',
      title: post.meta.title,
      description: `${post.meta.title} | ${post.meta.category} | Fight Fantasy`,
      images: [
        {
          url: imageUrl,
          alt: post.meta.title,
          width: 1200,
          height: 630,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function PostPage(props: unknown) {
  const { params } = props as { params: Promise<{ slug: string }> };
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  // サーバーコンポーネントとして動作

  const post = await getPost(slug);
  if (!post) return notFound();
  
  // 関連記事を取得
  const firstCategory = getFirstCategory(post.meta.category);
  const relatedPosts = firstCategory ? getRelatedPosts(slug, firstCategory, 4) : [];
  
  return (
    <>
      <Script src="/toc.js" strategy="afterInteractive" />
      <main className="articleMain" style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
        <h1 style={{marginTop:0, fontSize:'1.5em'}}>{post.meta.title}</h1>
      <div style={{ color: '#666' }}>
  {post.meta.date} / {
    Array.isArray(post.meta.category)
      ? post.meta.category.join(', ')
      : typeof post.meta.category === 'string'
        ? post.meta.category
        : ''
  }
</div>
      <hr style={{ margin: '16px 0' }} />
      {/* サムネイル画像を線の下に表示 */}
      <Image
        src={post.meta.thumbnail ? post.meta.thumbnail : '/sample-thumb.jpg'}
        alt="記事サムネイル"
        width={360}
        height={240}
        style={{ width: '100%', maxWidth: 360, display: 'block', margin: '24px auto', borderRadius: 12, height: 'auto' }}
        unoptimized
      />
      {/* 記事本文：h1は囲わず、h2〜h6のみ四角で囲う */}
      <PostBodyWithBoxedHeadings html={post.contentHtml} />
      
      {/* 関連記事セクション */}
      {relatedPosts.length > 0 && (
        <RelatedArticles posts={relatedPosts} />
      )}
      
        <div style={{textAlign:'right', marginTop:32}}>
          <Link href="/" style={{ color: '#b71c1c', fontWeight: 500, fontSize: '0.98em', textDecoration: 'underline', opacity: 0.85 }}>
            トップへ戻る
          </Link>
        </div>
      </main>
    </>
  );
}
