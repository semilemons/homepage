import React, { useState } from 'react';

const TextDownloadApp = () => {
  const [text, setText] = useState('');

  const handleDownload = () => {
    const date = new Date();
    const fileName = date.getFullYear() +
                     ('0' + (date.getMonth() + 1)).slice(-2) +
                     ('0' + date.getDate()).slice(-2) +
                     ('0' + date.getHours()).slice(-2) +
                     ('0' + date.getMinutes()).slice(-2) +
                     ('0' + date.getSeconds()).slice(-2) + '.txt';

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
      padding: '1.5rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 6px 9px rgba(0, 0, 0, 0.1)',
        padding: '2.25rem'
      }}>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>テキストダウンローダー</h1>
        <textarea
          style={{
            width: '100%',
            height: '240px',
            marginBottom: '1.5rem',
            padding: '0.75rem',
            border: '1.5px solid #ccc',
            borderRadius: '6px',
            resize: 'vertical',
            fontSize: '1.1rem'
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="ここにテキストを入力してください..."
        />
        <button 
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: text.trim() ? '#4CAF50' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: text.trim() ? 'pointer' : 'not-allowed',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}
          onClick={handleDownload}
          disabled={!text.trim()}
        >
          ダウンロード
        </button>
      </div>
    </div>
  );
};

export default TextDownloadApp;
