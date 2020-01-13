/**
 * 创建者  ：刘新洲
 *        ：liuxinzhou
 * 创建单位：龙湖集团
 * 创建时间：2019/4/9
 */
import { sendPost, sendGet } from './axios';

export default {
  allRequestPost(url, params, fn) {
    return sendPost(url, params)
      .then(res => {
        fn(res);
      }, err => {
        fn(err);
      });
  },
  // 以后用到GET请求时添加
  allRequestGet(url, params, fn) {
    return sendGet(url, params)
      .then(res => {
        fn(res);
      }, err => {
        fn(err);
      });
  },
  // 以️form格式传入请求接口信息
  transformRequest(url, params, fn) {
    return sendGet(url, { params: params })
      .then(res => {
        fn(res);
      }, err => {
        fn(err);
      });
  },
  transformRequestPost(url, params, fn) {
    return sendPost(url, params)
      .then(res => {
        fn(res);
      }, err => {
        fn(err);
      });
  }
};
