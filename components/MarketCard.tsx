
import React, { useEffect, useRef, useState, memo } from 'react';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { MarketAsset } from '../types';

interface MarketCardProps {
  asset: MarketAsset;
  isSelected: boolean;
  onSelect: (asset: MarketAsset) => void;
}

const MarketCard: React.FC<MarketCardProps> = memo(({ asset, isSelected, onSelect }) => {
  const isPositive = asset.change24h >= 0;
  const prevPriceRef = useRef<number>(asset.price);
  const [flashClass, setFlashClass] = useState<string>('');

  useEffect(() => {
    if (asset.price > prevPriceRef.current) {
      setFlashClass('animate-flash-up');
      const timer = setTimeout(() => setFlashClass(''), 1000);
      return () => clearTimeout(timer);
    } else if (asset.price < prevPriceRef.current) {
      setFlashClass('animate-flash-down');
      const timer = setTimeout(() => setFlashClass(''), 1000);
      return () => clearTimeout(timer);
    }
    prevPriceRef.current = asset.price;
  }, [asset.price]);

  return (
    <div 
      onClick={() => onSelect(asset)}
      className={`group p-5 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-[150px] relative overflow-hidden ${
        isSelected 
          ? 'bg-indigo-600/10 border-indigo-500/50 ring-1 ring-indigo-500/20 shadow-lg shadow-indigo-500/5' 
          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
      } ${flashClass}`}
    >
      {/* Indicador de Seleção */}
      {isSelected && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 blur-2xl -mr-8 -mt-8"></div>
      )}

      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col">
          <h3 className={`font-bold text-sm tracking-tight transition-colors ${isSelected ? 'text-indigo-400' : 'text-slate-200'}`}>
            {asset.symbol}
          </h3>
          <p className="text-slate-500 text-[10px] font-medium truncate max-w-[100px] mt-0.5">{asset.name}</p>
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
          asset.delay === 'Real-time' 
            ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10' 
            : 'bg-slate-800 text-slate-500 border-slate-700'
        }`}>
          {asset.delay}
        </div>
      </div>

      <div className="flex items-end justify-between mt-auto relative z-10">
        <div>
          <p className="text-xl font-bold text-white tracking-tight tabular-nums transition-colors duration-300">
            {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: asset.price < 10 ? 4 : 2 })}
          </p>
          <div className={`flex items-center gap-1 font-bold text-[11px] mt-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{isPositive ? '+' : ''}{asset.change24h}%</span>
          </div>
        </div>
        
        <div className={`p-1.5 rounded-xl transition-all ${isSelected ? 'bg-indigo-600 text-white translate-x-0' : 'bg-slate-800 text-slate-600 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`}>
          <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
});

export default MarketCard;