import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Package, Vault, Gamepad2, Bell, BarChart3 } from 'lucide-react';
import { mockDashboardStats, mockCases, mockArbitrage, mockAnnouncements } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { LoadingPage } from '@/components/LoadingPage';
import { api_case, api_index } from '@/utils/request';
import { getSkinsById, getSkinsNameById, getTimeDiffText } from '@/utils/utils';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const [indexData, setIndexData] = useState<any>({});
  const [cases, setCases] = useState<any>([]);
  useEffect(() => {
    const load = async () => {
      try {
        const data= await api_index()
        setIndexData(data?.data);
        console.log(data?.data)
        const cs = await api_case();
        setCases(cs?.data);
      } catch (err) {
        console.error("请求失败:", err);
      }
    };

    load();
  }, []);
  if (!indexData?.skins) {
    return (
      <LoadingPage/>
    );
  }
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/market?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  const quickActions = [
    {
      icon: TrendingUp,
      label: '查看市场',
      path: '/market',
      color: 'bg-blue-500'
    },
    {
      icon: Package,
      label: '套利机会',
      path: '/arbitrage',
      color: 'bg-green-500'
    },
    {
      icon: Vault,
      label: '质押收益',
      path: '/vault',
      color: 'bg-purple-500'
    },
    {
      icon: Gamepad2,
      label: '绑定Steam',
      path: '/profile',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header with Search */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="搜索饰品名、箱子名..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button className="p-3 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors">
            <Bell size={20} />
          </button>
        </div>
        
        {/* Welcome Message */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-orange-500">ITEMSHUB</h1>
          <p className="text-gray-300 text-sm mt-1">专业的CS2饰品交易平台</p>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="text-orange-500" size={20} />
          数据概览
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-xs">平均价差</p>
            <p className="text-lg font-bold text-white">+{(indexData.skinsAverageSub*100).toFixed(3)}%</p>
            <p className="text-green-400 text-xs">{indexData.skins.length} 种箱子</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-xs">高价差饰品</p>
            <p className="text-lg font-bold text-orange-500">{indexData.greatProfit}</p>
            <p className="text-green-400 text-xs">↗ 10%+ 价差</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-xs">全网总价差</p>
            <p className="text-lg font-bold text-white">{(indexData.profitRate*100).toFixed(3)}%</p>
            <p className="text-blue-400 text-xs">↗ 高</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-xs">上次更新</p>
            <p className="text-lg font-bold text-green-400">{getTimeDiffText(indexData.lastUpdateTime)}</p>
            {/* <p className="text-green-400 text-xs">↗ 历史高</p> */}
          </div>
        </div>

        {/* Trend Chart */}
        {/* <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">近7日收益趋势</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockDashboardStats.trendData}>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                />
                <YAxis hide />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#FB923C" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div> */}

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">快捷入口</h3>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors text-center"
                >
                  <div className={`${action.color} rounded-lg p-2 inline-flex mb-2`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <p className="text-xs text-gray-300">{action.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hot Cases */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">热门箱子</h3>
          <div className="space-y-3">
            {cases.slice(0, 3).map((caseItem) => (
              <div 
                key={caseItem.id} 
                className="bg-gray-800 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => navigate(`/market/${caseItem.id}`)}
              >
                <img 
                  src={caseItem.img_url} 
                  alt={caseItem.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{caseItem.name}</h4>
                  <p className="text-sm text-gray-400">￥{(getSkinsById(indexData.skins,caseItem.id) ? getSkinsById(indexData.skins,caseItem.id).price*7 : 0  ).toFixed(2)}</p>
                  <p className={`text-xs text-green-400`}>
                     ± {(getSkinsById(indexData.skins,caseItem.id) ? getSkinsById(indexData.skins,caseItem.id).averageSub*100 : 0  ).toFixed(2)}%
                  </p>
                  <p className={`text-xs`}>
                     {(getSkinsById(indexData.skins,caseItem.id) ? getSkinsById(indexData.skins,caseItem.id).offers : 0  ).toFixed(0)} Offers
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hot Arbitrage */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">热门套利</h3>
          <div className="space-y-3">
            {indexData.topSkinSub.map((arbitrage) => (
              <div 
                key={arbitrage.skin.skin}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => navigate(`/arbitrage/${arbitrage.skin.skin}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{getSkinsNameById(cases,arbitrage.skin.skin) ? getSkinsNameById(cases,arbitrage.skin.skin).name : ""}</h4>
                  <span className="text-green-400 text-sm font-medium">
                    +{(arbitrage.skin.averageSub*100).toFixed(3)}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">
                     {arbitrage.from.name} → {arbitrage.to.name}
                  </span>
                  <span className="text-orange-400">
                    ¥ {(arbitrage.skin.averageSub * arbitrage.skin.price*7).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="mb-20">
          <h3 className="text-lg font-semibold mb-4">公告栏</h3>
          <div className="space-y-3">
            {indexData.announce.map((announcement) => (
              <div 
                key={announcement.id}
                className="bg-gray-800 rounded-lg p-4 border-l-4 border-orange-500"
              >
                <h4 className="font-medium text-white mb-1">{announcement.title}</h4>
                <p className="text-sm text-gray-400 mb-2">{announcement.message}</p>
                <p className="text-xs text-gray-500">{(new Date(announcement.timestamp)).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;