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
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 12px rgba(0, 0, 0, 0.1)',
        padding: '3rem'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>.txtダウンローダー</h1>
        <textarea
          style={{
            width: '100%',
            height: '320px',
            marginBottom: '2rem',
            padding: '1rem',
            border: '2px solid #ccc',
            borderRadius: '8px',
            resize: 'vertical',
            fontSize: '1.25rem'
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="ここにテキストを入力してください..."
        />
        <button 
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: text.trim() ? '#4CAF50' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: text.trim() ? 'pointer' : 'not-allowed',
            fontSize: '1.5rem',
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