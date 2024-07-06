import React, { useState, useEffect } from 'react';

const ImagePromptCopyApp = () => {
  const [copiedItem, setCopiedItem] = useState('');
  const [character, setCharacter] = useState('tanaka mamimi');
  const [source, setSource] = useState('idolmaster shiny colors');
  const [positivePrompt, setPositivePrompt] = useState('');
  
  const negativePrompt = "(worst quality:1.4), (low quality:1.4), (monochrome:1.3), (bad anatomy, bad hands:1.4), (watermark, username:1.2), lowres, text, error, missing fingers, extra digit, fewer digits, cropped, normal quality, jpeg artifacts,";
  const options = {
    steps: "28",
    cfgScale: "7",
    sampler: "Euler",
    aspectRatio: "704x1408"
  };

  useEffect(() => {
    updatePositivePrompt();
  }, [character, source]);

  const updatePositivePrompt = () => {
    setPositivePrompt(`1 girl,{{${character}, ${source}}}, {wet bra, navel, wet panties}, luxury, night bool, in pool, bust focus, {{pastel pale tone skin}}, {{{smooth illustration,intricate silky hair,very aesthetic.amazing quality}}},`);
  };

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(type);
      setTimeout(() => setCopiedItem(''), 2000);
    } catch (err) {
      console.error('コピーに失敗しました:', err);
    }
  };

  const handleCharacterChange = (e) => {
    setCharacter(e.target.value);
  };

  const handleSourceChange = (e) => {
    setSource(e.target.value);
  };

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f0f0f0',
      display: 'flex',
    },
    leftSection: {
      flex: '2',
      marginRight: '20px',
    },
    rightSection: {
      flex: '1',
    },
    header: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '20px',
    },
    section: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '20px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    sectionHeader: {
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#444',
    },
    copyableText: {
      backgroundColor: '#e9e9e9',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '10px',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    optionItem: {
      cursor: 'pointer',
      padding: '5px',
      margin: '5px 0',
      backgroundColor: '#f0f0f0',
      borderRadius: '4px',
      transition: 'background-color 0.3s',
    },
    message: {
      color: 'green',
      fontWeight: 'bold',
      marginTop: '10px',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      color: '#444',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftSection}>
        <h1 style={styles.header}>AI画像生成プロンプトコピーアプリ</h1>
        
        <div style={styles.section}>
          <h2 style={styles.sectionHeader}>ポジティブプロンプト</h2>
          <div 
            style={styles.copyableText} 
            onClick={() => handleCopy(positivePrompt, 'positive')}
          >
            {positivePrompt}
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionHeader}>ネガティブプロンプト</h2>
          <div 
            style={styles.copyableText}
            onClick={() => handleCopy(negativePrompt, 'negative')}
          >
            {negativePrompt}
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionHeader}>その他のオプション</h2>
          {Object.entries(options).map(([key, value]) => (
            <div
              key={key}
              style={styles.optionItem}
              onClick={() => handleCopy(value, key)}
            >
              {key === 'cfgScale' ? '正確度' : 
               key === 'steps' ? 'ステップ' : 
               key === 'sampler' ? 'サンプラ' : 
               '画像比率'}: {value}
            </div>
          ))}
        </div>

        {copiedItem && (
          <div style={styles.message}>
            {copiedItem === 'positive' ? 'ポジティブプロンプト' : 
             copiedItem === 'negative' ? 'ネガティブプロンプト' : 
             copiedItem === 'steps' ? 'ステップ' :
             copiedItem === 'cfgScale' ? '正確度' :
             copiedItem === 'sampler' ? 'サンプラ' :
             copiedItem === 'aspectRatio' ? '画像比率' : 'オプション'}
            をコピーしました！
          </div>
        )}
      </div>

      <div style={styles.rightSection}>
        <div style={styles.section}>
          <h2 style={styles.sectionHeader}>キャラクター設定</h2>
          <label style={styles.label}>
            キャラクター名:
            <input 
              style={styles.input}
              type="text" 
              value={character}
              onChange={handleCharacterChange}
            />
          </label>
          <label style={styles.label}>
            出典元:
            <input 
              style={styles.input}
              type="text" 
              value={source}
              onChange={handleSourceChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ImagePromptCopyApp;