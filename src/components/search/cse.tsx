// cse.tsx
import "./cse.less";
import React, { useEffect } from 'react';

interface Props {
  cx: string;
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
      for (const result of resultElts) {
        console.log(result)
        var titleTag = result.querySelector('a.gs-title');
        var ogUrl = null;
        if (titleTag) {
          ogUrl = titleTag.getAttribute('href');
          console.log(ogUrl);
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
    };
    const resultsReadyWordCloudCallback = function(
      _name: any, _q: any, _promos: any, _results: any, resultsDiv: any) {
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
    (window as any).__gcse || ((window as any).__gcse = {});
    (window as any).__gcse.searchCallbacks = {
      web: {
        rendered: barredResultsRenderedCallback,
        ready: resultsReadyWordCloudCallback
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
