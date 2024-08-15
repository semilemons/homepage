import React from 'react';
import Link from 'next/link';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const BuddhismSciencePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">仏教の帰納法的アプローチと科学的整合性</h1>
      
      <Section title="仏教の経験主義的基盤">
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>釈迦の教えの起源：</strong> 個人的な経験と観察に基づく</li>
          <li><strong>帰納法的アプローチ：</strong> 個別の観察から一般的な原理を導出</li>
          <li><strong>実践の重視：</strong> 「来て、見て、試してみよ」（エーヒパッシコ）の姿勢</li>
        </ul>
      </Section>

      <Section title="科学との整合性">
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>因果関係の重視：</strong> 縁起説と系統的思考の類似性</li>
          <li><strong>実証主義的アプローチ：</strong> 個人の経験と検証の重視</li>
          <li><strong>心理学との親和性：</strong> 現代心理学研究との一致点</li>
          <li><strong>非二元論的世界観：</strong> 量子力学の解釈との類似性</li>
          <li><strong>可塑性と適応性：</strong> 新しい科学的発見への開放性</li>
        </ul>
      </Section>

      <Section title="現代の科学者による評価">
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>物理学者との対話：</strong> ダライ・ラマ14世と量子物理学者の対話</li>
          <li><strong>脳科学研究：</strong> 瞑想の効果に関する科学的裏付け</li>
          <li><strong>心理療法への応用：</strong> マインドフルネスベースの認知療法（MBCT）の開発</li>
        </ul>
      </Section>

      <Section title="結論">
        <p className="text-gray-700">
          仏教の教えの多くは、直接的な経験と観察に基づく帰納法的アプローチを取っており、
          現代の科学的方法と多くの共通点を持っています。このため、仏教の教えは科学的な知見と
          矛盾せず、むしろ整合性を持っています。この特徴は、仏教が長い歴史を持ちながらも、
          現代においてなお妥当性と重要性を保ち続けている理由の一つと言えるでしょう。
        </p>
      </Section>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">さらなる探求のために</h3>
        <p className="text-gray-700">
          仏教と科学の関係についてより詳しく知りたい方は、以下の書籍やリソースを参考にしてください：
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>『The Universe in a Single Atom』 by ダライ・ラマ14世</li>
          <li>『仏教と現代物理学』 by フリッチョフ・カプラ</li>
          <li>『マインドフルネスストレス低減法』 by ジョン・カバットジン</li>
        </ul>
      </div>


      <Link href="/buddhism">
      <a className="mt-8 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
        Back
      </a>
    </Link>
    </div>
  );
};

export default BuddhismSciencePage;