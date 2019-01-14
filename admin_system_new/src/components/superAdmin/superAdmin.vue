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
      <div class="mt20">
        <dl>
          <dt>
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
          <dd class="mt20">
            <Checkbox v-model="isFriFirst" @on-change="friSys">模块层级管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isFriArticle" @on-change="friSys">文章管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isFriBanner" @on-change="friSys">Banner图管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isFriTrends" @on-change="friSys">动态管理</Checkbox>
          </dd>
        </dl>
      </div>
      <div class="mt20">
        <dl>
          <dt>
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
        configureData:[],
        userList:[],
        configureTip:false,
        isFriSys:false,
        isFriSysCommunity:false,
        isFriSysActivity:false,
        isFriGift:false,
        isFriLabel:false,
        isFriPosition:false,
        isFriQuestion:false,
        isFriFirst:false,
        isFriArticle:false,
        isFriBanner:false,
        isFriTrends:false,
        isTvSys:false,
        isTvRoute:false,
        isTvDate:false,
        isTvAct:false,
        isTvTicket:false
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
              let menus = res.data.menus;
              for (let i = 0; i < menus.length; i++) {
                if (menus[i].group === '交友系统管理') {
                  this.isFriSys = true;
                  let items = menus[i].items;
                  for (let j = 0; j <items.length; j++) {
                    if (items[j].name === '圈子管理') {
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
                    if (items[j].name === '模块层级管理') {
                      this.isFriFirst = true;
                    }
                    if (items[j].name === '文章管理') {
                      this.isFriArticle = true;
                    }
                    if (items[j].name === 'Banner图管理') {
                      this.isFriBanner = true;
                    }
                    if (items[j].name === '动态管理') {
                      this.isFriTrends = true;
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
      friRoot:function () {
        if (!this.isFriSys) {
          this.isFriSysCommunity = false;
          this.isFriSysActivity = false;
          this.isFriGift = false;
          this.isFriLabel = false;
          this.isFriPosition = false;
          this.isFriQuestion = false;
          this.isFriFirst = false;
          this.isFriArticle = false;
          this.isFriBanner = false;
          this.isFriTrends = false;
        }
      },
      tvRoot:function () {
        if (!this.isTvSys) {
          this.isTvRoute = false;
          this.isTvDate = false;
          this.isTvAct = false;
          this.isTvTicket = false;
        }
      },
      friSys:function () {
        if (this.isFriSysActivity || this.isFriSysCommunity || this.isFriGift || this.isFriLabel || this.isFriPosition || this.isFriQuestion || this.isFriFirst || this.isFriArticle || this.isFriBanner || this.isFriTrends) {
          this.isFriSys = true;
        }
        if (!this.isFriSysActivity && !this.isFriSysCommunity && !this.isFriGift && !this.isFriLabel && !this.isFriPosition && !this.isFriQuestion && !this.isFriFirst && !this.isFriArticle && !this.isFriBanner && !this.isFriTrends) {
          this.isFriSys = false;
        }
      },
      tvSys:function () {
        if (this.isTvRoute || this.isTvDate || this.isTvAct || this.isTvTicket) {
          this.isTvSys = true;
        }
        if (!this.isTvRoute && !this.isTvDate && !this.isTvAct && !this.isTvTicket) {
          this.isTvSys = false;
        }
      },
      subConfigure:function () {
        //这种要一个一个的添加...
        if (this.isFriSys) { //交友系统
          let obj1 = {
            group:'',
            items:[]
          };
          obj1.group = '交友系统管理';
          if (this.isFriSysCommunity) {
            obj1.items.push({name:'圈子管理',path:'/communitySystem'})
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
          if (this.isFriFirst) {
            obj1.items.push({name:'模块层级管理',path:'/configureFirstModel'})
          }
          if (this.isFriArticle) {
            obj1.items.push({name:'文章管理',path:'/configureArticle'})
          }
          if (this.isFriBanner) {
            obj1.items.push({name:'Banner图管理',path:'/configureBanner'})
          }
          if (this.isFriTrends) {
            obj1.items.push({name:'动态管理',path:'/configureTrends'})
          }
          this.configureData.push(obj1);
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
          this.configureData.push(obj2);
        }
        //console.log(JSON.stringify(this.configureData));
        let configureData = JSON.stringify(this.configureData);
        axios.SubmitAuthorityChange({userId:this.configureId,name:this.configureName,permissions:configureData})
          .then(res => {
            //console.log(res);
            this.configureTip = true;
            this.$refs.configureTip.innerHTML = res.data;
            if (res.code === '0') {
              //提交成功之后清空configureData
              this.configureData = [];
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      resetAll:function () {
        this.isFriSys = false;
        this.isFriSysCommunity = false;
        this.isFriSysActivity = false;
        this.isFriGift = false;
        this.isFriLabel = false;
        this.isFriPosition = false;
        this.isFriQuestion = false;
        this.isFriFirst = false;
        this.isFriArticle = false;
        this.isFriBanner = false;
        this.isFriTrends = false;
        this.isTvSys = false;
        this.isTvRoute = false;
        this.isTvDate = false;
        this.isTvAct = false;
        this.isTvTicket = false;
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
    height: 550px;
    border: 1px solid #cccccc;
    overflow-y: scroll;
    div{
      margin-left: 30px;
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
