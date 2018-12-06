/**
 * 接口调用方法
 * author：MarLion
 * time：2018-12-1
 * axios.方法名
 */
import axios from 'axios'
import qs from 'querystring'
import * as base from './base'
//axios配置
axios.defaults.timeout = 10000;   //超时
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';  //请求头
axios.defaults.baseURL = base.baseUrl;   //请求基本路径

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
    return fetch('backend/user/login',params);
  },
  /**
   * 旅游路线
   * */
  //旅游路线列表
  TourRouteList(params){
    return fetch('column_tour/selectTourLineByParameter',params);
  },

  //新增线路
  TourAddRoute(params){
    return fetch('column_tour/addTourLine',params);
  },

  //删除图片
  TourDeletePhoto(params){
    return fetch('column_tour/deleteFile',params);
  },

  //查看路线详情
  TourRouteDetail(params){
    return fetch('column_tour/getTourLineDetails',params)
  },

  //取消旅游路线
  TourRouteCancel(params){
    return fetch('column_tour/updateStatus',params)
  },

  //旅游报名清单
  TourEnlist(params){
    return fetch('tour_user/getTourUserList',params);
  },

 //取消旅游报名资格
  CancleTourEn(params){
    return fetch('tour_user/cancelUserQualification',params)
  },

  //批量取消旅游报名资格
  CancleTourEnBatch(params){
    return fetch('tour_user/batchCancelUserQualification',params)
  },

  /**
   * 相亲专栏
   * */
  //相亲活动列表查询
  BlindDateList(params){
    return fetch('column_activity/selectActivityByParameter',params)
  },

  //相亲活动新增
  BlindDateAdd(params){
    return fetch('column_activity/addBlindDateActivity',params)
  },

  //相亲活动详情
  BlindDateDetail(params){
    return fetch('/column_activity/getActivityDetails',params);
  },

  //删除图片
  BlindDataDeletePhoto(params){
    return fetch('/column_activity/deleteFile',params);
  },

  //相亲活动修改
  BlindDateRevise(params){
    return fetch('column_activity/addBlindDateActivity',params);
  },

  //相亲活动取消
  BlindDateCancle(params){
    return fetch('column_activity/updateStatus',params);
  },

  //相亲活动报名清单查询
  BlindDateSignList(params){
    return fetch('activity_user/getActivityUser',params);
  },

  //取消、批量取消相亲活动报名资格
  BlindDateCancelEn(params){
    return fetch('/activity_user/cancelUserQualification',params);
  },


  /**
   * 节目专栏
   * */
  //节目列表查询
  ActList(params){
    return fetch('column_program/selectProgramByParameter',params);
  },

  //节目删除图片
  ActDeletePhoto(params){
    return fetch('column_activity/deleteFile',params);
  },

  //节目新增
  ActAdd(params){
    return fetch('column_program/addProgram',params);
  },

  //节目详情
  ActDetail(params){
    return fetch('column_program/getProgramDetails',params);
  },

  //节目修改
  ActRevise(params){
    return fetch('column_program/addProgram',params);
  },

  //节目取消
  ActCancel(params){
    return fetch('column_program/updateStatus',params);
  },

  //节目报名清单
  ActSignList(params){
    return fetch('column_user/getProgramUser',params);
  },

  //取消报名资格
  ActSignCancel(params){
    return fetch('column_user/cancelUserQualification',params);
  },

  /**
   * 活动券管理
   * */
  //活动券列表
  TicketList(params){
    return fetch('coupon/getCouponList',params);
  },

  //根据活动类型获取活动列表
  TicketGetActList(params){
    return fetch('coupon/getActList',params);
  },

  //新增活动券
  TicketAdd(params){
    return fetch('coupon/addCoupon',params);
  },

  //活动券详情
  TicketDetail(params){
    return fetch('coupon/getCouponInfo',params);
  },

  //活动券修改提交
  TicketRevise(params){
    return fetch('coupon/updCoupon',params);
  },

  //取消活动券
  TicketCancel(params){
    return fetch('coupon/cancelCoupon',params);
  },

  //活动券报名清单查询
  TicketSignList(params){
    return fetch('coupon/getCouponUserList',params);
  },

  //活动券清单取消资格
  TicketSignCancel(params){
    return fetch('coupon/cancelUserJoin',params)
  },

  //批量取消资格
  TicketSignBatchCancel(params){
    return fetch('coupon/pCancelUserJoin',params);
  },
}
