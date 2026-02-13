
import React, { useState } from 'react';
import { Header } from './components/Header';
import { MarketList } from './components/MarketList';
import { Simulator } from './components/Simulator';
import { Glossary } from './components/Glossary';
import { UploadAnalyzer } from './components/UploadAnalyzer';
import { Whisper } from './components/Whisper';
import { Tutorial } from './components/Tutorial';
import { Welcome } from './components/Welcome';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginModal } from './components/LoginModal';
import { Pricing } from './components/Pricing';
import { ReportsHub } from './components/ReportsHub';
import { Footer } from './components/Footer';
import { Coin } from './types';
import { COIN_DATA_SEED } from './constants';

function App() {
  const [currentView, setCurrentView] = useState('welcome');
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleCoinSelect = (coin: Coin) => {
    setSelectedCoin(coin);
    setCurrentView('sandbox');
    window.scrollTo(0,0);
  };

  const handleLogin = (user: any, role: 'member' | 'admin') => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    if (role === 'admin') {
      setIsAdmin(true);
      setCurrentView('admin');
    } else {
      setIsAdmin(false);
      setCurrentView('market');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentUser(null);
    setCurrentView('welcome');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'welcome':
        return <Welcome 
                  onStart={() => { 
                      setIsLoggedIn(true);
                      setCurrentView('market'); 
                      window.scrollTo(0,0); 
                  }}
                  onLoginClick={() => setShowLoginModal(true)} 
                  onPricingClick={() => setView('pricing')}
               />;
      case 'pricing':
        return <Pricing onJoinClick={() => {
          if (isLoggedIn) setView('market');
          else setShowLoginModal(true);
        }} />;
      case 'market':
        return <MarketList onSelectCoin={handleCoinSelect} onViewReports={() => setView('reports')} />;
      case 'reports':
        return <ReportsHub />;
      case 'sandbox':
        if (selectedCoin) {
          return <Simulator coin={selectedCoin} onBack={() => setView('market')} />;
        }
        return <MarketList onSelectCoin={handleCoinSelect} onViewReports={() => setView('reports')} />;
      case 'upload':
        return <UploadAnalyzer />;
      case 'whisper':
        return <Whisper />;
      case 'glossary':
        return <Glossary />;
      case 'tutorial':
        return <Tutorial />;
      case 'admin':
        return isAdmin ? <AdminDashboard /> : <Welcome onStart={() => setCurrentView('market')} onLoginClick={() => setShowLoginModal(true)} onPricingClick={() => setView('pricing')} />;
      default:
        return <Welcome onStart={() => { setCurrentView('market'); window.scrollTo(0,0); }} onLoginClick={() => setShowLoginModal(true)} onPricingClick={() => setView('pricing')} />;
    }
  };

  const setView = (view: string) => {
    if (view === 'sandbox' && !selectedCoin) {
      setSelectedCoin(COIN_DATA_SEED[0]);
    }
    setCurrentView(view);
    window.scrollTo(0,0);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header 
        currentView={currentView} 
        setView={setView} 
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLoginClick={() => setShowLoginModal(true)}
        onLogoutClick={handleLogout}
      />
      <main className="flex-grow pt-6">
        {renderContent()}
      </main>
      <Footer />

      {showLoginModal && (
        <LoginModal 
            onClose={() => setShowLoginModal(false)}
            onLogin={handleLogin}
        />
      )}
    </div>
  );
}

export default App;
