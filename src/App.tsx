import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNavigation from './components/BottomNavigation';
import Home from './pages/Home';
import Market from './pages/Market';
import Arbitrage from './pages/Arbitrage';
import Vault from './pages/Vault';
import Profile from './pages/Profile';
import SkinDetail from './pages/SkinDetail';
import MarketDetail from './pages/MarketDetail';
import ArbitrageDetail from './pages/ArbitrageDetail';
import VaultStake from './pages/VaultStake';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/market" element={<Market />} />
            <Route path="/arbitrage" element={<Arbitrage />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/skin/:id" element={<SkinDetail />} />
            <Route path="/market/:platform/:id" element={<MarketDetail />} />
            <Route path="/arbitrage/:id" element={<ArbitrageDetail />} />
            <Route path="/vault/stake" element={<VaultStake />} />
          </Routes>
        </div>
        <BottomNavigation />
      </div>
    </Router>
  );
}

export default App;