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

    const fetchTrendingKeywords = async () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        let cachedData = null;
        
        if (cached) {
          cachedData = JSON.parse(cached);
          // Check if cache is expired
          if (Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
            setTrendingKeywords(cachedData.keywords);
            setLoading(false);
            return;
          }
        }

        const headers = new Headers();
        if (cachedData?.lastModified) {
          headers.append('If-Modified-Since', cachedData.lastModified);
        }

        try {
          const response = await fetch('https://web3.mises.site/website/config.json', {
            headers,
          });
          
          if (response.status === 304) {
            // Data hasn't changed - refresh cache timestamp
            cachedData.timestamp = Date.now();
            localStorage.setItem(CACHE_KEY, JSON.stringify(cachedData));
            setTrendingKeywords(cachedData.keywords);
          } else if (response.ok) {
            const config = await response.json();
            let keywords:string[] = [];
            if (config.recommended_extensions) {
              config.recommended_extensions.forEach((item: any) => {
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
            setTrendingKeywords(keywords);
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } catch (fetchErr) {
          // If fetch fails but we have cached data, use that
          if (cachedData) {
            setTrendingKeywords(cachedData.keywords);
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
  return (
    <div className="trending-keywords">
      <div className="keywords-container">
        {trendingKeywords.map((keyword) => (
          <button
            key={keyword}
            className="keyword-tag"
            onClick={() => onKeywordClick(keyword)}
          >
            {keyword}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingKeywords;
