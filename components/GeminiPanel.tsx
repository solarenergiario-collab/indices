
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Target, BrainCircuit, ExternalLink, RefreshCw } from 'lucide-react';
import { analyzeMarketAsset } from '../services/gemini';
import { MarketAsset, AnalysisResult } from '../types';
import { translations, Language } from '../i18n';

interface GeminiPanelProps {
  asset: MarketAsset;
  lang: Language;
}

const GeminiPanel: React.FC<GeminiPanelProps> = ({ asset, lang }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const t = translations[lang];

  const performAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeMarketAsset(asset.symbol, asset.name, lang);
      setAnalysis(result);
    } catch (err) {
      setError("Analysis error / Error de análise / 分析错误");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performAnalysis();
  }, [asset.symbol, lang]);

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-indigo-500/20 flex flex-col h-full overflow-hidden shadow-2xl shadow-indigo-500/5">
      <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Sparkles className="text-indigo-400 w-5 h-5" />
          </div>
          <h2 className="font-bold text-white">{t.ai_advisor}</h2>
        </div>
        <button 
          disabled={loading}
          onClick={performAnalysis}
          className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4 py-20 text-slate-500">
            <Loader2 className="animate-spin w-10 h-10 text-indigo-500" />
            <div className="text-center">
              <p className="text-sm font-medium text-slate-300">{t.consulting_global}</p>
              <p className="text-xs">{t.analyzing_via} (${asset.symbol})</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-rose-400 text-sm">
            {error}
          </div>
        ) : analysis ? (
          <>
            <div className="flex items-center gap-4">
               <div className={`flex-1 p-3 rounded-xl border text-center ${
                 analysis.sentiment === 'Bullish' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                 analysis.sentiment === 'Bearish' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                 'bg-slate-800 border-slate-700 text-slate-300'
               }`}>
                 <span className="text-[10px] uppercase font-bold tracking-widest block mb-1">{t.sentiment}</span>
                 <span className="text-lg font-bold">{analysis.sentiment}</span>
               </div>
               <div className="flex-1 p-3 rounded-xl border border-slate-700 bg-slate-800 text-center">
                 <span className="text-[10px] uppercase font-bold tracking-widest block mb-1">{t.recommendation}</span>
                 <span className="text-lg font-bold text-indigo-400">{analysis.recommendation}</span>
               </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-wider">
                <BrainCircuit size={16} className="text-indigo-400" />
                <span>{t.ai_insight}</span>
              </div>
              <div className="text-slate-300 text-sm leading-relaxed bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 whitespace-pre-wrap">
                {analysis.summary}
              </div>
            </div>

            <div className="space-y-3">
               <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-wider">
                <Target size={16} className="text-rose-400" />
                <span>{t.target_zones}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">{t.support}</span>
                  <div className="space-y-1">
                    {analysis.keyLevels.support.map((lvl, idx) => (
                      <div key={idx} className="text-sm font-mono text-emerald-400">${lvl}</div>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">{t.resistance}</span>
                  <div className="space-y-1">
                    {analysis.keyLevels.resistance.map((lvl, idx) => (
                      <div key={idx} className="text-sm font-mono text-rose-400">${lvl}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {analysis.sources.length > 0 && (
              <div className="space-y-4">
                <div className="text-slate-400 text-sm font-bold uppercase tracking-wider">
                  {t.grounding_sources}
                </div>
                <div className="space-y-3">
                  {analysis.sources.map((source, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-2 hover:border-indigo-500/30 transition-all">
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between group"
                      >
                        <span className="text-xs font-bold text-indigo-300 group-hover:text-indigo-400 truncate pr-4 transition-colors">
                          {source.title}
                        </span>
                        <ExternalLink size={12} className="text-slate-500 shrink-0" />
                      </a>
                      {source.snippet && (
                        <p className="text-[10px] text-slate-400 leading-relaxed italic border-l-2 border-slate-700 pl-3">
                          "{source.snippet}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default GeminiPanel;
