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
//axios.defaults.baseURL = base.baseUrl;   //请求基本路径


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
    return fetch(base.baseUrl.serviceOne + 'backend/user/login',params);
  },

  //权限管理查找用户名单
  AuthorityNameList(params){
    return fetch(base.baseUrl.serviceOne + 'backend/user/selectUser',params);
  },

  //根据选择的角色查询原有权限
  GetAreadyAuthority(params){
    return fetch(base.baseUrl.serviceOne + 'backend/user/getPermissions',params);
  },

  //提交权限更改
  SubmitAuthorityChange(params){
    return fetch(base.baseUrl.serviceOne + 'backend/user/authorization',params);
  },

  //用户 订单总数
  GetTotalNumber(params){
    return fetch(base.baseUrl.serviceOne + 'user_data/selectSumByUserAndOrder',params)
  },

  //首页图表数据
  GetChartsData(params){
    return fetch(base.baseUrl.serviceOne + 'user_data/getDataStatistics',params);
  },
  /**
   *圈子活动管理
   * baseUrl用serviceTwo
   * */
  //查询圈子列表
  GetCommunityList(params){
    return fetch(base.baseUrl.serviceTwo + 'community/communityList',params);
  },

  //圈子详情
  CommunityDetail(params){
    return fetch(base.baseUrl.serviceTwo + 'community/getCommInfo',params);
  },

  //解散圈子
  CommunityDissolve(params){
    return fetch(base.baseUrl.serviceTwo + 'community/cancelCommunity',params);
  },

  //获取标签列表
  CommunityGetLabel(params){
    return fetch(base.baseUrl.serviceTwo + 'clabel/getCommLabelList',params);
  },

  //获取地标列表
  CommunityGetPosition(params){
    return fetch(base.baseUrl.serviceTwo + 'addressLabel/getAddressList',params);
  },

  //圈子用户清单
  CommunityUserList(params){
    return fetch(base.baseUrl.serviceTwo + 'community/communityUserList',params);
  },
  /**
   * 标签配置
   * baseUrl用serviceTwo
   * */
  //获取标签列表
  LabelList(params){
    return fetch(base.baseUrl.serviceTwo + 'clabel/getCommLabel',params);
  },

  //新增标签
  LabelAdd(params){
    return fetch(base.baseUrl.serviceTwo + 'clabel/addCommLabel',params);
  },

  //删除标签
  LabelDelete(params){
    return fetch(base.baseUrl.serviceTwo + 'clabel/delCommLabel',params);
  },
  /**
   * 地理位置配置
   * baseUrl用serviceTwo
   * */
  //地标列表
  PositionList(params){
    return fetch(base.baseUrl.serviceTwo + 'addressLabel/getAddress',params);
  },

  //地标添加
  PositionAdd(params){
    return fetch(base.baseUrl.serviceTwo + 'addressLabel/saveAddress',params);
  },

  /**
   * 礼物配置
   * */
  //获取礼物列表
  GiftList(params){
    return fetch(base.baseUrl.serviceOne + 'gift/getGiftList',params);
  },

  //新增修改礼物
  GiftAdd(params){
    return fetch(base.baseUrl.serviceOne + 'gift/saveGiftInfo',params);
  },

  //删除礼物
  GiftDelete(params){
    return fetch(base.baseUrl.serviceOne + 'gift/delGiftInfo',params);
  },
  /**
   * 模块层级管理 文章管理 Banner管理
   * */
  //获取层级模块列表
  ModalList(params){
    return fetch(base.baseUrl.serviceOne + 'marriage_level/getMarriageLevelList',params);
  },

  //模块和文章 新增修改式 获取已有层级结构  模块管理和文章管理都用这个接口
  ModalExist(params){
    return fetch(base.baseUrl.serviceOne + 'marriage_level/getMarriageLevelAll',params);
  },

  //新增层级结构
  ModalAdd(params){
    return fetch(base.baseUrl.serviceOne + 'marriage_level/saveOrUpdMarriageLevel',params);
  },

  //显示或隐藏
  ModalDelete(params){
    return fetch(base.baseUrl.serviceOne + 'marriage_level/delMarriageLevelById',params);
  },

  //是否推荐
  ModalRecommend(params){
    return fetch(base.baseUrl.serviceOne + 'marriage_level/changeLevelStatusById',params);
    // return fetch('http://192.168.1.234:6001/marriage_level/changeLevelStatusById',params);
  },

  /*文章管理*/
  //获取查询条件 一级 二级模块
  ArticleCheckModal(params){
    return fetch(base.baseUrl.serviceOne + 'marriage_article/getLevels',params);
  },

  //获取文章列表
  ArticleList(params){
    return fetch(base.baseUrl.serviceOne + 'marriage_article/getArticleList',params);
    //return fetch('http://192.168.1.234:6001/marriage_article/getArticleList',params);
  },

  //新增 修改文章
  ArticleAddOrRevise(params){
    return fetch(base.baseUrl.serviceOne + 'marriage_article/saveOrUpdMarriageArticle',params);
    // return fetch('http://192.168.1.234:6001/marriage_article/saveOrUpdMarriageArticle',params);
  },

  //文章是否推荐
  ArticleRecommeend(params){
    return fetch(base.baseUrl.serviceOne + 'marriage_article/changeArticleRecommentById',params);
  },

  //修改文章显示隐藏状态
  ArticleStatus(params){
    return fetch(base.baseUrl.serviceOne + 'marriage_article/changeArticleStatusById',params);
    // return fetch('http://192.168.1.234:6001/marriage_article/changeArticleStatusById',params);
  },

  /*Banner管理*/
  //文章模糊查询
  BannerArticleCheck(params){
    return fetch(base.baseUrl.serviceOne + 'marriage_chart/selectContents',params);
  },

  //获取Banner图列表
  BannerList(params){
    return fetch(base.baseUrl.serviceOne + 'marriage_chart/select',params);
  },

  //Banner图新增及修改
  BannerSaveAndRevise(params){
    return fetch(base.baseUrl.serviceOne + 'marriage_chart/save',params);
  },

  //Banner是否推荐
  BannerRecommend(params){
    return fetch(base.baseUrl.serviceOne + 'marriage_chart/updateShowType',params);
  },

    //Banner切换显示隐藏状态
  BannerIsShow(params){
    return fetch(base.baseUrl.serviceOne + 'marriage_chart/delete',params);
  },

  /*动态管理*/
  //查询动态列表
  TrendList(params){
    return fetch(base.baseUrl.serviceOne + 'lifeTrend/selectTrendList',params);
  },

  //动态是否隐藏
  TrendShowOrHiiden(params){
    return fetch(base.baseUrl.serviceOne + 'lifeTrend/showHidden',params);
  },

  //动态是否置顶
  TrendStick(params){
    return fetch(base.baseUrl.serviceOne + 'lifeTrend/showTop',params);
  },

  //发布动态--获取地理信息 第二个服务
  TrendPosition(params){
    return fetch(base.baseUrl.serviceTwo + 'addressLabel/getAddressList',params);
  },

  //发布动态
  TrendAdd(params){
    return fetch(base.baseUrl.serviceOne + 'lifeTrend/addTrends',params);
    //return fetch('http://192.168.1.64:6001/lifeTrend/addTrends',params); //思宇本地
  },
  /**
   * 旅游路线
   * */
  //旅游路线列表
  TourRouteList(params){
    return fetch(base.baseUrl.serviceOne + 'column_tour/selectTourLineByParameter',params);
  },

  //新增线路
  TourAddRoute(params){
    return fetch(base.baseUrl.serviceOne + 'column_tour/addTourLine',params);
  },

  //删除图片
  TourDeletePhoto(params){
    return fetch(base.baseUrl.serviceOne + 'column_tour/deleteFile',params);
  },

  //查看路线详情
  TourRouteDetail(params){
    return fetch(base.baseUrl.serviceOne + 'column_tour/getTourLineDetails',params)
  },

  //取消旅游路线
  TourRouteCancel(params){
    return fetch(base.baseUrl.serviceOne + 'column_tour/updateStatus',params)
  },

  //旅游报名清单
  TourEnlist(params){
    return fetch(base.baseUrl.serviceOne + 'tour_user/getTourUserList',params);
  },

 //取消旅游报名资格
  CancleTourEn(params){
    return fetch(base.baseUrl.serviceOne + 'tour_user/cancelUserQualification',params)
  },

  //批量取消旅游报名资格
  CancleTourEnBatch(params){
    return fetch(base.baseUrl.serviceOne + 'tour_user/batchCancelUserQualification',params)
  },

  /**
   * 相亲专栏
   * */
  //相亲活动列表查询
  BlindDateList(params){
    return fetch(base.baseUrl.serviceOne + 'column_activity/selectActivityByParameter',params)
  },

  //相亲活动新增
  BlindDateAdd(params){
    return fetch(base.baseUrl.serviceOne + 'column_activity/addBlindDateActivity',params)
  },

  //相亲活动详情
  BlindDateDetail(params){
    return fetch(base.baseUrl.serviceOne + '/column_activity/getActivityDetails',params);
  },

  //删除图片
  BlindDataDeletePhoto(params){
    return fetch(base.baseUrl.serviceOne + '/column_activity/deleteFile',params);
  },

  //相亲活动修改
  BlindDateRevise(params){
    return fetch(base.baseUrl.serviceOne + 'column_activity/addBlindDateActivity',params);
  },

  //相亲活动取消
  BlindDateCancle(params){
    return fetch(base.baseUrl.serviceOne + 'column_activity/updateStatus',params);
  },

  //相亲活动报名清单查询
  BlindDateSignList(params){
    return fetch(base.baseUrl.serviceOne + 'activity_user/getActivityUser',params);
  },

  //取消、批量取消相亲活动报名资格
  BlindDateCancelEn(params){
    return fetch(base.baseUrl.serviceOne + '/activity_user/cancelUserQualification',params);
  },


  /**
   * 节目专栏
   * */
  //节目列表查询
  ActList(params){
    return fetch(base.baseUrl.serviceOne + 'column_program/selectProgramByParameter',params);
  },

  //节目删除图片
  ActDeletePhoto(params){
    return fetch(base.baseUrl.serviceOne + 'column_activity/deleteFile',params);
  },

  //节目新增
  ActAdd(params){
    return fetch(base.baseUrl.serviceOne + 'column_program/addProgram',params);
  },

  //节目详情
  ActDetail(params){
    return fetch(base.baseUrl.serviceOne + 'column_program/getProgramDetails',params);
  },

  //节目修改
  ActRevise(params){
    return fetch(base.baseUrl.serviceOne + 'column_program/addProgram',params);
  },

  //节目取消
  ActCancel(params){
    return fetch(base.baseUrl.serviceOne + 'column_program/updateStatus',params);
  },

  //节目报名清单
  ActSignList(params){
    return fetch(base.baseUrl.serviceOne + 'column_user/getProgramUser',params);
  },

  //取消报名资格
  ActSignCancel(params){
    return fetch(base.baseUrl.serviceOne + 'column_user/cancelUserQualification',params);
  },

  /**
   * 活动券管理
   * */
  //活动券列表
  TicketList(params){
    return fetch(base.baseUrl.serviceOne + 'coupon/getCouponList',params);
  },

  //根据活动类型获取活动列表
  TicketGetActList(params){
    return fetch(base.baseUrl.serviceOne + 'coupon/getActList',params);
  },

  //新增活动券
  TicketAdd(params){
    return fetch(base.baseUrl.serviceOne + 'coupon/addCoupon',params);
  },

  //活动券详情
  TicketDetail(params){
    return fetch(base.baseUrl.serviceOne + 'coupon/getCouponInfo',params);
  },

  //活动券修改提交
  TicketRevise(params){
    return fetch(base.baseUrl.serviceOne + 'coupon/updCoupon',params);
  },

  //取消活动券
  TicketCancel(params){
    return fetch(base.baseUrl.serviceOne + 'coupon/cancelCoupon',params);
  },

  //活动券报名清单查询
  TicketSignList(params){
    return fetch(base.baseUrl.serviceOne + 'coupon/getCouponUserList',params);
  },

  //活动券清单取消资格
  TicketSignCancel(params){
    return fetch(base.baseUrl.serviceOne + 'coupon/cancelUserJoin',params)
  },

  //批量取消资格
  TicketSignBatchCancel(params){
    return fetch(base.baseUrl.serviceOne + 'coupon/pCancelUserJoin',params);
  },
}
