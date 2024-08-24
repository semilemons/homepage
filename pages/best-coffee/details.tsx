import React from 'react';
import Link from 'next/link';

const DetailsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">4:6メソッド - コーヒー抽出の革命</h1>
        <p className="text-xl font-bold mb-4 text-center text-blue-800">
          <Link href="https://philocoffea.com/" className="hover:underline">
            詳細リンク
          </Link>
        </p>


        

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4:6メソッドとは</h2>
          <p className="mb-4">
            4:6メソッドは、World Brewers Cup 2016で世界チャンピオンとなった粕谷哲氏が考案した革新的なハンドドリップ方法です。
            このメソッドは、「誰でも簡単に美味しいコーヒーを淹れられる」というコンセプトから生まれ、世界中のコーヒー愛好家に支持されています。
          </p>
          <p>
            従来のような複雑な技術ではなく、注ぐお湯の量という「数字」で味を調整できる点が特徴です。
            これにより、初心者でも簡単に、そして再現性高く美味しいコーヒーを淹れることができるのです。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">必要な道具</h2>
          <ul className="list-disc list-inside mb-4">
            <li>ドリッパー</li>
            <li>ペーパーフィルター</li>
            <li>サーバー</li>
            <li>スケール</li>
            <li>ケトル（細口がおすすめ）</li>
          </ul>
          <p>グラインダーがあるとさらに良いでしょう。新鮮な豆を挽くことで、より豊かな風味を楽しめます。</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4:6メソッドの基本</h2>
          <ol className="list-decimal list-inside mb-4">
            <li className="mb-2">コーヒー粉量の15倍のお湯を用意します。（例：粉20gなら湯300g）</li>
            <li className="mb-2">総湯量を4:6の比率で分割します。（例：300gなら120gと180g）</li>
            <li className="mb-2">最初の40%（120g）で味わいを調整します。</li>
            <li className="mb-2">残りの60%（180g）で濃度を調整します。</li>
          </ol>
          <p>
            この方法により、酸味と甘みのバランス、そして濃さを簡単に調整できます。
            粗挽きの豆を使用することで、きれいで複雑な味わいを引き出すことができるのも特徴です。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">抽出手順の例（粉20gの場合）</h2>
          <ol className="list-decimal list-inside mb-4">
            <li className="mb-2">0:00 - 60gのお湯を注ぐ</li>
            <li className="mb-2">0:45 - さらに60gのお湯を注ぐ</li>
            <li className="mb-2">1:30 - 60gのお湯を注ぐ</li>
            <li className="mb-2">2:15 - 60gのお湯を注ぐ</li>
            <li className="mb-2">2:45 - 最後の60gのお湯を注ぐ</li>
            <li className="mb-2">3:30 - ドリッパーを外す</li>
          </ol>
          <p>
            各ステップでお湯が落ち切ってから次を注ぐのがコツです。
            これにより、粗挽きでもしっかりとした濃さが得られます。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">カスタマイズのヒント</h2>
          <ul className="list-disc list-inside mb-4">
            <li className="mb-2">
              <strong>味わいの調整：</strong> 最初の40%で1回目と2回目の注ぐ量を変えることで、
              甘さや明るさを調整できます。1回目を少なくすると甘く、多くすると明るい味わいに。
            </li>
            <li className="mb-2">
              <strong>濃さの調整：</strong> 残りの60%を1回で注げば薄く、2回なら濃く、
              3回ならさらに濃くなります。好みの濃さを見つけましょう。
            </li>
            <li className="mb-2">
              <strong>豆の挽き方：</strong> 基本は中粗挽き〜粗挽きですが、
              細かく挽けば濃く、粗く挽けば薄くなります。
            </li>
          </ul>
        </section>

        <p className="mb-8">
          4:6メソッドは、あくまでもコーヒー抽出を考える上でのプラットフォームです。
          この方法を基本としつつ、自分好みにアレンジして、
          あなただけの最高のコーヒーの淹れ方を見つけてください。
        </p>

        <div className="mt-8">
          <Link href="/best-coffee">
            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              抽出ガイドに戻る
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;