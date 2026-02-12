
import React, { useState, useMemo } from 'react';
import { Repeat, ArrowRightLeft, DollarSign } from 'lucide-react';
import { MarketAsset } from '../types';
import { translations, Language } from '../i18n';

interface CurrencyConverterProps {
  assets: MarketAsset[];
  lang: Language;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ assets, lang }) => {
  const t = translations[lang];
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('BRL');

  // Available unique currencies derived from assets and common ones
  const availableCurrencies = useMemo(() => {
    return ['USD', 'BRL', 'EUR', 'GBP', 'JPY', 'INR'];
  }, []);

  // Simplified conversion logic based on available asset pairs
  const conversionRate = useMemo(() => {
    // Base rates relative to USD
    const rates: Record<string, number> = {
      USD: 1,
      BRL: assets.find(a => a.symbol === 'USDBRL')?.price || 5.12,
      EUR: 1 / (assets.find(a => a.symbol === 'EURUSD')?.price || 1.08),
      GBP: 0.79, // Mock if not in assets
      JPY: 156.40, // Mock
      INR: 83.30, // Mock
    };

    if (!rates[fromCurrency] || !rates[toCurrency]) return 1;
    
    // Convert from source to USD then to target
    const inUSD = parseFloat(amount) / rates[fromCurrency];
    return rates[toCurrency] / rates[fromCurrency];
  }, [fromCurrency, toCurrency, amount, assets]);

  const result = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 0;
    return numAmount * conversionRate;
  }, [amount, conversionRate]);

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-lg transition-all hover:border-indigo-500/30">
      <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <Repeat className="text-emerald-400 w-5 h-5" />
          </div>
          <h2 className="font-bold text-white">{t.currency_converter}</h2>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-500 block">{t.amount}</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <DollarSign size={14} />
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-500 block">{t.from}</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {availableCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button
            onClick={swapCurrencies}
            className="mt-5 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 border border-slate-700 transition-all active:scale-95"
          >
            <ArrowRightLeft size={16} />
          </button>

          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-500 block">{t.to}</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {availableCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="pt-2">
          <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-center">
            <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">{t.converted_value}</span>
            <div className="text-xl font-bold text-white">
              {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} 
              <span className="text-indigo-400 ml-1.5 text-sm uppercase">{toCurrency}</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-500 italic">
              1 {fromCurrency} = {conversionRate.toFixed(4)} {toCurrency}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
