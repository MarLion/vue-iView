<template>
  <div class="head-container">
    <div class="head-left">
      <span class="head-logo"></span><h1>相亲交友管理系统</h1>
    </div>
    <div class="head-right">
      <div class="head-person">
        <Icon type="md-person" />
      </div>
      <div class="head-message ml30">
        <p>
          <span>{{userName}}</span>
          <!--<span>集团总公司</span>-->
        </p>
        <p>
          消息（0）
        </p>
      </div>
      <div class="head-close ml30">
        <router-link :to="{path: '/'}" alt="退出登录">
          <Icon type="md-close-circle"/>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "headView",
    data () {
      return {
        out: '退出登录',
        name:''
      }
    },
    mounted () {
      this.name = sessionStorage.getItem('userName');
      if (sessionStorage.getItem('userName') != null) {
        this.$store.state.admin_token = sessionStorage.getItem('userName');
      }
    },
    computed:{
      userName:function () {
        return this.$store.state.admin_token;
      }
    }
  }
</script>

<style lang="scss" scoped>
.head-container{
  /*position: fixed;*/
  /*top: 0;*/
  /*left: 0;*/
  width: 100%;
  height: 64px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .head-left{
    padding-left: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    span{
      width: 44px;
      height: 44px;
      background: url("../../../assets/logo.png");
      background-size: 100% 100%;
      margin-top: 10px;
    }
    h1{
      height: 44px;
      line-height: 44px;
      margin-top: 10px;
      color: #ffffff;
    }
  }
  .head-right{
    width: 360px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    .head-person{
      i{
        font-size: 36px;
        color: #ffffff;
      }
    }
    .head-message{
      p{
        height: 32px;
        line-height:32px;
        color: #ffffff;
        text-align: left;
      }
    }
    .head-close{
      i{
        font-size: 36px;
        color: #ffffff;
        cursor: pointer;
      }
    }
  }
}
</style>
