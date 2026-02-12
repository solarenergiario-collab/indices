
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import MarketCard from './components/MarketCard';
import TradingChart from './components/TradingChart';
import GeminiPanel from './components/GeminiPanel';
import AlertManager from './components/AlertManager';
import NewsFeed from './components/NewsFeed';
import CurrencyConverter from './components/CurrencyConverter';
import { ASSETS } from './constants';
import { AssetType, AlertType } from './types';
import type { MarketAsset, PriceAlert } from './types';
import { Search, Bell as BellIcon, X, Languages, Info as InfoIcon, Zap, ChevronUp, ChevronDown as ChevronDownIcon, Activity, ChevronDown } from 'lucide-react';
import { translations, Language } from './i18n';

type SortKey = 'price' | 'change24h' | 'none';
type SortDirection = 'asc' | 'desc';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('pt');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState<MarketAsset[]>(ASSETS);
  const [selectedSymbol, setSelectedSymbol] = useState<string>(ASSETS[0].symbol);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [notifications, setNotifications] = useState<{id: string, message: string}[]>([]);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('none');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const t = translations[lang];

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  useEffect(() => {
    const pollInterval = setInterval(() => {
      setAssets(currentAssets => 
        currentAssets.map(asset => {
          const volatility = asset.type === AssetType.CRYPTO ? 0.008 : 0.003;
          const fluctuation = 1 + (Math.random() * volatility * 2 - volatility);
          return {
            ...asset,
            price: asset.price * fluctuation,
            change24h: parseFloat((asset.change24h + (Math.random() * 0.06 - 0.03)).toFixed(2))
          };
        })
      );
      setLastUpdated(new Date());
    }, 4000);
    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    setAlerts(prevAlerts => {
      let changed = false;
      const nextAlerts = prevAlerts.map(alert => {
        if (!alert.isActive || alert.isTriggered) return alert;
        const asset = assets.find(a => a.symbol === alert.symbol);
        if (!asset) return alert;
        const isTriggered = alert.type === AlertType.ABOVE ? asset.price >= alert.targetPrice : asset.price <= alert.targetPrice;
        if (isTriggered) {
          changed = true;
          addNotification(`${t.alerts}: ${alert.symbol} reached ${alert.targetPrice.toLocaleString()}`);
          return { ...alert, isTriggered: true };
        }
        return alert;
      });
      return changed ? nextAlerts : prevAlerts;
    });
  }, [assets]);

  const addNotification = useCallback((message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 6000);
  }, [t.alerts]);

  const selectedAsset = useMemo(() => 
    assets.find(a => a.symbol === selectedSymbol) || assets[0], 
  [assets, selectedSymbol]);

  const filteredAssets = useMemo(() => {
    let list = assets;
    const typeMap: Record<string, AssetType> = {
      crypto: AssetType.CRYPTO,
      commodities: AssetType.COMMODITY,
      funds: AssetType.FUND,
      currencies: AssetType.CURRENCY,
      indices: AssetType.INDEX
    };
    
    if (activeTab !== 'dashboard' && activeTab !== 'alerts') {
      const assetType = typeMap[activeTab];
      if (assetType) list = list.filter(a => a.type === assetType);
    }

    if (searchQuery) {
      list = list.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.symbol.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    if (sortKey !== 'none') {
      list = [...list].sort((a, b) => {
        let valA = sortKey === 'price' ? a.price : a.change24h;
        let valB = sortKey === 'price' ? b.price : b.change24h;
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      });
    }

    return list;
  }, [activeTab, searchQuery, assets, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-100 overflow-hidden font-inter">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} alertCount={alerts.filter(a => a.isTriggered && a.isActive).length} lang={lang} />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="fixed top-24 right-8 z-[60] space-y-3 pointer-events-none">
          {notifications.map(n => (
            <div key={n.id} className="pointer-events-auto bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-indigo-400/30 flex items-center gap-4 animate-in slide-in-from-right duration-300">
              <div className="p-2 bg-white/20 rounded-xl"><BellIcon size={20} /></div>
              <p className="text-sm font-semibold pr-4">{n.message}</p>
              <button onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))} className="p-1 hover:bg-white/10 rounded-lg"><X size={16} /></button>
            </div>
          ))}
        </div>

        <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-xl z-20 shrink-0">
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder={t.search_placeholder} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:text-slate-600"
              />
            </div>
            
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase leading-none tracking-wider">Live Stream</span>
                <span className="text-[9px] text-slate-500 font-medium tabular-nums mt-0.5">
                  Update: {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors text-xs font-bold">
                <Languages size={16} className="text-indigo-400" />
                <span className="hidden sm:inline">{languages.find(l => l.code === lang)?.flag}</span>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLangOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                  {languages.map(l => (
                    <button key={l.code} onClick={() => { setLang(l.code as Language); setIsLangOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-800 ${lang === l.code ? 'text-indigo-400 bg-indigo-500/5' : 'text-slate-300'}`}>
                      <span>{l.flag}</span><span className="font-medium">{l.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setActiveTab('alerts')} className="p-2.5 rounded-xl hover:bg-slate-900 text-slate-400 relative border border-slate-800 transition-all">
              <BellIcon size={20} />
              {alerts.some(a => a.isTriggered && a.isActive) && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900 animate-pulse"></span>}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#020617] custom-scrollbar">
          <div className="p-8 pb-32">
            {activeTab === 'alerts' ? (
              <div className="max-w-4xl mx-auto space-y-8">
                 <h2 className="text-3xl font-bold text-white tracking-tight">{t.alerts}</h2>
                 <AlertManager assets={assets} alerts={alerts} onAddAlert={(d) => setAlerts(prev => [...prev, {...d, id: Math.random().toString(), isTriggered: false, createdAt: Date.now()}])} onRemoveAlert={(id) => setAlerts(p => p.filter(a => a.id !== id))} onToggleAlert={(id) => setAlerts(p => p.map(a => a.id === id ? {...a, isActive: !a.isActive, isTriggered: false} : a))} lang={lang} />
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-8 space-y-8">
                  <section className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Zap size={14} className="text-indigo-400" /> {t.market_overview}
                      </h3>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.sort_by}:</span>
                        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                          <button 
                            onClick={() => handleSort('price')}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${sortKey === 'price' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            {t.price}
                            {sortKey === 'price' && (sortDirection === 'asc' ? <ChevronUp size={10} /> : <ChevronDownIcon size={10} />)}
                          </button>
                          <button 
                            onClick={() => handleSort('change24h')}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${sortKey === 'change24h' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            {t.change_24h}
                            {sortKey === 'change24h' && (sortDirection === 'asc' ? <ChevronUp size={10} /> : <ChevronDownIcon size={10} />)}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {filteredAssets.map(asset => (
                        <MarketCard 
                          key={asset.symbol} 
                          asset={asset} 
                          isSelected={selectedSymbol === asset.symbol} 
                          onSelect={(a) => setSelectedSymbol(a.symbol)} 
                        />
                      ))}
                    </div>
                  </section>

                  <section className="bg-slate-900/40 rounded-[32px] border border-slate-800/60 p-8 space-y-8 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-3xl font-bold text-indigo-400 shadow-inner">
                          {selectedAsset.symbol.charAt(0)}
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-white tracking-tight">{selectedAsset.name}</h2>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{selectedAsset.symbol}</span>
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors duration-500 ${selectedAsset.change24h >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                              {selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-bold text-white tabular-nums tracking-tighter transition-all duration-300">
                          ${selectedAsset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: selectedAsset.price < 1 ? 6 : 2 })}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">{t.price} USD</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                         <Activity size={16} className="text-indigo-400" /> {t.asset_history}
                       </div>
                       <div className="h-[400px]">
                         <TradingChart basePrice={selectedAsset.price} color={selectedAsset.change24h >= 0 ? '#10b981' : '#f43f5e'} />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">{t.volume}</h4>
                        <p className="text-xl font-bold text-white tabular-nums">{selectedAsset.volume24h}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 col-span-2">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">{t.market_cap}</h4>
                        <p className="text-sm text-slate-300 leading-relaxed italic">"{selectedAsset.description}"</p>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="xl:col-span-4 space-y-8">
                  <div className="sticky top-8 space-y-8">
                    <GeminiPanel asset={selectedAsset} lang={lang} />
                    <CurrencyConverter assets={assets} lang={lang} />
                    <NewsFeed query={selectedAsset.name + " day trading news today analysis"} lang={lang} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="h-16 bg-slate-950/80 backdrop-blur-2xl border-t border-slate-800/50 px-8 flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center gap-4">
            <InfoIcon size={14} className="text-indigo-400" />
            <p className="text-[10px] text-slate-500 leading-none uppercase tracking-wider">{t.data_disclaimer}</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <Activity size={12} className="text-emerald-500" />
                <span>42ms</span>
             </div>
             <div className="h-4 w-[1px] bg-slate-800"></div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Online</span>
             </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
