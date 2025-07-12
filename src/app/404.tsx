import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '70vh',

        textDecoration: 'none',
        fontSize: '1.1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
      }}>
        トップページへ戻る
      </Link>
    </div>
  );
}
