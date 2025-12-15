import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Vault, Info, Calculator, CheckCircle } from 'lucide-react';
import { mockCases } from '../data/mockData';

const VaultStake = () => {
  const navigate = useNavigate();
  const [selectedCase, setSelectedCase] = useState('');
  const [amount, setAmount] = useState(1);
  const [duration, setDuration] = useState(30);
  const [showConfirm, setShowConfirm] = useState(false);

  const selectedCaseData = mockCases.find(c => c.id === selectedCase);
  
  // Calculate potential rewards
  const getPotentialReward = () => {
    if (!selectedCaseData) return 0;
    const baseRate = duration === 7 ? 0.15 : duration === 30 ? 0.20 : 0.25; // Annual rate
    const monthlyRate = baseRate * (duration / 365);
    return selectedCaseData.price * amount * monthlyRate;
  };

  const potentialReward = getPotentialReward();
  const totalValue = selectedCaseData ? selectedCaseData.price * amount : 0;

  const durations = [
    { days: 7, rate: '15%', description: '短期质押' },
    { days: 30, rate: '20%', description: '标准质押' },
    { days: 90, rate: '25%', description: '长期质押' }
  ];

  if (!showConfirm) {
    return (
      <div className="min-h-screen bg-gray-900 text-white pb-20">
        {/* Header */}
        <div className="bg-gray-800 sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-4">
            <button 
              onClick={() => navigate('/vault')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="text-white" size={20} />
            </button>
            <h1 className="text-lg font-bold">质押箱子</h1>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="px-4 py-6">
          {/* Info Banner */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Info className="text-blue-400" size={20} />
              <span className="text-blue-400 font-medium">质押说明</span>
            </div>
            <div className="text-sm text-gray-300 space-y-1">
              <p>• 质押期间资产将被锁定，不可交易</p>
              <p>• 每日结算收益，可随时提现</p>
              <p>• 支持多种质押周期，选择最适合的方案</p>
              <p>• 质押资金安全由平台保障</p>
            </div>
          </div>

          {/* Case Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">选择箱子</h3>
            <div className="space-y-3">
              {mockCases.map((caseItem) => (
                <button
                  key={caseItem.id}
                  onClick={() => setSelectedCase(caseItem.id)}
                  className={`w-full bg-gray-800 rounded-lg p-4 flex items-center gap-4 text-left transition-colors ${
                    selectedCase === caseItem.id 
                      ? 'ring-2 ring-orange-500 bg-orange-500/10' 
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <img 
                    src={caseItem.image} 
                    alt={caseItem.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{caseItem.name}</h4>
                    <p className="text-sm text-gray-400 mb-2">{caseItem.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-400 font-bold">¥{caseItem.price.toFixed(2)}</span>
                      <span className={`text-sm ${caseItem.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {caseItem.change24h >= 0 ? '+' : ''}{caseItem.change24h.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  {selectedCase === caseItem.id && (
                    <CheckCircle className="text-orange-500" size={20} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">质押数量</h3>
            <div className="bg-gray-800 rounded-lg p-4">
              <label className="block text-sm text-gray-400 mb-2">数量</label>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setAmount(Math.max(1, amount - 1))}
                  className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg text-center text-lg font-bold"
                  min="1"
                />
                <button 
                  onClick={() => setAmount(amount + 1)}
                  className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
              {selectedCaseData && (
                <p className="text-sm text-gray-400 mt-2">
                  总价值: ¥{totalValue.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* Duration Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">质押周期</h3>
            <div className="space-y-3">
              {durations.map((durationOption) => (
                <button
                  key={durationOption.days}
                  onClick={() => setDuration(durationOption.days)}
                  className={`w-full bg-gray-800 rounded-lg p-4 flex items-center justify-between transition-colors ${
                    duration === durationOption.days 
                      ? 'ring-2 ring-orange-500 bg-orange-500/10' 
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <div className="text-left">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{durationOption.days}天</span>
                      <span className="text-green-400 font-bold">{durationOption.rate}</span>
                    </div>
                    <p className="text-sm text-gray-400">{durationOption.description}</p>
                  </div>
                  {duration === durationOption.days && (
                    <CheckCircle className="text-orange-500" size={20} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Reward Calculator */}
          {selectedCaseData && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calculator className="text-orange-500" size={20} />
                收益计算
              </h3>
              <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">质押价值</p>
                    <p className="text-xl font-bold text-white">¥{totalValue.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">质押周期</p>
                    <p className="text-xl font-bold text-orange-400">{duration}天</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">预期年化收益:</span>
                    <span className="text-green-400 font-bold">
                      {duration === 7 ? '15%' : duration === 30 ? '20%' : '25%'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400">预期收益:</span>
                    <span className="text-green-400 font-bold text-lg">¥{potentialReward.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">收益率:</span>
                    <span className="text-green-400 font-bold">
                      {((potentialReward / totalValue) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">解锁日期:</span>
                    <span className="text-white font-medium">
                      {new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Risk Warning */}
          <div className="mb-6">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <h4 className="font-medium text-yellow-400 mb-2">风险提示</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• 质押期间资产将锁定，无法交易</li>
                <li>• 市场波动可能影响质押资产价值</li>
                <li>• 质押收益可能低于市场平均水平</li>
                <li>• 请根据个人风险承受能力谨慎操作</li>
              </ul>
            </div>
          </div>

          {/* Confirm Button */}
          <button 
            onClick={() => setShowConfirm(true)}
            disabled={!selectedCase || amount < 1}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white py-4 rounded-lg font-bold text-lg transition-colors"
          >
            确认质押
          </button>
        </div>
      </div>
    );
  }

  // Confirmation Modal
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-gray-800 rounded-t-lg p-6 w-full max-w-md animate-slide-up">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Vault className="text-white" size={24} />
          </div>
          <h3 className="text-lg font-bold mb-2">质押确认</h3>
          <p className="text-gray-400 text-sm">请确认质押信息，提交后将开始计算收益</p>
        </div>

        {selectedCaseData && (
          <div className="bg-gray-700 rounded-lg p-4 mb-6 space-y-3">
            <h4 className="font-medium mb-3">质押信息</h4>
            <div className="flex justify-between">
              <span className="text-gray-400">质押资产:</span>
              <span className="text-white">{selectedCaseData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">质押数量:</span>
              <span className="text-white">{amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">质押价值:</span>
              <span className="text-white">¥{totalValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">质押周期:</span>
              <span className="text-white">{duration}天</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">年化收益:</span>
              <span className="text-green-400">
                {duration === 7 ? '15%' : duration === 30 ? '20%' : '25%'}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="text-gray-400">预期收益:</span>
              <span className="text-green-400">¥{potentialReward.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-600 pt-3">
              <div className="flex justify-between">
                <span className="text-gray-400">解锁日期:</span>
                <span className="text-white">
                  {new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button 
            onClick={() => setShowConfirm(false)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
          >
            返回修改
          </button>
          <button 
            onClick={() => {
              alert('质押成功！开始获得收益');
              navigate('/vault');
            }}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            确认质押
          </button>
        </div>
      </div>
    </div>
  );
};

export default VaultStake;