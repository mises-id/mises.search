// cse.tsx
import "./cse.less";
import React, { useEffect } from 'react';
import {misesSearch, maybeToggleMisesSearchResult,} from './mises-search';
import TrendingKeywords from './trending-keywords';
import { analytics } from '../../utils/firebase';
import { logEvent } from 'firebase/analytics';

//import {insertAdSenseAd} from './adsense';
interface Props {
  cx: string;
}

const checkGscAds =  (keyword: string) => {
  const elements = document.querySelectorAll('.gsc-adBlock');
  if (elements && elements.length === 0) {
    //no gsc ads
    let gscWrapper = document.querySelector('.gsc-wrapper');
    if(gscWrapper){
      //insertAdSenseAd(gscWrapper);
      return;
    }
  } else if (elements && elements.length > 0) {
    logEvent(analytics, 'gsc_ads_filled', { 
      number: elements.length,
      search_term: keyword
    });
  }
}

const GoogleCustomSearch: React.FC<Props> = ({ cx }) => {
  useEffect(() => {
    // google cse script 
    const script = document.createElement('script');
    script.src = `https://cse.google.com/cse.js?cx=${cx}`;
    script.async = true;
    document.body.appendChild(script);

    const barredResultsRenderedCallback = function(_gname: any, query: any, _promoElts: any, resultElts: any){
      maybeToggleMisesSearchResult(resultElts);
      setTimeout(() => {
        checkGscAds(query);
      }, 1000);
      
    };
    const resultsReadyCallback = function(
      _name: any, _q: any, _promos: any, _results: any, resultsDiv: any) {
      
        
    };

    const searchStartingCallback = (gname: any, query:string) => {
      misesSearch(query);
      return query;
    };

    

    (window as any).__gcse || ((window as any).__gcse = {});
    (window as any).__gcse.searchCallbacks = {
      web: {
        starting: searchStartingCallback,
        rendered: barredResultsRenderedCallback,
        ready: resultsReadyCallback
      },
    };

    // cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, [cx]);



  const handleSearch = (keyword: string) => {
    // Navigate to search results using window.location.hash
    logEvent(analytics, 'trending_search', {
      search_term: keyword
    });
    const searchParams = new URLSearchParams();
    searchParams.set('gsc.q', keyword);
    searchParams.set('gsc.tab', '0');
    window.location.hash = searchParams.toString();


  };

  // google cse container with trending keywords
  return (
    <div className="search-container">

      <TrendingKeywords
        onKeywordClick={(keyword) => {
          handleSearch(keyword);
        }}
      />
      <div className="gcse-search" 
        data-enablehistory="true" 
        data-autocompletemaxcompletions="5"
        data-autocompletemaxpromotions="5"
        data-websearchsafesearch="off"
        data-safesearch="off"
        data-enableorderby="true"
        data-filter="0"
      ></div>
    </div>
  );
};

export default GoogleCustomSearch;
