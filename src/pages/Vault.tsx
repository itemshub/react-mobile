import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vault as VaultIcon, Plus, TrendingUp, Clock, Lock, Unlock, Calculator, PiggyBank } from 'lucide-react';
import { mockVaultStakes, mockCases, mockUser } from '../data/mockData';

const Vault = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'stake' | 'rewards'>('overview');

  // Calculate total vault statistics
  const totalStaked = mockVaultStakes.reduce((sum, stake) => sum + stake.currentValue, 0);
  const totalRewards = mockVaultStakes.reduce((sum, stake) => sum + stake.totalRewards, 0);
  const dailyRewards = mockVaultStakes.reduce((sum, stake) => sum + stake.dailyReward, 0);
  const totalProfit = totalRewards;
  const annualRate = (dailyRewards / totalStaked * 365 / 100) * 100;

  // Generate mock daily rewards data for chart
  const mockDailyRewards = Array.from({ length: 30 }, (_, i) => ({
    date: `10/${26 - i}`,
    reward: Math.random() * 5 + 3,
    cumulative: Math.random() * 20 + 10
  })).reverse();

  const StakeModal = () => {
    const [selectedCase, setSelectedCase] = useState('');
    const [amount, setAmount] = useState(1);
    const [duration, setDuration] = useState(30);
    const [showConfirm, setShowConfirm] = useState(false);

    const selectedCaseData = mockCases.find(c => c.id === selectedCase);
    const potentialReward = selectedCaseData ? selectedCaseData.price * amount * (duration / 365) * 0.2 : 0;

    if (!showConfirm) {
      return (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-gray-800 rounded-t-lg p-6 w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">质押箱子</h3>
              <button 
                onClick={() => navigate('/vault')}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">选择箱子</label>
                <select
                  value={selectedCase}
                  onChange={(e) => setSelectedCase(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-3 rounded-lg"
                >
                  <option value="">请选择箱子</option>
                  {mockCases.map((caseItem) => (
                    <option key={caseItem.id} value={caseItem.id}>
                      {caseItem.name} - ¥{caseItem.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">数量</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                  min="1"
                  className="w-full bg-gray-700 text-white px-3 py-3 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">质押周期</label>
                <div className="grid grid-cols-3 gap-2">
                  {[7, 30, 90].map((days) => (
                    <button
                      key={days}
                      onClick={() => setDuration(days)}
                      className={`py-2 rounded-lg text-sm ${
                        duration === days 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {days}天
                    </button>
                  ))}
                </div>
              </div>

              {selectedCaseData && (
                <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium">质押信息</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">当前价值：</span>
                    <span className="text-white">¥{(selectedCaseData.price * amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">质押周期：</span>
                    <span className="text-white">{duration}天</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">预期收益：</span>
                    <span className="text-green-400 font-medium">¥{potentialReward.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">年化收益：</span>
                    <span className="text-green-400">~{(potentialReward / (selectedCaseData.price * amount) * (365 / duration) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              )}

              <button 
                onClick={() => setShowConfirm(true)}
                disabled={!selectedCase || amount < 1}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                确认质押
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
        <div className="bg-gray-800 rounded-t-lg p-6 w-full max-w-md animate-slide-up">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">质押确认</h3>
            <p className="text-gray-400 text-sm">确认后资金将锁定至到期日</p>
          </div>

          {selectedCaseData && (
            <div className="bg-gray-700 rounded-lg p-4 mb-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">质押资产：</span>
                <span className="text-white">{selectedCaseData.name} x{amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">总价值：</span>
                <span className="text-white">¥{(selectedCaseData.price * amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">质押周期：</span>
                <span className="text-white">{duration}天</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">预期收益：</span>
                <span className="text-green-400 font-medium">¥{potentialReward.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-600 pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">解锁日期：</span>
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
              返回
            </button>
            <button 
              onClick={() => {
                // Simulate staking
                alert('质押成功！');
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

  const renderOverview = () => (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="text-white" size={20} />
            <span className="text-white text-sm">当前质押</span>
          </div>
          <p className="text-2xl font-bold text-white">¥{totalStaked.toFixed(2)}</p>
          <p className="text-blue-100 text-xs">可用提现: ¥{totalRewards.toFixed(2)}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-white" size={20} />
            <span className="text-white text-sm">累计收益</span>
          </div>
          <p className="text-2xl font-bold text-white">¥{totalRewards.toFixed(2)}</p>
          <p className="text-green-100 text-xs">日收益: ¥{dailyRewards.toFixed(2)}</p>
        </div>
      </div>

      {/* Annual Rate */}
      <div className="bg-orange-500 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold">年化收益率</h3>
            <p className="text-orange-100 text-sm">基于当前质押表现</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{annualRate.toFixed(1)}%</p>
            <p className="text-orange-100 text-xs">APY</p>
          </div>
        </div>
      </div>

      {/* Active Stakes */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">我的质押</h3>
        <div className="space-y-3">
          {mockVaultStakes.map((stake) => {
            const progress = ((Date.now() - new Date(stake.stakeDate).getTime()) / 
              (new Date(stake.unlockDate).getTime() - new Date(stake.stakeDate).getTime())) * 100;
            
            return (
              <div key={stake.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{stake.caseName}</h4>
                    <p className="text-sm text-gray-400">数量: {stake.amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-400 font-bold">¥{stake.currentValue.toFixed(2)}</p>
                    <p className="text-green-400 text-sm">+¥{stake.totalRewards.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>质押进度</span>
                    <span>{Math.min(progress, 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>开始: {new Date(stake.stakeDate).toLocaleDateString()}</span>
                    <span>解锁: {new Date(stake.unlockDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-blue-400" />
                    <span className="text-sm text-blue-400">日收益: ¥{stake.dailyReward.toFixed(2)}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    stake.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {stake.status === 'active' ? '质押中' : '已解锁'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );

  const renderStake = () => (
    <div className="text-center py-12">
      <VaultIcon className="mx-auto text-gray-400 mb-4" size={48} />
      <h3 className="text-lg font-semibold mb-2">开始质押</h3>
      <p className="text-gray-400 mb-6">选择箱子进行质押，获得持续收益</p>
      <button 
        onClick={() => navigate('/vault/stake')}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        开始质押
      </button>
    </div>
  );

  const renderRewards = () => (
    <div>
      <h3 className="text-lg font-semibold mb-4">收益明细</h3>
      <div className="space-y-3">
        {mockDailyRewards.slice(0, 7).map((day, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{day.date}</p>
              <p className="text-sm text-gray-400">日收益</p>
            </div>
            <div className="text-right">
              <p className="text-green-400 font-bold">+¥{day.reward.toFixed(2)}</p>
              <p className="text-sm text-gray-400">累计: ¥{day.cumulative.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-900 px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <VaultIcon className="text-orange-400" size={24} />
          <h1 className="text-xl font-bold">质押金库</h1>
        </div>
        <p className="text-purple-100 text-sm">箱子质押，持续获得收益</p>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 px-4 py-3 sticky top-0 z-10">
        <div className="flex gap-1">
          {[
            { key: 'overview', label: '总览', icon: TrendingUp },
            { key: 'stake', label: '质押', icon: Plus },
            { key: 'rewards', label: '收益', icon: Calculator }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
                  activeTab === tab.key 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'stake' && renderStake()}
        {activeTab === 'rewards' && renderRewards()}
      </div>

      {/* Stake Modal */}
      {location.pathname === '/vault/stake' && <StakeModal />}
    </div>
  );
};

export default Vault;