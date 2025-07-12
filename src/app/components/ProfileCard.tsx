import Image from 'next/image';
import React from 'react';

const ProfileCard = () => {
  return (
    <section style={{
      marginTop: 32,
      marginBottom: 32,
      background: '#fff',
      color: '#333',
      border: '1px solid #e0e0e0',
      borderRadius: 12,
      boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
      maxWidth: 540,
      marginLeft: 'auto',
      marginRight: 'auto',
    }}>
      <div style={{ width: '100%' }}>
  <div style={{
    fontWeight: 'bold',
    fontSize: '1.18em',
    background: '#4e342e', // タイトル部分だけ濃い茶色
    color: '#fff3e0',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: '12px 0 16px 0',
    textAlign: 'center',
    letterSpacing: '0.1em',
    marginBottom: 18,
  }}>
    プロフィール
  </div>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
    <Image
      src="/character.png"
      alt="プロフィールイラスト"
      width={240}
      height={240}
      style={{ borderRadius: '50%', background: '#f2f2f2', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
      unoptimized
    />
    <a
      href="https://x.com/fight_fantasyy"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        margin: '12px 0',
        textDecoration: 'none',
        color: '#1da1f2',
        fontWeight: 600,
        fontSize: '1.05em',
      }}
    >
      {/* XのロゴSVG */}
      <svg width="22" height="22" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
          <path d="M925.6 0H1117.8L712.6 521.8L1200 1227H830.8L539.1 815.6L207.5 1227H15.1L443.7 668.7L0 0H377.2L636.2 371.7L925.6 0ZM864.2 1103.7H964.2L314.7 117.3H207.9L864.2 1103.7Z" fill="#222"/>
        </g>
      </svg>
      <span>@fight_fantasyy</span>
    </a>
    <div style={{ fontSize: '1.1em', color: '#333', fontWeight: 500, lineHeight: 1.7, textAlign: 'center', padding: '0 28px 28px 28px' }}>
      ファイトファンタジーでは格闘技に関する様々な情報をまとめていきます！
    </div>
  </div>
</div>
    </section>
  );
};

export default ProfileCard;
