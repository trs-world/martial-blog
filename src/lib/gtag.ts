// Google Analytics 4 設定
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Google Analytics が有効かどうかを判定
export const isProduction = process.env.NODE_ENV === 'production';

// ページビューを送信
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID && isProduction) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// イベントを送信
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID && isProduction) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// TypeScript用のグローバル型定義
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}
