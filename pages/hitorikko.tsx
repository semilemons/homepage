import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Menu, X, Settings, Send, Paperclip, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

const CompleteChatSimulator = () => {
  const [messages, setMessages] = useState([]);
  const [leftInput, setLeftInput] = useState('');
  const [rightInput, setRightInput] = useState('');
  const [activeInput, setActiveInput] = useState('right');
  const [partnerName, setPartnerName] = useState('相手');
  const [context, setContext] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFileLoaded, setIsFileLoaded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!createdAt) {
      setCreatedAt(new Date().toISOString());
    }
    setUpdatedAt(new Date().toISOString());
  }, [messages, partnerName, context]);

  useEffect(() => {
    if (isFileLoaded) {
      const timer = setTimeout(() => {
        setIsFileLoaded(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isFileLoaded]);

  const handleSendMessage = (sender, isSpecial = false) => {
    const inputMessage = sender === 'left' ? leftInput : rightInput;
    if (inputMessage.trim() !== '') {
      const now = new Date().toISOString();
      const messageText = isSpecial ? `{{{${inputMessage}}}}` : inputMessage;
      setMessages([...messages, { 
        id: `msg_${Date.now()}`,
        text: messageText, 
        sender, 
        timestamp: now
      }]);
      if (sender === 'left') {
        setLeftInput('');
      } else {
        setRightInput('');
      }
    }
  };

  const handleKeyPress = (e, sender) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSendMessage(sender);
    }
  };

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('ja-JP', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const handleSave = () => {
    const data = JSON.stringify({
      version: "1.0",
      metadata: {
        partnerName,
        context,
        createdAt,
        updatedAt: new Date().toISOString()
      },
      messages
    }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date();
    const fileName = `${partnerName}_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}_hitorikko.json`;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const loadedData = JSON.parse(e.target.result);
          setMessages(loadedData.messages);
          setPartnerName(loadedData.metadata.partnerName);
          setContext(loadedData.metadata.context);
          setCreatedAt(loadedData.metadata.createdAt);
          setUpdatedAt(loadedData.metadata.updatedAt);
          setIsFileLoaded(true);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length) {
      handleLoad(files[0]);
    }
  };

  const handleDeleteMessage = (messageId) => {
    setMessageToDelete(messageId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (messageToDelete) {
      setMessages(messages.filter(msg => msg.id !== messageToDelete));
      setMessageToDelete(null);
    }
    setShowDeleteConfirm(false);
  };

  const renderMessage = (msg) => (
    <div key={msg.id} className={`mb-4 flex ${msg.sender === 'right' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${msg.sender === 'right' ? 'order-2' : 'order-1'}`}>
        <div className={`text-sm mb-1 ${msg.sender === 'right' ? 'text-right text-blue-600' : 'text-left text-red-600'}`}>
          {msg.sender === 'right' ? '自分' : partnerName}
        </div>
        <div className="bg-white p-3 rounded-lg shadow-md relative group">
          {msg.text}
          <button 
            onClick={() => handleDeleteMessage(msg.id)} 
            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <div className={`text-xs mt-1 text-gray-500 ${msg.sender === 'right' ? 'text-right' : 'text-left'}`}>
          {formatTimestamp(msg.timestamp)}
        </div>
      </div>
    </div>
  );

  const renderInputArea = (side) => {
    const isLeft = side === 'left';
    const input = isLeft ? leftInput : rightInput;
    const setInput = isLeft ? setLeftInput : setRightInput;

    return (
      <div className={`flex-1 ${isLeft ? 'mr-2' : 'ml-2'}`}>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => handleKeyPress(e, side)}
          onFocus={() => setActiveInput(side)}
          placeholder={isLeft ? `${partnerName}のメッセージ...` : "自分のメッセージ..."}
          className="mb-2 h-24 text-lg resize-none"
        />
        <div className="flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={() => handleSendMessage(side, true)} 
                className="mr-2 bg-purple-500 hover:bg-purple-600 h-12 text-lg flex items-center justify-center"
              >
                <Paperclip className="mr-1" size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>特殊な形式で送信 {'{{{...}}}'}</p>
            </TooltipContent>
          </Tooltip>
          <Button 
            onClick={() => handleSendMessage(side)} 
            className={`flex-grow h-12 text-lg flex items-center justify-center ${isLeft ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            <Send className="mr-2" size={20} />
            {isLeft ? `${partnerName}として送信` : '自分として送信'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div 
        className="flex flex-col h-screen relative"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <nav className="bg-gray-800 text-white p-4 z-10">
          <div className="container mx-auto flex justify-between items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-2xl">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
            <h1 className="text-xl font-bold">チャットシミュレーター</h1>
            <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="text-2xl">
              <Settings />
            </button>
          </div>
        </nav>
        <div className="flex-grow flex relative overflow-hidden">
          {isMenuOpen && (
            <div className="w-64 bg-gray-200 p-4 overflow-y-auto transition-all duration-300 ease-in-out">
              <h2 className="text-lg font-bold mb-4">メニュー</h2>
              <Button onClick={handleSave} className="w-full mb-2 bg-green-500 hover:bg-green-600">
                保存
              </Button>
              <Button onClick={() => fileInputRef.current.click()} className="w-full bg-yellow-500 hover:bg-yellow-600">
                読み込み
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleLoad(e.target.files[0])}
                style={{ display: 'none' }}
                accept=".json"
              />
            </div>
          )}
          <div className="flex-grow bg-gray-100 overflow-auto" ref={chatContainerRef}>
            <Card className="min-h-full bg-gray-100 border-none">
              <CardContent className="p-4">
                {messages.map(renderMessage)}
              </CardContent>
            </Card>
          </div>
          {isSettingsOpen && (
            <div className="absolute top-0 right-0 bottom-0 w-64 bg-gray-200 p-4 overflow-y-auto transition-all duration-300 ease-in-out transform translate-x-0 shadow-lg animate-slide-in">
              <h2 className="text-lg font-bold mb-4">チャット設定</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">相手の名前</label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">ツール</label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>
            </div>
          )}
          {isFileLoaded && (
            <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2 transition-opacity duration-500 z-50">
              ファイルが正常に読み込まれました
            </div>
          )}
        </div>
        <div className="p-4 bg-white border-t flex flex-row">
          {renderInputArea('left')}
          {renderInputArea('right')}
        </div>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">メッセージを削除しますか？</h2>
              <p className="mb-6">この操作は取り消せません。本当にこのメッセージを削除しますか？</p>
              <div className="flex justify-end">
                <Button onClick={() => setShowDeleteConfirm(false)} className="mr-2">
                  キャンセル
                </Button>
                <Button onClick={confirmDelete} variant="destructive">
                  削除
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default CompleteChatSimulator;