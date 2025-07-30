import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import type { Root, Heading } from 'mdast';
import type { Plugin } from 'unified';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

// 文字列をスラッグ化する関数
function slugify(text: string, usedIds: Set<string> = new Set()): string {
  // 基本的なクリーニング
  let slug = text
    .trim()
    .toLowerCase()
    // 絵文字と特殊記号を除去
    .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
    // 日本語をローマ字に変換（簡易版）
    .replace(/あ/g, 'a').replace(/い/g, 'i').replace(/う/g, 'u').replace(/え/g, 'e').replace(/お/g, 'o')
    .replace(/か/g, 'ka').replace(/き/g, 'ki').replace(/く/g, 'ku').replace(/け/g, 'ke').replace(/こ/g, 'ko')
    .replace(/が/g, 'ga').replace(/ぎ/g, 'gi').replace(/ぐ/g, 'gu').replace(/げ/g, 'ge').replace(/ご/g, 'go')
    .replace(/さ/g, 'sa').replace(/し/g, 'shi').replace(/す/g, 'su').replace(/せ/g, 'se').replace(/そ/g, 'so')
    .replace(/ざ/g, 'za').replace(/じ/g, 'ji').replace(/ず/g, 'zu').replace(/ぜ/g, 'ze').replace(/ぞ/g, 'zo')
    .replace(/た/g, 'ta').replace(/ち/g, 'chi').replace(/つ/g, 'tsu').replace(/て/g, 'te').replace(/と/g, 'to')
    .replace(/だ/g, 'da').replace(/ぢ/g, 'di').replace(/づ/g, 'du').replace(/で/g, 'de').replace(/ど/g, 'do')
    .replace(/な/g, 'na').replace(/に/g, 'ni').replace(/ぬ/g, 'nu').replace(/ね/g, 'ne').replace(/の/g, 'no')
    .replace(/は/g, 'ha').replace(/ひ/g, 'hi').replace(/ふ/g, 'fu').replace(/へ/g, 'he').replace(/ほ/g, 'ho')
    .replace(/ば/g, 'ba').replace(/び/g, 'bi').replace(/ぶ/g, 'bu').replace(/べ/g, 'be').replace(/ぼ/g, 'bo')
    .replace(/ぱ/g, 'pa').replace(/ぴ/g, 'pi').replace(/ぷ/g, 'pu').replace(/ぺ/g, 'pe').replace(/ぽ/g, 'po')
    .replace(/ま/g, 'ma').replace(/み/g, 'mi').replace(/む/g, 'mu').replace(/め/g, 'me').replace(/も/g, 'mo')
    .replace(/や/g, 'ya').replace(/ゆ/g, 'yu').replace(/よ/g, 'yo')
    .replace(/ら/g, 'ra').replace(/り/g, 'ri').replace(/る/g, 'ru').replace(/れ/g, 're').replace(/ろ/g, 'ro')
    .replace(/わ/g, 'wa').replace(/を/g, 'wo').replace(/ん/g, 'n')
    // 残りの日本語文字を除去
    .replace(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '')
    // その他の特殊文字を除去
    .replace(/[^\w\s-]/g, '')
    // 複数のスペースを単一のハイフンに変換
    .replace(/[\s_-]+/g, '-')
    // 先頭と末尾のハイフンを除去
    .replace(/^-+|-+$/g, '');

  // 空の場合は基本IDを生成
  if (!slug) {
    slug = 'heading';
  }

  // 重複チェックと番号付け
  let finalSlug = slug;
  let counter = 1;
  while (usedIds.has(finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }
  
  usedIds.add(finalSlug);
  return finalSlug;
}

const remarkToc: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const toc: TocItem[] = [];
    const usedIds = new Set<string>();
    
    // 見出しを収集してIDを付与
    visit(tree, 'heading', (node: Heading) => {
      const text = toString(node);
      const id = slugify(text, usedIds);
      
      // デバッグ用ログ出力（本番環境では無効化）
      // console.log(`Heading: "${text}" -> ID: "${id}"`);
      
      // 見出しにIDを追加
      if (!node.data) {
        node.data = {};
      }
      if (!node.data.hProperties) {
        node.data.hProperties = {};
      }
      (node.data.hProperties as Record<string, unknown>).id = id;
      
      // TOCアイテムを追加
      toc.push({
        id,
        text,
        level: node.depth
      });
    });
    
    // TOCが存在する場合、最初の見出しの前にTOCを挿入
    if (toc.length > 0) {
      // TOCのHTMLを生成
      const tocHtml = generateTocHtml(toc);
      
      // HTMLノードとして挿入
      const tocNode = {
        type: 'html' as const,
        value: tocHtml
      };
      
      // 最初の見出しのインデックスを見つける
      let firstHeadingIndex = -1;
      for (let i = 0; i < tree.children.length; i++) {
        if (tree.children[i].type === 'heading') {
          firstHeadingIndex = i;
          break;
        }
      }
      
      // 最初の見出しの前にTOCを挿入
      if (firstHeadingIndex >= 0) {
        tree.children.splice(firstHeadingIndex, 0, tocNode);
      } else {
        // 見出しがない場合は先頭に挿入
        tree.children.unshift(tocNode);
      }
    }
  };
};

