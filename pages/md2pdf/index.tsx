// pages/md2pdf.tsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

// ReactMarkdownをラップする新しいコンポーネント

const MarkdownPreview: React.FC<{ content: string }> = ({ content }) => {
return (
    (ReactMarkdown as any)({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeRaw, rehypeSanitize],
      children: content
    })
  );
};

const MarkdownToPDFConverter: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isConverting, setIsConverting] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setMarkdown(content);
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'text/markdown': ['.md'] } });

  const handleConvert = async () => {
    setIsConverting(true);
    try {
      const response = await fetch('/api/md2pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markdown }),
      });

      if (!response.ok) {
        throw new Error('PDF conversion failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'converted.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error converting to PDF:', error);
      alert('Failed to convert to PDF. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Markdown to PDF Converter</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Upload Markdown File</h2>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed p-4 rounded ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            {fileName ? (
              <p>Uploaded file: {fileName}</p>
            ) : (
              <p>Drag 'n' drop a Markdown file here, or click to select one</p>
            )}
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
            onClick={handleConvert}
            disabled={!markdown || isConverting}
          >
            {isConverting ? 'Converting...' : 'Convert to PDF'}
          </button>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Preview</h2>
          <div className="border border-gray-300 rounded p-4 prose">
            <MarkdownPreview content={markdown} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownToPDFConverter;