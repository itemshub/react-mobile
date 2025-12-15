import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { mockSkins } from '../data/mockData';
import { api_case, api_index } from '@/utils/request';
import { base32Decode, getSkinsNameById } from '@/utils/utils';
import { LoadingPage } from '@/components/LoadingPage';

const MarketDetail = () => {
  const { platform} = useParams();

  const [marketData, setMarketData] = useState<any>({})
  const [marketSkins, setMarketSkins] = useState<any[]>([])

  const [indexData, setIndexData] = useState<any>({});
  const [cases, setCases] = useState<any>([]);

  const [market, setMarket] = useState<any>({});

    // Mock market data based on platform
  const getMarketData = (pla:string) => {
    switch (pla) {
      case 'buff': return {
        name: 'Buff163',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        currency: 'CNY',
        fee: '2.5%',
        features: ['支付宝支付', '即时到账', '手续费低']
      };
      case 'c5': return {
        name: 'C5游戏',
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        currency: 'CNY',
        fee: '2.0%',
        features: ['安全保障', '快速交易', '专业客服']
      };
      case 'steam': return {
        name: 'Steam Market',
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/10',
        currency: 'USD',
        fee: '15.0%',
        features: ['全球市场', '官方保障', '高流动性']
      };
      default: return {
        name: '未知平台',
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/10',
        currency: 'CNY',
        fee: '0%',
        features: []
      };
    }
  };


  const markets = ['buff', 'c5', 'steam'] as const;
  type MarketPlatform = typeof markets[number];
  const getRandomMarketPlatform = (): MarketPlatform => {
    const idx = Math.floor(Math.random() * markets.length);
    return markets[idx];
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data= await api_index()
        setIndexData(data?.data);
        console.log(data?.data.skins)
        const cs = await api_case();
        setCases(cs?.data);

        for(let i of data.data.markets)
        {
          // console.log(i)
          if(i.name.toLocaleLowerCase() == platform?.toLocaleLowerCase() || i.name.toLocaleLowerCase() == base32Decode(platform)?.toLocaleLowerCase())
          {
            console.log("name match :: ",i)
            setMarket(i);
            setMarketData(getMarketData(getRandomMarketPlatform()))
          }
        }
      } catch (err) {
        console.error("请求失败:", err);
      }
    };

    load();
  }, []);
  const navigate = useNavigate();
  
  if (!marketData?.name) {
    return (
      <LoadingPage/>
    );
  }
  


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
          <h1 className="text-lg font-bold">市场详情</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Market Info */}
        <div className={`${marketData.bgColor} rounded-lg p-6 mb-6`}>
          <div className="text-center">
            <div className="w-24 h-24 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              {/* <ExternalLink className={marketData.color} size={24} /> */}
              <img src={market.img_url} className='w-24 h-24'/>
            </div>
            <h2 className={`text-2xl font-bold ${marketData.color} mb-2`}>{market.name}</h2>
            <p className="text-gray-400 text-sm mb-4">专业游戏交易平台</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-400">手续费</p>
                <p className="text-lg font-bold text-white">{market.seller_fee}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">货币</p>
                <p className="text-lg font-bold text-white">{"USD"}</p>
              </div>
            </div>
            
            {/* <div className="text-left">
              <h4 className="font-medium mb-2">平台特色</h4>
              <div className="space-y-1">
                {marketData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-1 h-1 ${marketData.color.replace('text-', 'bg-')} rounded-full`} />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>

        {/* Market Stats */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">市场数据</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">今日交易量</p>
              <p className="text-xl font-bold text-white">¥123,456</p>
              <p className="text-sm text-green-400 flex items-center gap-1">
                <TrendingUp size={14} />
                +15.2%
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">活跃用户</p>
              <p className="text-xl font-bold text-white">8,592</p>
              <p className="text-sm text-blue-400">实时更新</p>
            </div>
          </div>
        </div>

        {/* Featured Items */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">热门商品</h3>
          <div className="space-y-3">
            {indexData.skins.map((skin) => (
              <div 
                key={skin.skin}
                onClick={() => navigate(`/skin/${skin.skin}`)}
                className="bg-gray-800 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <img 
                  src={(getSkinsNameById(cases,skin.skin) ? getSkinsNameById(cases,skin.skin).img_url : ""  )} 
                  alt={skin.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{skin.name}</h4>
                  <p className="text-sm text-gray-400 mb-2">{skin.skin}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-orange-400">
                      ¥{skin.price.toFixed(2)}
                    </span>
                    <span className={`text-sm flex items-center gap-1 text-green-400`}>
                      ± {(skin.averageSub).toFixed(2)}%
                    </span>
                  </div>
                </div>
                <button className={`px-3 py-1 rounded text-sm ${marketData.color} border ${marketData.color.replace('text-', 'border-')} hover:bg-gray-700 transition-colors`}>
                  跳转
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Price Comparison */}
        {/* <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">平台价格对比</h3>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-4">以 AK-47 Fire Serpent 为例</p>
            
            <div className="space-y-3">
              {[
                { platform: 'Buff163', price: 2850.50, change: 2.5 },
                { platform: 'C5游戏', price: 2793.49, change: 2.8 },
                { platform: marketData.name, price: 2850.50, change: 2.5, highlight: true },
                { platform: 'Skinport', price: 2821.50, change: 2.2 }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-3 rounded ${
                    item.highlight ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-gray-700'
                  }`}
                >
                  <div>
                    <span className="font-medium">{item.platform}</span>
                    {item.highlight && <span className="ml-2 text-xs text-orange-400">当前</span>}
                  </div>
                  <div className="text-right">
                    <p className="font-bold">¥{item.price.toFixed(2)}</p>
                    <p className={`text-sm ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.change >= 0 ? '+' : ''}{item.change.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => {
              alert(`模拟跳转到${marketData.name}官网`);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink size={16} />
            访问官网
          </button>
          <button 
            onClick={() => {
              alert('模拟跳转API文档');
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
          >
            API文档
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketDetail;