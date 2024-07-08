import React, { useState, useEffect } from 'react';


const ImagePromptCopyApp = () => {
  const [copiedItem, setCopiedItem] = useState('');
  const [character, setCharacter] = useState('');
  const [positivePrompt, setPositivePrompt] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const [sources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState('');
  const [characters, setCharacters] = useState([]);
  const [allData, setAllData] = useState([]);
  const [customSource, setCustomSource] = useState('');
  const [customCharacter, setCustomCharacter] = useState('');
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [copiedCharacter, setCopiedCharacter] = useState('');

  console.log(copiedCharacter)
  
  const negativePrompt = "(worst quality:1.4), (low quality:1.4), (monochrome:1.3), (bad anatomy, bad hands:1.4), (watermark, username:1.2), lowres, text, error, missing fingers, extra digit, fewer digits, cropped, normal quality, jpeg artifacts,";
  const options = {
    steps: "28",
    cfgScale: "7",
    sampler: "Euler",
    aspectRatio: "704x1408"
  };

  useEffect(() => {
    const importAll = (r) => r.keys().map(r);
    const jsonFiles = importAll(require.context('./', false, /\.json$/));

    Promise.all(jsonFiles.map(file => file.default || file)).then(data => {
      const validData = data.filter(item => item.metadata && item.metadata.content);
      
      const uniqueData = validData.reduce((acc, current) => {
        const x = acc.find(item => item.metadata.content === current.metadata.content);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      
      setAllData(uniqueData);

      const uniqueSources = [...new Set(uniqueData.map(item => item.metadata.content))];
      setSources([...uniqueSources, 'カスタム']);

      if (uniqueSources.length > 0) {
        setSelectedSource(uniqueSources[0]);
        const selectedData = uniqueData.find(item => item.metadata.content === uniqueSources[0]);
        if (selectedData) {
          setCharacters(selectedData.characters);
          setCharacter(selectedData.characters[0].romanizedName);
        }
      }
    });
  }, []);

  useEffect(() => {
    updatePositivePrompt();
  }, [character, selectedSource, customSource, customCharacter, additionalPrompt]);

  const updatePositivePrompt = () => {
    const sourceToUse = selectedSource === 'カスタム' ? customSource : selectedSource;
    const characterToUse = selectedSource === 'カスタム' ? customCharacter : character;
    let prompt = `1 girl,{{${characterToUse}, ${sourceToUse}}}, {wet bra, navel, wet panties}, luxury, night bool, in pool, bust focus, {{pastel pale tone skin}}, {{{smooth illustration,intricate silky hair,very aesthetic.amazing quality}}}`;
    if (additionalPrompt) {
      prompt += `, ${additionalPrompt}`;
    }
    setPositivePrompt(prompt);
  };

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(type);
      setShowOverlay(true);
      setTimeout(() => {
        setShowOverlay(false);
        setCopiedItem('');
      }, 2000);
    } catch (err) {
      console.error('コピーに失敗しました:', err);
    }
  };

  const handleSourceChange = (e) => {
    const newSource = e.target.value;
    setSelectedSource(newSource);
    if (newSource !== 'カスタム') {
      const selectedData = allData.find(item => item.metadata.content === newSource);
      if (selectedData) {
        setCharacters(selectedData.characters);
        setCharacter(selectedData.characters[0].romanizedName);
      }
    } else {
      setCustomSource('');
      setCustomCharacter('');
    }
  };

  const handleCharacterChange = (e) => {
    setCharacter(e.target.value);
  };

  const handleCopyCharacterName = (name) => {
    navigator.clipboard.writeText(name).then(() => {
      setCopiedCharacter(name);
      setTimeout(() => setCopiedCharacter(''), 2000);
    }).catch(err => {
      console.error('キャラクター名のコピーに失敗しました:', err);
    });
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f0f0f0',
      display: 'flex',
      position: 'relative',
    },
    leftSection: {
      flex: '2',
      marginRight: '20px',
    },
    rightSection: {
      flex: '1',
    },
    header: {
      textAlign: 'center' as const, // ここを修正
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
      wordBreak: 'break-all' as const, // ここを修正
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
    select: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      backgroundColor: 'white',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      backgroundColor: 'white',
    },
    textarea: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      backgroundColor: 'white',
      minHeight: '100px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      color: '#444',
    },
    overlay: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      zIndex: 1000,
      textAlign: 'center' as const, // ここを修正
      fontSize: '18px',
      fontWeight: 'bold',
    },
    copyButton: {
      backgroundColor: '#4CAF50',
      border: 'none',
      color: 'white',
      padding: '10px 15px',
      textAlign: 'center' as const, // ここを修正
      textDecoration: 'none',
      display: 'inline-block',
      fontSize: '14px',
      margin: '4px 2px',
      cursor: 'pointer',
      borderRadius: '4px',
    },
  };

  return (
    <div style={styles.container}>
      {showOverlay && (
        <div style={styles.overlay}>
          {copiedItem === 'positive' ? 'ポジティブプロンプト' : 
           copiedItem === 'negative' ? 'ネガティブプロンプト' : 
           copiedItem === 'steps' ? 'ステップ' :
           copiedItem === 'cfgScale' ? '正確度' :
           copiedItem === 'sampler' ? 'サンプラ' :
           copiedItem === 'aspectRatio' ? '画像比率' : 'オプション'}
          をコピーしました！
        </div>
      )}
      <div style={styles.leftSection}>
        <h1 style={styles.header}>冷蔵庫ナイトプール_プロンプトコピー</h1>
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
          <div style={styles.copyableText}
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
      </div>

      <div style={styles.rightSection}>
        <div style={styles.section}>
          <h2 style={styles.sectionHeader}>キャラクター設定</h2>
          <label style={styles.label}>
            出典元:
            <select 
              style={styles.select}
              value={selectedSource}
              onChange={handleSourceChange}
            >
              {sources.map((source, index) => (
                <option key={index} value={source}>{source}</option>
              ))}
            </select>
          </label>
          {selectedSource === 'カスタム' ? (
            <>
              <label style={styles.label}>
                カスタム出典元:
                <input
                  style={styles.input}
                  type="text"
                  value={customSource}
                  onChange={(e) => setCustomSource(e.target.value)}
                  placeholder="カスタム出典元を入力"
                />
              </label>
              <label style={styles.label}>
                カスタムキャラクター名:
                <input
                  style={styles.input}
                  type="text"
                  value={customCharacter}
                  onChange={(e) => setCustomCharacter(e.target.value)}
                  placeholder="カスタムキャラクター名を入力"
                />
              </label>
            </>
          ) : (
            <label style={styles.label}>
            キャラクター名:
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <select 
                style={{ ...styles.select, flexGrow: 1, marginRight: '10px' }}
                value={character}
                onChange={handleCharacterChange}
              >
                {characters.map((char) => (
                  <option key={char.id} value={char.romanizedName}>
                    {char.name} ({char.romanizedName})
                  </option>
                ))}
              </select>
              <button 
                style={styles.copyButton}
                onClick={() => {
                  const selectedChar = characters.find(char => char.romanizedName === character);
                  if (selectedChar) {
                    handleCopyCharacterName(selectedChar.name);
                  }
                }}
              >
                コピー
              </button>
            </div>
          </label>
          )}
        </div>
        <div style={styles.section}>
          <h2 style={styles.sectionHeader}>追加プロンプト</h2>
          <label style={styles.label}>
            追加のプロンプト:
            <textarea
              style={styles.textarea}
              value={additionalPrompt}
              onChange={(e) => setAdditionalPrompt(e.target.value)}
              placeholder="追加のプロンプトを入力（オプション）"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ImagePromptCopyApp;