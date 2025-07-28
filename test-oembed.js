// oEmbed APIのテストスクリプト
async function testOEmbed() {
  console.log('🧪 oEmbed APIテスト開始');
  
  // テスト用のツイートID（Jack Dorseyの最初のツイート）
  const tweetId = '20';
  const oembedUrl = `https://publish.twitter.com/oembed?url=https://x.com/jack/status/${tweetId}&omit_script=true`;
  
  console.log('🔗 テスト URL:', oembedUrl);
  
  try {
    const response = await fetch(oembedUrl);
    console.log('📊 レスポンス状態:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error('❌ API エラー:', response.status);
      return;
    }
    
    const data = await response.json();
    console.log('✅ 取得成功！');
    console.log('📋 完全なレスポンス:', JSON.stringify(data, null, 2));
    
    // 重要な情報を抽出
    console.log('\n📊 重要な情報:');
    console.log('作者名:', data.author_name);
    console.log('作者URL:', data.author_url);
    console.log('HTML長:', data.html?.length || 0);
    console.log('プロバイダー:', data.provider_name);
    
    if (data.html) {
      console.log('\n📝 HTML内容:');
      console.log(data.html);
      
      // テキスト抽出テスト
      const pMatch = data.html.match(/<p[^>]*>([\s\S]*?)<\/p>/);
      console.log('\n🔍 p要素マッチ:', pMatch ? 'あり' : 'なし');
      if (pMatch) {
        console.log('p要素内容:', pMatch[1]);
      }
      
      const blockquoteMatch = data.html.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/);
      console.log('blockquote要素マッチ:', blockquoteMatch ? 'あり' : 'なし');
    }
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

// 複数のツイートをテスト
async function testMultipleTweets() {
  const testTweets = [
    '20', // Jack Dorseyの最初のツイート
    '1949791711452115084', // ユーザーが提供した正しいツイートID
  ];
  
  for (const tweetId of testTweets) {
    console.log(`\n🧪 ツイートID ${tweetId} をテスト中...`);
    const oembedUrl = `https://publish.twitter.com/oembed?url=https://x.com/x/status/${tweetId}&omit_script=true`;
    
    try {
      const response = await fetch(oembedUrl);
      console.log(`📊 ${tweetId}: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${tweetId}: データ取得成功`);
        console.log(`📋 ${tweetId}: 作者 = ${data.author_name}`);
        console.log(`📏 ${tweetId}: HTML長 = ${data.html?.length || 0}`);
        
        if (data.html && data.html.includes('このツイートの内容を表示するには')) {
          console.log(`⚠️ ${tweetId}: 制限されたコンテンツ`);
        } else if (data.html) {
          console.log(`✅ ${tweetId}: 実際のコンテンツあり`);
        }
      }
    } catch (error) {
      console.error(`❌ ${tweetId}: エラー`, error.message);
    }
  }
}

// 実行
testOEmbed().then(() => {
  console.log('\n' + '='.repeat(50));
  return testMultipleTweets();
});
