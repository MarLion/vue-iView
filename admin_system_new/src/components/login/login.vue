<template>
  <div class="login-container">
    <div class="login-area">
      <h1>相亲交友管理系统</h1>
      <div class="login-form mt20">
        <div class="login-center">统一登录中心</div>
        <div class="login-line"></div>
        <Input prefix="ios-contact" placeholder="请输入账号" style="width: 300px;" class="mt30"/>
        <Input prefix="ios-unlock" placeholder="请输入密码" style="width: 300px;"  class="mt30"/>
        <div class="mt30">
          <Button type="primary" :loading="loading" @click="toLoading" style="width: 300px">
            <span v-if="!loading">登录</span>
            <span v-else>登陆中...</span>
          </Button>
        </div>
      </div>
    </div>
   <back-view :width="baWidth" :height="baHeight"></back-view>
  </div>
</template>

<script>
  import axios from '../../../src/axios/axios'
  export default {
    name: "login",
    data () {
      return {
        loading : false,
        baWidth:window.innerWidth,
        baHeight:window.innerHeight
      }
    },
    methods : {
      toLoading: function () {
        this.loading = true;
        axios.Login('11')
          .then(res => {
          this.$store.dispatch('setUserInfo',res);
        })
          .catch(error => {
            console.log(error)
          });
        this.$router.push({path:'/welcome'})
      }
    },
    mounted () {
      //返回登录页时 初始化导航展开菜单和页签记录
      this.$store.commit('INT_ARR');
      sessionStorage.clear();
    }
  }
</script>

<style lang="scss" scoped>
.login-area{
  position: fixed;
  z-index: 999;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 500px;
  height: 500px;
  border-radius: 10px;

  h1{
    color: #ffffff;
  }
  .login-form{
    background-color: #ffffff;
    padding-bottom: 50px;
    border-radius: 10px;
    .login-line{
      background: -webkit-linear-gradient(left, #3399CC , #D5D5D5);
      background: -o-linear-gradient(right, #3399CC, #D5D5D5);
      background: -moz-linear-gradient(right, #3399CC, #D5D5D5);
      background: linear-gradient(to right, #3399CC , #D5D5D5);
      height: 2px;
    }
    .login-center{
      color: #3399CC;
      /*border-bottom: 2px solid #3399CC;*/
      text-align: left;
      padding: 10px 0 10px 20px;
      font-size: 16px;
    }
  }
}
</style>
