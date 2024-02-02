/*
 * @Author: lmk
 * @Date: 2022-06-13 14:36:18
 * @LastEditTime: 2022-10-22 09:08:51
 * @LastEditors: lmk
 * @Description: web3 site and extension site
 */
import { getCategory, getData } from "@/api/web3sites";
// import Loading from "@/components/pageLoading";
import GoogleCustomSearch from '@/components/search/cse';
import { web3sitesCacheKey } from "@/utils";
import { useThrottleFn } from "ahooks";
import { Image, InfiniteScroll, List, Popup, PullToRefresh, Tabs } from "antd-mobile";
import React, { useEffect, useRef, useState } from "react";
import "./index.less";
export interface websiteParams {
  "title": string;
  "url": string;
  "id": string;
  "logo": string;
  "website_category_id": string;
  "desc": string;
}
interface categoryParams {
  id: string;
  type_string: 'web3' | 'extension';
  name: string;
  shorter_name: string;
}
interface categoryListType extends categoryParams {
  pageNum: number;
  hasMore: boolean;
  currentKeyIndex: number;
  list?: Array<websiteParams>;
}
const Home = () => {
  const cx = '26f94955e327b21df';
  const [category, setcategory] = useState<categoryParams[]>([]);
  const [activeKey, setactiveKey] = useState<string>()
  const [activeKeyIndex, setactiveKeyIndex] = useState<number>(0)
  const [activeRequestKey, setactiveRequestKey] = useState<string>()
  const [categoryListParams, setcategoryListParams] = useState<categoryListType[]>([])
  const mainElementRef = useRef<HTMLDivElement>(null)
  const sideElementRef = useRef<HTMLDivElement>(null)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)

  const [misesContentDisplay, setMisesContentDisplay] = useState<boolean>(false)

  const topBarHeight = 97
  const pageSize = 200;
  const defalutParams = {
    hasMore: true,
    pageNum: 1,
  }
  const { run: handleScroll } = useThrottleFn(() => {
    let currentKey = category[0].id
    for (const item of category) {
      const element = document.getElementById(`anchor-${item.id}`)
      if (!element) continue
      const rect = element.getBoundingClientRect()
      if (rect.top <= topBarHeight) {
        currentKey = item.id
      } else {
        break
      }
    }
    setactiveKey(currentKey)
    findActiveKeyIndex(currentKey)
  },
    {
      leading: true,
      trailing: true,
      wait: 100,
    })
  const findActiveKeyIndex = (key: string) => {
    const index = category.findIndex(c => c.id === key)
    setactiveKeyIndex(index)
    return index
  }
  const setcategoryLayout = (res: categoryParams[]) => {
    setactiveKey(res[0].id)
    setactiveRequestKey(res[0].id)
    setcategoryListParams([{
      ...defalutParams,
      currentKeyIndex: 0,
      ...res[0]
    }])
    setcategory(res)
  }
  useEffect(() => {
    const getCategoryCache = localStorage.getItem(web3sitesCacheKey)
    let localCategoryCache: categoryParams[] = []
    if(getCategoryCache){
      localCategoryCache = JSON.parse(getCategoryCache)
      setcategoryLayout(localCategoryCache)
    }
    getCategory().then((res) => {
      if (Array.isArray(res) && res.length > 0) {
        if(Array.isArray(res) && JSON.stringify(res) !== getCategoryCache){
          // update category cache
          localStorage.setItem(web3sitesCacheKey, JSON.stringify(res))
          if(localCategoryCache.length===0 || localCategoryCache[0]?.id!==res[0].id){
            setcategoryLayout(res)
          }
        }
        
        // setcategoryLayout(res)
      }
    })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
    // eslint-disable-next-line
  }, [])

  const trimTrailingSlash = (inputString:string) => {
    return inputString.replace(/\/$/, '');
  }

  const extractDomainAndPath = (url:string) => {
    try{
        let parsedUrl = new URL(url);
        return parsedUrl.hostname + trimTrailingSlash(parsedUrl.pathname);
    } catch(error) {
        return "";
    }
  }

  const filterData = (data:any, elements:NodeListOf<Element>) => {
    if(!elements || elements.length === 0){
        return data;
    }
    const firstThreeElements = Array.from(elements).slice(0, 3);
    let arrUrl:string[] = [];
    firstThreeElements.forEach((item) => {
        let url = item.getAttribute('href');
        if(url && url !== ""){
            arrUrl.push(extractDomainAndPath(url));
        }
    });
    let ret:string[] = [];
    if(arrUrl.length > 0){
        data.forEach((item:any) => {
            if(!arrUrl.includes(extractDomainAndPath(item.url))){
                ret.push(item);
            }
        })
    }
    return ret;
  }

  const refreshMisesWrapper = (data:any, wrapperDiv:HTMLElement) => {
      if(!Array.isArray(data) || data.length === 0){
          return
      }
      data.forEach((item) => {
          const grandParentDiv = document.createElement('div');
          grandParentDiv.className = "gsc-webResult gsc-result";

          const parentDiv = document.createElement('div');
          parentDiv.className = "gs-webResult gs-result";

          const titleDiv = document.createElement('div');
          titleDiv.className = "gsc-thumbnail-inside";
          titleDiv.innerHTML = `<div class="gs-title"><a class="gs-title" href="${item.url}" target="_blank">${item.title}</a></div>`;
          parentDiv.appendChild(titleDiv);

          const descDiv = document.createElement('div');
          descDiv.className = "gsc-table-result";
          descDiv.innerHTML = `<div class="gsc-table-cell-thumbnail gsc-thumbnail"><div class="gs-image-box gs-web-image-box gs-web-image-box-portrait"><a class="gs-image" href="${item.url}" target="_blank"><img class="gs-image" src="${item.logo}" alt="Thumbnail image"></a></div></div><div class="gsc-table-cell-snippet-close"><div class="gs-title gsc-table-cell-thumbnail gsc-thumbnail-left"><a class="gs-title" href="${item.url}" target="_blank">${item.title}</a></div><div><span></span></div><div class="gs-bidi-start-align gs-snippet">${item.desc}</div><div class="gsc-url-bottom"></div><div class="gs-richsnippet-box" style="display: none;"></div></div>`;
          parentDiv.appendChild(descDiv);

          grandParentDiv.appendChild(parentDiv);

          wrapperDiv.appendChild(grandParentDiv);
      });
      wrapperDiv.style.display = "block";
  }

  // mises search
  const misesSearch = (elements : NodeListOf<Element>) => {
    const inputElement = document.getElementById('gsc-i-id1') as HTMLInputElement;
    const query = inputElement.value.trim();
    if(!query){
      return;
    }
    fetch(`https://api.test.mises.site/api/v1/website/internal_search?keywords=${query}&limit=3`)
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
          gscWrapper.prepend(wrapperDiv);
        }
        refreshMisesWrapper(filterData(ret.data, elements), wrapperDiv);
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
              wrapperDiv.style.display = "none";
          }
          setMisesContentDisplay(true);
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
              if(misesContentDisplay){
                setMisesContentDisplay(false);
              }
              if(elements.item(0).innerHTML !== featureToken){
                featureToken = elements.item(0).innerHTML;
                misesSearch(elements);
              }else{
                let wrapperDiv = document.getElementById('mises-wrapper');
                if(wrapperDiv && wrapperDiv.style.display === "none"){
                    wrapperDiv.style.display = "block";
                }
              }
            }
          }else if((mobile && mobile.innerHTML !== "") || (desktop && desktop.innerHTML !== "1")){
            let wrapperDiv = document.getElementById('mises-wrapper');
            if(wrapperDiv && wrapperDiv.style.display === "block"){
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

  const loadMore = async (id?: string) => {
    if (isLoading) return;
    setIsLoading(true)
    const website_category_id = id || activeRequestKey!
    const currentCategaryIndex = categoryListParams.findIndex(item => item.id === website_category_id)
    const currentCategary = categoryListParams[currentCategaryIndex];
    return getData({
      page_size: pageSize,
      page_num: currentCategary.pageNum,
      website_category_id,
    }).then((res: any) => {
      const hasMore = Array.isArray(res) ? !(res?.length < pageSize) : false;
      currentCategary.hasMore = hasMore;
      if (hasMore) currentCategary.pageNum = currentCategary.pageNum + 1;
      if (!hasMore && !id) {
        // get next category
        const index = currentCategary.currentKeyIndex + 1;
        const nextCategoryItem = category[index];
        if (!nextCategoryItem) setHasMore(false);
        if (nextCategoryItem) {
          setactiveRequestKey(nextCategoryItem.id);
          const hasActiveCategory = categoryListParams.some(val => val.id === nextCategoryItem.id)
          if (!hasActiveCategory) {
            categoryListParams.push({
              ...nextCategoryItem,
              ...defalutParams,
              currentKeyIndex: index
            })
          }
        }
      }
      renderList(res, currentCategaryIndex)
      setIsLoading(false)
    }).catch(() => {
      setIsLoading(false)
      throw new Error('mock request failed')
    })
  }

  const renderList = (list: Array<websiteParams>, currentCategaryIndex: number) => {
    list.forEach((val: websiteParams) => {
      const item = categoryListParams[currentCategaryIndex];
      if (item) {
        item.list = item.list || [];
        item.list.push(val);
      }
    })
    setcategoryListParams([...categoryListParams])
  }
  const onRefresh = async () => {
    // if(isLoading) return;
    // setIsLoading(true)
    const preCategory = category[activeKeyIndex - 1]
    if (preCategory) {
      const categoryId = preCategory.id
      // if (!hasMore) setHasMore(true);
      setactiveKey(categoryId)
      setactiveRequestKey(categoryId)
      findActiveKeyIndex(categoryId)
      categoryListParams.unshift({
        ...defalutParams,
        currentKeyIndex: activeKeyIndex - 1,
        ...preCategory,
      })
      setcategoryListParams([...categoryListParams])
      loadMore(categoryId)
      return true
    } else {
      setIsLoading(false)
    }
  }
  const getSideChange = (key: string) => {
    if (isLoading) return
    const hasEmptyCategory = categoryListParams.length === category.length;
    if (hasEmptyCategory) {
      document.getElementById(`anchor-${key}`)?.scrollIntoView()
      window.scrollTo({ top: window.scrollY - 90 })
      setactiveKey(key)
      setIsDisabled(true)
      return;
    }
    setactiveKey(key)
    if (!hasMore) setHasMore(true);
    const index = findActiveKeyIndex(key)
    const categoryItem = category[index];
    setactiveRequestKey(key)
    setcategoryListParams([{
      ...defalutParams,
      currentKeyIndex: index,
      ...categoryItem,
    }])
  }
  const defaultTop = 0;
  const headerHeight = 46;
  const [top,setTop] = useState<number>(defaultTop)
  const toggleVisible = ()=>{
    const position = window.scrollY<headerHeight ? headerHeight - window.scrollY : defaultTop
    setTop(position)
    setVisible(!visible)
  }
  // if (!activeKey) return <Loading />

  return (
    <div className="container">
      <div className="top-bar">
        {/* <div className="header">
          <NavBar backArrow={false}>Mises Search</NavBar>
        </div> */}
        
      <div className='flex justify-between items-center px-10 pt-10' style={{height: 40}}>
        <div className="relative flex">
          <p className='swap-title'><span className='mises-title'>Mises</span> <span>Search</span></p>
          <div><span className="beta-tag">BETA</span></div>
        </div>
      </div>
      <GoogleCustomSearch cx={cx}/>
      </div>

      { misesContentDisplay && 
      <div className="side" ref={sideElementRef}>
        <Tabs
          activeKey={activeKey}
          activeLineMode="fixed"
          style={{
            "--content-padding": "0",
            "--active-line-border-radius": "4px",
            "--active-line-height": "4px",
          }}
          onChange={getSideChange}>{
            category.map(item => (
              <Tabs.Tab key={`${item.id}`} title={item.shorter_name || item.name} />
            ))
          }</Tabs>
        <div className="show-menu"  onClick={toggleVisible}>
          <Image src="./images/open.png"
          lazy={false}
          width={12} height={12} />
        </div>
      </div>
      }

      { misesContentDisplay &&
      <div className="main" id="main" ref={mainElementRef}>

        <PullToRefresh
          onRefresh={onRefresh}
          disabled={activeKeyIndex === 0 || isDisabled}
          canReleaseText="Release to previous-category immediately"
          completeText=""
          refreshingText=""
          pullingText="">
          <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
            {categoryListParams.map((item) => {
              return <div key={item.id} className="category-item">
                <h3 id={`anchor-${item.id}`} className="main-title">{item.name}</h3>
                <div className="website-container">
                  {
                    item.list?.map((val, index) => {
                      return <a key={index} className="list-item" href={val.url} target="_blank" rel="noreferrer">
                        <div className="list-item-logo">
                          <Image src={val.logo} alt={val.title} width={40} height={40} fit="contain" style={{ borderRadius: '50px' }} />
                        </div>
                        <div className="list-item-content">
                          <span>{val.title}</span>
                          {val.desc && <p className="desc">{val.desc}</p>}
                        </div>
                      </a>
                    })
                  }
                </div>
              </div>;
            })}
          </List>
          {hasMore && <InfiniteScroll loadMore={() => loadMore()} hasMore={hasMore} />}
        </PullToRefresh>
      </div>
      }

      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false)
        }}
        position='top'
        maskStyle={{
          top: `${top}px`,
          background: 'rgba(0, 0, 0, 0.75)',
        }}
        bodyStyle={{
          borderBottomLeftRadius: '15px',
          borderBottomRightRadius: '15px',
          top: `${top}px`,
          paddingBottom:'25px',
          minHeight: '40px',
          boxSizing: 'border-box'
        }}>
        <div className="select-header">
          <span>Select</span>
          <Image src="./images/close.png"
            lazy={false} width={9} height={9} onClick={() => {
            setVisible(false)
          }} />
        </div>
        <div className="pop-category-box">
          {category.map(val => {
            return <div key={val.id} className={`pop-category-item ${activeKey === val.id ? 'active' : ''}`}
              onClick={() => {
                getSideChange(val.id);
                setVisible(false)
              }}>
              <span>{val.name}</span>
            </div>
          })}
        </div>
      </Popup>
    </div>
  );
};
export default Home;
