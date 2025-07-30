import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ArticleList from './components/ArticleList';

interface PostMeta {
  title: string;
  date: string;
  category: string;
  slug: string;
  thumbnail?: string;
  excerpt: string;
  content: string; // 検索用に本文全体を保持
}

function getPosts(): PostMeta[] {
  const postsDir = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDir);
  console.log(`Total .md files found: ${files.filter(f => f.endsWith('.md')).length}`);
  const posts = files
    .filter((file) => file.endsWith('.md'))
    .map((file): PostMeta | null => {
      try {
        const filePath = path.join(postsDir, file);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);
      // 本文から最初の50文字を抜粋
      const plain = content.replace(/[#>*\-\[\]!`_>\n]/g, '').trim();
      let excerpt = plain.slice(0, 50);
      if (plain.length > 50) excerpt += '...';
      
      // デバッグ用ログ（「朝倉」が含まれる記事をチェック）
      if (data.title && data.title.includes('朝倉')) {
        console.log(`Found article with 朝倉: ${data.title} (${data.date})`);
      }
      
        return {
          title: data.title,
          date: data.date,
          category: data.category || '',
          slug: file.replace(/\.md$/, ''),
          thumbnail: data.thumbnail || '/sample-thumb.jpg',
          excerpt,
          content: plain, // 検索用に本文全体を保持
        };
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
        return null; // エラーが発生したファイルはnullを返す
      }
    })
    .filter((post): post is PostMeta => post !== null) // nullを除外
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  
  return posts;
}

export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const allPosts = getPosts();
  console.log(`[Home] Total posts loaded: ${allPosts.length}`);
  console.log(`[Home] Posts titles:`, allPosts.map(p => p.title));
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const postsPerPage = 10;
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const posts = allPosts.slice(startIndex, startIndex + postsPerPage);
  console.log(`[Home] Displaying ${posts.length} posts for page ${currentPage}`);
  
  return (
    <ArticleList 
      posts={posts}
      allPosts={allPosts} 
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/"
    />
  );
}

