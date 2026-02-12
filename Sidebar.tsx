
import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Settings,
  ShieldAlert,
  Bell,
  Coins,
  DollarSign,
  Gem,
  BarChart3,
  Globe
} from 'lucide-react';
import { translations, Language } from '../i18n';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  alertCount?: number;
  lang: Language;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, alertCount = 0, lang }) => {
  const t = translations[lang];

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
    { id: 'crypto', icon: Coins, label: t.crypto },
    { id: 'commodities', icon: Gem, label: t.commodities },
    { id: 'funds', icon: BarChart3, label: t.funds },
    { id: 'currencies', icon: DollarSign, label: t.currencies },
    { id: 'indices', icon: Globe, label: t.indices },
    { id: 'alerts', icon: Bell, label: t.alerts, badge: alertCount > 0 ? alertCount : null },
  ];

  return (
    <div className="w-64 h-screen bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <TrendingUp className="text-white w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-white leading-none">TradeFlow</h1>
          <span className="text-[10px] text-indigo-400 font-bold uppercase mt-1 tracking-widest">Day Trade Pro</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} />
              <span className="font-semibold text-sm flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-amber-500">
            <ShieldAlert size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{t.risk_level}</span>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 w-3/4 animate-pulse"></div>
          </div>
          <p className="text-[9px] text-slate-500 mt-2 leading-relaxed">
            {t.high_volatility}
          </p>
        </div>
        
        <button className="w-full mt-4 flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-300 transition-colors">
          <Settings size={18} />
          <span className="font-semibold text-sm">{t.settings}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
