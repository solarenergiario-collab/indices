
import React, { useState } from 'react';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';
import { PriceAlert, AlertType, MarketAsset } from '../types';
import { translations, Language } from '../i18n';

interface AlertManagerProps {
  assets: MarketAsset[];
  alerts: PriceAlert[];
  onAddAlert: (alert: Omit<PriceAlert, 'id' | 'isTriggered' | 'createdAt'>) => void;
  onRemoveAlert: (id: string) => void;
  onToggleAlert: (id: string) => void;
  lang: Language;
}

const AlertManager: React.FC<AlertManagerProps> = ({ assets, alerts, onAddAlert, onRemoveAlert, onToggleAlert, lang }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(assets[0].symbol);
  const [targetPrice, setTargetPrice] = useState('');
  const [alertType, setAlertType] = useState<AlertType>(AlertType.ABOVE);
  const t = translations[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPrice) return;
    onAddAlert({
      symbol: selectedSymbol,
      targetPrice: parseFloat(targetPrice),
      type: alertType,
      isActive: true,
    });
    setTargetPrice('');
    setShowForm(false);
  };

  const activeAsset = assets.find(a => a.symbol === selectedSymbol);

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <Bell className="text-amber-400 w-5 h-5" />
          </div>
          <h2 className="font-bold text-white">{t.alerts}</h2>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-2 text-xs font-bold"
        >
          <Plus size={16} />
          {t.new_alert}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 bg-slate-800/50 p-4 rounded-xl border border-indigo-500/30 space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">{t.asset}</label>
              <select 
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {assets.map(asset => (
                  <option key={asset.symbol} value={asset.symbol}>{asset.name} ({asset.symbol})</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">{t.condition}</label>
                <select 
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value as AlertType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value={AlertType.ABOVE}>{t.price_above}</option>
                  <option value={AlertType.BELOW}>{t.price_below}</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">{t.price} ($)</label>
                <input 
                  type="number" 
                  step="any"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder={activeAsset?.price.toFixed(2)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button 
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-xs font-bold transition-colors"
              >
                {t.create_alert}
              </button>
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-xs font-bold transition-colors"
              >
                {t.cancel}
              </button>
            </div>
          </form>
        )}

        {alerts.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bell className="text-slate-600 w-6 h-6" />
            </div>
            <p className="text-sm text-slate-500">No alerts set yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.sort((a, b) => b.createdAt - a.createdAt).map(alert => {
              return (
                <div key={alert.id} className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  alert.isTriggered 
                    ? 'bg-amber-500/10 border-amber-500/30' 
                    : alert.isActive ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-900/20 border-slate-800 opacity-60'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${alert.type === AlertType.ABOVE ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {alert.type === AlertType.ABOVE ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{alert.symbol}</span>
                        {alert.isTriggered && (
                          <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 bg-amber-500 text-amber-950 rounded">Triggered</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Target: <span className="text-slate-300">${alert.targetPrice.toLocaleString()}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onToggleAlert(alert.id)}
                      className={`p-1.5 rounded-lg transition-colors ${alert.isActive ? 'text-indigo-400 hover:bg-indigo-500/10' : 'text-slate-600 hover:bg-slate-800'}`}
                    >
                      <CheckCircle2 size={16} />
                    </button>
                    <button 
                      onClick={() => onRemoveAlert(alert.id)}
                      className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertManager;
