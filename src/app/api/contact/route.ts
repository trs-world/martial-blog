export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';

// nodemailerなどを使ってメール送信
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  // 必須チェック
  if (!name || !email) {
    return NextResponse.json({ error: 'お名前とメールアドレスは必須です。' }, { status: 400 });
  }

  // 送信先メールアドレス（あなたのアドレスに変更してください）
  const to = 'trs1141@yahoo.co.jp'; // ←ここを自分のアドレスに変更！

  // nodemailer設定例（Yahooメールの場合）
  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.co.jp',
    port: 465,
    secure: true,
    auth: {
      user: process.env.YAHOO_USER,
      pass: process.env.YAHOO_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.YAHOO_USER,
      to,
      subject: subject || 'お問い合わせ',
      text: `お名前: ${name}\nメール: ${email}\n題名: ${subject}\n\n${message}`,
      replyTo: email,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('メール送信エラー:', err);
    return NextResponse.json({ error: 'メール送信に失敗しました。' }, { status: 500 });
  }
}
