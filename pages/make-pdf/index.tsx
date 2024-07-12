// pages/make-pdf/index.tsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    if (acceptedFiles.length > 0 && title === '') {
      setTitle(acceptedFiles[0].name.replace(/\.[^/.]+$/, ""));
    }
  }, [title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif']
    },
    maxSize: 32 * 1024 * 1024,
    maxFiles: 200,
  });

  const removeFile = (file: File) => {
    setFiles(prevFiles => prevFiles.filter(f => f !== file));
  };



  const handleSaveAsPdf = async () => {
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('title', title || "無題");
    files.forEach(file => formData.append('files', file));

    try {
      const response = await fetch('/api/convert-to-pdf', {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        // エラーレスポンスの場合
        const errorData = await response.json();
        throw new Error(errorData.details || 'PDF creation failed');
      } else if (contentType && contentType.indexOf("application/pdf") !== -1) {
        // 成功レスポンスの場合
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${title || 'document'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

        setToastMessage({
          type: 'success',
          message: "PDFが正常に作成され、ダウンロードが開始されました。"
        });
        setFiles([]);
        setTitle('');
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error:', error);
      setToastMessage({
        type: 'error',
        message: `PDFの作成に失敗しました: ${error.message}`
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">画像をPDFに変換</h1>
      <div className="space-y-6">
        {files.length === 0 && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            <p>画像をドラッグ＆ドロップするか、クリックして選択</p>
            <p className="text-sm text-gray-500 mt-2">
              JPEG / PNG / GIF<br />
              1枚32MB以内、最大200枚（合計200MB以内まで）
            </p>
          </div>
        )}

        {files.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-40 object-cover rounded"
                />
                <button
                  onClick={() => removeFile(file)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  ✕
                </button>
                <p className="text-sm truncate mt-1">{file.name}</p>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">PDFのタイトル</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={32}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="PDFのタイトルを入力"
            />
            <p className="text-sm text-gray-500 mt-1">{title.length}/32</p>
          </div>

          <button
            onClick={handleSaveAsPdf}
            disabled={files.length === 0 || isProcessing}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'PDFを作成中...' : 'PDFとして保存'}
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md ${
          toastMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {toastMessage.message}
        </div>
      )}
    </div>
  );
}