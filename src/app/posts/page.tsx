import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';


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
        return null;
      }
    })
    .filter((post): post is PostMeta => post !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  
  return posts;
}



import ArticleList from "../components/ArticleList";

export default async function PostsPage(props: unknown) {
  const { searchParams } = props as { searchParams: Promise<{ category?: string | string[]; page?: string }> };
  const resolvedSearchParams = await searchParams;
  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : Array.isArray(resolvedSearchParams.category) ? resolvedSearchParams.category[0] : undefined;
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  
  let allPosts = getPosts();
  if (category) {
    allPosts = allPosts.filter(post => {
      const cats = Array.isArray(post.category)
        ? post.category
        : typeof post.category === 'string'
          ? post.category.split(/[\,\s]+/).filter(Boolean)
          : [];
      return cats.includes(category);
    });
  }
  
  const postsPerPage = 10;
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const posts = allPosts.slice(startIndex, startIndex + postsPerPage);
  
  // ベースパスを構築（カテゴリがある場合はクエリパラメータを含める）
  const basePath = category ? `/posts?category=${encodeURIComponent(category)}` : '/posts';
  
  return (
    <ArticleList 
      posts={posts}
      allPosts={allPosts} 
      currentPage={currentPage}
      totalPages={totalPages}
      basePath={`/posts?category=${category}`}
    />
  );
}
