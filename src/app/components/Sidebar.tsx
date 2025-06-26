"use client";
import React, { useState, useMemo } from "react";
import ArticleSearchBox from "./ArticleSearchBox";
import PopularArticles, { PopularArticle } from "./PopularArticles";

// ダミーデータ（本来はAPIやpropsから渡す）
const defaultPopularArticles: PopularArticle[] = [
  { title: '最強の打撃テクニック', slug: 'best-striking', views: 1280, thumbnail: '/sample-thumb.jpg' },
  { title: '寝技の極意', slug: 'grappling-tips', views: 980, thumbnail: '/sample-thumb.jpg' },
  { title: '減量の科学', slug: 'weight-cutting', views: 870, thumbnail: '/sample-thumb.jpg' },
];

export default function Sidebar({ popularArticles = defaultPopularArticles }: { popularArticles?: PopularArticle[] }) {
  const [query, setQuery] = useState("");
  // Sidebar自体は検索クエリ状態のみ管理し、親で使いたい場合はリフトアップ
  return (
    <aside style={{ minWidth: 260, maxWidth: 340, marginLeft: 24 }}>
      <ArticleSearchBox query={query} setQuery={setQuery} />
      <div style={{ marginTop: 24 }}>
        <PopularArticles posts={popularArticles} />
      </div>
    </aside>
  );
}
