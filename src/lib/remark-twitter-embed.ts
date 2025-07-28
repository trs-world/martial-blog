import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Paragraph, Text, Parent, Html, Link } from 'mdast';

// Twitter URLの正規表現パターン
const TWITTER_URL_REGEX = /https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+\/status\/\d+/g;

// ツイートデータの型定義
interface TweetData {
  html: string;
  author_name: string;
  author_url: string;
  provider_name: string;
  provider_url: string;
  cache_age: number;
  url: string;
  version: string;
  type: string;
  width?: number;
  height?: number;
  thumbnail_url?: string;
}

// ツイートデータのキャッシュ（強制的にクリア）
const tweetCache = new Map<string, TweetData>();
// 強制的にキャッシュをクリアして新しいデータを取得
tweetCache.clear();
console.log('🗑️ 強制的にキャッシュをクリアしました - 新しいデータを取得します');

// oEmbed APIでツイートデータを取得する関数
async function fetchTweetData(tweetId: string): Promise<TweetData | null> {
  console.log(`🌐 fetchTweetData: ツイートID ${tweetId} のデータを取得中...`);
  
  try {
    const oembedUrl = `https://publish.twitter.com/oembed?url=https://x.com/i/status/${tweetId}&omit_script=true`;
    console.log('🔗 fetchTweetData: oEmbed URL:', oembedUrl);
    const response = await fetch(oembedUrl);
    
    if (!response.ok) {
      console.error(`❌ fetchTweetData: oEmbed API エラー ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    console.log('✅ fetchTweetData: 生のoEmbedデータ:', JSON.stringify(data, null, 2));
    
    // キャッシュに保存
    tweetCache.set(tweetId, data);
    console.log(`💾 fetchTweetData: ツイートID ${tweetId} をキャッシュに保存しました`);
    console.log(`📊 fetchTweetData: 現在のキャッシュサイズ: ${tweetCache.size}`);
    
    // プロフィール画像の抽出を詳細にログ出力
    if (data.html) {
      const imgMatches = data.html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/g);
      console.log('🖼️ fetchTweetData: HTML内のすべてのimg要素:', imgMatches);
      
      if (imgMatches) {
        imgMatches.forEach((match: string, index: number) => {
          const srcMatch = match.match(/src=["']([^"']+)["']/);
          if (srcMatch) {
            console.log(`🖼️ fetchTweetData: 画像${index + 1}: ${srcMatch[1]}`);
          }
        });
      }
    }
    
    return data;
  } catch (error) {
    console.error('❌ fetchTweetData: エラー', error);
    return null;
  }
}

// 実際のoEmbedデータを直接テストする関数
async function directOEmbedTest() {
  console.log('🧪 directOEmbedTest: Jack Dorseyの最初のツイートをテスト中...');
  const tweetId = '20';
  const oembedUrl = `https://publish.twitter.com/oembed?url=https://twitter.com/jack/status/${tweetId}&omit_script=true`;
  
  try {
    const response = await fetch(oembedUrl);
    if (!response.ok) {
      console.error('❌ directOEmbedTest: API エラー', response.status);
      return;
    }
    
    const data = await response.json();
    console.log('✅ directOEmbedTest: 生のoEmbedデータ:');
    console.log('📊 Author:', data.author_name);
    console.log('🔗 URL:', data.author_url);
    console.log('📏 HTML長:', data.html?.length || 0);
    console.log('📝 HTML内容:', data.html);
    
    // テキスト抽出テスト
    if (data.html) {
      const pMatch = data.html.match(/<p[^>]*>([\s\S]*?)<\/p>/);
      console.log('🔍 pタグマッチ:', pMatch ? pMatch[1] : 'なし');
      
      const blockquoteMatch = data.html.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/);
      console.log('🔍 blockquoteマッチ:', blockquoteMatch ? '見つかった' : 'なし');
    }
    
  } catch (error) {
    console.error('❌ directOEmbedTest: エラー', error);
  }
}

// テスト実行
directOEmbedTest();

// キャッシュからツイートデータを取得する関数
function getCachedTweetData(tweetId: string): TweetData | null {
  return tweetCache.get(tweetId) || null;
}

// oEmbedデータからツイート情報を抽出する関数
function parseTweetData(tweetData: TweetData): {
  username: string;
  displayName: string;
  content: string;
  date: string;
  profileImage?: string;
  verified: boolean;
} {
  console.log('🔍 parseTweetData: oEmbedデータ解析開始');
  console.log('📊 parseTweetData: 完全なoEmbedデータ', JSON.stringify(tweetData, null, 2));
  
  const html = tweetData.html;
  console.log('📄 parseTweetData: HTML内容', html);
  
  // ツイート内容を抽出（改善されたロジック）
  let content = '';
  
  console.log('🔍 parseTweetData: ツイート内容抽出開始');
  console.log('📜 parseTweetData: HTML全体の構造解析:');
  console.log('HTML長:', html.length);
  console.log('blockquoteの有無:', html.includes('<blockquote'));
  console.log('pタグの数:', (html.match(/<p[^>]*>/g) || []).length);
  console.log('aタグの数:', (html.match(/<a[^>]*>/g) || []).length);
  
  // HTMLの主要部分を表示
  const htmlPreview = html.replace(/\s+/g, ' ').substring(0, 500);
  console.log('📝 HTMLプレビュー:', htmlPreview);
  
  // パターン1: blockquote内のp要素からテキストを抽出
  const pTagMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/);
  console.log('🔎 pタグマッチ結果:', pTagMatch ? '見つかった' : '見つからない');
  if (pTagMatch) {
    console.log('🔎 pタグの内容:', pTagMatch[1]);
    content = pTagMatch[1]
      .replace(/<br\s*\/?>/gi, '\n') // <br>タグを改行文字に変換
      .replace(/<a[^>]*>([^<]*)<\/a>/g, '$1') // リンクテキストを保持
      .replace(/<[^>]*>/g, '') // その他のHTMLタグを除去
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&mdash;/g, '—')
      .replace(/&nbsp;/g, ' ')
      .trim();
    console.log('✅ parseTweetData: p要素からテキスト抽出成功', content);
  } else {
    console.log('⚠️ parseTweetData: p要素が見つかりませんでした');
  }
  
  // パターン2: blockquote全体からテキストを抽出（フォールバック）
  if (!content) {
    console.log('🔄 parseTweetData: パターン2 - blockquote全体から抽出を試行');
    const contentMatch = html.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/);
    if (contentMatch) {
      content = contentMatch[1]
        .replace(/<br\s*\/?>/gi, '\n') // <br>タグを改行文字に変換
        .replace(/<a[^>]*>([^<]*)<\/a>/g, '$1') // リンクテキストを保持
        .replace(/<[^>]*>/g, '') // その他のHTMLタグを除去
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&mdash;/g, '—')
        .replace(/&nbsp;/g, ' ')
        .trim();
      
      // URL部分を除去（最後の行にあることが多い）
      const lines = content.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        const lastLine = lines[lines.length - 1];
        if (lastLine.includes('pic.twitter.com') || lastLine.includes('https://t.co') || lastLine.includes('— ')) {
          lines.pop();
        }
      }
      content = lines.join('\n').trim();
      console.log('✅ parseTweetData: blockquote全体からテキスト抽出成功', content);
    } else {
      console.log('⚠️ parseTweetData: blockquote要素が見つかりませんでした');
    }
  }
  
  // パターン3: より広範囲なテキスト抽出（最終フォールバック）
  if (!content) {
    console.log('🔄 parseTweetData: パターン3 - 広範囲テキスト抽出を試行');
    // HTMLからすべてのテキスト内容を抽出
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // スクリプトを除去
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // スタイルを除去
      .replace(/<br\s*\/?>/gi, '\n') // <br>タグを改行文字に変換
      .replace(/<a[^>]*>([^<]*)<\/a>/g, '$1') // リンクテキストを保持
      .replace(/<[^>]*>/g, '') // その他のHTMLタグを除去
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&mdash;/g, '—')
      .replace(/&nbsp;/g, ' ')
      .trim();
    
    if (textContent && textContent.length > 10) {
      // 不要な部分を除去
      const lines = textContent.split('\n').filter(line => {
        const trimmed = line.trim();
        return trimmed && 
               !trimmed.includes('pic.twitter.com') && 
               !trimmed.includes('https://t.co') && 
               !trimmed.startsWith('—') &&
               !trimmed.includes('Twitter for');
      });
      
      if (lines.length > 0) {
        content = lines.slice(0, 3).join('\n').trim(); // 最初の3行まで
        console.log('✅ parseTweetData: 広範囲テキスト抽出成功', content);
      }
    }
  }
  
  // まだ内容が空の場合はフォールバック
  if (!content) {
    // ツイートの基本情報を表示
    content = `${tweetData.author_name} のツイート\n\nツイートの内容を表示するには、Xで確認してください。`;
    console.log('⚠️ parseTweetData: テキスト抽出に失敗、フォールバック使用', content);
  }
  
  // 作者情報を抽出
  const authorName = tweetData.author_name || 'X User';
  const authorUrl = tweetData.author_url || '';
  
  // ユーザー名を抽出（URLから）
  const usernameMatch = authorUrl.match(/twitter\.com\/([^/?]+)/) || authorUrl.match(/x\.com\/([^/?]+)/);
  const username = usernameMatch ? usernameMatch[1] : 'x';
  
  // プロフィール画像URLを抽出（oEmbedのHTMLから）
  let profileImage = '';
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/);
  if (imgMatch) {
    profileImage = imgMatch[1];
    console.log('🖼️ parseTweetData: プロフィール画像URL抽出', profileImage);
  }
  
  // 日付を抽出（oEmbedには含まれないことが多いので現在日時を使用）
  const date = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const result = {
    username,
    displayName: authorName,
    content,
    date,
    profileImage,
    verified: false // oEmbedでは認証情報は取得できない
  };
  
  console.log('🎯 parseTweetData: 最終結果', result);
  return result;
}

