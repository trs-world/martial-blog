import type { Metadata } from "next";
import Link from 'next/link';
import Image from 'next/image';
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
  title: "格闘技ブログ | Martial Blog",
  description: "格闘技の練習・観戦・道具レビューなどを発信するブログ。初心者から経験者まで楽しめる最新情報をお届けします。",
  keywords: ["格闘技", "MMA", "キックボクシング", "UFC", "練習日記", "観戦記", "道具レビュー", "ブログ"],
  openGraph: {
    title: "格闘技ブログ | Martial Blog",
    description: "格闘技の練習・観戦・道具レビューなどを発信するブログ。初心者から経験者まで楽しめる最新情報をお届けします。",
    type: "website",
    locale: "ja_JP",
    url: "https://martial-blog.example.com/",
    siteName: "格闘技ブログ | Martial Blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "格闘技ブログ | Martial Blog",
    description: "格闘技の練習・観戦・道具レビューなどを発信するブログ。初心者から経験者まで楽しめる最新情報をお届けします。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="navbar">
          <Link href="/" className="navbar-logo" style={{display:'flex',alignItems:'center',marginRight:18}}>
            <Image src="/logo.png" alt="ロゴ" height={48} width={60} style={{height:48, width:'auto', display:'block'}} priority />
          </Link>
          <a href="/">ホーム</a>
          <a href="/posts?category=RIZIN" className="nav-btn nav-rizin">RIZIN</a>
          <a href="/posts?category=MMA" className="nav-btn nav-mma">MMA</a>
          <a href="/posts?category=ボクシング" className="nav-btn nav-boxing">ボクシング</a>
          <a href="/posts?category=キックボクシング" className="nav-btn nav-kick">キックボクシング</a>
        </nav>
        {children}
        <footer>
          <div className="footer-nav">
            <a href="/privacy-policy" className="footer-link"><span className="footer-arrow">&#9654;</span>プライバシーポリシー</a>
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
