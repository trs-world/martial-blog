import React from 'react';
import styles from './PostBodyWithBoxedHeadings.module.css';

// 記事本文のHTMLを受け取り、h1のみ除外し、h2〜h6を.boxed-hNでラップして返す
export default function PostBodyWithBoxedHeadings({ html }: { html: string }) {
  // DOMParserはサーバーサイドで使えないため、正規表現でh2〜h6にclassを付与
  let processed = html
    // h2〜h6の開始タグにclass追加
    .replace(/<(h[2-6])( [^>]*)?>/gi, (match, tag, attrs = '') => `<${tag} class=\"${styles['boxed-' + tag.toLowerCase()]}\"${attrs}>`);
  // h1は何もclassを付けずそのまま
  return <div className="markdown-body" dangerouslySetInnerHTML={{ __html: processed }} />;
}
