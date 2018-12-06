<template>
  <div id="app">
    <Header v-show="$route.path!=='/'">
      <header-view></header-view>
    </Header>
    <Layout>
      <Sider v-show="$route.path!=='/'" :style="{background:'#ffffff'}" :class="siderClasses">
        <nav-view v-if="$route.path!=='/'" :class="menuitemClasses"></nav-view>
      </Sider>
      <Content class="content-pad">
        <tab-view v-show="$route.path!=='/'"></tab-view>
        <router-view></router-view>
      </Content>
    </Layout>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      isCollapsed: false
    };
  },
  computed: {
    menuitemClasses: function () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : '',
        !this.isCollapsed ? 'sider-width' : 'sider-widrh-small'
      ]
    },
    siderClasses: function () {
      return [
        !this.isCollapsed ? 'collapsed-width' : ''
      ]
    }
  },
  mounted () {
    //window.addEventListener('beforeunload',evt => this.beforeunloadFun(evt))
  },
  destroyed () {
     //window.removeEventListener('beforeunload')
  },
  methods:{
    beforeunloadFun:function () {
      sessionStorage.removeItem('userName');
    }
  }
}
</script>

<style>
  @import "assets/css/public.css";
  #app {
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  /*自定义导航滚动条样式*/
  .ivu-layout-sider{
    /*min-width: 240px!important;*/
    overflow-y: scroll;
  }
  .ivu-layout-sider::-webkit-scrollbar {/*滚动条整体样式*/
    width: 0;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 0;
  }
  .ivu-layout-sider-trigger{
    background-color: #ffffff!important;
  }
  .ivu-layout-sider-trigger-icon{
    color: #515a6e;
  }

  .collapsed-width{
    min-width: 240px!important;
  }

  .sider-width{
    min-width: 240px!important;
  }
  .sider-widrh-small{
    min-width: 78px!important;
  }
  .layout-con{
    height: 100%;
    width: 100%;
  }
  .menu-item span{
    display: inline-block;
    overflow: hidden;
    width: 100px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }
  .menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
  }
  .collapsed-menu .ivu-menu{
    width: 78px!important;
    transition: width .2s ease;
  }
  .collapsed-menu .ivu-icon-ios-arrow-down{
    display: none;
    transition: display .2s ease;
  }
  .collapsed-menu span{
    width: 0;
    transition: width .2s ease;
  }
  .collapsed-menu i{
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
  }
  .content-pad{
    padding: 10px 0 0 10px;
  }
</style>
