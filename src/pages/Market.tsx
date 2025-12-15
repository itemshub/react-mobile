import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, Grid, List, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { mockSkins } from '../data/mockData';
import { SkinItem } from '../types';
import { api_case, api_index } from '@/utils/request';
import { LoadingPage } from '@/components/LoadingPage';

const Market = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [skins, setSkins] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedRarity, setSelectedRarity] = useState('全部');
  const [selectedSource, setSelectedSource] = useState('全部');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('price');

  const [initLock, setInitLock] = useState<boolean>(false);
  const [indexData, setIndexData] = useState<any>({});
  const [cases, setCases] = useState<any>(mockSkins);
  const [showFilters, setShowFilters] = useState(false);
  const categories = ['全部', 'AK', 'M4', 'AWP', 'USP', 'Pistol', 'Rifle'];
  const rarities = ['全部', 'Consumer Grade', 'Industrial Grade', 'Restricted', 'Classified', 'Covert', 'Contraband'];
  const sources = ['全部', '箱子', '收藏', '限定'];

  
  const filterSkins = (indexDatas:any,search = searchQuery, category = selectedCategory, rarity = selectedRarity, source = selectedSource) => {
    let filtered = indexDatas?.skins;
    
    if (search) {
      filtered = filtered.filter(skin => 
        skin.name.toLowerCase().includes(search.toLowerCase()) ||
        skin.skin.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category !== '全部') {
      filtered = filtered.filter(skin => skin.category === category);
    }
    
    if (rarity !== '全部') {
      filtered = filtered.filter(skin => skin.rarity === rarity);
    }
    
    // Sort
    filtered = filtered.sort((a, b) => {
      console.log(sortBy)
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'change':
          return b.averageSub - a.averageSub;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    
    setSkins(filtered);
  };


  const load = async () => {
    try {
      const data= await api_index()
      setIndexData(data?.data);
      console.log(data?.data)
      const cs = await api_case();
      setCases(cs?.data);
      setInitLock(true)
      searchFn(data.data)
    } catch (err) {
      console.error("请求失败:", err);
    }
  };

  const searchFn = (indexDatas:any) =>
  {
    // Parse search query from URL
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
      filterSkins(indexDatas,search, selectedCategory, selectedRarity, selectedSource);
    }else{
      filterSkins(indexDatas)
    }
  }

  useEffect(() => {
    if(!initLock)
    {
      load();
    }else{
      if(indexData?.skins)
      {
        searchFn(indexData)
      }
      
    }
  }, [location.search,sortBy]);

  if (!indexData?.skins) {
    return (
      <LoadingPage/>
    );
  }
  

  const handleSearch = () => {
    filterSkins(indexData);
    const newSearchParams = new URLSearchParams();
    if (searchQuery) {
      newSearchParams.set('search', searchQuery);
    }
    navigate(`${location.pathname}?${newSearchParams.toString()}`);
  };

  const handleFilterChange = () => {
    filterSkins(indexData);
  };



  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="搜索饰品..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            <Filter size={20} />
          </button>
          <button 
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 bg-gray-700 rounded-lg p-4 space-y-4">
            {/* <div>
              <h4 className="text-sm font-medium mb-2">分类</h4>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      handleFilterChange();
                    }}
                    className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                      selectedCategory === category 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div> */}
            
            {/* <div>
              <h4 className="text-sm font-medium mb-2">稀有度</h4>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {rarities.map((rarity) => (
                  <button
                    key={rarity}
                    onClick={() => {
                      setSelectedRarity(rarity);
                      handleFilterChange();
                    }}
                    className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                      selectedRarity === rarity 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {rarity}
                  </button>
                ))}
              </div>
            </div> */}

            {/* <div>
              <h4 className="text-sm font-medium mb-2">来源</h4>
              <div className="flex gap-2">
                {sources.map((source) => (
                  <button
                    key={source}
                    onClick={() => {
                      setSelectedSource(source);
                      handleFilterChange();
                    }}
                    className={`px-3 py-1 rounded-full text-xs ${
                      selectedSource === source 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {source}
                  </button>
                ))}
              </div>
            </div> */}

            <div>
              <h4 className="text-sm font-medium mb-2">排序</h4>
              <select
                value={sortBy}
                onChange={async(e) => {
                  setSortBy(e.target.value);
                  // handleFilterChange();
                }}
                className="w-full bg-gray-600 text-white rounded px-3 py-2 text-sm"
              >
                <option value="price">价格排序</option>
                <option value="change">价差排序</option>
                <option value="name">名称排序</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
        <p className="text-sm text-gray-400">
          找到 {skins.length} 个饰品
        </p>
      </div>

      {/* Skins List */}
      <div className="px-4 py-4">
        {skins.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">没有找到匹配的饰品</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-4">
            {skins.map((skin) => (
              <div 
                key={skin.skin}
                onClick={() => navigate(`/skin/${skin.id}`)}
                className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="aspect-square bg-gray-700 relative">
                  <img 
                    src={skin.img_url} 
                    alt={skin.name}
                    className="w-full h-full object-cover"
                  />
                  {/* <button className="absolute top-2 right-2 p-1 bg-black/50 rounded-full">
                    <Star size={16} className="text-gray-300" />
                  </button> */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-xs text-gray-300">{(skin.offers).toFixed(0)}</p>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm mb-1 truncate">{skin.name}</h3>
                  <p className="text-xs text-gray-400 mb-2 truncate">{skin.skin}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-orange-400">¥{skin.price.toFixed(2)}</span>
                    <span className={`text-xs flex items-center gap-1 text-green-400`}>
                      {/* {skin.change24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />} */}
                      ± {(skin.averageSub*100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {skins.map((skin) => (
              <div 
                key={skin.skin}
                onClick={() => navigate(`/skin/${skin.skin}`)}
                className="bg-gray-800 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <img 
                  src={skin.img_url} 
                  alt={skin.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{skin.name}</h3>
                  <p className="text-sm text-gray-400 mb-1">{skin.skin}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-orange-400">¥{skin.price.toFixed(2)}</span>
                    <span className={`text-sm flex items-center gap-1 text-green-400`}>
                      {/* {skin.change24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />} */}
                      ± {(skin.averageSub*100).toFixed(2)}%
                    </span>
                    {/* <span className="text-xs text-gray-500">{skin.name}</span> */}
                  </div>
                </div>
                {/* <button className="p-2 hover:bg-gray-700 rounded">
                  <Star size={16} className="text-gray-400" />
                </button> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Market;