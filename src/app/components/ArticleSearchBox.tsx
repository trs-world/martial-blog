'use client';
import React, { useState } from 'react';

export default function ArticleSearchBox({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  // スマホ時はmain幅と揃える
  // 横幅は親(main)の幅に合わせる（スマホ・PC問わず）
  const outerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 700,
    margin: '0 auto',
    padding: 0,
    boxSizing: 'border-box',
    background: 'transparent',
  };





  return (
    <div style={outerStyle}>
      <div style={{ background: '#faf7f5', border: '1px solid #e0e0e0', borderRadius: 10, padding: 36, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <label htmlFor="search-box" style={{ fontWeight: 'bold', color: '#b71c1c', fontSize: '1.05em' }}>
          記事検索
        </label>
        <input
          id="search-box"
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="キーワード..."
          style={{ width: '100%', marginTop: 10, padding: '8px 12px', borderRadius: 6, border: '1px solid #d0d0d0', fontSize: '1em', background: '#fff', color: '#333' }}
        />
      </div>
    </div>
  );
}
