
import React, { useState, useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Brush
} from 'recharts';
import { ChartDataPoint } from '../types';
import { generateMockHistory } from '../constants';

interface TradingChartProps {
  basePrice: number;
  color?: string;
}

type TimeRange = '1D' | '5D' | '1M' | '1Y';

const TradingChart: React.FC<TradingChartProps> = ({ basePrice, color = "#6366f1" }) => {
  const [range, setRange] = useState<TimeRange>('1D');

  // Map ranges to data counts and labels
  const rangeConfig = {
    '1D': { count: 24, label: 'Hours' },
    '5D': { count: 120, label: 'Hours' },
    '1M': { count: 30, label: 'Days' },
    '1Y': { count: 365, label: 'Days' },
  };

  const data = useMemo(() => {
    const config = rangeConfig[range];
    // Generate mock history based on range
    return generateMockHistory(basePrice, config.count).map((item, idx) => ({
      ...item,
      // Overwrite time labels for longer ranges
      time: range === '1D' || range === '5D' 
        ? item.time 
        : range === '1M' 
          ? `Day ${idx + 1}`
          : `Week ${Math.floor(idx / 7) + 1}`
    }));
  }, [basePrice, range]);

  const ranges: TimeRange[] = ['1D', '5D', '1M', '1Y'];

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {/* Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                range === r 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Interactive View
        </div>
      </div>

      <div className="flex-1 min-h-[300px] bg-slate-800/30 rounded-3xl p-6 border border-slate-700/50 relative group">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10 }} 
              dy={10}
              minTickGap={30}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10 }} 
              dx={-10}
              tickFormatter={(val) => `$${val.toLocaleString()}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid #334155', 
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
              }}
              itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
              labelStyle={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={color} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              animationDuration={800}
              activeDot={{ r: 6, stroke: '#0f172a', strokeWidth: 2, fill: color }}
            />
            <Brush 
              dataKey="time" 
              height={30} 
              stroke="#475569" 
              fill="#1e293b"
              travellerWidth={10}
              gap={1}
              className="mt-4"
            >
              <AreaChart>
                <Area dataKey="price" stroke={color} fill={color} fillOpacity={0.1} />
              </AreaChart>
            </Brush>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="h-24 bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50">
        <div className="text-[9px] font-bold text-slate-500 uppercase mb-2">Volume Traded</div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <Bar 
              dataKey="volume" 
              fill="#475569" 
              radius={[4, 4, 0, 0]} 
              opacity={0.6}
            />
            <Tooltip 
               cursor={{ fill: '#334155', opacity: 0.2 }}
               contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
               itemStyle={{ color: '#f8fafc' }}
               labelStyle={{ display: 'none' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TradingChart;
