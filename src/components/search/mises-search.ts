import { analytics } from '../../utils/firebase';
import { logEvent } from 'firebase/analytics';

const filterData = (data:any, elements:NodeListOf<Element>) => {
  return data;
}

const chromeURLPattern = /^https?:\/\/chrome.google.com\/webstore\/.+?\/([a-z]{32})(?=[/#?]|$)/;
const chromeNewURLPattern = /^https?:\/\/chromewebstore.google.com\/detail\/.+?\/([a-z]{32})(?=[/#?]|$)/;
function isAppleDevice(): boolean {
  return /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
}
const fixForExtension = (item: any) => {
  if (item && item.url) {
    let result = chromeURLPattern.exec(item.url);
    if (!result) {
        result = chromeNewURLPattern.exec(item.url);
    }
    if (result && result[1]) {
      if (isAppleDevice()) {
        item.url = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=130.0.6723.93&acceptformat=crx2,crx3&x=id%3D${result[1]}%26uc&nacl_arch=arm64`;
        item.title = item.title + ' [Download Extension CRX]'
      } else {
        item.title = item.title + ' [Extension]'
      }
    }
  }
  return
}

const fillMisesWrapper = (data:any, wrapperDiv:HTMLElement) => {
  if(!Array.isArray(data) || data.length === 0){
      return
  }
  let iterator:HTMLDivElement;
  data.forEach((item, index) => {
      if(index % 6 === 0){
        let subContainer = document.createElement('div');
        subContainer.className = "website-sub-container";
        wrapperDiv.appendChild(subContainer);
        iterator = subContainer;
      }
      fixForExtension(item)
      const a = document.createElement('a');
      a.className = "list-item";
      a.href = item.url;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.addEventListener('click', () => {
        logEvent(analytics, 'click_result', {
          content_type: 'mises_result',
          item_id: item.url
        });
      });
      a.innerHTML = `
      <div class="list-item-logo"><div class="adm-image" style="--width: 40px; width: 40px; --height: 40px; height: 40px; border-radius: 50px;"><img class="adm-image-img" src="${item.logo}" alt="${item.title}" draggable="false" style="object-fit: contain; display: block;"></div></div>
      <div class="list-item-content"><span>${item.title}</span><p class="desc">${item.desc}</p></div>
      `;
      iterator.appendChild(a);
  });
  wrapperDiv.className = "website-outer-container";
  wrapperDiv.style.display = "grid";
}

export const misesSearch = (raw_query:string) => {
  const elements = document.querySelectorAll('.gsc-expansionArea a.gs-title');
  const query = raw_query.trim();
  if(!query){
    return;
  }
  logEvent(analytics, 'search', { search_term: query });
  fetch(`https://api.alb.mises.site/api/v1/website/internal_search?keywords=${query}`)
  .then((response) => response.json())
  .then((ret) => {
    let gscWrapper = document.querySelector('.gsc-wrapper');
    if(!gscWrapper){
      return;
    }
    let wrapperDiv = document.getElementById('mises-wrapper');
    if(wrapperDiv){
        wrapperDiv.innerHTML = "";
    }
    if(ret && ret.data && ret.data.length > 0){
      if (!wrapperDiv) {
        wrapperDiv = document.createElement('div');
        wrapperDiv.id = 'mises-wrapper';
        wrapperDiv.className = 'website-outer-container';
        gscWrapper.prepend(wrapperDiv);
      }
      fillMisesWrapper(filterData(ret.data, elements), wrapperDiv);
    }else{
      if(wrapperDiv){
        wrapperDiv.style.display = "none";
        wrapperDiv.className = "";
      }
    }
  })
  .catch((error) => {
    console.log(error)
  });
}

export const maybeToggleMisesSearchResult = () => {
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
