import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ExternalLink, BarChart3, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { mockSkins } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { api_case, api_index } from '@/utils/request';
import { LoadingPage } from '@/components/LoadingPage';
import { base32Encode, getSkinsById } from '@/utils/utils';

const SkinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const skin = mockSkins.find(s => s.id === id);
  const [isFavorited, setIsFavorited] = useState(false);

  const [indexData, setIndexData] = useState<any>({});
  const [cases, setCases] = useState<any>([]);
  const [targetSkin, setTargetSkin] = useState<any>({});
  const [arbi, setArbi] = useState<any>({});

  useEffect(() => {
    const load = async () => {
      try {
        const data= await api_index()
        setIndexData(data?.data);
        // console.log(data?.data)
        const cs = await api_case();
        setCases(cs?.data);

        //Search target case 
        for(let i of cs?.data)
        {
          if(i?.id == id?.toLocaleLowerCase())
          {
            const skinData = getSkinsById(data?.data.skins,(id as any));
            i['data'] = skinData

            let arb = {
              to:skinData.data[skinData.data.length-1],
              from : skinData.data[0],
              sub: skinData.data[skinData.data.length-1].price - skinData.data[0].price,
              averageSub:skinData.averageSub
            }
            setArbi(arb)
            setTargetSkin(i);
            console.log(i)
          }
        }
      } catch (err) {
        console.error("请求失败:", err);
      }
    };

    load();
  }, []);
  if (!indexData?.skins || !targetSkin?.data || !targetSkin.data?.price) {
    return (
      <LoadingPage/>
    );
  }

  if (!targetSkin?.data || !targetSkin.data?.price) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-400">饰品不存在</p>
          <button 
            onClick={() => navigate('/market')}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            返回市场
          </button>
        </div>
      </div>
    );
  }

  // // Mock market comparison data
  // const marketComparison = [
  //   { platform: 'Buff163', price: skin.price, change: skin.change24h, volume: 156 },
  //   { platform: 'C5游戏', price: skin.price * 0.98, change: skin.change24h + 0.3, volume: 89 },
  //   { platform: 'Steam Market', price: skin.price * 1.02, change: skin.change24h - 0.2, volume: 67 },
  //   { platform: 'Skinport', price: skin.price * 0.99, change: skin.change24h + 0.1, volume: 123 }
  // ];

  // // Mock price trend data
  // const priceTrendData = Array.from({ length: 30 }, (_, i) => ({
  //   date: `10/${26 - i}`,
  //   price: skin.price + (Math.random() - 0.5) * skin.price * 0.1,
  //   volume: Math.random() * 100 + 50
  // })).reverse();

  const getChangeColor = (change: number) => change >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="bg-gray-800 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-4">
          <button 
            onClick={() => navigate('/market')}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <h1 className="text-lg font-bold">饰品详情</h1>
          {/* <button 
            onClick={() => setIsFavorited(!isFavorited)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Star className={isFavorited ? 'text-orange-500 fill-current' : 'text-gray-400'} size={20} />
          </button> */}
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Skin Image and Basic Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 text-center">
          <div className="w-48 h-48 bg-gray-700 rounded-lg mx-auto mb-4 relative">
            <img 
              src={targetSkin.img_url} 
              alt={targetSkin.name}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute top-2 right-2 bg-black/50 rounded px-2 py-1">
              <span className="text-xs text-white">{targetSkin.offers}</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{targetSkin.name}</h2>
          <p className="text-lg text-gray-400 mb-4">{targetSkin.skin}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* <div>
              <p className="text-sm text-gray-400">稀有度</p>
              <p className="font-medium">{skin.rarity}</p>
            </div> */}
            {/* <div>
              <p className="text-sm text-gray-400">系列</p>
              <p className="font-medium">{skin.collection}</p>
            </div> */}
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-400">当前价格</p>
              <p className="text-2xl font-bold text-orange-400">${targetSkin.data.price.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">24小时涨跌</p>
              <p className={`text-lg font-bold flex items-center gap-1 text-green-400`}>
                ± {(targetSkin.data.averageSub*100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Market Comparison */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="text-orange-500" size={20} />
            市场对比
          </h3>
          
          <div className="space-y-3">
            {targetSkin.data.data.map((market, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
              onClick={() => navigate(`/market/${base32Encode(market.name)}`)}
              >
                <div>
                  <h4 className="font-medium">{market.name}</h4>
                  <p className="text-sm text-gray-400">交易量: {market.active_offers}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">${market.price.toFixed(2)}</p>
                  <p className={`text-sm ${getChangeColor(market.price-targetSkin.data.price)}`}>
                    {market.change >= targetSkin.data.price ? '+' : ''}{((market.price-targetSkin.data.price)*100 / market.price).toFixed(1)}%
                  </p>
                </div>
                <button className="ml-4 p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  <ExternalLink size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Price Trend Chart */}
        {/* <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">价格趋势</h3>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceTrendData}>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#FB923C" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div> */}

        {/* Arbitrage Opportunities */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">套利机会</h3>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="text-green-400" size={20} />
              <span className="text-green-400 font-medium">可套利</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-400">最优买入</p>
                <p className="font-bold text-blue-400">{arbi.from.name} - ${(arbi.from.price).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">最优卖出</p>
                <p className="font-bold text-green-400">{arbi.to.name} - ${(arbi.to.price).toFixed(2)}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">套利空间</span>
              <div className="text-right">
                <p className="text-lg font-bold text-orange-400">+{(arbi.averageSub*100).toFixed(2)}%</p>
                <p className="text-sm text-white">${(arbi.sub).toFixed(2)}</p>
              </div>
            </div>
            
            <button className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            onClick={() => navigate(`/arbitrage/${base32Encode(`${targetSkin.id}#${arbi.from.name}#${arbi.to.name}`)}`)}
            >
              查看套利详情
            </button>
          </div>
        </div>

        {/* Skin Stats */}
        {/* {skin.stats && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">皮肤详情</h3>
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">磨损度</span>
                <span className="text-white">{skin.stats.float}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">图案索引</span>
                <span className="text-white">{skin.stats.patternIndex}</span>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <ExternalLink size={16} />
                在Steam中查看
              </button>
            </div>
          </div>
        )} */}

        {/* Description */}
        {/* {skin.description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">描述</h3>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-300">{skin.description}</p>
            </div>
          </div>
        )} */}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
            加入关注
          </button> */}
          <button className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors">
            分享饰品
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkinDetail;