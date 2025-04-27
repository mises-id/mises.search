import React from 'react';
import { createRoot } from 'react-dom/client';
import { analytics } from '../../utils/firebase';
import { logEvent } from 'firebase/analytics';

interface MisesSearchResult {
    id: string;
    title: string;
    url: string;
    logo: string;
    desc: string;
    type?: string;
    color?: string;
}

interface InternalSearchResult {
  code: number;
  data: MisesSearchResult[];
}
interface MisesSearchResultItemProps {
  item: MisesSearchResult;
}



const MisesSearchResultItem: React.FC<MisesSearchResultItemProps> = ({ item }) => {
  const handleClick = () => {
    logEvent(analytics, 'click_mises_result', {
      content_type: 'web3',
      item_id: item.title
    });
  };

  return (
    <a 
      className="list-item"
      href={item.url}
      target="_blank"
      rel="noreferrer"
      onClick={handleClick}
    >
      <span className="list-item-logo">
        <img
          className="adm-image-img"
          style={(item.color && {
            background: item.color,
            objectFit: "contain",
            borderRadius: '10px',
          }) || {
            objectFit: "contain",
            borderRadius: '10px',
          }}
          src={item.logo}
          alt={item.title}
          draggable={false}
        />
      </span>
      <span className="list-item-content">
        <span>{item.title}</span>
        {item.type === 'crx' && (
        <span className="type">
          CRX
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            width="10px" 
            height="10px"
          >
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
        </span>
      )}
      {item.type === 'webstore' && (
        <span className="type">
          WebStore
        </span>
      )}
        <span className="desc">{item.desc}</span>
      </span>

    </a>
  );
};

const filterData = (data: MisesSearchResult[], elements: NodeListOf<Element>) => {
  return data;
}

