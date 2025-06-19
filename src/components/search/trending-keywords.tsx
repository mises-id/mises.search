import React, { useEffect, useState } from 'react';
import './trending-keywords.less';

interface TrendingKeywordsProps {
  onKeywordClick: (keyword: string) => void;
}

const TrendingKeywords: React.FC<TrendingKeywordsProps> = ({ onKeywordClick }) => {
  const [trendingKeywords, setTrendingKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const CACHE_KEY = 'trending_keywords_cache';
    const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour

    const shuffleArray = (arr: string[]) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }
    const setTrendingKeywordsShuffled = async (keywords: string[]) => {
      const shuffled = shuffleArray(keywords);
      setTrendingKeywords(shuffled.slice(0, 6))
    }

    const fetchTrendingKeywords = async () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        let cachedData = null;
        
        if (cached) {
          cachedData = JSON.parse(cached);
          // Check if cache is expired
          if (Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
            setTrendingKeywordsShuffled(cachedData.keywords);
            setLoading(false);
            return;
          }
        }

        const headers = new Headers();
        if (cachedData?.lastModified) {
          headers.append('If-Modified-Since', cachedData.lastModified);
        }

        try {
          const response = await fetch('https://web3.mises.site/website/config-search.json', {
            headers,
          });
          
          if (response.status === 304) {
            // Data hasn't changed - refresh cache timestamp
            cachedData.timestamp = Date.now();
            localStorage.setItem(CACHE_KEY, JSON.stringify(cachedData));
            setTrendingKeywordsShuffled(cachedData.keywords);
          } else if (response.ok) {
            const config = await response.json();
            let keywords:string[] = [];
            if (config.recommended_sites) {
              config.recommended_sites.forEach((item: any) => {
                if (typeof item.title === 'string') {
                  keywords.push(item.title.toLowerCase())
                }
              });
            }
            
            const lastModified = response.headers.get('Last-Modified') || '';
            
            localStorage.setItem(CACHE_KEY, JSON.stringify({
              keywords,
              lastModified,
              timestamp: Date.now()
            }));
            setTrendingKeywordsShuffled(keywords);
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } catch (fetchErr) {
          // If fetch fails but we have cached data, use that
          if (cachedData) {
            setTrendingKeywordsShuffled(cachedData.keywords);
          } else {
            throw fetchErr;
          }
        }
      } catch (err) {
        setError('Failed to load trending keywords');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingKeywords();
  }, []);

  if (loading) return (
    <div className="trending-keywords">
      <div className="loading-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
  if (error) return <div className="trending-keywords">{error}</div>;

  const truncate = (str: string, maxLength: number) => {
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
  };
  return (
    <div className="trending-keywords">
      <div className="keywords-container">
        {trendingKeywords.map((keyword) => (
          <button
            key={keyword}
            className="keyword-tag"
            onClick={() => onKeywordClick(keyword)}
          >
            {truncate(keyword, 20)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingKeywords;
