import { useState, useRef, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { useDropzone } from 'react-dropzone';

const IconPngPage = () => {
  const [selectedSize, setSelectedSize] = useState('128');
  const [imageUrl, setImageUrl] = useState('');
  const [originalImage, setOriginalImage] = useState(null);
  const canvasRef = useRef(null);

  const convertToCircular = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        resizeImage(img, parseInt(selectedSize));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, [selectedSize]);

  const resizeImage = (img, size) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const scale = Math.max(size / img.width, size / img.height);
    const x = (size - img.width * scale) / 2;
    const y = (size - img.height * scale) / 2;

    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    ctx.restore();

    setImageUrl(canvas.toDataURL('image/png'));
  };

  useEffect(() => {
    if (originalImage) {
      resizeImage(originalImage, parseInt(selectedSize));
    }
  }, [selectedSize, originalImage]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      convertToCircular(acceptedFiles[0]);
    }
  }, [convertToCircular]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  const sizeOptions = ['16', '32', '64', '128', '256'];

  const resetImage = () => {
    setImageUrl('');
    setOriginalImage(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Head>
        <title>円形画像コンバーター</title>
      </Head>
      <main className="flex flex-col items-center">
        <div 
          {...getRootProps()} 
          className={`w-full h-96 border-4 border-dashed p-4 mb-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          {imageUrl ? (
            <div className="relative" style={{width: `${selectedSize}px`, height: `${selectedSize}px`}}>
              <img 
                src={imageUrl} 
                alt="Converted" 
                className="max-w-full max-h-full object-contain"
                width={selectedSize}
                height={selectedSize}
              />
            </div>
          ) : isDragActive ? (
            <p className="text-blue-500 text-center">画像をドロップしてください...</p>
          ) : (
            <p className="text-gray-500 text-center">クリックして画像を選択するか、<br />ここにドラッグ＆ドロップしてください</p>
          )}
        </div>
        <div className="flex justify-center space-x-4 mb-6">
          {sizeOptions.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 rounded ${
                selectedSize === size
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {size}x{size}
            </button>
          ))}
        </div>
        <div className="flex space-x-4">
          {imageUrl && (
            <>
              <a
                href={imageUrl}
                download={`circular_image_${selectedSize}x${selectedSize}.png`}
                className="inline-block px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                ダウンロード
              </a>
              <button
                onClick={resetImage}
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                リセット
              </button>
            </>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </main>
    </div>
  );
}

export default IconPngPage;