const chromeURLPattern = /^https?:\/\/chrome.google.com\/webstore\/.+?\/([a-z]{32})(?=[/#?]|$)/;
const chromeNewURLPattern = /^https?:\/\/chromewebstore.google.com\/detail\/.+?\/([a-z]{32})(?=[/#?]|$)/;
const microsoftURLPattern = /^https?:\/\/microsoftedge.microsoft.com\/addons\/detail\/.+?\/([a-z]{32})(?=[/#?]|$)/;
function isAppleDevice(): boolean {
  return /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
}
const fixForChromeExtension = (item: MisesSearchResult) => {
  if (item && item.url) {
    let result = chromeURLPattern.exec(item.url);
    if (!result) {
        result = chromeNewURLPattern.exec(item.url);
    }
    if (result && result[1]) {
      item.type = 'webstore';
      if (isAppleDevice()) {
        item.url = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=130.0.6723.93&acceptformat=crx2,crx3&x=id%3D${result[1]}%26uc&nacl_arch=arm64`;
        item.type = 'crx';
      }
    }
  }
  return
}

let rootMap = new WeakMap<HTMLElement, any>();

const fillMisesWrapper = (data: MisesSearchResult[], wrapperDiv: HTMLElement) => {
  console.log('fillMisesWrapper')
  if(!Array.isArray(data) || data.length === 0) {
    return;
  }
  
  const chunks: MisesSearchResult[][] = [];
  for (let i = 0; i < data.length; i += 6) {
    chunks.push(data.slice(i, i + 6));
  }

  let root = rootMap.get(wrapperDiv);
  if (!root) {
    root = createRoot(wrapperDiv);
    rootMap.set(wrapperDiv, root);
  }
  root.render(
    <div className="website-outer-container" style={{ display: 'grid' }}>
      {chunks.map((chunk: MisesSearchResult[], chunkIndex: number) => (
        <div key={chunkIndex} className="website-sub-container">
          {chunk.map((item: MisesSearchResult, index: number) => {
            fixForChromeExtension(item);
            return <MisesSearchResultItem key={`${chunkIndex}-${index}`} item={item} />;
          })}
        </div>
      ))}
    </div>
  );
}

const pornKeywords: string[] = [
  "xnxx",
  "pornhub",
  "porn",
  "xxx",
  "xvideos",
  "xhamster",
  "xxx video",
  "porno",
  "xxx videos",
  "sex videos"
];

// 判断关键词是否包含敏感词
export function containsPornKeyword(input: string): boolean {
  const normalized = input.toLowerCase();
  return pornKeywords.some(keyword => normalized.includes(keyword));
}

function getMisesWrapper() {
  let gscWrapper = document.querySelector('.gsc-wrapper');
  if(!gscWrapper){
    return;
  }
  let wrapperDiv = document.getElementById('mises-wrapper');
  if(wrapperDiv){
      const root = rootMap.get(wrapperDiv);
      if(root) {
          root.unmount();
          rootMap.delete(wrapperDiv);
      }
  } else {
    wrapperDiv = document.createElement('div');
    wrapperDiv.id = 'mises-wrapper';
    wrapperDiv.className = 'website-outer-container';
    gscWrapper.prepend(wrapperDiv);
  }
  return wrapperDiv;
}
export const misesSearch = (raw_query:string) => {
  const elements = document.querySelectorAll('.gsc-expansionArea a.gs-title');
  const query = raw_query.trim();
  if(!query){
    return;
  }

  if (containsPornKeyword(query)) {

    const ve : MisesSearchResult = {
      id: 've',
      title: 'Video Easy',
      url: 'https://app.videoeasy.site/index.html#/popular?ctype=porn',
      logo: 'https://app.videoeasy.site/favicon.png',
      desc: 'Free Porn,OnlyFans Leak, Ads free',
      color: 'black'
    }
    const wrapperDiv = getMisesWrapper();
    if (!wrapperDiv) {
      return;
    }
    fillMisesWrapper([ve], wrapperDiv);
    logEvent(analytics, 'mises_search', { 
      step: "porn",
      search_term: query
    });
    

    return
  }
  logEvent(analytics, 'mises_search', { 
    step: "start",
    search_term: query
  });
  


  fetch(`https://api.alb.mises.site/api/v1/website/internal_search?keywords=${query}`)
  .then((response) => response.json() as Promise<InternalSearchResult>)
  .then((ret) => {
    const wrapperDiv = getMisesWrapper();
    if (!wrapperDiv) {
      return;
    }
    if(ret && ret.data && ret.data.length > 0){
      fillMisesWrapper(filterData(ret.data, elements), wrapperDiv);
      logEvent(analytics, 'mises_search', { step: "fill" });
    } else{
      wrapperDiv.style.display = "none";
      wrapperDiv.className = "";
      logEvent(analytics, 'mises_search', { step: "nofill" });
    }
  })
  .catch((error) => {
    logEvent(analytics, 'mises_search', { 
      step: "error",
      error: error.message 
    });
    console.log(error)
  });
}

export const maybeToggleMisesSearchResult = (resultElts: any) => {
  for (const result of resultElts) {
    var titleTag = result.querySelector('a.gs-title');
    var ogUrl = null;
    if (titleTag) {
      ogUrl = titleTag.getAttribute('href');
    }
    if (ogUrl) {
      const match = chromeNewURLPattern.exec(ogUrl);
      if (match && match[1]) {
        const container = document.createElement('div');
        result.appendChild(container);
        container.classList.add('crx-download');
        const button = document.createElement('button');
        button.textContent = 'Download Extension CRX';
        button.onclick = function() {
            window.open( `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=130.0.6723.93&acceptformat=crx2,crx3&x=id%3D${match[1]}%26uc&nacl_arch=arm64`, '_blank');
        }
        container.appendChild(button);
      }
      
      const match1 = microsoftURLPattern.exec(ogUrl);
      if (match1 && match1[1]) {
        const container = document.createElement('div');
        result.appendChild(container);
        container.classList.add('crx-download');
        const button = document.createElement('button');
        button.textContent = 'Download Extension CRX';
        button.onclick = async function() {
            const downloadLink = `https://edge.microsoft.com/extensionwebstorebase/v1/crx?response=redirect&prod=chromiumcrx&prodchannel=&x=id%3D${match1[1]}%26installsource%3Dondemand%26uc`
            window.open( downloadLink, '_self', 'noopener=yes,noreferrer=yes');
        }
        container.appendChild(button);
      }
    }
    
  }
  const mobile = document.querySelector('.gsc-cursor-container-previous');
  const desktop = document.querySelector('.gsc-cursor-page.gsc-cursor-current-page');
  if((mobile && mobile.innerHTML === "") || (desktop && desktop.innerHTML === "1")){
    const elements = document.querySelectorAll('.gsc-expansionArea a.gs-title');
    if (elements && elements.length > 0) {
      let wrapperDiv = document.getElementById('mises-wrapper');
      if(wrapperDiv && wrapperDiv.style.display === "none" && wrapperDiv.innerHTML !== ""){
          wrapperDiv.className = "website-outer-container";
          wrapperDiv.style.display = "grid";
      }
    }
  } else if((mobile && mobile.innerHTML !== "") || (desktop && desktop.innerHTML !== "1")){
    let wrapperDiv = document.getElementById('mises-wrapper');
    if(wrapperDiv && wrapperDiv.style.display === "grid"){
        wrapperDiv.className = "";
        wrapperDiv.style.display = "none";
    }
  }
}
