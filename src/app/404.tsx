import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--foreground)',
      textAlign: 'center',
      padding: 32,
    }}>
      <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, color: 'var(--main-red)' }}>
        ページが存在しません！
      </div>
      <img
        src="/404-suten.png"
        alt="ページが存在しません"
        style={{ width: '320px', maxWidth: '90vw', marginBottom: 28, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
      />
      <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: 16 }}>404 - ページが見つかりません</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: 32 }}>
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link href="/" style={{
        display: 'inline-block',
        background: 'var(--main-red)',
        color: '#fff',
        padding: '12px 32px',
        borderRadius: 8,
        fontWeight: 600,
        textDecoration: 'none',
        fontSize: '1.1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
      }}>
        トップページへ戻る
      </Link>
    </div>
  );
}
