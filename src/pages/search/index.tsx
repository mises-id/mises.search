/*
 * @Author: lmk
 * @Date: 2022-06-13 14:36:18
 * @LastEditTime: 2022-10-22 09:08:51
 * @LastEditors: lmk
 * @Description: web3 site and extension site
 */
// import Loading from "@/components/pageLoading";
import GoogleCustomSearch from '@/components/search/cse';
import { useEffect } from "react";
import "./index.less";
const Home = () => {
  const cx = '26f94955e327b21df';

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
        a.innerHTML = `
        <div class="list-item-logo"><div class="adm-image" style="--width: 40px; width: 40px; --height: 40px; height: 40px; border-radius: 50px;"><img class="adm-image-img" src="${item.logo}" alt="${item.title}" draggable="false" style="object-fit: contain; display: block;"></div></div>
        <div class="list-item-content"><span>${item.title}</span><p class="desc">${item.desc}</p></div>
        `;
        iterator.appendChild(a);
    });
    wrapperDiv.className = "website-outer-container";
    wrapperDiv.style.display = "grid";
  }

  // mises search
  const misesSearch = (elements : NodeListOf<Element>) => {
    const inputElement = document.getElementById('gsc-i-id1') as HTMLInputElement;
    const query = inputElement.value.trim();
    if(!query){
      return;
    }
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

  // add event listeners
  useEffect(() => {
    window.onload = () => {
      const xx = document.getElementById('gs_st50');
      if(xx){
        xx.addEventListener('click', function(e){
          let wrapperDiv = document.getElementById('mises-wrapper');
          if(wrapperDiv){
              wrapperDiv.className = "";
              wrapperDiv.style.display = "none";
          }
        });
      }

    };

    // gsc
    let featureToken = "";
    const gscObserver = new MutationObserver(mutationsList => {
      mutationsList.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          const mobile = document.querySelector('.gsc-cursor-container-previous');
          const desktop = document.querySelector('.gsc-cursor-page.gsc-cursor-current-page');
          if((mobile && mobile.innerHTML === "") || (desktop && desktop.innerHTML === "1")){
            const elements = document.querySelectorAll('.gsc-expansionArea a.gs-title');
            if (elements && elements.length > 0) {

              if(elements.item(0).innerHTML !== featureToken){
                featureToken = elements.item(0).innerHTML;
                misesSearch(elements);
              }else{
                let wrapperDiv = document.getElementById('mises-wrapper');
                if(wrapperDiv && wrapperDiv.style.display === "none" && wrapperDiv.innerHTML !== ""){
                    wrapperDiv.className = "website-outer-container";
                    wrapperDiv.style.display = "grid";
                }
              }
            }
          }else if((mobile && mobile.innerHTML !== "") || (desktop && desktop.innerHTML !== "1")){
            let wrapperDiv = document.getElementById('mises-wrapper');
            if(wrapperDiv && wrapperDiv.style.display === "grid"){
                wrapperDiv.className = "";
                wrapperDiv.style.display = "none";
            }
          }
        }
      });
    });

    // body
    let gscExecuted = false;
    const bodyObserver = new MutationObserver(mutationsList => {
      mutationsList.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          const targetElement = document.querySelector('.gsc-expansionArea');
          if (targetElement && !gscExecuted) {
            gscObserver.observe(targetElement, { childList: true, subtree: true });
            bodyObserver.disconnect();
            gscExecuted = true;
          }
        }
      });
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      bodyObserver.disconnect();
      gscObserver.disconnect();
    }
    // eslint-disable-next-line
  }, []);



  return (
    <div className="container">
      <div className="top-bar">

        
      <div className='flex justify-between items-center px-10 pt-10' style={{height: 40}}>
        <div className="relative flex">
          <p className='swap-title'><span className='mises-title'>Mises</span> <span>Search</span></p>
          <div><span className="beta-tag">BETA</span></div>
        </div>
      </div>
      <GoogleCustomSearch cx={cx}/>
      </div>

    </div>
  );
};
export default Home;
