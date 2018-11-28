<template>
  <div class="nav-container" :style="{height: height+'px'}">
    <Menu @on-select="selectedMenu" @on-open-change="openMenu" :active-name="activeName" ref="nav" :open-names="openName">
      <Submenu name="hn">
        <template slot="title">
          <Icon type="ios-analytics"/>
          <span>红娘管理</span>
        </template>
        <!--<Submenu name="hn-register">-->
          <!--<template slot="title" :to="{path: ''}"><span>红娘注册管理</span></template>-->
          <!--<MenuItem name="hn-reg-money" :to="{path: ''}"><span>押金管理</span></MenuItem>-->
          <!--<MenuItem name="hn-reg-related" :to="{path: ''}"><span>关联用户清单</span></MenuItem>-->
          <!--<MenuItem name="hn-reg-list" :to="{path: ''}"><span>红娘清单</span></MenuItem>-->
          <!--<MenuItem name="hn-reg-supervise" :to="{path: ''}"><span>监管名单</span></MenuItem>-->
          <!--<MenuItem name="hn-reg-blacklist" :to="{path: ''}"><span>黑名单</span></MenuItem>-->
          <!--<MenuItem name="hn-reg-rollover" :to="{path: ''}"><span>待续期清单</span></MenuItem>-->
          <!--<MenuItem name="welcome" :to="{path: '/welcome'}"><span>待审核红娘清单</span></MenuItem>-->
          <!--<MenuItem name="hnData" :to="{path: '/hnData'}"><span>红娘资料上传</span></MenuItem>-->
        <!--</Submenu>-->
        <Submenu name="user-register">
          <template slot="title"><span>用户注册管理</span></template>
          <MenuItem name="userMessage" :to="{path: '/userMessage'}"><span>用户信息</span></MenuItem>
          <MenuItem name="user-reg-blacklist" :to="{path: ''}"><span>黑名单</span></MenuItem>
          <MenuItem name="user-reg-supervise" :to="{path: ''}"><span>监管名单</span></MenuItem>
          <MenuItem name="user-reg-uprecord" :to="{path: ''}"><span>批量上传记录</span></MenuItem>
        </Submenu>
        <Submenu name="friends-system">
          <template slot="title"><span>交友系统管理</span></template>
          <MenuItem name="communitySystem" :to="{path: '/communitySystem'}"><span>圈子管理</span></MenuItem>
          <MenuItem name="activitySystem" :to="{path: '/activitySystem'}"><span>活动管理</span></MenuItem>
        </Submenu>
        <Submenu name="hbtv-system">
          <template slot="title"><span>湖北电视台专栏管理</span></template>
          <MenuItem name="tourRouteSystem" :to="{path: '/tourRouteSystem'}"><span>旅游线路管理</span></MenuItem>
          <MenuItem name="dataPageSystem" :to="{path: '/dataPageSystem'}"><span>相亲专栏管理</span></MenuItem>
          <MenuItem name="act" :to="{path: '/act'}"><span>节目专栏管理</span></MenuItem>
        </Submenu>
        <!--<Submenu name="hn-service">-->
          <!--<template slot="title"><span>红娘服务管理</span></template>-->
          <!--<MenuItem name="hn-service-wait" :to="{path: ''}"><span>敬请期待</span></MenuItem>-->
          <!--<MenuItem name="hn-service-completed" :to="{path: ''}"><span>服务完成订单</span></MenuItem>-->
          <!--<MenuItem name="hn-service-feedback" :to="{path: ''}"><span>服务反馈</span></MenuItem>-->
        <!--</Submenu>-->
        <!--<Submenu name="after-sales">-->
          <!--<template slot="title"><span>售后管理</span></template>-->
          <!--<MenuItem name="after-sales-check" :to="{path: ''}"><span>服务满意度调查</span></MenuItem>-->
          <!--<MenuItem name="after-sales-list" :to="{path: ''}"><span>服务调查清单</span></MenuItem>-->
        <!--</Submenu>-->
        <!--<Submenu name="pay-manage">-->
          <!--<template slot="title"><span>支付管理</span></template>-->
          <!--<MenuItem name="pay-manage-list" :to="{path: ''}"><span>营收清单</span></MenuItem>-->
          <!--<MenuItem name="pay-manage-waiting" :to="{path: ''}"><span>待打款</span></MenuItem>-->
          <!--<MenuItem name="pay-manage-record" :to="{path: ''}"><span>打款记录</span></MenuItem>-->
          <!--<MenuItem name="pay-manage-mask" :to="{path: ''}"><span>定时任务清单</span></MenuItem>-->
        <!--</Submenu>-->
        <!--<Submenu name="area-manage">-->
          <!--<template slot="title"><span>区域管理</span></template>-->
          <!--<MenuItem name="area-manage-list" :to="{path: ''}"><span>区域管理</span></MenuItem>-->
        <!--</Submenu>-->
        <!--<Submenu name="organize-manage">-->
          <!--<template slot="title"><span>组织架构设置</span></template>-->
          <!--<MenuItem name="organize-manage-list" :to="{path: ''}"><span>组织架构设置</span></MenuItem>-->
        <!--</Submenu>-->
        <!--<Submenu name="role-manage">-->
          <!--<template slot="title"><span>角色管理</span></template>-->
          <!--<MenuItem name="role-manage-list" :to="{path: ''}"><span>角色管理</span></MenuItem>-->
        <!--</Submenu>-->
        <!--<Submenu name="consumer-manage">-->
          <!--<template slot="title"><span>用户管理</span></template>-->
          <!--<MenuItem name="consumer-manage-list" :to="{path: ''}"><span>用户管理</span></MenuItem>-->
        <!--</Submenu>-->
        <!--<Submenu name="sys-manage">-->
          <!--<template slot="title"><span>系统参数设置</span></template>-->
          <!--<MenuItem name="sys-manage-list" :to="{path: ''}"><span>系统参数设置</span></MenuItem>-->
        <!--</Submenu>-->
        <!--<Submenu name="certificate-manage">-->
          <!--<template slot="title"><span>红娘证书管理</span></template>-->
          <!--<MenuItem name="certificate-manage-list" :to="{path: ''}"><span>红娘证书管理</span></MenuItem>-->
        <!--</Submenu>-->
      </Submenu>
    </Menu>
  </div>
</template>

<script>
  export default {
    name: "navView",
    data () {
      return {
        height:window.innerHeight - 64
      }
    },
    computed:{
      activeName:function () {
        return this.$store.state.activeTab;
      },
      openName:function () {
        return this.$store.state.openName;
      }
    },
    mounted () {
      if (sessionStorage.getItem('active') != null) {
        this.$store.state.activeTab = sessionStorage.getItem('active')
      }
      if (sessionStorage.getItem('open') != null) {
        this.$store.state.openName = JSON.parse(sessionStorage.getItem('open'));
      }
      this.$nextTick(()=>{
        this.$refs.nav.updateOpened();
      })
    },
    methods :{
      //name名绑定为路由名 选择时保存至store 与页签关联
      selectedMenu: function (name) {
        let el = event.currentTarget;
        let text = el.text;
        let data = {
          label:text,
          name:name
        };
        this.$store.commit('ADD_TAB_LIST',data);
        this.$store.commit('ACTIVE_TAB',name)
      },
      openMenu :function (arr) {
        this.$store.commit('ADD_OPEN',arr);
      }
    }
  }
</script>

<style lang="scss" scoped>
.active-class{
  color: #2d8cf0;
}
</style>
