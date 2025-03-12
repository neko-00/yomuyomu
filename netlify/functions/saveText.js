// netlify/functions/saveText.js

const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event, context) => {
  try {
    // 1. フロントエンドから送られてきたテキストを取り出す
    const data = JSON.parse(event.body);
    const inputText = data.text;

    // 2. FaunaDB クライアントを作成 (環境変数からキーを取得)
    //    ※ 後ほど Netlify の管理画面で FAUNA_SECRET を設定します
    const client = new faunadb.Client({
      secret: process.env.FAUNA_SECRET
    });

    // 3. texts コレクションにデータを保存する
    //   - 一例として "singleton" という固定IDを使い、毎回上書きする想定
    //   - ID を自動生成させたいなら q.Create(...) を使って新規文書を作成します
    await client.query(
      q.Replace(
        q.Ref(q.Collection('texts'), 'singleton-id'),
        { data: { text: inputText } }
      )
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Text saved successfully.' })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save text.' })
    };
  }
};
