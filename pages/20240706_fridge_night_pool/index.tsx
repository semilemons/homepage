import React, { useState, useEffect } from 'react';
import { GetStaticProps, NextPage } from 'next';
import fs from 'fs';
import path from 'path';

// 型定義
interface CharacterData {
  id: number;
  name: string;
  romanizedName: string;
}

interface SourceData {
  metadata: {
    content: string;
    version: string;
    lastUpdated: string;
  };
  characters: CharacterData[];
}

// カスタムフック
const usePromptGenerator = (
  selectedSource: string,
  character: string,
  additionalPrompt: string
) => {
  const [positivePrompt, setPositivePrompt] = useState('');
  const negativePrompt = "(worst quality:1.4), (low quality:1.4), (monochrome:1.3), (bad anatomy, bad hands:1.4), (watermark, username:1.2), lowres, text, error, missing fingers, extra digit, fewer digits, cropped, normal quality, jpeg artifacts,";
  const options = {
    steps: "28",
    cfgScale: "7",
    sampler: "Euler",
    aspectRatio: "704x1408"
  };

  useEffect(() => {
    let prompt = `1 girl,{{${character}, ${selectedSource}}}, {wet bra, navel, wet panties}, luxury, night bool, in pool, bust focus, {{pastel pale tone skin}}, {{{smooth illustration,intricate silky hair,very aesthetic.amazing quality}}}`;
    if (additionalPrompt) {
      prompt += `, ${additionalPrompt}`;
    }
    setPositivePrompt(prompt);
  }, [selectedSource, character, additionalPrompt]);

  return { positivePrompt, negativePrompt, options };
};

// メインコンポーネント
const ImagePromptCopyApp: NextPage<{ sources: SourceData[] }> = ({ sources }) => {
  const [selectedSource, setSelectedSource] = useState<string>(sources[0]?.metadata.content || '');
  const [character, setCharacter] = useState<string>('');
  const [additionalPrompt, setAdditionalPrompt] = useState<string>('');
  const [copiedItem, setCopiedItem] = useState<string>('');

  const { positivePrompt, negativePrompt, options } = usePromptGenerator(
    selectedSource,
    character,
    additionalPrompt
  );

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(type);
      setTimeout(() => setCopiedItem(''), 2000);
    } catch (err) {
      console.error('コピーに失敗しました:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">冷蔵庫ナイトプール_プロンプトコピー</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">ポジティブプロンプト</h2>
            <div 
              className="bg-gray-100 p-4 rounded cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => handleCopy(positivePrompt, 'positive')}
            >
              {positivePrompt}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">ネガティブプロンプト</h2>
            <div 
              className="bg-gray-100 p-4 rounded cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => handleCopy(negativePrompt, 'negative')}
            >
              {negativePrompt}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">その他のオプション</h2>
            {Object.entries(options).map(([key, value]) => (
              <div
                key={key}
                className="bg-gray-100 p-2 rounded mb-2 cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleCopy(value, key)}
              >
                {key === 'cfgScale' ? '正確度' :
                 key === 'steps' ? 'ステップ' :
                 key === 'sampler' ? 'サンプラ' :
                 '画像比率'}: {value}
              </div>
            ))}
          </div>
        </div>
        <div className="md:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">キャラクター設定</h2>
            <label className="block mb-4">
              <span className="text-gray-700">出典元:</span>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
              >
                {sources.map((source, index) => (
                  <option key={index} value={source.metadata.content}>
                    {source.metadata.content}
                  </option>
                ))}
              </select>
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">キャラクター名:</span>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
                onClick={() => {
                  const selectedCharacter = sources.find(source => source.metadata.content === selectedSource)?.characters.find(char => char.romanizedName === character);
                  if (selectedCharacter) {
                    navigator.clipboard.writeText(selectedCharacter.name);
                  }
                }}
              >
                {sources.find(source => source.metadata.content === selectedSource)?.characters.map((char) => (
                  <option key={char.id} value={char.romanizedName}>
                    {char.name} ({char.romanizedName})
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">追加プロンプト</h2>
            <textarea
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={additionalPrompt}
              onChange={(e) => setAdditionalPrompt(e.target.value)}
              placeholder="追加のプロンプトを入力（オプション）"
              rows={4}
            />
          </div>
        </div>
      </div>
      {copiedItem && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-black bg-opacity-50 text-white px-6 py-3 rounded-lg">
            {copiedItem}をコピーしました！
          </div>
        </div>
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const currentDir = path.join(process.cwd(), 'pages', '20240706_fridge_night_pool');
    const fileNames = fs.readdirSync(currentDir).filter(file => file.endsWith('.json'));
    
    const sources = fileNames.map(fileName => {
      const filePath = path.join(currentDir, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContents);
    });

    return {
      props: {
        sources,
      },
    };
  } catch (error) {
    console.error('Error reading JSON files:', error);
    return { props: { sources: [] } };
  }
};

export default ImagePromptCopyApp;