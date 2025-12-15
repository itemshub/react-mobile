import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightLeft, TrendingUp, AlertTriangle, Calculator, Filter } from 'lucide-react';
import { mockArbitrage } from '../data/mockData';
import { ArbitrageOpportunity } from '../types';

const Arbitrage = () => {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState('全部');
  const [selectedProfitRange, setSelectedProfitRange] = useState('全部');
  const [showCalculator, setShowCalculator] = useState(false);

  const platformOptions = [
    '全部',
    'Buff↔Steam',
    'C5↔Skinport',
    'Buff↔C5',
    'Steam↔Skinport'
  ];

  const profitRanges = [
    '全部',
    '1%+',
    '2%+',
    '5%+',
    '10%+'
  ];

  const filteredArbitrage = mockArbitrage.filter((arb) => {
    const platformMatch = selectedPlatform === '全部' || 
      `${arb.markets.buy.platform}↔${arb.markets.sell.platform}`.includes(selectedPlatform);
    
    const profitMatch = selectedProfitRange === '全部' || 
      arb.profitPercentage >= parseFloat(selectedProfitRange);
    
    return platformMatch && profitMatch;
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-400 bg-green-400/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'High': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const CalculatorModal = () => {
    const [buyPrice, setBuyPrice] = useState('');
    const [sellPrice, setSellPrice] = useState('');
    const [buyFee, setBuyFee] = useState(2.5);
    const [sellFee, setSellFee] = useState(2.5);
    const [quantity, setQuantity] = useState(1);

    const calculateProfit = () => {
      const buyTotal = parseFloat(buyPrice) * quantity * (1 + buyFee / 100);
      const sellTotal = parseFloat(sellPrice) * quantity * (1 - sellFee / 100);
      const profit = sellTotal - buyTotal;
      const profitPercentage = ((profit / buyTotal) * 100);
      
      return { profit, profitPercentage };
    };

    const result = buyPrice && sellPrice ? calculateProfit() : null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
        <div className="bg-gray-800 rounded-t-lg p-6 w-full max-w-md animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">套利计算器</h3>
            <button 
              onClick={() => setShowCalculator(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">买入价格 (¥)</label>
              <input
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
                placeholder="输入买入价格"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">卖出价格 (¥)</label>
              <input
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
                placeholder="输入卖出价格"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-2">买入手续费 (%)</label>
                <input
                  type="number"
                  value={buyFee}
                  onChange={(e) => setBuyFee(parseFloat(e.target.value))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">卖出手续费 (%)</label>
                <input
                  type="number"
                  value={sellFee}
                  onChange={(e) => setSellFee(parseFloat(e.target.value))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
                  step="0.1"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">数量</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
                min="1"
              />
            </div>
            
            {result && (
              <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">总成本：</span>
                  <span className="text-white font-medium">¥{(parseFloat(buyPrice) * quantity * (1 + buyFee / 100)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">预期收入：</span>
                  <span className="text-white font-medium">¥{(parseFloat(sellPrice) * quantity * (1 - sellFee / 100)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-600 pt-2">
                  <span className="text-gray-400">净收益：</span>
                  <span className={`font-bold ${result.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ¥{result.profit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">收益率：</span>
                  <span className={`font-bold ${result.profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {result.profitPercentage.toFixed(2)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="text-orange-500" size={24} />
            <h1 className="text-xl font-bold">套利机会</h1>
          </div>
          <button 
            onClick={() => setShowCalculator(true)}
            className="p-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Calculator size={20} />
          </button>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-2">平台组合</label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {platformOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedPlatform(option)}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    selectedPlatform === option 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">收益率</label>
            <div className="flex gap-2">
              {profitRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedProfitRange(range)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedProfitRange === range 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-4 bg-gray-800">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-400">可用机会</p>
            <p className="text-xl font-bold text-white">{filteredArbitrage.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">平均收益</p>
            <p className="text-xl font-bold text-green-400">
              {(filteredArbitrage.reduce((sum, arb) => sum + arb.profitPercentage, 0) / filteredArbitrage.length || 0).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">预估总量</p>
            <p className="text-xl font-bold text-orange-400">
              {filteredArbitrage.reduce((sum, arb) => sum + arb.volume, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Arbitrage Opportunities */}
      <div className="px-4 py-4">
        {filteredArbitrage.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-400">暂无可用套利机会</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredArbitrage.map((arbitrage) => (
              <div 
                key={arbitrage.id}
                onClick={() => navigate(`/arbitrage/${arbitrage.id}`)}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                {/* Skin Info */}
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={arbitrage.skin.image} 
                    alt={arbitrage.skin.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{arbitrage.skin.name}</h3>
                    <p className="text-sm text-gray-400">{arbitrage.skin.skin}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded text-xs ${getRiskColor(arbitrage.riskLevel)}`}>
                        {arbitrage.riskLevel} 风险
                      </span>
                      <span className="text-xs text-gray-500">交易量: {arbitrage.volume}</span>
                    </div>
                  </div>
                </div>

                {/* Price Comparison */}
                <div className="bg-gray-700 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-center flex-1">
                      <p className="text-xs text-gray-400">买入市场</p>
                      <p className="text-sm font-bold text-white">{arbitrage.markets.buy.platform}</p>
                      <p className="text-lg font-bold text-blue-400">
                        ¥{arbitrage.markets.buy.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="px-3">
                      <ArrowRightLeft className="text-gray-400" size={20} />
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-xs text-gray-400">卖出市场</p>
                      <p className="text-sm font-bold text-white">{arbitrage.markets.sell.platform}</p>
                      <p className="text-lg font-bold text-green-400">
                        ¥{arbitrage.markets.sell.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-600 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">套利空间</span>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-400">
                          +{arbitrage.profitPercentage.toFixed(2)}%
                        </p>
                        <p className="text-sm text-white">
                          ¥{arbitrage.potentialProfit.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                    查看详情
                  </button>
                  <button className="px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
                    模拟计算
                  </button>
                </div>

                {/* Last Updated */}
                <p className="text-xs text-gray-500 mt-2 text-center">
                  最后更新: {arbitrage.lastUpdated}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Calculator Modal */}
      {showCalculator && <CalculatorModal />}
    </div>
  );
};

export default Arbitrage;