import axiosTwo from 'axios'
import qs from 'querystring'
import * as base from './base'

axiosTwo.defaults.timeout = 10000;   //超时
axiosTwo.defaults.headers.post['Content-Type'] = 'application/json';  //请求头


axiosTwo.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data);
  }
  return config;
}, (error) => {
  console.log('参数错误');
  return Promise.reject(error);
});

export function fetchEs(url,params) {
  return new Promise((resolve, reject) => {
      axiosTwo.post(url,params)
        .then(response => {
          resolve(response.data);
        }, err => {
          reject(err);
        })
        .catch((error) => {
          reject(error);
        })
    }
  )
}

export default {
  //发布动态
  TrendAddElse(params){
    return fetchEs(base.baseUrl.serviceOne + 'lifeTrend/addTrends',params);
    //return fetchEs('http://192.168.1.64:6001/lifeTrend/addTrends',params); //思宇本地
  },
}
