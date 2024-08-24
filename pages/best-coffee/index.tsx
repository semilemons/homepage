import React, { useState, useEffect } from 'react';

interface UserInput {
  coffeeAmount: number;
  tasteVariant: 'basic' | 'sweet' | 'bright';
  strengthVariant: 'light' | 'normal' | 'strong';
  initialScale: number;
}

interface BrewingStep {
  instruction: string;
  pourAmount: number;
  targetScale: number;
}

const tasteVariants = {
  basic: { name: 'ベーシック', firstPour: 60, secondPour: 60 },
  sweet: { name: 'より甘く', firstPour: 50, secondPour: 70 },
  bright: { name: 'より明るく', firstPour: 70, secondPour: 50 },
};

const strengthVariants = {
  light: { name: '薄く', pourSteps: [180] },
  normal: { name: 'より濃く', pourSteps: [90, 90] },
  strong: { name: 'さらに濃く', pourSteps: [60, 60, 60] },
};

const CoffeeBrewingGuide: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput>({
    coffeeAmount: 20,
    tasteVariant: 'basic',
    strengthVariant: 'normal',
    initialScale: 100,
  });
  const [brewingSteps, setBrewingSteps] = useState<BrewingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    calculateBrewingSteps();
  }, );

  const calculateBrewingSteps = () => {
    const { coffeeAmount, tasteVariant, strengthVariant, initialScale } = userInput;
    const totalWater = coffeeAmount * 15;
    const taste = tasteVariants[tasteVariant];
    const strength = strengthVariants[strengthVariant];

    const firstPour = Math.round(totalWater * taste.firstPour / 300);
    const secondPour = Math.round(totalWater * taste.secondPour / 300);

    const steps: BrewingStep[] = [
      {
        instruction: `コーヒー粉${coffeeAmount}gをセットしてください。`,
        pourAmount: 0,
        targetScale: initialScale + coffeeAmount,
      },
      {
        instruction: `${firstPour}gの水を注いでください。`,
        pourAmount: firstPour,
        targetScale: initialScale + coffeeAmount + firstPour,
      },
      {
        instruction: `${secondPour}gの水を注いでください。`,
        pourAmount: secondPour,
        targetScale: initialScale + coffeeAmount + firstPour + secondPour,
      },
    ];

    let currentScale = steps[steps.length - 1].targetScale;
    strength.pourSteps.forEach(pour => { // Removed 'index' as it's not used
      const pourAmount = Math.round(totalWater * pour / 300);
      currentScale += pourAmount;
      steps.push({
        instruction: `${pourAmount}gの水を注いでください。`,
        pourAmount,
        targetScale: currentScale,
      });
    });

    setBrewingSteps(steps);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserInput(prev => ({
      ...prev,
      [name]: name === 'coffeeAmount' || name === 'initialScale' ? Number(value) : value,
    }));
  };

  const handleNextStep = () => {
    if (currentStep < brewingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">4:6メソッド コーヒー抽出ガイド</h1>
      {currentStep === 0 ? (
        <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label htmlFor="coffeeAmount" className="block text-gray-700 font-bold mb-2">
              コーヒー粉の量 (g)
            </label>
            <input
              type="number"
              id="coffeeAmount"
              name="coffeeAmount"
              value={userInput.coffeeAmount}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              min="1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              味わいバリエーション
            </label>
            <select
              name="tasteVariant"
              value={userInput.tasteVariant}
              onChange={handleInputChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {Object.entries(tasteVariants).map(([key, { name }]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              濃さバリエーション
            </label>
            <select
              name="strengthVariant"
              value={userInput.strengthVariant}
              onChange={handleInputChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {Object.entries(strengthVariants).map(([key, { name }]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="initialScale" className="block text-gray-700 font-bold mb-2">
              はかりの初期メモリ (g)
            </label>
            <input
              type="number"
              id="initialScale"
              name="initialScale"
              value={userInput.initialScale}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              min="0"
            />
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
          <h2 className="text-xl font-bold mb-4 text-blue-800">ステップ {currentStep} / {brewingSteps.length - 1}</h2>
          <div className="mb-6 bg-gray-100 p-4 rounded">
            <p className="font-semibold mb-2">{brewingSteps[currentStep].instruction}</p>
            <p className="text-sm">目標の計りの表示: {brewingSteps[currentStep].targetScale}g</p>
          </div>
          <div className="flex justify-between items-center">
            {currentStep > 0 ? (
              <button
                onClick={handlePreviousStep}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                前のステップ
              </button>
            ) : (
              <div></div>
            )}
            {currentStep < brewingSteps.length - 1 ? (
              <button
                onClick={handleNextStep}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                次のステップ
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
};

export default CoffeeBrewingGuide;