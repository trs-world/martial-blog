"use client";
import React, { useState } from "react";
import ArticleSearchBox from "./ArticleSearchBox";
import PopularArticles, { PopularArticle } from "./PopularArticles";

// ダミーデータ（本来はAPIやpropsから渡す）
const defaultPopularArticles: PopularArticle[] = [];

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
