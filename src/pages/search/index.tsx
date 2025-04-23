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
