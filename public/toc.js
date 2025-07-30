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

// DOMContentLoadedでイベントリスナーを追加
document.addEventListener('DOMContentLoaded', function() {
  // 目次リンクにクリックイベントを追加
  const tocLinks = document.querySelectorAll('.toc-link');
  tocLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        const elementId = href.substring(1);
        smoothScrollToElement(elementId);
      }
      return false;
    });
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
});

// グローバル関数として定義（インラインonclickでも使用可能）
window.smoothScrollToElement = smoothScrollToElement;
