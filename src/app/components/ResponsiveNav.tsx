"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './MobileMenu.module.css';

export default function ResponsiveNav() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <nav className="navbar" style={{width:'100%', position:'relative', zIndex:10, height:56, overflow:'hidden'}}>
      {/* トップバー */}
      <div style={{display:'flex', alignItems:'center', width:'100%'}}>
        {/* PC用カテゴリナビゲーション（中央寄せ、ロゴ→ホーム→RIZIN→…） */}
        <div className={styles.desktopNav} style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <Link href="/" className="navbar-logo" style={{display:'flex', alignItems:'center'}}>
            <Image src="/logo.png" alt="ロゴ" width={50} height={60} style={{height:60, width:'auto', display:'block'}} priority unoptimized />
          </Link>
          <Link href="/">ホーム</Link>
          <Link href="/posts?category=RIZIN">RIZIN</Link>
          <Link href="/posts?category=MMA">MMA</Link>
          <Link href="/posts?category=ボクシング">ボクシング</Link>
          <Link href="/posts?category=キックボクシング">キックボクシング</Link>
        </div>
        {/* モバイル用ロゴ（左端） */}
        <div className={styles.mobileOnly}>
          <Link href="/" className="navbar-logo" style={{display:'flex', alignItems:'center', marginRight:8}}>
            <Image src="/logo.png" alt="ロゴ" width={50} height={60} style={{height:60, width:'auto', display:'block'}} priority unoptimized />
          </Link>
        </div>
        {/* モバイル用ハンバーガー（右端） */}
        <div className={styles.mobileOnly} style={{marginLeft:'auto'}}>
          <button className={styles.hamburger} onClick={() => setMenuOpen(true)} aria-label="メニューを開く">
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
        </div>
      </div>
      {/* モバイル用サイドメニュー */}
      {menuOpen && (
        <>
          <div className={styles.overlay} onClick={()=>setMenuOpen(false)}></div>
          <nav className={styles.menuOpen}>
            <button className={styles.closeBtn} aria-label="メニューを閉じる" onClick={()=>setMenuOpen(false)}>
              ×
            </button>
            <div className={styles.menuList}>
              <Link href="/" className="nav-btn nav-home">
                <div onClick={()=>setMenuOpen(false)}>ホーム</div>
              </Link>
              <Link href="/posts?category=RIZIN" className="nav-btn nav-rizin">
                <div onClick={()=>setMenuOpen(false)}>RIZIN</div>
              </Link>
              <Link href="/posts?category=MMA" className="nav-btn nav-mma">
                <div onClick={()=>setMenuOpen(false)}>MMA</div>
              </Link>
              <Link href="/posts?category=ボクシング" className="nav-btn nav-boxing">
                <div onClick={()=>setMenuOpen(false)}>ボクシング</div>
              </Link>
              <Link href="/posts?category=キックボクシング" className="nav-btn nav-kick">
                <div onClick={()=>setMenuOpen(false)}>キックボクシング</div>
              </Link>
              <Link href="/contact" className="nav-btn nav-contact">
                <div onClick={()=>setMenuOpen(false)}>お問い合わせ</div>
              </Link>
            </div>
          </nav>
        </>
      )}
    </nav>
  );
}
