import React, { useState, useMemo, useEffect } from 'react';

const generateHash = (index) => {
  // 固定の文字列を返す
  return `${index.toString().padStart(16, '0')}`;
};

const createSampleData = () => {
  return [
    { id: 1, createdAt: '2024-07-01T10:30', productId: generateHash(1), seller: '山田太郎', status: '発送済み' },
    { id: 2, createdAt: '2024-07-01T14:45', productId: generateHash(2), seller: '鈴木一郎', status: '処理中' },
    { id: 3, createdAt: '2024-07-02T09:15', productId: generateHash(3), seller: '高橋三郎', status: '準備中' },
    { id: 4, createdAt: '2024-07-02T16:20', productId: generateHash(4), seller: '田中次郎', status: '発送済み' },
    { id: 5, createdAt: '2024-07-03T11:00', productId: generateHash(5), seller: '佐藤花子', status: '処理中' },
    { id: 6, createdAt: '2024-07-03T15:30', productId: generateHash(6), seller: '山田太郎', status: '準備中' },
    { id: 7, createdAt: '2024-07-04T08:45', productId: generateHash(7), seller: '鈴木一郎', status: '発送済み' },
    { id: 8, createdAt: '2024-07-04T13:10', productId: generateHash(8), seller: '高橋三郎', status: '処理中' },
    { id: 9, createdAt: '2024-07-05T10:20', productId: generateHash(9), seller: '田中次郎', status: '準備中' },
    { id: 10, createdAt: '2024-07-05T14:55', productId: generateHash(10), seller: '佐藤花子', status: '発送済み' },
    { id: 11, createdAt: '2024-07-06T09:30', productId: generateHash(11), seller: '山田太郎', status: '処理中' },
    { id: 12, createdAt: '2024-07-06T16:40', productId: generateHash(12), seller: '鈴木一郎', status: '準備中' },
    { id: 13, createdAt: '2024-07-07T11:25', productId: generateHash(13), seller: '高橋三郎', status: '発送済み' },
    { id: 14, createdAt: '2024-07-07T15:15', productId: generateHash(14), seller: '田中次郎', status: '処理中' },
    { id: 15, createdAt: '2024-07-08T10:05', productId: generateHash(15), seller: '佐藤花子', status: '準備中' },
  ];
};

const IntegratedInvoiceManagement = () => {
  const [sortOrder, setSortOrder] = useState('desc');
  const [sellerFilter, setSellerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sampleData, setSampleData] = useState([]);

  useEffect(() => {
    setSampleData(createSampleData());
  }, []);

  const sellers = useMemo(() => [...new Set(sampleData.map(item => item.seller))], [sampleData]);
  const statuses = useMemo(() => [...new Set(sampleData.map(item => item.status))], [sampleData]);

  const filteredAndSortedData = useMemo(() => {
    return [...sampleData]
      .filter(item => sellerFilter ? item.seller === sellerFilter : true)
      .filter(item => statusFilter ? item.status === statusFilter : true)
      .sort((a, b) => {
        const aTimestamp = new Date(a.createdAt).getTime();
        const bTimestamp = new Date(b.createdAt).getTime();
        return sortOrder === 'desc' 
          ? bTimestamp - aTimestamp
          : aTimestamp - bTimestamp;
      });
  }, [sampleData, sortOrder, sellerFilter, statusFilter]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/\//g, '/');
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  if (sampleData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">統合伝票管理システム</h1>
      
      <div className="mb-4 flex space-x-4">
        <select
          className="block w-1/4 bg-white border border-gray-300 rounded-md py-2 px-3 text-sm"
          value={sellerFilter}
          onChange={(e) => setSellerFilter(e.target.value)}
        >
          <option value="">全ての出品者</option>
          {sellers.map(seller => (
            <option key={seller} value={seller}>{seller}</option>
          ))}
        </select>
        
        <select
          className="block w-1/4 bg-white border border-gray-300 rounded-md py-2 px-3 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">全てのステータス</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={toggleSortOrder}>
                伝票作成日時 {sortOrder === 'desc' ? '▼' : '▲'}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">出品者</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">処理ステータス</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.createdAt)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    {item.productId}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.seller}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.status === '発送済み' ? 'bg-green-100 text-green-800' :
                    item.status === '処理中' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IntegratedInvoiceManagement;