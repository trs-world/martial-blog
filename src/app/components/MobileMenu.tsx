"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./MobileMenu.module.css";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
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
        <div className={styles.menuHeader}>
          <Image src="/logo.png" alt="ロゴ" height={32} width={40} style={{height:32, width:'auto'}} priority />
          <span style={{fontWeight:'bold',marginLeft:8}}>Martial Blog</span>
        </div>
        <ul className={styles.menuList}>
          <li><Link href="/" onClick={() => setOpen(false)}>ホーム</Link></li>
          <li><Link href="/posts?category=RIZIN" onClick={() => setOpen(false)}>RIZIN</Link></li>
          <li><Link href="/posts?category=MMA" onClick={() => setOpen(false)}>MMA</Link></li>
          <li><Link href="/posts?category=ボクシング" onClick={() => setOpen(false)}>ボクシング</Link></li>
          <li><Link href="/posts?category=キックボクシング" onClick={() => setOpen(false)}>キックボクシング</Link></li>
          <li><Link href="/contact" onClick={() => setOpen(false)}>お問い合わせ</Link></li>
        </ul>
      </nav>
    </>
  );
}
