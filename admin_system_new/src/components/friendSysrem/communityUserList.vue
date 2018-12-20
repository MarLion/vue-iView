<template>
    <div class="list-container">
      <div class="list-bread">
        <div class="list-tit">
          <h1>圈子用户清单</h1>
          <!--<span class="ml10"><Icon type="md-information-circle" />友情提示：取消资格用户会以短信方式告知用户，缴纳的报名费用会退还至用户的玄乐账户。</span>-->
        </div>
        <div class="list-list">
          <Breadcrumb>
            <BreadcrumbItem to="/communitySystem">圈子管理</BreadcrumbItem>
            <BreadcrumbItem>用户清单</BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>
      <div class="list-fun mt20">
        <div class="list-ope">
          <Button type="default" icon="ios-download" @click="exportData">导出EXCEL</Button>
          <!--<Button icon="ios-cash" type="info" class="ml10" @click="cancelBatch" :loading="canceling">批量取消</Button>-->
        </div>
        <div class="list-search">
          <span class="ml15">报名日期从：</span>
          <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="startTime" style="width: 200px;"></DatePicker></span>
          <span class="ml15">报名日期止：</span>
          <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="endTime" style="width: 200px;"></DatePicker></span>
          <span class="ml15">用户姓名：</span>
          <span><Input v-model="userName" style="width: 200px;"/></span>
          <span class="ml10"><Button icon="ios-search" @click="getUserEnlist">查询</Button></span>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: "communityUserList",
    data () {
      return {
        userName:''
      }
    },
    methods:{
      exportData:function () {

      },
      startTime:function () {

      },
      endTime:function () {

      },
      getUserEnlist:function () {

      }
    }
  }
</script>

<style lang="scss" scoped>
  .list-bread{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .list-tit{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    h1{
      text-align: left;
    }
    span{
      height: 36px;
      line-height: 36px;
    }
  }
  .list-fun{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .list-search{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      line-height: 33px;
      padding-right: 30px;
    }
  }
  .list-list{
    padding-right: 20px;
  }
</style>
