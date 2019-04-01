<template>
  <div class="admin-container">
    <div class="configure-name">
      角色账号：
      <Select v-model="configureId" style="width: 200px;" label-in-value @on-change="getAuthority">
        <Option v-for="item in userList" :value="item.id" :key="item.id">{{item.userName}}</Option>
      </Select>
    </div>
    <div class="configure-name mt30">设置权限：</div>
    <div class="configure-container mt30">
      <span class="mt20">红娘：</span>
      <div class="mt20">
        <dl>
          <dt class="text-left">
            <Checkbox v-model="isData" @on-change="dataRoot"><Icon type="ios-arrow-down"></Icon>数据看板</Checkbox>
          </dt>
          <dd class="mt20">
            <Checkbox v-model="isDataUser" @on-change="dataSys">用户统计</Checkbox>
          </dd>
        </dl>
      </div>
      <div class="mt20">
        <dl>
          <dt class="text-left">
            <Checkbox v-model="isFriSys" @on-change="friRoot"><Icon type="ios-arrow-down"></Icon>交友系统管理</Checkbox>
          </dt>
          <dd class="mt20">
            <Checkbox v-model="isFriSysCommunity" @on-change="friSys">话题管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isFriSysActivity" @on-change="friSys">活动管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isFriGift" @on-change="friSys">礼物配置</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isFriLabel" @on-change="friSys">标签配置</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isFriPosition" @on-change="friSys">地理位置配置</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isFriQuestion" @on-change="friSys">题库配置</Checkbox>
          </dd>
          <!--<dd class="mt20">-->
            <!--<Checkbox v-model="isFriFirst" @on-change="friSys">模块层级管理</Checkbox>-->
          <!--</dd>-->
          <!--<dd class="mt20">-->
            <!--<Checkbox v-model="isFriArticle" @on-change="friSys">文章管理</Checkbox>-->
          <!--</dd>-->
          <dd class="mt20">
            <Checkbox v-model="isFriBanner" @on-change="friSys">Banner图管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isFriTrends" @on-change="friSys">动态管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isFriStartPage" @on-change="friSys">启动页管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isFriRecord" @on-change="friSys">履历管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isFriMessage" @on-change="friSys">系统消息管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isFriMessageIcon" @on-change="friSys">推送图标管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isFriStyle" @on-change="friSys">寻姻缘风格管理</Checkbox>
          </dd>
        </dl>
      </div>
      <div class="mt20">
        <dl>
          <dt class="text-left">
            <Checkbox v-model="isTvSys" @on-change="tvRoot"><Icon type="ios-arrow-down"></Icon>湖北电视台专栏管理</Checkbox>
          </dt>
          <dd class="mt20">
            <Checkbox v-model="isTvRoute" @on-change="tvSys">旅游线路管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isTvDate" @on-change="tvSys">相亲专栏管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isTvAct" @on-change="tvSys">节目专栏管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isTvTicket" @on-change="tvSys">活动券管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isTvBanner" @on-change="tvSys">Banner管理</Checkbox>
          </dd>
        </dl>
      </div>
      <span class="mt20 ml100">营养师：</span>
      <div class="mt20">
        <dl>
          <dt class="text-left">
            <Checkbox v-model="isYysSys" @on-change="yysRoot"><Icon type="ios-arrow-down"></Icon>营养师系统管理</Checkbox>
          </dt>
          <!--<dd class="mt20">-->
            <!--<Checkbox v-model="isYysKnow" @on-change="yysSys">健康文化管理</Checkbox>-->
          <!--</dd>-->
          <dd class="mt20">
            <Checkbox v-model="isYysProduct" @on-change="yysSys">商品资料上传</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isYysCoupon" @on-change="yysSys">优惠券管理</Checkbox>
          </dd>
          <!--<dd class="mt20">-->
            <!--<Checkbox v-model="isYysKnowClass" @on-change="yysSys">健康文化分类管理</Checkbox>-->
          <!--</dd>-->
          <!--<dd class="mt20">-->
            <!--<Checkbox v-model="isYysGuideClass" @on-change="yysSys">小常识分类管理</Checkbox>-->
          <!--</dd>-->
          <dd class="mt20">
            <Checkbox v-model="isYysBanner" @on-change="yysSys">Banner图管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isYysTrend" @on-change="yysSys">健康动态管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isYysQuestion" @on-change="yysSys">健康问答管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isYysKey" @on-change="yysSys">搜索关键词管理</Checkbox>
          </dd>
        </dl>
      </div>
      <span class="mt20 ml100">系统管理：</span>
      <div class="mt20">
        <dl>
          <dt class="text-left">
            <Checkbox v-model="isSysSys" @on-change="sysRoot"><Icon type="ios-arrow-down"></Icon>组织架构系统管理</Checkbox>
          </dt>
          <dd class="mt20">
            <Checkbox v-model="isSysUsers" @on-change="sysSys">用户信息管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isSysOrganization" @on-change="sysSys">组织架构管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isSysApartment" @on-change="sysSys">部门管理</Checkbox>
          </dd>
        </dl>
      </div>
      <span class="mt20 ml100">新闻管理：</span>
      <div class="mt20">
        <dl>
          <dt class="text-left">
            <Checkbox v-model="isMarriageNewsSys" @on-change="marriageRoot"><Icon type="ios-arrow-down"></Icon>寻姻缘新闻管理</Checkbox>
          </dt>
          <dd class="mt20">
            <Checkbox v-model="isMarriageModal" @on-change="marriageSys">寻姻缘模块管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isMarriageNews" @on-change="marriageSys">新闻发布管理</Checkbox>
          </dd>
        </dl>
        <dl>
          <dt class="text-left">
            <Checkbox v-model="isYysNewsSys" @on-change="yysNewsRoot"><Icon type="ios-arrow-down"></Icon>营养师新闻管理</Checkbox>
          </dt>
          <dd class="mt20">
            <Checkbox v-model="isYysNewsClass" @on-change="yysNewsSys">健康文化分类管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isYysNewsGuideClass" @on-change="yysNewsSys">小常识分类管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isYysNews" @on-change="yysNewsSys">健康文化管理</Checkbox>
          </dd>
        </dl>
        <dl>
          <dt class="text-left">
            <Checkbox v-model="isHospitalSys" @on-change="hospitalRoot"><Icon type="ios-arrow-down"></Icon>体检新闻管理</Checkbox>
          </dt>
          <dd class="mt20">
            <Checkbox v-model="isHospitalType" @on-change="hospitalSys">资讯类型管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isHospitalNews" @on-change="hospitalSys">资讯发布管理</Checkbox>
          </dd>
        </dl>
        <dl>
          <dt class="text-left">
            <Checkbox v-model="isNewsSys" @on-change="newsRoot"><Icon type="ios-arrow-down"></Icon>新闻资讯管理</Checkbox>
          </dt>
          <dd class="mt20">
            <Checkbox v-model="isNewsSave" @on-change="newsSys">新闻发布管理</Checkbox>
          </dd>
        </dl>
      </div>
    </div>
    <div class="mt70 text-left configure-btn">
      <Button type="info" @click="subConfigure">保存</Button>
      <Button type="error" @click="resetAll">重置</Button>
    </div>
    <Modal
      title="提示"
      v-model="configureTip"
    >
      <p ref="configureTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from '../../../src/axios/axios'
  export default {
    name: "superAdmin",
    data () {
      return {
        configureName:'',
        configureId:'',
        configureData:{},
        userList:[],
        configureTip:false,
        isData:false,
        isDataUser:false,
        isFriSys:false,
        isFriSysCommunity:false,
        isFriSysActivity:false,
        isFriGift:false,
        isFriLabel:false,
        isFriPosition:false,
        isFriQuestion:false,
        //isFriFirst:false,
        //isFriArticle:false,
        isFriBanner:false,
        isFriTrends:false,
        isFriStartPage:false,
        isFriRecord:false,
        isFriMessage:false,
        isFriMessageIcon:false,
        isFriStyle:false,
        isTvSys:false,
        isTvRoute:false,
        isTvDate:false,
        isTvAct:false,
        isTvTicket:false,
        isTvBanner:false,
        //营养师
        isYysSys:false,
        // isYysKnow:false,
        isYysProduct:false,
        isYysCoupon:false,
        // isYysKnowClass:false,
        // isYysGuideClass:false,
        isYysBanner:false,
        isYysTrend:false,
        isYysQuestion:false,
        isYysKey:false,
        //系统设置
        isSysSys:false,
        isSysUsers:false,
        isSysOrganization:false,
        isSysApartment:false,
        //寻姻缘新闻
        isMarriageNewsSys:false,
        isMarriageModal:false,
        isMarriageNews:false,
        //营养师新闻
        isYysNewsSys:false,
        isYysNewsClass:false,
        isYysNewsGuideClass:false,
        isYysNews:false,
        //体检新闻
        isHospitalSys:false,
        isHospitalType:false,
        isHospitalNews:false,
        //新闻
        isNewsSys:false,
        isNewsSave:false,
      }
    },
    mounted () {
      this.getUserNameList();
    },
    methods:{
      getUserNameList: function () {
        axios.AuthorityNameList()
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.userList = res.data;
            } else {
              console.log("请求失败！")
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      getAuthority:function (opt) {
        this.configureName = opt.label;
        this.resetAll();
        axios.GetAreadyAuthority({userId:this.configureId})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              let menus = res.data.HNmenus;
              let yysMenus = res.data.YYSmenus;
              let newsMenus = res.data.NEWSmenus;
              let sysMenus = res.data.SYSmenus;
              for (let i = 0; i < menus.length; i++) {
                if (menus[i].group === '数据看板') {
                  this.isData = true;
                  let items = menus[i].items;
                  for (let j = 0; j <items.length; j++) {
                    if (items[j].name === '用户统计') {
                      this.isDataUser = true;
                    }
                  }
                }
                if (menus[i].group === '交友系统管理') {
                  this.isFriSys = true;
                  let items = menus[i].items;
                  for (let j = 0; j <items.length; j++) {
                    if (items[j].name === '话题管理') {
                      this.isFriSysCommunity = true;
                    }
                    if (items[j].name === '活动管理') {
                      this.isFriSysActivity = true;
                    }
                    if (items[j].name === '礼物配置') {
                      this.isFriGift = true;
                    }
                    if (items[j].name === '标签配置') {
                      this.isFriLabel = true;
                    }
                    if (items[j].name === '地理位置配置') {
                      this.isFriPosition = true;
                    }
                    if (items[j].name === '题库配置') {
                      this.isFriQuestion = true;
                    }
                    // if (items[j].name === '模块层级管理') {
                    //   this.isFriFirst = true;
                    // }
                    // if (items[j].name === '文章管理') {
                    //   this.isFriArticle = true;
                    // }
                    if (items[j].name === 'Banner图管理') {
                      this.isFriBanner = true;
                    }
                    if (items[j].name === '动态管理') {
                      this.isFriTrends = true;
                    }
                    if (items[j].name === '启动页管理') {
                      this.isFriStartPage = true;
                    }
                    if (items[j].name === '履历管理') {
                      this.isFriRecord = true;
                    }
                    if (items[j].name === '系统消息管理') {
                      this.isFriMessage = true;
                    }
                    if (items[j].name === '推送图标管理') {
                      this.isFriMessageIcon = true;
                    }
                    if (items[j].name === '寻姻缘风格管理') {
                      this.isFriStyle = true;
                    }
                  }
                }
                if (menus[i].group === '湖北电视台专栏管理') {
                  this.isTvSys = true;
                  let items = menus[i].items;
                  for (let j = 0; j < items.length; j++) {
                    if (items[j].name === '旅游线路管理') {
                      this.isTvRoute = true;
                    }
                    if (items[j].name === '相亲专栏管理') {
                      this.isTvDate = true;
                    }
                    if (items[j].name === '节目专栏管理') {
                      this.isTvAct = true;
                    }
                    if (items[j].name === '活动券管理') {
                      this.isTvTicket = true;
                    }
                    if (items[j].name === 'Banner管理') {
                      this.isTvBanner = true;
                    }
                  }
                }
              }
              //营养师部分
              for (let i = 0; i < yysMenus.length; i++) {
                if (yysMenus[i].group === '营养师系统管理') {
                  this.isYysSys = true;
                  let items = yysMenus[i].items;
                  for (let j = 0; j < items.length; j++) {
                    // if (items[j].name === '健康文化管理') {
                    //   this.isYysKnow = true;
                    // }
                    if (items[j].name === '商品资料上传') {
                      this.isYysProduct = true;
                    }
                    if (items[j].name === '优惠券管理') {
                      this.isYysCoupon = true;
                    }
                    // if (items[j].name === '健康文化分类管理') {
                    //   this.isYysKnowClass = true;
                    // }
                    // if (items[j].name === '小常识分类管理') {
                    //   this.isYysGuideClass = true;
                    // }
                    if (items[j].name === 'Banner图管理') {
                      this.isYysBanner = true;
                    }
                    if (items[j].name === '健康动态管理') {
                      this.isYysTrend = true;
                    }
                    if (items[j].name === '健康问答管理') {
                      this.isYysQuestion = true;
                    }
                    if (items[j].name === '搜索关键词管理') {
                      this.isYysKey = true;
                    }
                  }
                }
              }
              //新闻管理
              for (let i = 0; i < newsMenus.length; i++) {
                if (newsMenus[i].group === '寻姻缘新闻管理') {
                  this.isData = true;
                  let items = newsMenus[i].items;
                  for (let j = 0; j <items.length; j++) {
                    if (items[j].name === '寻姻缘模块管理') {
                      this.isMarriageModal = true;
                    }
                    if (items[j].name === '新闻发布管理') {
                      this.isMarriageNews = true;
                    }
                  }
                }
                if (newsMenus[i].group === '营养师新闻管理') {
                  this.isData = true;
                  let items = newsMenus[i].items;
                  for (let j = 0; j <items.length; j++) {
                    if (items[j].name === '健康文化分类管理') {
                      this.isYysNewsClass = true;
                    }
                    if (items[j].name === '小常识分类管理') {
                      this.isYysNewsGuideClass = true;
                    }
                    if (items[j].name === '健康文化管理') {
                      this.isYysNews = true;
                    }
                  }
                }
                if (newsMenus[i].group === '体检新闻管理') {
                  this.isData = true;
                  let items = newsMenus[i].items;
                  for (let j = 0; j <items.length; j++) {
                    if (items[j].name === '资讯类型管理') {
                      this.isHospitalType = true;
                    }
                    if (items[j].name === '资讯发布管理') {
                      this.isHospitalNews = true;
                    }
                  }
                }
                if (newsMenus[i].group === '新闻资讯管理') {
                  this.isData = true;
                  let items = newsMenus[i].items;
                  for (let j = 0; j <items.length; j++) {
                    if (items[j].name === '新闻发布管理') {
                      this.isNewsSave = true;
                    }
                  }
                }
              }
              //系统设置
              for (let i = 0; i < sysMenus.length; i++) {
                if (sysMenus[i].group === '组织架构系统管理') {
                  this.isSysSys = true;
                  let items = sysMenus[i].items;
                  for (let j = 0; j < items.length; j++) {
                    if (items[j].name === '用户信息管理') {
                      this.isSysUsers = true;
                    }
                    if (items[j].name === '组织架构管理') {
                      this.isSysOrganization = true;
                    }
                    if (items[j].name === '部门管理') {
                      this.isSysApartment = true;
                    }
                  }
                }
              }
            } else {
              console.log('请求失败！')
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      dataRoot:function () {
        this.isDataUser = this.isData;
      },
      friRoot:function () {
        this.isFriSysCommunity = this.isFriSys;
        this.isFriSysActivity = this.isFriSys;
        this.isFriGift = this.isFriSys;
        this.isFriLabel = this.isFriSys;
        this.isFriPosition = this.isFriSys;
        this.isFriQuestion = this.isFriSys;
        // this.isFriFirst = this.isFriSys;
        // this.isFriArticle = this.isFriSys;
        this.isFriBanner = this.isFriSys;
        this.isFriTrends = this.isFriSys;
        this.isFriStartPage = this.isFriSys;
        this.isFriRecord = this.isFriSys;
        this.isFriMessage = this.isFriSys;
        this.isFriMessageIcon = this.isFriSys;
        this.isFriStyle = this.isFriSys;
      },
      tvRoot:function () {
        this.isTvRoute = this.isTvSys;
        this.isTvDate = this.isTvSys;
        this.isTvAct = this.isTvSys;
        this.isTvTicket = this.isTvSys;
        this.isTvBanner = this.isTvSys;
      },
      yysRoot:function () {
        // this.isYysKnow = this.isYysSys;
        this.isYysCoupon = this.isYysSys;
        this.isYysProduct = this.isYysSys;
        // this.isYysKnowClass = this.isYysSys;
        // this.isYysGuideClass = this.isYysSys;
        this.isYysBanner = this.isYysSys;
        this.isYysTrend = this.isYysSys;
        this.isYysQuestion = this.isYysSys;
        this.isYysKey = this.isYysSys;
      },
      sysRoot:function () {
        this.isSysUsers = this.isSysSys;
        this.isSysOrganization = this.isSysSys;
        this.isSysApartment = this.isSysSys;
      },
      marriageRoot:function () {
        this.isMarriageModal = this.isMarriageNewsSys;
        this.isMarriageNews = this.isMarriageNewsSys;
      },
      yysNewsRoot:function () {
        this.isYysNewsClass = this.isYysNewsSys;
        this.isYysNewsGuideClass = this.isYysNewsSys;
        this.isYysNews = this.isYysNewsSys;
      },
      hospitalRoot:function () {
        this.isHospitalType = this.isHospitalSys;
        this.isHospitalNews = this.isHospitalSys;
      },
      newsRoot:function () {
        this.isNewsSave = this.isNewsSys;
      },
      dataSys:function () {
        this.isData = this.isDataUser;
      },
      friSys:function () {
        this.isFriSys = this.isFriSysActivity || this.isFriSysCommunity || this.isFriGift || this.isFriLabel || this.isFriPosition || this.isFriQuestion || this.isFriBanner || this.isFriTrends || this.isFriStartPage || this.isFriRecord || this.isFriMessage || this.isFriMessageIcon || this.isFriStyle
      },
      tvSys:function () {
        this.isTvSys = this.isTvRoute || this.isTvDate || this.isTvAct || this.isTvTicket || this.isTvBanner;
      },
      yysSys:function () {
        this.isYysSys = this.isYysProduct || this.isYysCoupon || this.isYysBanner || this.isYysTrend || this.isYysQuestion || this.isYysKey;
      },
      sysSys:function () {
        this.isSysSys = this.isSysUsers || this.isSysOrganization || this.isSysApartment;
      },
      marriageSys:function () {
        this.isMarriageNewsSys = this.isMarriageModal || this.isMarriageNews;
      },
      yysNewsSys:function () {
        this.isYysNewsSys = this.isYysNews || this.isYysNewsClass || this.isYysNewsGuideClass;
      },
      hospitalSys:function () {
        this.isHospitalSys = this.isHospitalType || this.isHospitalNews;
      },
      newsSys:function () {
        this.isNewsSys = this.isNewsSave;
      },
      subConfigure:function () {
        let hnArr = [];
        let yysArr = [];
        let newsArr = [];
        let sysArr = [];
        //这种要一个一个的添加...
        if (this.isData) { //数据看板
          let obj = {
            group:'',
            items:[]
          };
          obj.group = '数据看板';
          if (this.isDataUser) {
            obj.items.push({name:'用户统计',path:'/welcome'})
          }
          hnArr.push(obj);
        }
        if (this.isFriSys) { //交友系统
          let obj1 = {
            group:'',
            items:[]
          };
          obj1.group = '交友系统管理';
          if (this.isFriSysCommunity) {
            obj1.items.push({name:'话题管理',path:'/communitySystem'})
          }
          if (this.isFriSysActivity) {
            obj1.items.push({name:'活动管理',path:'/activitySystem'})
          }
          if (this.isFriGift) {
            obj1.items.push({name:'礼物配置',path:'/configureGift'})
          }
          if (this.isFriLabel) {
            obj1.items.push({name:'标签配置',path:'/configureLabel'})
          }
          if (this.isFriPosition) {
            obj1.items.push({name:'地理位置配置',path:'/configurePosition'})
          }
          if (this.isFriQuestion) {
            obj1.items.push({name:'题库配置',path:'/configureQuestion'})
          }
          // if (this.isFriFirst) {
          //   obj1.items.push({name:'模块层级管理',path:'/configureFirstModel'})
          // }
          // if (this.isFriArticle) {
          //   obj1.items.push({name:'文章管理',path:'/configureArticle'})
          // }
          if (this.isFriBanner) {
            obj1.items.push({name:'Banner图管理',path:'/configureBanner'})
          }
          if (this.isFriTrends) {
            obj1.items.push({name:'动态管理',path:'/configureTrends'})
          }
          if (this.isFriStartPage) {
            obj1.items.push({name:'启动页管理',path:'/configureStartPage'})
          }
          if (this.isFriRecord) {
            obj1.items.push({name:'履历管理',path:'/configureRecord'})
          }
          if (this.isFriMessage) {
            obj1.items.push({name:'系统消息管理',path:'/configureMessage'})
          }
          if (this.isFriMessageIcon) {
            obj1.items.push({name:'推送图标管理',path:'/configureMessageIcon'})
          }
          if (this.isFriStyle) {
            obj1.items.push({name:'寻姻缘风格管理',path:'/configureStyle'})
          }
          hnArr.push(obj1);
        }
        if (this.isTvSys) { //电视台专栏
          let obj2 = {
            group:'',
            items:[]
          };
          obj2.group = '湖北电视台专栏管理';
          if (this.isTvRoute) {
            obj2.items.push({name:'旅游线路管理',path:'/tourRouteSystem'});
          }
          if (this.isTvDate) {
            obj2.items.push({name:'相亲专栏管理',path:'/dataPageSystem'});
          }
          if (this.isTvAct) {
            obj2.items.push({name:'节目专栏管理',path:'/act'});
          }
          if (this.isTvTicket) {
            obj2.items.push({name:'活动券管理',path:'/actTicketSystem'});
          }
          if (this.isTvBanner) {
            obj2.items.push({name:'Banner管理',path:'/tourBanner'});
          }
          hnArr.push(obj2);
        }
        if (this.isYysSys) { //营养师系统管理
          let yysObj = {
            group:'',
            items:[]
          };
          yysObj.group = '营养师系统管理';
          // if (this.isYysKnow) {
          //   yysObj.items.push({name:'健康文化管理',path:'/configureHealthKnowledge'});
          // }
          if (this.isYysProduct) {
            yysObj.items.push({name:'商品资料上传',path:'/configureHealthProducts'});
          }
          if (this.isYysCoupon) {
            yysObj.items.push({name:'优惠券管理',path:'/configureHealthCoupon'});
          }
          // if (this.isYysKnowClass) {
          //   yysObj.items.push({name:'健康文化分类管理',path:'/configureHealthKnowledgeClass'});
          // }
          // if (this.isYysGuideClass) {
          //   yysObj.items.push({name:'小常识分类管理',path:'/configureHealthGuideClass'});
          // }
          if (this.isYysBanner) {
            yysObj.items.push({name:'Banner图管理',path:'/configureHealthBanner'});
          }
          if (this.isYysTrend) {
            yysObj.items.push({name:'健康动态管理',path:'/configureHealthProductTrend'});
          }
          if (this.isYysQuestion) {
            yysObj.items.push({name:'健康问答管理',path:'/configureHealthQuestion'});
          }
          if (this.isYysKey) {
            yysObj.items.push({name:'搜索关键词管理',path:'/configureHealthKey'});
          }
          yysArr.push(yysObj)
        }
        //新闻管理
        if (this.isMarriageNewsSys){
          let mNewsObj = {
            group:'',
            items:[]
          };
          mNewsObj.group = '寻姻缘新闻管理';
          if (this.isMarriageModal) {
            mNewsObj.items.push({name:'寻姻缘模块管理',path:'/configureFirstModel'});
          }
          if (this.isMarriageNews) {
            mNewsObj.items.push({name:'新闻发布管理',path:'/configureArticle'});
          }
          newsArr.push(mNewsObj);
        }
        if (this.isYysNewsSys) {
          let yNewsObj = {
            group:'',
            items:[]
          };
          if (this.isYysNewsClass) {
            yNewsObj.items.push({name:'健康文化分类管理',path:'/configureHealthKnowledgeClass'});
          }
          if (this.isYysNewsGuideClass) {
            yNewsObj.items.push({name:'小常识分类管理',path:'/configureHealthGuideClass'});
          }
          if (this.isYysNews) {
            yNewsObj.items.push({name:'健康文化管理',path:'/configureHealthKnowledge'});
          }
          newsArr.push(yNewsObj);
        }
        if (this.isHospitalSys) {
          let hNewsObj = {
            group:'',
            items:[]
          };
          if (this.isHospitalType) {
            hNewsObj.items.push({name:'资讯类型管理',path:'/configureHospitalNewsType'});
          }
          if (this.isHospitalNews) {
            hNewsObj.items.push({name:'资讯发布管理',path:'/configureHospitalNews'});
          }
          newsArr.push(hNewsObj);
        }
        if (this.isNewsSys) {
          let nNewsObj = {
            group:'',
            items:[]
          };
          if (this.isNewsSave) {
            nNewsObj.items.push({name:'新闻发布管理',path:'/configureNews'});
          }
          newsArr.push(nNewsObj);
        }
        //系统设置
        if (this.isSysSys) {
          let obj3 = {
            group:'',
            items:[]
          };
          obj3.group = '组织架构系统管理';
          if (this.isSysUsers) {
            obj3.items.push({name:'用户信息管理',path:'/configureShopAndUser'});
          }
          if (this.isSysOrganization) {
            obj3.items.push({name:'组织架构管理',path:'/configureOrganization'});
          }
          if (this.isSysApartment) {
            obj3.items.push({name:'部门管理',path:'/configureApartment'});
          }
          sysArr.push(obj3);
        }
        this.configureData = {
          HNmenus:hnArr,
          YYSmenus:yysArr,
          NEWSmenus:newsArr,
          SYSmenus:sysArr
        };
        //console.log(JSON.stringify(this.configureData));
        let configureData = JSON.stringify(this.configureData);
        axios.SubmitAuthorityChange({userId:this.configureId,name:this.configureName,permissions:configureData})
          .then(res => {
            //console.log(res);
            this.configureTip = true;
            this.$refs.configureTip.innerHTML = res.data;
            this.configureData = [];
          })
          .catch(error => {
            console.log(error);
            this.configureData = [];
          })
      },
      resetAll:function () {
        this.isData = false;
        this.isDataUser = false;
        this.isFriSys = false;
        this.isFriSysCommunity = false;
        this.isFriSysActivity = false;
        this.isFriGift = false;
        this.isFriLabel = false;
        this.isFriPosition = false;
        this.isFriQuestion = false;
        // this.isFriFirst = false;
        // this.isFriArticle = false;
        this.isFriBanner = false;
        this.isFriTrends = false;
        this.isFriStartPage = false;
        this.isFriRecord = false;
        this.isFriMessage = false;
        this.isFriMessageIcon = false;
        this.isFriStyle = false;
        this.isTvSys = false;
        this.isTvRoute = false;
        this.isTvDate = false;
        this.isTvAct = false;
        this.isTvTicket = false;
        this.isTvBanner = false;
        this.isYysSys = false;
        // this.isYysKnow = false;
        this.isYysProduct = false;
        this.isYysCoupon = false;
        // this.isYysKnowClass = false;
        // this.isYysGuideClass = false;
        this.isYysBanner = false;
        this.isYysTrend = false;
        this.isYysQuestion = false;
        this.isYysKey =false;
        this.isSysSys = false;
        this.isSysUsers = false;
        this.isSysApartment = false;
        this.isSysOrganization = false;
        this.isNewsSys = false;
        this.isNewsSave = false;
      },
      del:function () {
        this.configureTip = false;
      }
    }
  }
</script>

<style lang="scss" scoped>
.admin-container{
  padding: 0 15px;
  .configure-name{
    text-align: left;
    padding-left: 30px;
  }
  .configure-container{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding:  0 30px;
    height: 600px;
    border: 1px solid #cccccc;
    overflow-y: scroll;
    div{
      margin-left: 30px;
      dl{
        padding-bottom: 20px;
      }
      dd{
        text-align: left;
        padding-left: 15px;
      }
    }
  }
  .configure-btn{
    padding-left: 30px;
  }
}
</style>
