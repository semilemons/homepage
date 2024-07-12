import React, { useState, useRef, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { useDropzone } from 'react-dropzone';
import { RotateCcw, RotateCw } from 'lucide-react';

const IconPngPage: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [downloadUrl256, setDownloadUrl256] = useState<string>('');
  const [downloadUrl128, setDownloadUrl128] = useState<string>('');
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const downloadCanvas256Ref = useRef<HTMLCanvasElement>(null);
  const downloadCanvas128Ref = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const convertToCircular = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setPosition({ x: 0, y: 0 });
        setRotation(0);
        setZoom(1);
        resizeImage(img, 256, { x: 0, y: 0 }, 0, 1);
      };
      if (e.target && e.target.result && typeof e.target.result === 'string') {
        img.src = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const resizeImage = (img: HTMLImageElement, size: number, pos: { x: number, y: number }, angle: number, zoomLevel: number) => {
    const canvas = canvasRef.current;
    const downloadCanvas256 = downloadCanvas256Ref.current;
    const downloadCanvas128 = downloadCanvas128Ref.current;
    if (!canvas || !downloadCanvas256 || !downloadCanvas128) return;
    
    const ctx = canvas.getContext('2d');
    const downloadCtx256 = downloadCanvas256.getContext('2d');
    const downloadCtx128 = downloadCanvas128.getContext('2d');
    if (!ctx || !downloadCtx256 || !downloadCtx128) return;

    canvas.width = size;
    canvas.height = size;
    downloadCanvas256.width = 256;
    downloadCanvas256.height = 256;
    downloadCanvas128.width = 128;
    downloadCanvas128.height = 128;

    // Clear the canvases with a transparent background
    ctx.clearRect(0, 0, size, size);
    downloadCtx256.clearRect(0, 0, 256, 256);
    downloadCtx128.clearRect(0, 0, 128, 128);

    const scale = Math.max(size / img.width, size / img.height) * zoomLevel;
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    const x = (size - scaledWidth) / 2 + pos.x;
    const y = (size - scaledHeight) / 2 + pos.y;

    // Function to draw the image with rotation and zoom
    const drawRotatedImage = (context: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number, rotation: number, size: number) => {
      // 一時的なキャンバスを作成
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = size;
      tempCanvas.height = size;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;
    
      // 一時的なキャンバスに画像を描画
      tempCtx.save();
      tempCtx.translate(size / 2, size / 2);
      tempCtx.rotate(rotation * Math.PI / 180);
      tempCtx.translate(-size / 2, -size / 2);
      tempCtx.drawImage(image, x, y, width, height);
      tempCtx.restore();
    
      // メインのコンテキストをクリア
      context.clearRect(0, 0, size, size);
    
      // 円形のパスを作成
      context.beginPath();
      context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
      context.closePath();
    
      // 円形の内側を白で塗りつぶす
      context.fillStyle = '#ffffff';
      context.fill();
    
      // 円形にクリップ
      context.save();
      context.clip();
    
      // 一時的なキャンバスの内容を円形にクリップされた領域に描画
      context.drawImage(tempCanvas, 0, 0, size, size);
    
      // クリッピングをリセット
      context.restore();
    };
    // Draw the circular part for preview
    drawRotatedImage(ctx, img, x, y, scaledWidth, scaledHeight, angle, size);

    // Draw the circular part for 256x256 download
    drawRotatedImage(downloadCtx256, img, x, y, scaledWidth, scaledHeight, angle, 256);


    // Draw the circular part for 128x128 download
    drawRotatedImage(downloadCtx128, img, x / 2, y / 2, scaledWidth / 2, scaledHeight / 2, angle, 128);


    setImageUrl(canvas.toDataURL('image/png'));
    setDownloadUrl256(downloadCanvas256.toDataURL('image/png'));
    setDownloadUrl128(downloadCanvas128.toDataURL('image/png'));
  };

  useEffect(() => {
    if (originalImage) {
      resizeImage(originalImage, 256, position, rotation, zoom);
    }
  }, [originalImage, position, rotation, zoom]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      convertToCircular(acceptedFiles[0]);
    }
  }, [convertToCircular]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    multiple: false,
    disabled: !!imageUrl
  });

  const resetImage = () => {
    setImageUrl('');
    setDownloadUrl256('');
    setDownloadUrl128('');
    setOriginalImage(null);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
    setZoom(1);
  };

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleDragMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const dx = clientX - dragStart.x;
    const dy = clientY - dragStart.y;
    
    // Apply rotation to movement
    const angle = rotation * Math.PI / 180;
    const newX = dx * Math.cos(angle) + dy * Math.sin(angle);
    const newY = -dx * Math.sin(angle) + dy * Math.cos(angle);
    
    setPosition({ x: newX, y: newY });
  };

  const handleDragEnd = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRotation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setRotation(value % 360);
    }
  };

  const handleZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setZoom(value);
    }
  };

  const handleRotate90 = (direction: 'left' | 'right') => {
    setRotation((prevRotation) => {
      const newRotation = direction === 'left' ? prevRotation - 90 : prevRotation + 90;
      return ((newRotation % 360) + 360) % 360; // 常に0-359の範囲に保つ
    });
  };

  // Disable pinch-to-zoom
  useEffect(() => {
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventZoom, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventZoom);
    };
  }, []);

 

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>CircleCrop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <main className="flex flex-col items-center">
        <div className="w-full flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
          <div className="w-[90vw] md:w-[60vh] max-w-3xl mx-auto">
            <div 
              {...(imageUrl ? {} : getRootProps())} 
              className={`w-full aspect-square border-4 border-dashed p-4 mb-6 flex flex-col items-center justify-center ${
                !imageUrl && isDragActive ? 'border-blue-500 bg-blue-50 cursor-pointer' : 'border-gray-300'
              } ${imageUrl ? '' : 'hover:border-gray-400'}`}
            >
              {!imageUrl && <input {...getInputProps()} />}
              {imageUrl ? (
                <div 
                  ref={containerRef}
                  className="relative overflow-hidden rounded-full"
                  style={{width: '100%', height: '100%', maxWidth: '512px', maxHeight: '512px'}}
                  onMouseDown={handleDragStart}
                  onMouseMove={handleDragMove}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                  onTouchStart={handleDragStart}
                  onTouchMove={handleDragMove}
                  onTouchEnd={handleDragEnd}
                >
                  <img 
                    src={imageUrl} 
                    alt="Converted" 
                    className="max-w-none max-h-none w-full h-full object-cover"
                    style={{
                      position: 'absolute',
                      left: '0',
                      top: '0',
                      cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                    draggable={false}
                  />
                </div>
              ) : isDragActive ? (
                <p className="text-blue-500 text-center">画像をドロップしてください...</p>
              ) : (
                <p className="text-gray-500 text-center">クリックして画像を選択するか、<br />ここにドラッグ＆ドロップしてください</p>
              )}
            </div>
            {imageUrl && (
              <div className="w-full flex flex-col items-center mt-4 space-y-4">
                <div className="w-full">
                  <input
                    type="range"
                    id="zoom"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={handleZoom}
                    className="w-full mb-2"
                  />
                  <label htmlFor="zoom" className="text-gray-700">拡大: {zoom.toFixed(1)}x</label>
                </div>
              </div>
            )}
          </div>
          {imageUrl && (
            <div className="flex flex-row md:flex-col items-center md:items-start space-x-4 md:space-x-0 md:space-y-4">
              <div className="flex flex-row md:flex-col items-center space-x-2 md:space-x-0 md:space-y-2">
                <button
                  onClick={() => handleRotate90('left')}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  <RotateCcw size={24} />
                </button>
                <button
                  onClick={() => handleRotate90('right')}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  <RotateCw size={24} />
                </button>
              </div>
              <div className="h-12 md:h-48 flex flex-col items-center">
                <input
                  type="range"
                  id="rotation"
                  min="0"
                  max="359"
                  value={rotation}
                  onChange={handleRotation}
                  className="h-full md:-rotate-90 md:origin-center"
                  style={{ width: '200px', accentColor: '#10B981' }}
                />
                <label htmlFor="rotation" className="text-gray-700 mt-2">{rotation}°</label>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {imageUrl && (
            <>
              <a
                href={downloadUrl256}
                download="256x256.png"
                className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
              >
                256x256.png ダウンロード
              </a>
              <a
                href={downloadUrl128}
                download="128x128.png"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
              >
                128x128.png ダウンロード
              </a>
              <button
                onClick={resetImage}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
              >
                リセット
              </button>
            </>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
        <canvas ref={downloadCanvas256Ref} className="hidden" />
        <canvas ref={downloadCanvas128Ref} className="hidden" />
      </main>
    </div>
  );

}


export default IconPngPage;