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
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, justifyContent: 'center' }}>
    <Image
      src="/character.png"
      alt="プロフィールイラスト"
      width={240}
      height={240}
      style={{ borderRadius: '50%', background: '#f2f2f2', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
      unoptimized
    />
    <div style={{ fontSize: '1.1em', color: '#333', fontWeight: 500, lineHeight: 1.7, textAlign: 'center', padding: 28 }}>
      ファイトファンタジーでは格闘技に関する様々な情報をまとめていきます！
    </div>
  </div>
</div>
    </section>
  );
};

export default ProfileCard;
