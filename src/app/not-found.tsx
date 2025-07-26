import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--foreground)',
      textAlign: 'center',
      padding: 32,
    }}>
      <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16, color: 'var(--main-red)' }}>
        ページが存在しません！
      </div>
      <Image
        src="/404-suten.png"
        alt="ページが存在しません"
        width={320}
        height={240}
        style={{ width: '320px', maxWidth: '90vw', borderRadius: 12, height: 'auto' }}
        unoptimized
      />
      <p style={{ fontSize: '1.2rem', marginBottom: 32, color: 'var(--main-red)', fontWeight: 600 }}>
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link href="/" style={{
        display: 'inline-block',
        background: '#2b1a10',
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
