import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Settings, HelpCircle, MessageSquare, Bell, Moon, 
  Globe, TrendingUp, Shield, LogOut, ExternalLink, 
  BarChart3, Target, Award
} from 'lucide-react';
import { mockUser } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const Profile = () => {
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('中文');
  const [showSteamBind, setShowSteamBind] = useState(false);

  // Generate monthly profit chart data
  const monthlyData = mockUser.monthlyProfit.map((profit, index) => ({
    month: `M${index + 1}`,
    profit: profit,
    target: 1000
  }));

  const SteamBindModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-gray-800 rounded-t-lg p-6 w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">绑定Steam账号</h3>
          <button 
            onClick={() => setShowSteamBind(false)}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="text-white" size={24} />
            </div>
            <p className="text-gray-400 text-sm mb-6">
              绑定Steam账号可获得更多交易便利和安全保障
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4 space-y-3">
            <h4 className="font-medium">绑定好处：</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-400 rounded-full" />
                <span>快速查看Steam市场价格</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-400 rounded-full" />
                <span>一键导入Steam库存</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-400 rounded-full" />
                <span>交易安全保障</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-400 rounded-full" />
                <span>专属会员权益</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => {
                alert('模拟跳转到Steam授权页面');
                setShowSteamBind(false);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              通过Steam授权登录
            </button>
            
            <button 
              onClick={() => {
                alert('模拟输入SteamID');
                setShowSteamBind(false);
              }}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
            >
              手动输入SteamID
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <Icon className={color} size={20} />
        <span className="text-xs text-gray-400">{change}</span>
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-white" size={32} />
          </div>
          <h1 className="text-xl font-bold text-white">{mockUser.username}</h1>
          <p className="text-gray-400 text-sm">UID: {mockUser.uid}</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="text-center">
              <p className="text-orange-400 font-bold">{mockUser.level}</p>
              <p className="text-xs text-gray-400">等级</p>
            </div>
            <div className="text-center">
              <p className="text-orange-400 font-bold">{mockUser.points}</p>
              <p className="text-xs text-gray-400">积分</p>
            </div>
            <div className="text-center">
              <p className="text-green-400 font-bold">VIP</p>
              <p className="text-xs text-gray-400">会员</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="text-orange-500" size={20} />
          收益统计
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            title="质押收益"
            value={`¥${mockUser.totalVaultRewards.toFixed(0)}`}
            change="+15.2%"
            icon={Target}
            color="text-green-400"
          />
          <StatCard
            title="套利收益"
            value={`¥${mockUser.totalArbitrageProfit.toFixed(0)}`}
            change="+8.7%"
            icon={TrendingUp}
            color="text-blue-400"
          />
        </div>

        {/* Monthly Profit Chart */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">月度收益趋势</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <XAxis 
                  dataKey="month" 
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
                  dot={{ fill: '#FB923C', strokeWidth: 0, r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#6B7280" 
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs text-gray-400 mt-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span>实际收益</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-1 bg-gray-500" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, #6B7280 2px, #6B7280 4px)' }} />
              <span>目标收益</span>
            </div>
          </div>
        </div>

        {/* Account Binding */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">账号绑定</h2>
          <div className="space-y-3">
            <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-medium">Steam账号</h3>
                  <p className="text-sm text-gray-400">
                    {mockUser.steamBound ? '已绑定' : '未绑定'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowSteamBind(true)}
                className={`px-3 py-1 rounded text-sm ${
                  mockUser.steamBound 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                } transition-colors`}
              >
                {mockUser.steamBound ? '已绑定' : '绑定'}
              </button>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-medium">邮箱绑定</h3>
                  <p className="text-sm text-gray-400">{mockUser.email || '未绑定'}</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors">
                管理
              </button>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">应用设置</h2>
          <div className="space-y-3">
            <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="text-gray-400" size={20} />
                <div>
                  <h3 className="font-medium">推送通知</h3>
                  <p className="text-sm text-gray-400">接收价格变动和套利提醒</p>
                </div>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notificationsEnabled ? 'bg-orange-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="text-gray-400" size={20} />
                <div>
                  <h3 className="font-medium">深色模式</h3>
                  <p className="text-sm text-gray-400">保护眼睛，节省电量</p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  darkMode ? 'bg-orange-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="text-gray-400" size={20} />
                <div>
                  <h3 className="font-medium">语言设置</h3>
                  <p className="text-sm text-gray-400">当前：{language}</p>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-700 text-white px-3 py-1 rounded text-sm"
              >
                <option value="中文">中文</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Help & Feedback */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">帮助与反馈</h2>
          <div className="space-y-3">
            <button className="w-full bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <HelpCircle className="text-gray-400" size={20} />
                <span className="font-medium">常见问题</span>
              </div>
              <div className="text-gray-400">›</div>
            </button>
            
            <button className="w-full bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <MessageSquare className="text-gray-400" size={20} />
                <span className="font-medium">意见反馈</span>
              </div>
              <div className="text-gray-400">›</div>
            </button>
            
            <button className="w-full bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <Award className="text-gray-400" size={20} />
                <span className="font-medium">关于我们</span>
              </div>
              <div className="text-gray-400">›</div>
            </button>
          </div>
        </div>

        {/* Logout */}
        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
          <LogOut size={16} />
          退出登录
        </button>
      </div>

      {/* Steam Bind Modal */}
      {showSteamBind && <SteamBindModal />}
    </div>
  );
};

export default Profile;