function generateTocHtml(toc: TocItem[]): string {
  const tocItems = toc.map(item => {
    const indent = '  '.repeat(Math.max(0, item.level - 2)); // h2を基準にインデント
    const icon = getTocIcon(item.level);
    return `${indent}<li class="toc-item toc-level-${item.level}">
${indent}  <a href="#${item.id}" class="toc-link" onclick="smoothScrollToElement('${item.id}'); return false;">
${indent}    <span class="toc-icon">${icon}</span>
${indent}    <span class="toc-text">${item.text}</span>
${indent}  </a>
${indent}</li>`;
  }).join('\n');

  return `<div class="table-of-contents">
  <div class="toc-header">
    <span class="toc-title">Contents</span>
    <button class="toc-toggle" onclick="this.parentElement.parentElement.classList.toggle('collapsed')">Hide</button>
  </div>
  <ul class="toc-list">
${tocItems}
  </ul>
</div>

<script>
function smoothScrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}
</script>

<style>
.table-of-contents {
  background: #FFF3E8;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin: 24px 0;
  font-size: 14px;
}

.toc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #dee2e6;
}

.toc-title {
  font-weight: 600;
  color: #495057;
  font-size: 16px;
}

.toc-toggle {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.toc-toggle:hover {
  background-color: #e9ecef;
}

.table-of-contents.collapsed .toc-list {
  display: none;
}

.table-of-contents.collapsed .toc-toggle::after {
  content: "Show";
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin: 4px 0;
}

.toc-link {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  text-decoration: none;
  color: #495057;
  border-radius: 4px;
  transition: all 0.2s;
}

.toc-link:hover {
  background-color: #e9ecef;
  color: #212529;
  text-decoration: none;
}

.toc-icon {
  margin-right: 8px;
  font-size: 12px;
  width: 16px;
  display: inline-block;
}

.toc-text {
  flex: 1;
}

.toc-level-2 .toc-link {
  padding-left: 8px;
  font-weight: 500;
}

.toc-level-3 .toc-link {
  padding-left: 24px;
  font-size: 13px;
}

.toc-level-4 .toc-link {
  padding-left: 40px;
  font-size: 12px;
  color: #6c757d;
}

.toc-level-5 .toc-link,
.toc-level-6 .toc-link {
  padding-left: 56px;
  font-size: 12px;
  color: #6c757d;
}

/* スムーススクロール */
html {
  scroll-behavior: smooth;
}

/* アンカーリンクのオフセット調整 */
h2[id], h3[id], h4[id], h5[id], h6[id] {
  scroll-margin-top: 20px;
}
</style>`;
}

function getTocIcon(level: number): string {
  switch (level) {
    case 2: return '📋';
    case 3: return '📝';
    case 4: return '▶';
    case 5: return '•';
    case 6: return '◦';
    default: return '•';
  }
}

export default remarkToc;
