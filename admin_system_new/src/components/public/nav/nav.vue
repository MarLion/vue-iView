<template>
  <div class="nav-container" :style="{height: height+'px'}">
    <Menu @on-select="selectedMenu" @on-open-change="openMenu" :active-name="activeName" ref="nav" :open-names="openName">
      <Submenu name="hn">
        <template slot="title">
          <Icon type="ios-analytics"/>
          <span>红娘管理</span>
        </template>
        <Submenu v-for="(item,index) in menus" :key="index" :name='item.group'>
          <template slot="title"><span>{{item.group}}</span></template>
          <MenuItem v-for="(it,index) in item.items" :to="{path:it.path}" :key="it.name" :name="it.path">{{it.name}}</MenuItem>
        </Submenu>
      </Submenu>
      <Submenu name="super" v-if="users === 'admin'">
        <template slot="title">
          <Icon type="ios-build"/>
          <span>权限管理</span>
        </template>
        <MenuItem :to="{path: '/superAdmin'}" name="/superAdmin">权限设置</MenuItem>
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
      users:function () {
        return this.$store.state.admin_token;
      },
      menus:function () {
        return JSON.parse(sessionStorage.getItem('menus'));
      },
      activeName:function () {
        return this.$store.state.activeTab;
      },
      openName:function () {
        return this.$store.state.openName;
      }
    },
    mounted () {
      if (sessionStorage.getItem('userName') != null) {
        this.$store.state.admin_token = sessionStorage.getItem('userName');
      }
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
