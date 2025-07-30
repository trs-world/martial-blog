import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMeta {
  title: string;
  date: string;
  category: string;
  slug: string;
  thumbnail?: string;
  excerpt: string;
}

export function getAllPosts(): PostMeta[] {
  const postsDir = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDir);
  return files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
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
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getRelatedPosts(currentSlug: string, category: string, limit: number = 4): PostMeta[] {
  const allPosts = getAllPosts();
  
  // 現在の記事を除外し、同じカテゴリの記事をフィルタリング
  const relatedPosts = allPosts.filter(post => {
    if (post.slug === currentSlug) return false;
    
    // カテゴリが配列ならそのまま、文字列ならカンマ・スペースで分割
    const cats = Array.isArray(post.category)
      ? post.category
      : typeof post.category === 'string'
        ? post.category.split(/[,\s]+/).filter(Boolean)
        : [];
    
    return cats.includes(category);
  });
  
  // 最新順で指定された数だけ返す
  return relatedPosts.slice(0, limit);
}

export function getFirstCategory(category: string | string[]): string {
  if (Array.isArray(category)) {
    return category[0] || '';
  }
  if (typeof category === 'string') {
    const cats = category.split(/[,\s]+/).filter(Boolean);
    return cats[0] || '';
  }
  return '';
}
