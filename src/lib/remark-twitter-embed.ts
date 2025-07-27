import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Paragraph, Text, Parent, Html } from 'mdast';

// Twitter URLの正規表現パターン
const TWITTER_URL_REGEX = /https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+\/status\/\d+/g;

// ツイートIDを抽出する関数
function extractTweetId(url: string): string | null {
  const match = url.match(/\/status\/(\d+)/);
  return match ? match[1] : null;
}

// ツイート埋め込みHTMLを生成する関数
function createTweetEmbed(tweetId: string): string {
  return `
    <div class="tweet-embed" style="margin: 20px 0; border: 1px solid #e1e8ed; border-radius: 12px; padding: 16px; background: #fff; max-width: 550px;">
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <div style="width: 40px; height: 40px; background: #1da1f2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </div>
        <div>
          <div style="font-weight: bold; color: #14171a;">X (Twitter)</div>
          <div style="color: #657786; font-size: 14px;">@twitter</div>
        </div>
      </div>
      <div style="margin-bottom: 12px;">
        <p style="margin: 0; color: #14171a; line-height: 1.4;">ツイートを読み込み中...</p>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <a href="https://twitter.com/i/status/${tweetId}" target="_blank" rel="noopener noreferrer" 
           style="color: #1da1f2; text-decoration: none; font-size: 14px; display: flex; align-items: center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 4px;">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Xで見る
        </a>
      </div>
    </div>
    <script>
      (function() {
        const tweetId = '${tweetId}';
        const tweetContainer = document.querySelector('.tweet-embed');
        
        // Twitter APIを使用してツイート情報を取得（実際の実装では適切なAPIキーが必要）
        // ここではプレースホルダーとして基本的な表示を行う
        if (tweetContainer) {
          const content = tweetContainer.querySelector('p');
          if (content) {
            content.textContent = 'ツイートID: ' + tweetId + ' のツイートです。Xで詳細を確認してください。';
          }
        }
      })();
    </script>
  `;
}

// remarkプラグインの実装
const remarkTwitterEmbed: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'paragraph', (node: Paragraph, index: number | undefined, parent: Parent | undefined) => {
      // パラグラフ内のテキストノードをチェック
      const textNode = node.children.find((child): child is Text => child.type === 'text');
      
      if (textNode && textNode.value) {
        const matches = textNode.value.match(TWITTER_URL_REGEX);
        
        if (matches) {
          // 各ツイートURLを処理
          matches.forEach(url => {
            const tweetId = extractTweetId(url);
            
            if (tweetId) {
              // HTMLノードを作成してツイート埋め込みに置換
              const embedHtml = createTweetEmbed(tweetId);
              
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
              }
            }
          });
          
          // テキストが空になった場合はパラグラフを削除
          if (!textNode.value.trim()) {
            if (parent && typeof index === 'number' && 'children' in parent) {
              parent.children.splice(index, 1);
            }
          }
        }
      }
    });
  };
};

export default remarkTwitterEmbed;
