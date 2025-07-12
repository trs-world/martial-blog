import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
// Google Analytics プロパティID
const PROPERTY_ID = '496524489';

// サービスアカウントキーを環境変数から取得
function getCredentials() {
  const json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!json) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON env not set');
  return JSON.parse(json);
}

export async function GET() {
  try {
    const credentials = getCredentials();
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
    });

    // 直近30日間のPV数上位5件を取得
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [
        { startDate: '30daysAgo', endDate: 'today' },
      ],
      dimensions: [
        { name: 'pagePath' },
        { name: 'pageTitle' },
      ],
      metrics: [
        { name: 'screenPageViews' },
      ],
      orderBys: [
        {
          metric: { metricName: 'screenPageViews' },
          desc: true,
        },
      ],
      limit: 5,
    });

    const articles = response.rows?.map(row => ({
      path: row.dimensionValues?.[0]?.value || '',
      title: row.dimensionValues?.[1]?.value || '',
      pv: Number(row.metricValues?.[0]?.value || 0),
    })) || [];

    return NextResponse.json({ articles });
  } catch (error) {
    // 詳細なエラー情報を出力
    let message = 'Unknown error';
    let stack = '';
    let errorDetail = '';
    if (typeof error === 'object' && error !== null) {
      if ('message' in error && typeof error.message === 'string') message = error.message;
      if ('stack' in error && typeof error.stack === 'string') stack = error.stack;
      try {
        errorDetail = JSON.stringify(error, Object.getOwnPropertyNames(error));
      } catch {
        errorDetail = String(error);
      }
    } else {
      message = String(error);
      errorDetail = String(error);
    }
    console.error('GA4 API error:', error, message, stack);
    // エラー詳細をAPIレスポンスにも含める（デバッグ用。公開時は削除推奨）
    return NextResponse.json({ 
      error: 'Failed to fetch popular articles.', 
      errorDetail,
      message,
      stack
    }, { status: 500 });
  }
}
