/*
 * @Author: lmk
 * @Date: 2022-06-13 14:36:18
 * @LastEditTime: 2022-10-22 09:08:51
 * @LastEditors: lmk
 * @Description: web3 site and extension site
 */
// import Loading from "@/components/pageLoading";
import GoogleCustomSearch from '@/components/search/cse';
import "./index.less";
const Home = () => {

  const cx = '26f94955e327b21df';
  // add event listeners
  // useEffect(() => {
  //   window.onload = () => {
  //     const xx = document.getElementById('gs_st50');
  //     if(xx){
  //       xx.addEventListener('click', function(e){
  //         let wrapperDiv = document.getElementById('mises-wrapper');
  //         if(wrapperDiv){
  //             wrapperDiv.className = "";
  //             wrapperDiv.style.display = "none";
  //         }
  //       });
  //     }

  //   };

  //   // gsc
  //   let featureToken = "";
  //   const gscObserver = new MutationObserver(mutationsList => {
  //     mutationsList.forEach(mutation => {
  //       if (mutation.type === 'childList' && mutation.addedNodes.length) {
  //         const mobile = document.querySelector('.gsc-cursor-container-previous');
  //         const desktop = document.querySelector('.gsc-cursor-page.gsc-cursor-current-page');
  //         if((mobile && mobile.innerHTML === "") || (desktop && desktop.innerHTML === "1")){
  //           const elements = document.querySelectorAll('.gsc-expansionArea a.gs-title');
  //           if (elements && elements.length > 0) {

  //             if(elements.item(0).innerHTML !== featureToken){
  //               featureToken = elements.item(0).innerHTML;
  //               misesSearch(elements);
  //             }else{
  //               let wrapperDiv = document.getElementById('mises-wrapper');
  //               if(wrapperDiv && wrapperDiv.style.display === "none" && wrapperDiv.innerHTML !== ""){
  //                   wrapperDiv.className = "website-outer-container";
  //                   wrapperDiv.style.display = "grid";
  //               }
  //             }
  //           }
  //         }else if((mobile && mobile.innerHTML !== "") || (desktop && desktop.innerHTML !== "1")){
  //           let wrapperDiv = document.getElementById('mises-wrapper');
  //           if(wrapperDiv && wrapperDiv.style.display === "grid"){
  //               wrapperDiv.className = "";
  //               wrapperDiv.style.display = "none";
  //           }
  //         }
  //       }
  //     });
  //   });

  //   // body
  //   let gscExecuted = false;
  //   const bodyObserver = new MutationObserver(mutationsList => {
  //     mutationsList.forEach(mutation => {
  //       if (mutation.type === 'childList' && mutation.addedNodes.length) {
  //         const targetElement = document.querySelector('.gsc-expansionArea');
  //         if (targetElement && !gscExecuted) {
  //           gscObserver.observe(targetElement, { childList: true, subtree: true });
  //           bodyObserver.disconnect();
  //           gscExecuted = true;
  //         }
  //       }
  //     });
  //   });
  //   bodyObserver.observe(document.body, { childList: true, subtree: true });

  //   return () => {
  //     bodyObserver.disconnect();
  //     gscObserver.disconnect();
  //   }
  //   // eslint-disable-next-line
  // }, []);



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
