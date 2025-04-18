// cse.tsx
import "./cse.less";
import React, { useEffect } from 'react';
import {misesSearch, maybeToggleMisesSearchResult,} from './mises-search';

//import {insertAdSenseAd} from './adsense';
interface Props {
  cx: string;
}

const maybeShowDefaultAds =  () => {
  const elements = document.querySelectorAll('.gsc-adBlock');
  if (elements && elements.length === 0) {
    //no gsc ads
    let gscWrapper = document.querySelector('.gsc-wrapper');
    if(gscWrapper){
      //insertAdSenseAd(gscWrapper);
      return;
    }
  }
}

const GoogleCustomSearch: React.FC<Props> = ({ cx }) => {
  useEffect(() => {
    // google cse script 
    const script = document.createElement('script');
    script.src = `https://cse.google.com/cse.js?cx=${cx}`;
    script.async = true;
    document.body.appendChild(script);

    const barredResultsRenderedCallback = function(_gname: any, _query: any, _promoElts: any, resultElts: any){

      maybeToggleMisesSearchResult(resultElts);
      maybeShowDefaultAds();
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

  // google cse container
  return <div className="gcse-search"></div>;
};

export default GoogleCustomSearch;
