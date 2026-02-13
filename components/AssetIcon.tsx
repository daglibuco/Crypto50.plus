
import React, { useState } from 'react';
import { Coin } from '../types';

interface AssetIconProps {
  coin: Coin;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AssetIcon: React.FC<AssetIconProps> = ({ coin, size = 'md', className = "" }) => {
  const [retryCount, setRetryCount] = useState(0);
  const symbol = coin.symbol.toLowerCase();

  // Tier 1: Optimized High-Authority Mapping
  const STATIC_MAP: Record<string, string> = {
    btc: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    eth: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    sol: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    xrp: 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
    ada: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
    doge: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
    dot: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png',
    trx: 'https://cryptologos.cc/logos/tron-trx-logo.png',
    link: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
    avax: 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
    matic: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    pepe: 'https://cryptologos.cc/logos/pepe-pepe-logo.png',
    bonk: 'https://cryptologos.cc/logos/bonk-bonk-logo.png',
  };

  const getImageUrl = () => {
    // Stage 1: Static High-Res Mapping
    if (STATIC_MAP[symbol] && retryCount === 0) return STATIC_MAP[symbol];
    
    // Stage 2: Trust Wallet Assets - Direct path verification
    if (retryCount === 0) return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${coin.symbol}/logo.png`;
    
    // Stage 3: Community Standard Repository (SpotHQ)
    if (retryCount === 1) return `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${symbol}.png`;
    
    // Stage 4: API Fallbacks
    if (retryCount === 2) return `https://cryptoicons.org/api/icon/${symbol}/128`;
    if (retryCount === 3) return `https://assets.coincap.io/assets/icons/${symbol}@2x.png`;
    
    return null; // Exhausted repositories
  };

  const currentUrl = getImageUrl();

  const sizeClasses = {
    sm: 'w-10 h-10 rounded-xl text-lg',
    md: 'w-16 h-16 rounded-2xl text-2xl',
    lg: 'w-24 h-24 rounded-[2rem] text-4xl',
    xl: 'w-32 h-32 rounded-[2.5rem] text-6xl'
  };

  const getAssetGradient = (s: string) => {
    const gradients = [
      'from-blue-600 to-indigo-800',
      'from-emerald-600 to-teal-800',
      'from-orange-600 to-rose-800',
      'from-purple-600 to-fuchsia-800',
      'from-slate-700 to-slate-950'
    ];
    const index = s.length % gradients.length;
    return gradients[index];
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br ${getAssetGradient(coin.symbol)} flex items-center justify-center overflow-hidden shadow-2xl transform transition-transform relative shrink-0 border-4 border-white/5 ${className}`}>
      {currentUrl ? (
        <img 
          src={currentUrl} 
          alt={coin.name} 
          className="w-full h-full object-contain p-2.5 bg-white/5 backdrop-blur-sm"
          onError={() => setRetryCount(prev => prev + 1)}
        />
      ) : (
        <span className="font-black text-white uppercase tracking-tighter drop-shadow-md">{coin.symbol[0]}</span>
      )}
    </div>
  );
};
