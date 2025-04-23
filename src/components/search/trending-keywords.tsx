import React from 'react';
import './trending-keywords.less';

interface TrendingKeywordsProps {
  keywords: string[];
  onKeywordClick: (keyword: string) => void;
}

const TrendingKeywords: React.FC<TrendingKeywordsProps> = ({ keywords, onKeywordClick }) => {
  return (
    <div className="trending-keywords">
      <div className="keywords-container">
        {keywords.map((keyword) => (
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
