import type { Metadata } from "next";
import React from "react";
import Link from 'next/link';

import ResponsiveNav from './components/ResponsiveNav';
import GoogleAnalytics from '@/components/GoogleAnalytics';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fight Fantasy",
  description: "格闘技の最新情報をお届けします。",
  keywords: ["格闘技", "MMA", "キックボクシング", "UFC", "練習日記", "観戦記", "道具レビュー", "ブログ"],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/icon.png', sizes: '57x57', type: 'image/png' },
      { url: '/icon.png', sizes: '60x60', type: 'image/png' },
      { url: '/icon.png', sizes: '72x72', type: 'image/png' },
      { url: '/icon.png', sizes: '76x76', type: 'image/png' },
      { url: '/icon.png', sizes: '114x114', type: 'image/png' },
      { url: '/icon.png', sizes: '120x120', type: 'image/png' },
      { url: '/icon.png', sizes: '144x144', type: 'image/png' },
      { url: '/icon.png', sizes: '152x152', type: 'image/png' },
      { url: '/icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon',
        url: '/icon.png',
        sizes: '180x180',
      },
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/icon.png',
        sizes: '180x180',
      },
      {
        rel: 'mask-icon',
        url: '/icon.svg',
        color: '#b71c1c',
      },
    ],
  },
  openGraph: {
    title: "Fight Fantasy",
    description: "格闘技の練習・観戦・道具レビューなどを発信するブログ。初心者から経験者まで楽しめる最新情報をお届けします。",
    type: "website",
    locale: "ja_JP",
    url: "https://martial-blog.netlify.app/",
    siteName: "Fight Fantasy",
    images: [
      {
        url: "https://martial-blog.netlify.app/character.png",
        width: 1200,
        height: 630,
        alt: "Fight Fantasy - 格闘技ブログのプロフィール画像",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fight Fantasy",
    description: "RIZIN・UFCを中心に格闘技に関する最新情報をまとめるブログ。初心者からコアファンにまでわかりやすい情報をお届けします。",
    images: ["https://martial-blog.netlify.app/character.png"],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#b71c1c',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <GoogleAnalytics />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4014848226068727"
          crossOrigin="anonymous"></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="topbar" style={{
          width: '100vw',
          maxWidth: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 28,
          marginBottom: 10,
          overflow: 'visible',
        }}>
          <Link href="/" className="navbar-logo" style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            paddingBottom: 8,
            overflow: 'visible',
          }} aria-label="ホームへ">
            <span style={{
  fontSize: '2.5rem',
  fontWeight: 900,
  letterSpacing: '0.07em',
  background: 'linear-gradient(90deg, #ff3c3c 0%, #ffb347 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: '#ff3c3c',
  textShadow: '2px 2px 6px rgba(0,0,0,0.12)',
  lineHeight: 1.2,
  display: 'inline-block',
}}>Fight Fantasy</span>
          </Link>
          
        </div>

        {/* ナビゲーションバー */}
        <ResponsiveNav />

        {children}
        <footer style={{ marginBottom: 0, paddingBottom: 0 }}>
          <div className="footer-nav">
            <a href="/privacy-policy" className="footer-link"><span className="footer-arrow">&#9654;</span>プライバシーポリシー</a>
            <a href="/terms" className="footer-link"><span className="footer-arrow">&#9654;</span>利用規約</a>
            <a href="/contact" className="footer-link"><span className="footer-arrow">&#9654;</span>お問い合わせ</a>
          </div>
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} Martial Blog / 格闘技ブログ
          </div>
        </footer>
      </body>
    </html>
  );
}
