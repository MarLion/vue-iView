/**
 * 接口调用方法
 * author：MarLion
 * time：2018-12-1
 * axios.方法名
 * 以后图片上传删除接口统一使用话题管理使用的接口 不用再增加新的
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
   *话题活动管理
   * baseUrl用serviceTwo
   * */
  /*话题*/
  //新增话题
  CommunityAdd(params){
    return fetch(base.baseUrl.serviceTwo + 'community/saveCommunity',params);
  },

  //查询话题列表
  GetCommunityList(params){
    return fetch(base.baseUrl.serviceTwo + 'community/communityList',params);
  },

  //话题详情
  CommunityDetail(params){
    return fetch(base.baseUrl.serviceTwo + 'community/getCommInfo',params);
  },

  //解散话题
  CommunityDissolve(params){
    return fetch(base.baseUrl.serviceTwo + 'community/cancelCommunity',params);
  },

  //是否推荐话题
  CommunityRecommend(params){
    return fetch(base.baseUrl.serviceTwo + 'community/updateIndexShow',params);
  },

  //获取标签列表
  CommunityGetLabel(params){
    return fetch(base.baseUrl.serviceTwo + 'clabel/getCommLabelList',params);
  },

  //获取地标列表
  CommunityGetPosition(params){
    return fetch(base.baseUrl.serviceTwo + 'addressLabel/getAddressList',params);
  },

  //话题用户清单
  CommunityUserList(params){
    return fetch(base.baseUrl.serviceTwo + 'community/communityUserList',params);
  },

  //删除图片
  CommunityDeleteImg(params){
    return fetch(base.baseUrl.serviceTwo + 'documents/removeFile',params);
  },

  /*活动*/
  //发布修改活动
  ActivityAddOrRevise(params){
    return fetch(base.baseUrl.serviceTwo + 'activity/addAct',params);
  },

  //获取活动列表
  ActivityList(params){
    return fetch(base.baseUrl.serviceTwo + 'activity/getActList',params);
  },

  //活动详情 详情数据从列表数据里取 这个接口获取content
  AcrivityDetail(params){
    return fetch(base.baseUrl.serviceTwo + 'activity/getActInfo',params);
  },

  //取消活动
  ActivityCancel(params){
    return fetch(base.baseUrl.serviceTwo + 'activity/cancelAct',params);
  },

  //获取活动用户清单
  ActivityUserList(params){
    return fetch(base.baseUrl.serviceTwo + 'activity/getActUserList',params);
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
    //return fetch('http://192.168.1.234:6001/marriage_level/saveOrUpdMarriageLevel',params);
  },

  //显示或隐藏
  ModalDelete(params){
    return fetch(base.baseUrl.serviceOne + 'marriage_level/delMarriageLevelById',params);
  },

  //是否推荐
  ModalRecommend(params){
    return fetch(base.baseUrl.serviceOne + 'marriage_level/changeLevelStatusById',params);
    //return fetch('http://192.168.1.234:6001/marriage_level/changeLevelStatusById',params);
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
    //return fetch('http://192.168.1.234:6001/marriage_article/saveOrUpdMarriageArticle',params);
  },

  //查看文章详情、修改文章时查询文章content
  ArticlrContentDetail(params){
    return fetch(base.baseUrl.serviceOne + 'marriage_article/getArticleDetailsBackFrom',params);
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

  //删除系统动态
  TrendDelete(params){
    return fetch(base.baseUrl.serviceOne +'lifeTrend/delTrendInfo',params);
  },

  //重新编辑系统动态内容
  TrendContentEdit(params){
    return fetch(base.baseUrl.serviceOne + 'lifeTrend/updTrendContent',params);
  },

  /*启动页管理*/
  //启动页列表
  StartPageList(params){
    return fetch(base.baseUrl.serviceOne + 'appLoading/getPicList',params);
  },

  //添加启动页
  StartPageAdd(params){
    return fetch(base.baseUrl.serviceOne + 'appLoading/addPicAnother',params)
  },

  //删除启动页
  StartPageHDelete(params){
    return fetch(base.baseUrl.serviceOne + 'appLoading/delPic',params);
  },

  //启动页是否置顶
  StartPageStick(params){
    return fetch(base.baseUrl.serviceOne + 'appLoading/stickOrNotPic',params)
  },

  /**
   * 题库配置
   * */
  //查询问题列表
  QuestionList(params){
    return fetch(base.baseUrl.serviceOne + 'questionBank/selectList',params);
  },

  //新增题目
  QuestionAdd(params){
    return fetch(base.baseUrl.serviceOne + 'questionBank/saveQuestion',params);
  },

  /**
   * 履历管理
   * */
  //用户清单列表
  UserList(params){
    return fetch(base.baseUrl.serviceOne + 'lifeExperience/getLeUserList',params);
  },

  //查看用户履历
  UserRecord(params){
    return fetch(base.baseUrl.serviceOne + 'lifeExperience/getUserLExp',params);
  },

  /**
   * 寻姻缘风格管理
   * */
  //获取风格列表
  StyleList(params){
    return fetch(base.baseUrl.serviceOne + 'iconSettings/getPackagesList',params);
  },

  //获取已有模块
  StyleModalList(params){
    return fetch(base.baseUrl.serviceOne + 'iconSettings/getModuleName',params);
  },

  //激活风格
  StyleActivate(params){
    return fetch(base.baseUrl.serviceOne + 'iconSettings/setStatus',params);
  },

  //添加风格
  StyleAdd(params){
    return fetch(base.baseUrl.serviceOne + 'iconSettings/addPackage',params);
    //return fetch('http://192.168.1.48:6001/iconSettings/addPackage',params);
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

  //删除旅游路线封面图
  TourCoverDelete(params){
    return fetch(base.baseUrl.serviceOne + 'column_tour/removeBackgroundImage',params);
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

  //删除相亲活动封面图
  BlindDataCoverDelete(params){
    return fetch(base.baseUrl.serviceOne + 'column_activity/removeBackgroundImage',params);
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

  /**
   * 电视台专栏Banner管理
   * */
  //获取Banner列表
  TvBannerList(params){
    return fetch(base.baseUrl.serviceOne + 'tvCarousel/select',params);
  },

  //是否推荐
  TvBannerStick(params){
    return fetch(base.baseUrl.serviceOne + 'tvCarousel/updateShowType',params);
  },

  //是否展示
  TvBannerShow(params){
    return fetch(base.baseUrl.serviceOne + 'tvCarousel/delete',params);
  },

  //添加修改
  TvBannerAdd(params){
    return fetch(base.baseUrl.serviceOne + 'tvCarousel/save',params);
  },

  //活动模糊查询
  TvActiCheck(params){
    return fetch(base.baseUrl.serviceOne + 'tvCarousel/clickName',params);
  },

  /**
   * 电视台推送和系统消息推送
   * system-im-service 服务
   * */
  //电视台推送
  PropelTvActivity(params){
    return fetch(base.baseUrl.serviceTwo + 'message/pushMarriageActivities',params);
  },

  //系统消息推送
  PropelSysMessage(params){
    return fetch(base.baseUrl.serviceTwo + 'message/sendMessage',params);
  },

  /*推送图标管理*/
  //获取图标列表
  IconList:function(params){
    return fetch(base.baseUrl.serviceTwo + 'message/getIcons',params);
  },

  //保存图标
  IconSave(params){
    return fetch(base.baseUrl.serviceTwo + 'message/saveIcon',params);
  },

  //删除图标
  IconDelete(params){
    return fetch(base.baseUrl.serviceTwo + 'message/deleteIcon',params);
  },

  /**
   * 营养师部分
   * http://192.168.1.197:2002/business-user-service 前缀
   * */
  /*健康知识文章*/
  //根据分类查询文章类别
  HealthCategoryByCalss(params){
    return fetch(base.baseUrl.serviceThree + 'healthArticle/getCateByMold',params);
  },

  //获取文章分类列表
  HealthKnowCategory(params){
    return fetch(base.baseUrl.serviceThree + 'healthArticle/getCategory',params);
  },

  //获取文章列表
  HealthKnowList(params){
    return fetch(base.baseUrl.serviceThree + 'healthArticle/selectListByParam',params);
  },

  //新增修改健康知识
  HealthKnowAdd(params){
    return fetch(base.baseUrl.serviceThree + 'healthArticle/saveOrUpdate',params);
  },

  //健康知识展示隐藏
  HealthKnowShowOrHide(params) {
    return fetch(base.baseUrl.serviceThree + 'healthArticle/setShowHidden', params);
  },

  //健康知识详情
  HealthKnowDetail(params){
    return fetch(base.baseUrl.serviceThree + 'healthArticle/getDetails',params);
  },

  /*健康知识分类*/
  //获取列表
  HealthKnowClassList(params){
    return fetch(base.baseUrl.serviceThree + 'category/getCategoryList',params);
  },

  //添加分类
  HealthKnowClassAdd(params){
    return fetch(base.baseUrl.serviceThree + 'category/saveCategory',params);
  },

  //分类展示隐藏
  HealthKnowClassShowOrHide(params){
    return fetch(base.baseUrl.serviceThree + 'category/showHidden',params);
  },

  /*健康小常识*/
  //获取列表
  HealthGuideClassList(params){
    return fetch(base.baseUrl.serviceThree + 'productType/getProductType',params);
  },

  //新增类型
  HealthGuideClassAdd(params){
    return fetch(base.baseUrl.serviceThree + 'productType/addOrUpdPT',params);
  },

  //展示隐藏
  HealthGuideClassShowOrHide(params){
    return fetch(base.baseUrl.serviceThree + 'productType/changePTStatus',params);
  },

  /*营养师首页轮播图*/
  //获取banner列表
  HealthBannerList(params){
    return fetch(base.baseUrl.serviceThree + 'healthCarousel/getCarouselList',params);
  },

  //添加 修改banner
  HealthBannerAdd(params){
    return fetch(base.baseUrl.serviceThree + 'healthCarousel/saveOrUpdate',params);
  },

  //banner展示隐藏
  HealthBannerShowOrHide(params){
    return fetch(base.baseUrl.serviceThree + 'healthCarousel/showHidden',params);
  },

  //banner设置推荐
  HealthBannerRecommend(params) {
    return fetch(base.baseUrl.serviceThree + 'healthCarousel/recommend', params);
  },

  //查询健康知识
  HealthBannerGetKnow(params){
    return fetch(base.baseUrl.serviceThree + 'healthCarousel/getHealthNames',params);
  },

  /*商品资料上传*/

  //获取商品功能类型
  HealthProductType(params){
    return fetch(base.baseUrl.serviceThree + 'productType/getProductType4App',params);
  },

  //获取生产商
  HealthProductProduce(params){
    return fetch(base.baseUrl.serviceThree + 'product/getvendorData',params);
  },

  //获取品牌
  HealthProductBrand(params){
    return fetch(base.baseUrl.serviceThree + 'product/getBrand',params);
  },

  //获取商品列表
  HealthProductsList(params){
    return fetch(base.baseUrl.serviceThree + 'product/getProductList',params);
  },

  //新增 修改商品资料
  HealthProductsSave(params){
    return fetch(base.baseUrl.serviceThree + 'product/saveProductNew',params);
  },

  //获取商品详情
  HealthProductDetail(params){
    return fetch(base.baseUrl.serviceThree + 'product/getProductDetails',params);
  },

  /*商品上传资料时 获取职务层级分配比例*/
  HealthProductMap(params){
    return fetch(base.baseUrl.serviceFour + 'postLevel/getPostMap',params);
  },

  /*健康动态*/
  //获取厂家列表
  HealthTrendVendors(params){
    return fetch(base.baseUrl.serviceThree + 'productNews/getVendors',params);
  },

  //获取商品列表
  HealthTrendProducts(params){
    return fetch(base.baseUrl.serviceThree + 'productNews/getProducts',params);
  },

  //动态添加更新
  HealthTrendSave(params){
    return fetch(base.baseUrl.serviceThree + 'productNews/saveNews',params);
  },

  //删除 批量删除动态
  HealthTrendDelete(params){
    return fetch(base.baseUrl.serviceThree + 'productNews/delete',params);
  },

  //获取商品动态列表
  HealthTrendList(params){
    return fetch(base.baseUrl.serviceThree + 'productNews/getProductNews',params);
  },

  /*搜索关键词*/
  //关键词列表
  HealthSearchKeyList(params){
    return fetch(base.baseUrl.serviceThree + 'keyword/findKeywordList',params);
  },

  //新增词
  HealthSearchKeyAdd(params){
    return fetch(base.baseUrl.serviceThree + 'keyword/insertKeyword',params);
  },

  //关键词状态修改
  HealthSearchKeyStatus(params){
    return fetch(base.baseUrl.serviceThree + 'keyword/modifyKeyword',params);
  },

  //关键词模块查询
  HealthSearchKeyModal(params){
    return fetch(base.baseUrl.serviceThree + 'keyword/queryDataDictionary',params);
  },

  /*健康问答*/
  //获取问答列表
  HealthQuesList(params){
    return fetch(base.baseUrl.serviceThree + 'healthAnswer/getHealthAnswer',params);
  },

  //编辑健康问答
  HealthQuesAdd(params){
    return fetch(base.baseUrl.serviceThree + 'healthAnswer/publishHealthQu',params);
  },

  //删除健康问答
  HealthQuesDelete(params){
    return fetch(base.baseUrl.serviceThree + 'healthAnswer/delHealthQu',params);
  },

  //修改问答状态
  HealrhQuesTop(params){
    return fetch(base.baseUrl.serviceThree + 'healthAnswer/putHealQuIndex',params);
  },

  //问答评论清单
  HealthQuesAnswerList(params){
    return fetch(base.baseUrl.serviceThree + 'healthAnswer/getHealthQuComm',params);
  },

  //添加问答评论
  HealthQuesAnswerSave(params){
    return fetch(base.baseUrl.serviceThree + 'healthAnswer/answerHealthQu',params);
  },

  /**
   * 系统设置-组织架构
   * */
  /*用户信息管理*/
  //获取部门节点
  SysUserApartment(params){
    return fetch(base.baseUrl.serviceFour + 'deptUser/getDept',params);
  },

  //获取部门员工列表
  SysUserList(params){
    return fetch(base.baseUrl.serviceFour + 'employee/getEmployeesByParams',params);
  },

  //删除员工
  SysUserDelete(params){
    return fetch(base.baseUrl.serviceFour + 'employee/delEmployee',params);
  },

  //获取员工信息详情
  SysUserDetail(params){
    return fetch(base.baseUrl.serviceFour + 'employee/getEmployeeDetails',params);
  },

  //初始化密码
  SysUserPassword(params){
    return fetch(base.baseUrl.serviceFour + 'employee/initPassword',params);
  },

  /*部门管理*/
  //获取部门信息
  SysApartment(params){
    return fetch(base.baseUrl.serviceFour + 'deptUser/getDeptList',params);
  },

  //新增 编辑部门
  SysApartmentSave(params){
    return fetch(base.baseUrl.serviceFour + 'deptUser/addDept',params);
  },

  //删除部门
  SysApartmentDelete(params){
    return fetch(base.baseUrl.serviceFour + 'deptUser/delDept',params);
  },

  /*职务组织架构管理*/
  //职务树节点
  SysPostTree(params){
    return fetch(base.baseUrl.serviceFour + 'postLevel/getPostNode',params);
  },

  //获取职务
  SysPostData(params){
    return fetch(base.baseUrl.serviceFour + 'postLevel/getPostLevel',params);
  },

  //根据所选上级职务获取下级职务名称
  SysPostLower(params){
    return fetch(base.baseUrl.serviceFour + 'postLevel/getNextLevel',params);
  },

  //新增职务
  SysPostSave(params){
    return fetch(base.baseUrl.serviceFour + 'postLevel/addPost',params);
  },

  //根据职务获取用户
  SysPostUser(params){
    return fetch(base.baseUrl.serviceFour + 'postLevel/getUserByLevel',params);
  },

  //删除职务
  SysPostDelete(params){
    return fetch(base.baseUrl.serviceFour + 'postLevel/delLevel',params);
  },

  //解除职务
  SysPostCancel(params){
    return fetch(base.baseUrl.serviceFour + 'postLevel/canUserLevel',params);
  },

  //根据所选职务获取人员列表
  SysPostUserByChoosed(params){
    return fetch(base.baseUrl.serviceFour + 'postLevel/getUserByLevelAndName',params);
  },

  //关联职务
  SysPostRelation(params){
    return fetch(base.baseUrl.serviceFour + 'postLevel/saveUserLevelRel', params);
  },

  //获取区/或者获取区下的门店
  SysPostGetShop(params){
    return fetch(base.baseUrl.serviceFour + 'deptUser/getAreaOrShop',params);
  },

  /*新闻管理*/
  //获取新闻列表
  NewsList(params){
    return fetch(base.baseUrl.serviceFive + 'newArticle/selectListByParam',params);
  },

  //编辑新闻
  NewsSave(params){
    return fetch(base.baseUrl.serviceFive + 'newArticle/saveOrUpdate',params);
  },

  //删除新闻
  NewsDelete(params){
    return fetch(base.baseUrl.serviceFive + 'newArticle/delete',params);
  },

  //查询详情
  NewsDetail(params){
    return fetch(base.baseUrl.serviceFive + 'newArticle/selectNewDetail',params);
  },

  //获取二级分类
  NewsSecondClass(params){
    return fetch(base.baseUrl.serviceFive + 'newArticle/getNewType',params);
  },

  /**
   * 体检资讯
   * **/
  /*获得可用的医院列表*/
  HospitalList(params){
    return fetch(base.baseUrl.serviceSix + 'hospital/getHospitalListUsable',params);
  },

  /*资讯类型列表查询*/
  HospitalNewsClassList(params){
    return fetch(base.baseUrl.serviceSix + 'healthmessage/getTypeList',params);
  },

  /*新增/修改健康资讯类型*/
  HospitalNewsClassSave(params){
    return fetch(base.baseUrl.serviceSix + 'healthmessage/addType',params);
  },

  /*删除资讯类型*/
  HospitalNewsClassDelete(params){
    return fetch(base.baseUrl.serviceSix + 'healthmessage/delType',params);
  },

  /* 健康资讯列表显示*/
  HospitalNewsList(params){
    return fetch(base.baseUrl.serviceSix + 'healthmessage/getMessageList',params);
  },

  /*根据医院ID获取类型列表*/
  HospitalNewsCkasById(params){
    return fetch(base.baseUrl.serviceSix + 'healthmessage/getTypes',params);
  },

  /*新增/修改健康资讯*/
  HospitalNewsSave(params){
    return fetch(base.baseUrl.serviceSix + 'healthmessage/saveMessage',params);
  },

  /*删除健康资讯*/
  HospitalNewsDelete(params){
    return fetch(base.baseUrl.serviceSix + 'healthmessage/delMesseage',params);
  },

  /*根据ID获取资讯详情*/
  HospitalNewsDetail(params){
    return fetch(base.baseUrl.serviceSix + 'healthmessage/findMessageById', params);
  },

}

