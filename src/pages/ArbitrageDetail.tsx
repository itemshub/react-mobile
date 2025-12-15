import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRightLeft, TrendingUp, Calculator, AlertCircle, ExternalLink, BarChart3 } from 'lucide-react';
import { mockArbitrage } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { api_case, api_index } from '@/utils/request';
import { base32Decode, base32Encode, getMarketsByName, getSkinsById, getTimeDiffText } from '@/utils/utils';
import { LoadingPage } from '@/components/LoadingPage';

const ArbitrageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const arbitrage = mockArbitrage.find(a => a.id === id);
  const [customQuantity, setCustomQuantity] = useState(1);
  const [showCalculator, setShowCalculator] = useState(false);

    const [indexData, setIndexData] = useState<any>({});
  const [cases, setCases] = useState<any>({});
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
      try{
        const raw = base32Decode(String(id)).split("#")
        if(raw.length<2)
        {
          return false;
        }
        const [skinId,fromId,toId] = raw;
        console.log(skinId,fromId,toId)

        //Search target case 
        for(let i of cs?.data)
        {
          if(i?.id == skinId?.toLocaleLowerCase())
          {
            const skinData = getSkinsById(data?.data.skins,(skinId as any));
            i['data'] = skinData
            let from ;
            let to ;
            for(let u of skinData.data)
            {
              if(u.name == fromId)
              {
                from = u
                from['info'] = getMarketsByName(data?.data.markets,u.name)
              }
              if(u.name == toId)
              {
                to = u
                to['info'] = getMarketsByName(data?.data.markets,u.name)
              }
            }
            if(!from || !to)
            {
              return false;
            }


            let arb = {
              to,
              from,
              sub: to.price - from.price,
              averageSub:skinData.averageSub
            }
            setArbi(arb)
            setTargetSkin(i);
            console.log(arb)
          }
        }

      }catch(e)
      {
        console.error(e);
      }

    } catch (err) {
      console.error("请求失败:", err);
    }
  };
  load();
}, []);

  if (!indexData?.skins || !arbi?.from) {
    return (
      <LoadingPage/>
    );
  }

  if (!arbi?.from) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-400">套利机会不存在</p>
          <button 
            onClick={() => navigate('/arbitrage')}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            返回套利
          </button>
        </div>
      </div>
    );
  }

  const buyTotal = arbi.from.price * customQuantity 
  const sellTotal = arbi.to.price * customQuantity
  const buyFeeRate = Number(arbi.from.info.seller_fee.split("%")[0])/100
  const buyFee = buyTotal * buyFeeRate
  const sellFeeRate = Number(arbi.to.info.seller_fee.split("%")[0])/100
  const sellFee = sellTotal * sellFeeRate
  const totalCost = buyTotal + buyFee
  const totalRevenue = sellTotal - sellFee
  const netProfit = totalRevenue - totalCost
  const netProfitPercentage = (netProfit / totalCost) * 100

  // Mock historical price data
  // const priceHistory = Array.from({ length: 24 }, (_, i) => ({
  //   time: `${i}:00`,
  //   buyPrice: arbitrage.markets.buy.price + (Math.random() - 0.5) * 100,
  //   sellPrice: arbitrage.markets.sell.price + (Math.random() - 0.5) * 100,
  //   arbitrage: arbitrage.markets.sell.price - arbitrage.markets.buy.price + (Math.random() - 0.5) * 20
  // }));

  const getRiskLevelColor = () => {
    if(arbi.from.active_offers >10000 && arbi.to.active_offers > 10000)
    {
      return 'low'
    }
    if(arbi.from.active_offers <1000 && arbi.to.active_offers < 1000)
    {
      return 'high'
    }

    return 'medium'
  }
  const CalculatorModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-gray-800 rounded-t-lg p-6 w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">收益计算器</h3>
          <button 
            onClick={() => setShowCalculator(false)}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">交易数量</label>
            <input
              type="number"
              value={customQuantity}
              onChange={(e) => setCustomQuantity(parseInt(e.target.value))}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
              min="1"
            />
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4 space-y-3">
            <h4 className="font-medium">成本计算</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">买入成本：</span>
                <span className="text-white">${buyTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">买入手续费 ({buyFeeRate*100}%)：</span>
                <span className="text-white">${buyFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-600 pt-2">
                <span>总成本：</span>
                <span className="text-white">${totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4 space-y-3">
            <h4 className="font-medium">收入计算</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">卖出收入：</span>
                <span className="text-white">${sellTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">卖出手续费 ({sellFeeRate * 100}%)：</span>
                <span className="text-white">${sellFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-600 pt-2">
                <span>净收入：</span>
                <span className="text-white">${totalRevenue.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-green-400">净收益</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">净收益金额：</span>
                <span className="text-green-400 font-bold text-lg">${netProfit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">净收益率：</span>
                <span className="text-green-400 font-bold text-lg">{netProfitPercentage.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="bg-gray-800 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-4">
          <button 
            onClick={() => navigate('/arbitrage')}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <h1 className="text-lg font-bold">套利详情</h1>
          <button 
            onClick={() => setShowCalculator(true)}
            className="p-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
          >
            <Calculator size={20} />
          </button>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Skin Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={targetSkin.img_url} 
              alt={targetSkin.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold">{targetSkin.name}</h2>
              <p className="text-gray-400 mb-2">{targetSkin.skin}</p>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs low`}>
                  ${(targetSkin.data.price).toFixed(3)}
                </span>
                <span className="text-xs text-gray-500">交易量: {(targetSkin.data.offers).toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Comparison */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">价格对比</h3>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="text-center flex-1"
              onClick={
                ()=>{
                  navigate(`/market/${base32Encode(arbi.from.name)}`)
                }
              }
              >
                <p className="text-sm text-gray-400 mb-2">买入市场</p>
                <div className="bg-blue-600 rounded-lg p-4">
                  <p className="font-bold text-white text-lg">{arbi.from.name}</p>
                  <p className="text-blue-100 text-sm">手续费 {arbi.from.info.seller_fee}</p>
                  <p className="text-2xl font-bold text-white mt-2">
                    ${(arbi.from.price).toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="px-6">
                <ArrowRightLeft className="text-orange-500" size={32} />
              </div>
              
              <div className="text-center flex-1"
              onClick={
              ()=>{
                navigate(`/market/${base32Encode(arbi.to.name)}`)
              }
            }
              >
                <p className="text-sm text-gray-400 mb-2">卖出市场</p>
                <div className="bg-green-600 rounded-lg p-4">
                  <p className="font-bold text-white text-lg">{arbi.to.name}</p>
                  <p className="text-green-100 text-sm">手续费 {arbi.to.info.seller_fee}</p>
                  <p className="text-2xl font-bold text-white mt-2">
                    ${(arbi.to.price).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-600 pt-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-400">价格差</p>
                  <p className="text-xl font-bold text-orange-400">
                    ${((arbi.to.price - arbi.from.price)).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">套利率</p>
                  <p className="text-xl font-bold text-green-400">
                     +{((arbi.to.price - arbi.from.price)*100/arbi.from.price).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">预估收益</p>
                  <p className="text-xl font-bold text-blue-400">
                    ${((arbi.to.price - arbi.from.price)).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price History Chart */}
        {/* <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="text-orange-500" size={20} />
            价格历史走势
          </h3>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceHistory}>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  />
                  <YAxis hide />
                  <Line 
                    type="monotone" 
                    dataKey="buyPrice" 
                    stroke="#3B82F6" 
                    strokeWidth={1}
                    dot={false}
                    name="买入价"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sellPrice" 
                    stroke="#10B981" 
                    strokeWidth={1}
                    dot={false}
                    name="卖出价"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="arbitrage" 
                    stroke="#FB923C" 
                    strokeWidth={2}
                    dot={false}
                    name="套利空间"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs text-gray-400 mt-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-1 bg-blue-500" />
                <span>买入价</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-1 bg-green-500" />
                <span>卖出价</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500" />
                <span>套利空间</span>
              </div>
            </div>
          </div>
        </div> */}

        {/* Market Links */}
        {/* <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">快速跳转</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => alert(`跳转到${arbitrage.markets.buy.platform}购买页面`)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              {arbitrage.markets.buy.platform}
            </button>
            <button 
              onClick={() => alert(`跳转到${arbitrage.markets.sell.platform}出售页面`)}
              className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              {arbitrage.markets.sell.platform}
            </button>
          </div>
        </div> */}

        {/* Risk Assessment */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">风险评估</h3>
          <div className={`rounded-lg p-4 ${getRiskLevelColor()}`}>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={20} />
              <span className="font-bold">{getRiskLevelColor().toUpperCase()} 风险</span>
            </div>
            
            <div className="space-y-2 text-sm">
              {getRiskLevelColor() === 'low' &&  (
                <>
                  <p>• 流动性充足</p>
                  <p>• 买方挂单量 : {(arbi.from.active_offers).toFixed(0)}</p>
                  <p>• 卖方挂单量 : {(arbi.to.active_offers).toFixed(0)}</p>
                </>
              )}
              {getRiskLevelColor() === 'medium' && (
                <>
                  <p>• 流动性轻微不足</p>
                  <p>• 买方挂单量 : {(arbi.from.active_offers).toFixed(0)}</p>
                  <p>• 卖方挂单量 : {(arbi.to.active_offers).toFixed(0)}</p>
                </>
              )}
              {getRiskLevelColor() === 'high' && (
                <>
                  <p>• 流动性严重不足</p>
                  <p>• 买方挂单量 : {(arbi.from.active_offers).toFixed(0)}</p>
                  <p>• 卖方挂单量 : {(arbi.to.active_offers).toFixed(0)}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center text-sm text-gray-500">
          最后更新: {getTimeDiffText(targetSkin.data.timestamp)}
        </div>
      </div>

      {/* Calculator Modal */}
      {showCalculator && <CalculatorModal />}
    </div>
  );
};

export default ArbitrageDetail;