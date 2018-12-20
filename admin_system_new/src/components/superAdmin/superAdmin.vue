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
            <Checkbox v-model="isFriSysCommunity" @on-change="friSys">圈子管理</Checkbox>
          </dd>
          <dd class="mt20">
            <Checkbox v-model="isFriSysActivity" @on-change="friSys">活动管理</Checkbox>
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
        if (this.isFriSysActivity || this.isFriSysCommunity) {
          this.isFriSys = true;
        }
        if (!this.isFriSysActivity && !this.isFriSysCommunity) {
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
