<template>
  <div class="tan-container content-pad" v-if="isShow">
    <Tabs type="card" closable @on-tab-remove="handleTabRemove" v-model="activeTab" @on-click="tabClick">
      <TabPane  v-for="(item, index) in tabList" :label="item.label" :name="item.name" :key="item.name"></TabPane>
      <!--这里如果key绑定index的话会出现bug 当关闭中间的页签时被关闭项的后面一个页签无法加载 经测是由于key值绑定index引起 故使用name值-->
    </Tabs>
  </div>
</template>

<script>
  export default {
    name: "tab",
    data () {
      return {
      }
    },
    //将name绑定为路由名 点击时实现跳转
    computed: {
      tabList:function () {
         return this.$store.state.tabList
      },
      isShow:function () {
        return this.$store.state.tabList.length > 0;
      },
      //双向绑定了activeTab 需要设置set方法 否则会报错
      activeTab: {
        get: function () {
          return this.$store.state.activeTab
        },
        set: function (newValue) {
          this.$store.commit('ACTIVE_TAB',newValue);
        }
      }
    },
    methods: {
      handleTabRemove (name) {
        this.$store.commit('REMOVE_TAB_LIST',name);
        //删除之后定位到上一个页面 全部关闭时先定位到欢迎界面
        if (this.$store.state.tabList.length > 0){
          this.$router.push({path :this.$store.state.activeTab})
        } else {
          this.$router.push({path :'/welcomeNoRight'})
        }
      },
      tabClick : function (name) {
        this.$router.push({path :name})
      }
    },
    mounted () {
      //刷新页面会导致vuex清空 每次刷新时tabList从storage动态获取
      if(sessionStorage.getItem('navArr') != null){
        this.$store.state.tabList = JSON.parse(sessionStorage.getItem('navArr'));
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
