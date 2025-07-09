"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ArticleSearchBox from "./ArticleSearchBox";
import styles from "./MobileMenu.module.css";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <>
      <button
        className={styles.hamburger}
        aria-label="メニューを開く"
        onClick={() => setOpen(true)}
      >
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </button>
      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)} />
      )}
      <nav className={open ? styles.menuOpen : styles.menu}>
        <button className={styles.closeBtn} aria-label="閉じる" onClick={() => setOpen(false)}>
          ×
        </button>
        <div style={{display: 'flex', flexDirection: 'column', flex: 1, height: '100%'}}>
          <div>
            <div className={styles.menuHeader}>
              <Image src="/logo.png" alt="ロゴ" width={50} height={60} style={{height:60, width:'auto', display:'block'}} priority unoptimized />
              <span style={{
                fontWeight:'bold',
                marginLeft:8,
                whiteSpace:'nowrap',
                overflow:'hidden',
                textOverflow:'ellipsis',
                minWidth:0,
                display:'block',
                fontSize:'clamp(1rem,5vw,1.4rem)'
              }}>Martial Blog</span>
            </div>
            <ul className={styles.menuList}>
              <li><Link href="/" onClick={() => setOpen(false)}>ホーム</Link></li>
              <li><Link href="/posts?category=RIZIN" onClick={() => setOpen(false)}>RIZIN</Link></li>
              <li><Link href="/posts?category=MMA" onClick={() => setOpen(false)}>MMA</Link></li>
              <li><Link href="/posts?category=ボクシング" onClick={() => setOpen(false)}>ボクシング</Link></li>
              <li><Link href="/posts?category=キックボクシング" onClick={() => setOpen(false)}>キックボクシング</Link></li>

              <li><Link href="/contact" onClick={() => setOpen(false)}>お問い合わせ</Link></li>
            </ul>
        </div>
      </nav>
    </>
  );
}
