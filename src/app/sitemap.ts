import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://martial-blog.netlify.app'
  
  // 静的ページ
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  // 記事ページを動的に取得
  const postsDir = path.join(process.cwd(), 'posts')
  const files = fs.readdirSync(postsDir)
  
  const postPages = files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const filePath = path.join(postsDir, file)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContents)
      const slug = file.replace(/\.md$/, '')
      
      return {
        url: `${baseUrl}/posts/${slug}`,
        lastModified: new Date(data.date || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }
    })

  return [...staticPages, ...postPages]
}
