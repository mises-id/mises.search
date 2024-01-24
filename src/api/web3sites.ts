/*
 * @Author: lmk
 * @Date: 2022-09-14 15:01:37
 * @LastEditTime: 2022-09-22 14:34:47
 * @LastEditors: lmk
 * @Description: 
 */
import request from "@/utils/request";

export function getCategory(){
  return request({
    url: 'website_category/list',
  })
}
export interface categoryListRequest{
  page_num: number,
  page_size: number,
  website_category_id: string,
}
export function getData(params: categoryListRequest){
  return request({
    url: 'website/page',
    params
  })
}