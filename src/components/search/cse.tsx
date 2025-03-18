// cse.tsx
import "./cse.less";
import React, { useEffect } from 'react';
import {misesSearch, maybeToggleMisesSearchResult} from './mises-search';

import {insertAdSenseAd} from './adsense';
interface Props {
  cx: string;
}

const maybeShowDefaultAds =  () => {
  const elements = document.querySelectorAll('.gsc-adBlock');
  if (elements && elements.length === 0) {
    //no gsc ads
    let gscWrapper = document.querySelector('.gsc-wrapper');
    if(gscWrapper){
      insertAdSenseAd(gscWrapper);
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

    const chromeNewURLPattern = /^https?:\/\/chromewebstore.google.com\/detail\/.+?\/([a-z]{32})(?=[/#?]|$)/;
    const barredResultsRenderedCallback = function(_gname: any, _query: any, _promoElts: any, resultElts: any){
      console.log('barredResultsRenderedCallback');
      
      for (const result of resultElts) {
        var titleTag = result.querySelector('a.gs-title');
        var ogUrl = null;
        if (titleTag) {
          ogUrl = titleTag.getAttribute('href');
        }
        if (ogUrl) {
          const match = chromeNewURLPattern.exec(ogUrl);
          if (match && match[1]) {
            console.log(result)
            const container = document.createElement('div');
            result.appendChild(container);
            container.classList.add('crx-download');
            var button = document.createElement('button');
            button.textContent = 'Download Extension CRX';
            button.onclick = function() {
               window.open( `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=130.0.6723.93&acceptformat=crx2,crx3&x=id%3D${match[1]}%26uc&nacl_arch=arm64`, '_blank');
            }
            container.appendChild(button);
          }
          
        }
        
      }

      maybeToggleMisesSearchResult();
      maybeShowDefaultAds();
    };
    const resultsReadyCallback = function(
      _name: any, _q: any, _promos: any, _results: any, resultsDiv: any) {
        console.log('resultsReadyCallback');
        for (const result of _results) {
          if (result.richSnippet && result.richSnippet.metatags && result.richSnippet.metatags.ogUrl) {
            const match = chromeNewURLPattern.exec(result.richSnippet.metatags.ogUrl);
            if (match && match[1]) {
              console.log(result)
              console.log(resultsDiv)
              // const container = document.createElement('div');
              // resultsDiv.appendChild(container);
              // container.id = 'crx_container';
              // var button = document.createElement('button');
              // button.textContent = 'Click Me!';
              // container.appendChild(button);
            }
            
          }
          
        }
        
    };

    const searchStartingCallback = (gname: any, query:string) => {
      console.log('searchStartingCallback', gname, query);
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
