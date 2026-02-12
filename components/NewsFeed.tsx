
import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, RefreshCw, Clock } from 'lucide-react';
import { fetchMarketNews, NewsItem } from '../services/news';
import { Language, translations } from '../i18n';

interface NewsFeedProps {
  query: string;
  lang: Language;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ query, lang }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const t = translations[lang];

  const loadNews = async () => {
    setLoading(true);
    const data = await fetchMarketNews(query, lang);
    if (data && data.length > 0) {
      setNews(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNews();
  }, [query, lang]);

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col h-full overflow-hidden shadow-lg">
      <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Newspaper className="text-indigo-400 w-5 h-5" />
          </div>
          <h2 className="font-bold text-white">{t.related_news}</h2>
        </div>
        <button 
          disabled={loading}
          onClick={loadNews}
          className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && news.length === 0 ? (
          <div className="py-10 flex flex-col items-center justify-center text-slate-500 space-y-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-medium">{t.fetching_news}</p>
          </div>
        ) : (
          news.map((item, idx) => (
            <div 
              key={idx} 
              className="group p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/60 transition-all cursor-default"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded">
                  {item.source}
                </span>
                {item.time && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Clock size={10} />
                    <span>{item.time}</span>
                  </div>
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-200 leading-snug mb-2 group-hover:text-white transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                {item.summary}
              </p>
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase"
              >
                {t.read_more}
                <ExternalLink size={10} />
              </a>
            </div>
          ))
        )}
        
        {!loading && news.length === 0 && (
          <div className="text-center py-10 text-slate-500 text-sm italic">
            No news found for this asset.
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
