// CoffeeBrewingGuide.js
import React, { useState, useEffect } from 'react';

type Instruction = string | (() => string);

interface Step {
  title: string;
  instruction: Instruction;
}



export default function CoffeeBrewingGuide() {
  const [coffeeAmount, setCoffeeAmount] = useState('');
  const [waterAmount, setWaterAmount] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [tasteVariant, setTasteVariant] = useState('basic');
  const [strengthVariant, setStrengthVariant] = useState('normal');
  const [pourAmounts, setPourAmounts] = useState([]);

  const presetAmounts = [20, 10, 30];

  const tasteVariants = {
    basic: { name: 'ベーシック', first: 60, second: 60, description: 'バランスの取れた味わい' },
    sweet: { name: 'より甘く', first: 50, second: 70, description: '1投目を少なくすることで、より甘い味わいに' },
    bright: { name: 'より明るく', first: 70, second: 50, description: '1投目を多くすることで、より明るい味わいに' }
  };

  const strengthVariants = {
    light: { name: '薄く', steps: [180, 0, 0], description: '残り60%を1回で注ぎ、薄めの味わいに' },
    normal: { name: '普通', steps: [60, 60, 60], description: '残り60%を3回に分けて注ぎ、バランスの取れた濃さに' },
    strong: { name: '濃く', steps: [90, 90, 0], description: '残り60%を2回に分けて注ぎ、濃い味わいに' }
  };

  useEffect(() => {
    if (waterAmount > 0) {
      const tasteWater = waterAmount * 0.4;
      const strengthWater = waterAmount * 0.6;
      const newPourAmounts = [
        Math.round(tasteWater * tasteVariants[tasteVariant].first / 120),
        Math.round(tasteWater * tasteVariants[tasteVariant].second / 120),
        ...strengthVariants[strengthVariant].steps.map(step => Math.round(strengthWater * step / 180))
      ];
      setPourAmounts(newPourAmounts);
    }
  }, [waterAmount, tasteVariant, strengthVariant]);

  const handleStartBrewing = (e) => {
    e.preventDefault();
    const amount = Number(coffeeAmount);
    setWaterAmount(amount * 15);
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleReset = () => {
    setCoffeeAmount('');
    setWaterAmount(0);
    setCurrentStep(0);
    setPourAmounts([]);
  };

  const handlePresetClick = (amount) => {
    setCoffeeAmount(amount.toString());
  };

  const steps: Step[] = [
    { 
      title: '準備', 
      instruction: () => `
        以下の道具を用意してください：
        - ドリッパー
        - ペーパーフィルター
        - サーバー
        - ${coffeeAmount}gのコーヒー豆（中粗挽き～粗挽き）
        - ${waterAmount}gのお湯（浅煎りは93℃前後、中煎りは88℃前後、深煎りは83℃前後）
        - スケール
        - ケトル（できれば細口）
        
        準備ができたら、「調理開始」ボタンを押してください。
      `
    },
    { 
      title: '1回目の注湯 (味わいの調整)', 
      instruction: () => `${pourAmounts[0]}gのお湯を注ぎます。これは総湯量の40%のうちの最初の注湯です。${tasteVariants[tasteVariant].description}`
    },
    { 
      title: '2回目の注湯 (味わいの調整)', 
      instruction: () => `${pourAmounts[1]}gのお湯を注ぎます。これで味わいの調整（総湯量の40%）が完了します。`
    },
    { 
      title: '3回目の注湯 (濃度の調整)', 
      instruction: () => `${pourAmounts[2]}gのお湯を注ぎます。これから濃度の調整（残りの60%）を行います。${strengthVariants[strengthVariant].description}`
    },
    { 
      title: '4回目の注湯 (濃度の調整)', 
      instruction: () => `${pourAmounts[3]}gのお湯を注ぎます。`
    },
    { 
      title: '5回目の注湯 (濃度の調整)', 
      instruction: () => `${pourAmounts[4]}gのお湯を注ぎます。`
    },
    { 
      title: '完成', 
      instruction: 'ドリッパーを外し、コーヒーをお楽しみください。4:6メソッドにより、あなたの好みに合わせた味わいと濃さのコーヒーが完成しました。'
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">4:6メソッド コーヒー抽出ガイド</h1>
      {currentStep === 0 ? (
        <form onSubmit={handleStartBrewing} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              味わいバリエーション (最初の40%の調整)
            </label>
            <select
              value={tasteVariant}
              onChange={(e) => setTasteVariant(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {Object.entries(tasteVariants).map(([key, { name }]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-600">{tasteVariants[tasteVariant].description}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              濃さバリエーション (残りの60%の調整)
            </label>
            <select
              value={strengthVariant}
              onChange={(e) => setStrengthVariant(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {Object.entries(strengthVariants).map(([key, { name }]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-600">{strengthVariants[strengthVariant].description}</p>
          </div>
          <div className="mb-4">
            <label htmlFor="coffeeAmount" className="block text-gray-700 font-bold mb-2">
              コーヒー粉の量 (g)
            </label>
            <div className="flex items-center">
              <input
                type="number"
                id="coffeeAmount"
                value={coffeeAmount}
                onChange={(e) => setCoffeeAmount(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                required
                min="1"
              />
              <div className="flex space-x-2">
                {presetAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handlePresetClick(amount)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-3 rounded"
                  >
                    {amount}g
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-600">お湯の量は自動的にコーヒー粉の15倍に設定されます。</p>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            抽出開始
          </button>
        </form>
      ) : (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-blue-800">抽出ステップ</h2>
          <div className="mb-4 p-3 bg-blue-100 rounded">
            <p className="font-semibold">コーヒー粉: {coffeeAmount}g</p>
            <p className="font-semibold">お湯: {waterAmount}g</p>
            <p>味わい: {tasteVariants[tasteVariant].name}</p>
            <p>濃さ: {strengthVariants[strengthVariant].name}</p>
          </div>
          <div className="mb-6 bg-gray-100 p-4 rounded">
            <h3 className="font-bold text-lg mb-2">{steps[currentStep - 1].title}</h3>
            <p className="whitespace-pre-line">{typeof steps[currentStep - 1].instruction === 'function' ? steps[currentStep - 1].instruction() : steps[currentStep - 1].instruction}</p>
          </div>
          <div className="flex justify-between">
            {currentStep > 1 && (
              <button
                onClick={handlePreviousStep}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                前のステップ
              </button>
            )}
            {currentStep < steps.length ? (
              <button
                onClick={handleNextStep}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {currentStep === 1 ? '調理開始' : '次のステップ'}
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                最初からやり直す
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}