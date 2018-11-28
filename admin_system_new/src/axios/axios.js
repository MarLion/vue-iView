import axios from 'axios'
import qs from 'querystring'

//axios配置
axios.defaults.timeout = 5000;   //超时
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';  //请求头
axios.defaults.baseURL = '';   //请求基本路径

//设置拦截器
//POST传参序列化
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data);
  }
  return config;
}, (error) => {
  console.log('参数错误');
  return Promise.reject(error);
});
//返回状态判断
/*
axios.interceptors.response.use((res) => {
  if (!res.data.success) {
    console.log('请求失败！')
  }
  },(error) => {
    return Promise.reject(error);
  }
);
*/
//请求返回Promise对象
export function fetch(url,params) {
  return new Promise((resolve, reject) => {
    axios.post(url,params)
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
  // 用户登录
  Login(params){
    return fetch('',params);
  }
}