// ツイートデータを事前に取得してキャッシュする関数
export async function preloadTweetData(content: string): Promise<void> {
  const matches = content.match(TWITTER_URL_REGEX);
  if (matches) {
    console.log('🔄 Preloading tweet data for', matches.length, 'tweets');
    const promises = matches.map(async (url) => {
      const tweetId = extractTweetId(url);
      if (tweetId && !tweetCache.has(tweetId)) {
        await fetchTweetData(tweetId);
      }
    });
    await Promise.all(promises);
    console.log('✅ Tweet data preloading completed');
  }
}



// ツイートIDを抽出する関数
function extractTweetId(url: string): string | null {
  const match = url.match(/\/status\/(\d+)/);
  return match ? match[1] : null;
}

// ツイート埋め込みHTMLを生成する関数（Xツイート風リッチカード）
function createTweetEmbed(tweetId: string, tweetData?: TweetData): string {
  console.log(`🎯 createTweetEmbed: ツイートID ${tweetId} のカード生成開始`);
  console.log('📊 createTweetEmbed: 受信したtweetData:', tweetData ? 'データあり' : 'データなし');
  
  if (tweetData && tweetData.html) {
    console.log('✅ createTweetEmbed: oEmbedデータが存在します');
    console.log('🔍 createTweetEmbed: oEmbedデータの詳細:', {
      author_name: tweetData.author_name,
      author_url: tweetData.author_url,
      html_length: tweetData.html.length,
      html_preview: tweetData.html.substring(0, 200) + '...'
    });
    
    const parsedData = parseTweetData(tweetData);
    console.log('📝 createTweetEmbed: 解析されたデータ:', {
      content: parsedData.content,
      displayName: parsedData.displayName,
      username: parsedData.username,
      profileImage: parsedData.profileImage ? '画像あり' : '画像なし'
    });
    
    return `
      <style>
        .x-rich-tweet-card {
          margin: 24px 0;
          border: 1px solid #e1e8ed;
          border-radius: 16px;
          padding: 0;
          background: #ffffff;
          max-width: 550px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
          transition: all 0.3s cubic-bezier(.25,.8,.25,1);
          cursor: pointer;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
        }
        .x-rich-tweet-card:hover {
          box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        }
        .x-rich-tweet-header {
          display: flex;
          align-items: center;
          padding: 16px 16px 0 16px;
          gap: 12px;
        }
        .x-rich-tweet-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(45deg, #1da1f2, #0d8bd9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }
        .x-rich-tweet-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
        .x-rich-tweet-user-info {
          flex: 1;
          min-width: 0;
        }
        .x-rich-tweet-display-name {
          font-weight: 700;
          color: #0f1419;
          font-size: 15px;
          line-height: 20px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .x-rich-tweet-username {
          color: #536471;
          font-size: 15px;
          line-height: 20px;
        }
        .x-rich-tweet-content {
          padding: 12px 16px;
          color: #0f1419;
          font-size: 15px;
          line-height: 20px;
          white-space: pre-line;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .x-rich-tweet-footer {
          padding: 12px 16px 16px 16px;
          border-top: 1px solid #eff3f4;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .x-rich-tweet-date {
          color: #536471;
          font-size: 14px;
        }
        .x-rich-tweet-actions {
          display: flex;
          gap: 16px;
          color: #536471;
        }
        .x-rich-tweet-action {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          transition: color 0.2s;
        }
        .x-rich-tweet-action:hover {
          color: #1d9bf0;
        }
      </style>
      <div class="x-rich-tweet-card" data-tweet-id="${tweetId}" data-tweet-url="https://x.com/${parsedData.username}/status/${tweetId}" onclick="window.open(this.dataset.tweetUrl, '_blank', 'noopener,noreferrer')">
        <!-- Header -->
        <div class="x-rich-tweet-header">
          <div class="x-rich-tweet-avatar">
            ${parsedData.profileImage ? 
              `<img src="${parsedData.profileImage}" alt="${parsedData.displayName}のプロフィール画像" />` : 
              `<svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>`
            }
          </div>
          <div class="x-rich-tweet-user-info">
            <div class="x-rich-tweet-display-name">
              ${parsedData.displayName}
              ${parsedData.verified ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="#1d9bf0"><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/></svg>' : ''}
            </div>
            <div class="x-rich-tweet-username">@${parsedData.username}</div>
          </div>
          <div style="color: #536471; font-size: 14px;">•••</div>
        </div>
        
        <!-- Content -->
        <div class="x-rich-tweet-content">
          ${parsedData.content}
        </div>
        
        <!-- Footer -->
        <div class="x-rich-tweet-footer">
          <div class="x-rich-tweet-date">
            ${parsedData.date}
          </div>
          <div class="x-rich-tweet-actions">
            <div class="x-rich-tweet-action">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01z"/>
              </svg>
            </div>
            <div class="x-rich-tweet-action">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2h8.5v-2H7.5V7.55L5.432 9.48 4.068 8.02 8.5 3.88h-4z"/>
              </svg>
            </div>
            <div class="x-rich-tweet-action">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/>
              </svg>
            </div>
            <div class="x-rich-tweet-action">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0L11 5.06V19c0 .553.447 1 1 1s1-.447 1-1V5.06l3.47 3.44c.293.293.767.293 1.06 0s.294-.767 0-1.06z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  // フォールバック: 静的プレースホルダー
  return `
    <style>
      .x-tweet-card:hover {
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23) !important;
      }
    </style>
    <div class="x-tweet-card" data-tweet-id="${tweetId}" style="
      margin: 24px 0;
      border: 1px solid #cfd9de;
      border-radius: 16px;
      padding: 0;
      background: #ffffff;
      max-width: 550px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
      transition: all 0.3s cubic-bezier(.25,.8,.25,1);
      cursor: pointer;
    ">
      <div style="padding: 16px;">
        <!-- Header -->
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(45deg, #1da1f2, #0d8bd9);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            flex-shrink: 0;
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
          <div style="flex: 1; min-width: 0;">
            <div style="
              font-weight: 700;
              color: #0f1419;
              font-size: 15px;
              line-height: 20px;
              display: flex;
              align-items: center;
              gap: 4px;
            ">
              <span>X Post</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1d9bf0">
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/>
              </svg>
            </div>
            <div style="color: #536471; font-size: 14px; line-height: 16px;">@x · ツイート</div>
          </div>
          <div style="color: #536471; font-size: 14px;">•••</div>
        </div>
        
        <!-- Content -->
        <div style="margin-bottom: 16px;">
          <div class="tweet-content" style="
            color: #0f1419;
            font-size: 15px;
            line-height: 20px;
            white-space: pre-wrap;
            word-wrap: break-word;
          ">
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
              color: #536471;
              font-style: italic;
            ">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              ツイートを読み込み中...
            </div>
          </div>
        </div>
        
        <!-- Actions -->
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid #eff3f4;
        ">
          <div style="display: flex; gap: 16px; color: #536471; font-size: 13px;">
            <span style="display: flex; align-items: center; gap: 4px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01z"/>
              </svg>
              返信
            </span>
            <span style="display: flex; align-items: center; gap: 4px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.791-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.791 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/>
              </svg>
              リツイート
            </span>
            <span style="display: flex; align-items: center; gap: 4px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/>
              </svg>
              いいね
            </span>
          </div>
          <a href="https://x.com/i/status/${tweetId}" target="_blank" rel="noopener noreferrer" style="
            color: #1d9bf0;
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 6px 12px;
            border-radius: 20px;
            background: rgba(29, 155, 240, 0.1);
            transition: background-color 0.2s;
          " onmouseover="this.style.backgroundColor='rgba(29, 155, 240, 0.2)'" onmouseout="this.style.backgroundColor='rgba(29, 155, 240, 0.1)'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Xで見る
          </a>
        </div>
      </div>
    </div>
    
    <script>
      (function() {
        const tweetId = '${tweetId}';
        const tweetCard = document.querySelector('[data-tweet-id="' + tweetId + '"]');
        
        if (tweetCard) {
          const contentDiv = tweetCard.querySelector('.tweet-content');
          
          // クリックでXページを開く
          tweetCard.addEventListener('click', function(e) {
            if (e.target.tagName !== 'A') {
              window.open('https://x.com/i/status/' + tweetId, '_blank');
            }
          });
          
          // プレースホルダーコンテンツを表示
          if (contentDiv) {
            setTimeout(() => {
              contentDiv.innerHTML = 
                '<div style="padding: 8px 0;">' +
                  '<p style="margin: 0; line-height: 1.4;">このツイートの内容を表示するには、Xで確認してください。</p>' +
                  '<p style="margin: 8px 0 0 0; font-size: 13px; color: #536471;">ツイートID: ' + tweetId + '</p>' +
                '</div>';
            }, 500);
          }
        }
      })();
    </script>
  `;
}

// remarkプラグインのメイン関数
const remarkTwitterEmbed: Plugin<[], Root> = () => {
  console.log('🚀🚀🚀 remarkTwitterEmbed: プラグイン初期化 - ' + new Date().toISOString());
  console.log('📋 remarkTwitterEmbed: 現在のキャッシュサイズ:', tweetCache.size);
  return (tree: Root) => {
    console.log('🔍🔍🔍 remarkTwitterEmbed: プラグインが実行されました - ' + new Date().toISOString());
    console.log('🌳 remarkTwitterEmbed: AST tree type:', tree.type, 'children count:', tree.children.length);
    console.log('📊 AST tree type:', tree.type);
    console.log('📊 AST children count:', tree.children?.length);
    
    // パラグラフ内のテキストノードをチェック
    visit(tree, 'paragraph', (node: Paragraph, index: number | undefined, parent: Parent | undefined) => {
      console.log('📝 paragraph node found:', node);
      const textNode = node.children.find((child): child is Text => child.type === 'text');
      
      if (textNode && textNode.value) {
        console.log('📄 text node content:', textNode.value);
        const matches = textNode.value.match(TWITTER_URL_REGEX);
        console.log('🔗 regex matches:', matches);
        
        if (matches) {
          console.log('✅ Twitter URL found in text!');
          // 各ツイートURLを処理
          matches.forEach(url => {
            const tweetId = extractTweetId(url);
            console.log('🆔 extracted tweet ID:', tweetId);
            
            if (tweetId) {
              // キャッシュからツイートデータを取得
              const tweetData = getCachedTweetData(tweetId);
              console.log('💾 Tweet data from cache:', tweetData ? 'found' : 'not found');
              
              // HTMLノードを作成してツイート埋め込みに置換
              const embedHtml = createTweetEmbed(tweetId, tweetData || undefined);
              console.log('🎨 embed HTML created');
              
              // 元のテキストからURLを削除
              textNode.value = textNode.value.replace(url, '').trim();
              
              // HTMLノードを作成
              const htmlNode: Html = {
                type: 'html',
                value: embedHtml
              };
              
              // 親ノードに新しいHTMLノードを挿入
              if (parent && typeof index === 'number' && 'children' in parent) {
                parent.children.splice(index + 1, 0, htmlNode);
                console.log('✨ HTML node inserted');
              }
            }
          });
          
          // テキストが空になった場合はパラグラフを削除
          if (!textNode.value.trim()) {
            if (parent && typeof index === 'number' && 'children' in parent) {
              parent.children.splice(index, 1);
              console.log('🗑️ empty paragraph removed');
            }
          }
        }
      }
    });
    
    // linkノードもチェック（マークダウンで自動リンク化された場合）
    visit(tree, 'link', (node: Link, index: number | undefined, parent: Parent | undefined) => {
      const url = node.url;
      console.log('🔗 link node found:', url);
      
      if (url && typeof url === 'string' && TWITTER_URL_REGEX.test(url)) {
        console.log('✅ Twitter URL found in link!');
        const tweetId = extractTweetId(url);
        console.log('🆔 extracted tweet ID:', tweetId);
        
        if (tweetId) {
          // キャッシュからツイートデータを取得
          const tweetData = getCachedTweetData(tweetId);
          console.log('💾 Tweet data from cache for link:', tweetData ? 'found' : 'not found');
          
          // HTMLノードを作成してツイート埋め込みに置換
          const embedHtml = createTweetEmbed(tweetId, tweetData || undefined);
          console.log('🎨 embed HTML created for link');
          console.log('📝 Generated HTML:', embedHtml.substring(0, 200) + '...');
          
          // HTMLノードを作成
          const htmlNode: Html = {
            type: 'html',
            value: embedHtml
          };
          
          // 親ノードでlinkノードをHTMLノードに置換
          if (parent && typeof index === 'number' && 'children' in parent) {
            parent.children.splice(index, 1, htmlNode);
            console.log('✨ link node replaced with HTML');
          }
        }
      }
    });
    
    console.log('🏁 remarkTwitterEmbed: 処理完了');
  };
};

export default remarkTwitterEmbed;
