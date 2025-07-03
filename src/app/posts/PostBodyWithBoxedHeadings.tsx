"use client";
import { useEffect, useRef } from 'react';
import styles from './PostBodyWithBoxedHeadings.module.css';

// 記事本文のHTMLを受け取り、h1のみ除外し、h2〜h6を.boxed-hNでラップして返す
export default function PostBodyWithBoxedHeadings({ html }: { html: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  // DOMParserはサーバーサイドで使えないため、正規表現でh2〜h6にclassを付与
  const processed = html
    // h2〜h6の開始タグにclass追加
    .replace(/<(h[2-6])( [^>]*)?>/gi, (match, tag, attrs = '') => `<${tag} class=\"${styles['boxed-' + tag.toLowerCase()]}\"${attrs}>`);

  // クライアントサイドでaタグにtarget, relを付与
  useEffect(() => {
    if (divRef.current) {
      const links = divRef.current.querySelectorAll('a');
      links.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      });
    }
  }, [processed]);

  // h1は何もclassを付けずそのまま
  return <div ref={divRef} className="markdown-body" dangerouslySetInnerHTML={{ __html: processed }} />;
}
