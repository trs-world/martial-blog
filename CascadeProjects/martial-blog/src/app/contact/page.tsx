'use client';
import React, { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    // APIルートに送信
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setError('送信に失敗しました。しばらくしてから再度お試しください。');
      }
    } catch (err) {
      setStatus('error');
      setError('送信中にエラーが発生しました。');
    }
  };

  return (
    <main style={{ maxWidth: 480, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 10, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
      <h1 style={{ textAlign: 'center', color: '#b71c1c', marginBottom: 24 }}>お問い合わせ</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="name" style={{ fontWeight: 'bold' }}>お名前 <span style={{ color: '#b71c1c' }}>*</span></label>
          <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 6 }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="email" style={{ fontWeight: 'bold' }}>メールアドレス <span style={{ color: '#b71c1c' }}>*</span></label>
          <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 6 }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="subject" style={{ fontWeight: 'bold' }}>題名</label>
          <input type="text" id="subject" name="subject" value={form.subject} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 6 }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label htmlFor="message" style={{ fontWeight: 'bold' }}>メッセージ本文</label>
          <textarea id="message" name="message" value={form.message} onChange={handleChange} rows={6} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 6, resize: 'vertical' }} />
        </div>
        {error && <div style={{ color: '#b71c1c', marginBottom: 16 }}>{error}</div>}
        {status === 'success' && <div style={{ color: '#388e3c', marginBottom: 16 }}>送信が完了しました。ありがとうございました！</div>}
        <button type="submit" disabled={status === 'sending'} style={{ width: '100%', background: '#b71c1c', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: 6, padding: 12, fontSize: '1.1em', cursor: status === 'sending' ? 'not-allowed' : 'pointer' }}>
          {status === 'sending' ? '送信中...' : '送信する'}
        </button>
      </form>
    </main>
  );
}
