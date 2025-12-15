import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRightLeft, TrendingUp, Calculator, AlertCircle, ExternalLink, BarChart3 } from 'lucide-react';
import { mockArbitrage } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const ArbitrageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const arbitrage = mockArbitrage.find(a => a.id === id);
  const [customQuantity, setCustomQuantity] = useState(1);
  const [showCalculator, setShowCalculator] = useState(false);

  if (!arbitrage) {
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

  const buyTotal = arbitrage.markets.buy.price * customQuantity;
  const sellTotal = arbitrage.markets.sell.price * customQuantity;
  const buyFee = buyTotal * arbitrage.markets.buy.fee;
  const sellFee = sellTotal * arbitrage.markets.sell.fee;
  const totalCost = buyTotal + buyFee;
  const totalRevenue = sellTotal - sellFee;
  const netProfit = totalRevenue - totalCost;
  const netProfitPercentage = (netProfit / totalCost) * 100;

  // Mock historical price data
  const priceHistory = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    buyPrice: arbitrage.markets.buy.price + (Math.random() - 0.5) * 100,
    sellPrice: arbitrage.markets.sell.price + (Math.random() - 0.5) * 100,
    arbitrage: arbitrage.markets.sell.price - arbitrage.markets.buy.price + (Math.random() - 0.5) * 20
  }));

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-400 bg-green-400/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'High': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

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
                <span className="text-white">¥{buyTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">买入手续费 ({arbitrage.markets.buy.fee * 100}%)：</span>
                <span className="text-white">¥{buyFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-600 pt-2">
                <span>总成本：</span>
                <span className="text-white">¥{totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4 space-y-3">
            <h4 className="font-medium">收入计算</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">卖出收入：</span>
                <span className="text-white">¥{sellTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">卖出手续费 ({arbitrage.markets.sell.fee * 100}%)：</span>
                <span className="text-white">¥{sellFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-600 pt-2">
                <span>净收入：</span>
                <span className="text-white">¥{totalRevenue.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-green-400">净收益</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">净收益金额：</span>
                <span className="text-green-400 font-bold text-lg">¥{netProfit.toFixed(2)}</span>
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
              src={arbitrage.skin.image} 
              alt={arbitrage.skin.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold">{arbitrage.skin.name}</h2>
              <p className="text-gray-400 mb-2">{arbitrage.skin.skin}</p>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${getRiskLevelColor(arbitrage.riskLevel)}`}>
                  {arbitrage.riskLevel} 风险
                </span>
                <span className="text-xs text-gray-500">交易量: {arbitrage.volume}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Comparison */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">价格对比</h3>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="text-center flex-1">
                <p className="text-sm text-gray-400 mb-2">买入市场</p>
                <div className="bg-blue-600 rounded-lg p-4">
                  <p className="font-bold text-white text-lg">{arbitrage.markets.buy.platform}</p>
                  <p className="text-blue-100 text-sm">手续费 {arbitrage.markets.buy.fee * 100}%</p>
                  <p className="text-2xl font-bold text-white mt-2">
                    ¥{arbitrage.markets.buy.price.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="px-6">
                <ArrowRightLeft className="text-orange-500" size={32} />
              </div>
              
              <div className="text-center flex-1">
                <p className="text-sm text-gray-400 mb-2">卖出市场</p>
                <div className="bg-green-600 rounded-lg p-4">
                  <p className="font-bold text-white text-lg">{arbitrage.markets.sell.platform}</p>
                  <p className="text-green-100 text-sm">手续费 {arbitrage.markets.sell.fee * 100}%</p>
                  <p className="text-2xl font-bold text-white mt-2">
                    ¥{arbitrage.markets.sell.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-600 pt-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-400">价格差</p>
                  <p className="text-xl font-bold text-orange-400">
                    ¥{(arbitrage.markets.sell.price - arbitrage.markets.buy.price).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">套利率</p>
                  <p className="text-xl font-bold text-green-400">
                    +{arbitrage.profitPercentage.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">预估收益</p>
                  <p className="text-xl font-bold text-blue-400">
                    ¥{arbitrage.potentialProfit.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price History Chart */}
        <div className="mb-6">
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
        </div>

        {/* Market Links */}
        <div className="mb-6">
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
        </div>

        {/* Risk Assessment */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">风险评估</h3>
          <div className={`rounded-lg p-4 ${getRiskLevelColor(arbitrage.riskLevel)}`}>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={20} />
              <span className="font-bold">{arbitrage.riskLevel} 风险</span>
            </div>
            
            <div className="space-y-2 text-sm">
              {arbitrage.riskLevel === 'Low' && (
                <>
                  <p>• 价格波动相对稳定</p>
                  <p>• 流动性充足</p>
                  <p>• 市场深度良好</p>
                  <p>• 建议操作时间: 小于 30分钟</p>
                </>
              )}
              {arbitrage.riskLevel === 'Medium' && (
                <>
                  <p>• 价格存在一定波动</p>
                  <p>• 流动性中等</p>
                  <p>• 建议控制交易量</p>
                  <p>• 建议操作时间: 小于 15分钟</p>
                </>
              )}
              {arbitrage.riskLevel === 'High' && (
                <>
                  <p>• 价格波动较大</p>
                  <p>• 流动性有限</p>
                  <p>• 建议小额操作</p>
                  <p>• 建议操作时间: 小于 5分钟</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center text-sm text-gray-500">
          最后更新: {arbitrage.lastUpdated}
        </div>
      </div>

      {/* Calculator Modal */}
      {showCalculator && <CalculatorModal />}
    </div>
  );
};

export default ArbitrageDetail;