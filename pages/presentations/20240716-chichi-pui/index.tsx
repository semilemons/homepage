// pages/presentation.tsx
import React from 'react';
import { NextPage } from 'next';
import { Users, TrendingUp, Target, DollarSign, Award, ChevronRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

const Presentation: NextPage = () => {
  const renderSlide = (content: React.ReactNode, className?: string) => (
    <div className={`bg-gradient-to-br from-purple-100 to-indigo-200 p-8 rounded-lg shadow-lg mb-8 ${className}`}>
      {content}
    </div>
  );

  const renderIconWithText = (Icon: LucideIcon, text: string) => (
    <div className="flex items-center mb-4">
      {React.createElement(Icon as React.ComponentType<{ size?: number; className?: string }>, { size: 24, className: "text-indigo-600 mr-2" })}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {renderSlide(
        <div className="flex flex-col justify-center h-[70vh]">
          <h1 className="text-4xl font-bold mb-4 text-indigo-800">Chichipui</h1>
          <h2 className="text-2xl mb-8 text-indigo-600">AIアートの未来を創造する</h2>
          <p className="text-xl">概念段階ビジネスプラン</p>
        </div>,
        'text-center'
      )}
      
      {renderSlide(
        <div className="flex flex-col justify-center h-[70vh]">
          <h2 className="text-2xl font-bold mb-6 text-indigo-800">ビジョン</h2>
          <p className="text-xl mb-4">AIが生成したイラストやグラビア画像に特化した投稿・共有プラットフォームを提供し、AIアーティストとファンを繋ぐコミュニティを構築する。</p>
          <div className="w-full h-40 bg-gray-300 flex items-center justify-center">
            [AIアートのサンプル画像]
          </div>
        </div>
      )}

      {renderSlide(
        <div className="flex flex-col justify-center h-[70vh]">
          <h2 className="text-2xl font-bold mb-6 text-indigo-800">解決する問題</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>AIアーティストの作品展示場所の不足</li>
            <li>一般ユーザーのAIアート創造・共有機会の不足</li>
            <li>AIアート専門プラットフォームの欠如</li>
          </ul>
        </div>
      )}

      {renderSlide(
        <div className="flex flex-col justify-center h-[70vh]">
          <h2 className="text-2xl font-bold mb-6 text-indigo-800">ソリューション</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold mb-2">AIイラスト投稿・共有</h3>
              <p>専門プラットフォーム</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold mb-2">AI画像生成機能</h3>
              <p>ユーザーフレンドリーなツール</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold mb-2">クリエイター支援</h3>
              <p>収益化とファン獲得サポート</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold mb-2">コミュニティ機能</h3>
              <p>AIアート愛好家の交流促進</p>
            </div>
          </div>
        </div>
      )}

      {renderSlide(
        <div className="flex flex-col justify-center h-[70vh]">
          <h2 className="text-2xl font-bold mb-6 text-indigo-800">市場機会</h2>
          {renderIconWithText(TrendingUp, "グローバルAIアート市場：2025年までに10億ドル規模")}
          {renderIconWithText(Target, "年間成長率：50%以上")}
          <div className="w-full h-40 bg-gray-300 flex items-center justify-center mt-4">
            [市場成長予測グラフ]
          </div>
        </div>
      )}

      {renderSlide(
        <div className="flex flex-col justify-center h-[70vh]">
          <h2 className="text-2xl font-bold mb-6 text-indigo-800">ビジネスモデル</h2>
          {renderIconWithText(DollarSign, "広告収入")}
          {renderIconWithText(Users, "プレミアム会員サービス（月額制）")}
          {renderIconWithText(Target, "AI画像生成機能の有料利用")}
          {renderIconWithText(Award, "クリエイター支援プラットフォーム（FANBOX型）")}
        </div>
      )}

      {renderSlide(
        <div className="flex flex-col justify-center h-[70vh]">
          <h2 className="text-2xl font-bold mb-6 text-indigo-800">チーム</h2>
          <div className="flex flex-col md:flex-row justify-around">
            <div className="text-center mb-4 md:mb-0">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-2"></div>
              <h3 className="font-bold">山田太郎</h3>
              <p>CEO, 元AIエンジニア</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-2"></div>
              <h3 className="font-bold">鈴木花子</h3>
              <p>CTO, AI研究者</p>
            </div>
          </div>
        </div>
      )}

      {renderSlide(
        <div className="flex flex-col justify-center h-[70vh]">
          <h2 className="text-2xl font-bold mb-6 text-indigo-800">次のステップ</h2>
          <ul className="space-y-2">
            {[
              "MVPの開発と初期ユーザーテスト",
              "AIアーティストとの提携交渉",
              "初期マーケティング戦略の立案と実行",
              "シード資金の調達"
            ].map((step, index) => (
              <li key={index} className="flex items-center">
                {React.createElement(ChevronRight as React.ComponentType<{ size?: number; className?: string }>, { size: 20, className: "text-indigo-600 mr-2" })}
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {renderSlide(
        <div className="flex flex-col justify-center h-[70vh]">
          <h2 className="text-3xl font-bold mb-6 text-indigo-800">ご清聴ありがとうございました</h2>
          <p className="text-xl mb-4">一緒にAIアートの未来を創造しましょう</p>
          <p>お問い合わせ: info@chichipui.com</p>
        </div>,
        'text-center'
      )}
    </div>
  );
};

export default Presentation;