// netlify/functions/getText.js

const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event, context) => {
  try {
    // 1. FaunaDB クライアントを作成
    const client = new faunadb.Client({
      secret: process.env.FAUNA_SECRET
    });

    // 2. "singleton-id" というドキュメントを取得
    const result = await client.query(
      q.Get(q.Ref(q.Collection('texts'), 'singleton-id'))
    );

    // 3. テキストをレスポンスとして返す
    return {
      statusCode: 200,
      body: JSON.stringify({ text: result.data.text })
    };
  } catch (err) {
    console.error(err);
    // データがまだ存在しない場合などもここに来る
    return {
      statusCode: 200, // エラーでも空文書として返す
      body: JSON.stringify({ text: '' })
    };
  }
};
