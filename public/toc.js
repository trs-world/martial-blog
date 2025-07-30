// 目次のスムーススクロール機能
function smoothScrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    // スムーススクロール
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    
    // URLのハッシュを更新（ページ遷移は発生しない）
    if (history.replaceState) {
      history.replaceState(null, null, '#' + elementId);
    }
  }
  return false;
}

// より確実なイベントリスナー設定
function initializeTocEvents() {
  // 目次リンクにクリックイベントを追加
  const tocLinks = document.querySelectorAll('.toc-link');
  console.log('Found TOC links:', tocLinks.length);
  
  tocLinks.forEach(function(link) {
    // 既存のイベントリスナーを削除
    link.removeEventListener('click', handleTocClick);
    // 新しいイベントリスナーを追加
    link.addEventListener('click', handleTocClick, true);
  });
  
  // 目次の折りたたみ機能
  const tocToggle = document.querySelector('.toc-toggle');
  if (tocToggle) {
    tocToggle.addEventListener('click', function() {
      const toc = this.closest('.table-of-contents');
      if (toc) {
        toc.classList.toggle('collapsed');
        this.textContent = toc.classList.contains('collapsed') ? 'Show' : 'Hide';
      }
    });
  }
}

// 目次リンククリックのハンドラー
function handleTocClick(e) {
  console.log('TOC link clicked:', e.target);
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  
  const href = this.getAttribute('href');
  if (href && href.startsWith('#')) {
    const elementId = href.substring(1);
    console.log('Scrolling to:', elementId);
    smoothScrollToElement(elementId);
  }
  return false;
}

// DOMContentLoadedでイベントリスナーを追加
document.addEventListener('DOMContentLoaded', initializeTocEvents);

// ページが完全に読み込まれた後にも再実行
window.addEventListener('load', initializeTocEvents);

// MutationObserverで動的に追加された目次も監視
if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasTocContent = addedNodes.some(node => 
          node.nodeType === Node.ELEMENT_NODE && 
          (node.classList?.contains('table-of-contents') || 
           node.querySelector?.('.table-of-contents'))
        );
        if (hasTocContent) {
          setTimeout(initializeTocEvents, 100);
        }
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// グローバル関数として定義（インラインonclickでも使用可能）
window.smoothScrollToElement = smoothScrollToElement;
