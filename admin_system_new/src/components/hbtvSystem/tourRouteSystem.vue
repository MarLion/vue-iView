<template>
  <div class="route-container">
    <div>
      <div class="route-fun">
        <div class="route-ope">
          <Button type="default" icon="md-add" @click="addCommunity">新增路线</Button>
          <Button type="default" icon="ios-download" @click="exportData">导出EXCEL</Button>
        </div>
        <div class="route-search">
          <span class="ml15">创建日期从：</span>
          <span><DatePicker type="date" style="width: 200px;"></DatePicker></span>
          <span class="ml15">创建日期止：</span>
          <span><DatePicker type="date" style="width: 200px;"></DatePicker></span>
          <span class="ml15">路线名称：</span>
          <span><Input style="width: 200px;"/></span>
          <span class="ml15">状态类型：</span>
          <span>
            <Select v-model="routeType" style="width:200px" @on-change="selectType">
              <Option v-for="(item,index) in routeList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </span>
          <span class="ml10"><Button icon="ios-search">查询</Button></span>
        </div>
      </div>
      <div class="route-list mt30">
        <Table border :columns="columns" :data="listData" :loading="loading"></Table>
        <Page :total="total" v-if="total>10" show-elevator show-total class="mt30" @on-change="pageChange"/>
      </div>
    </div>
    <Drawer
      title="发布旅游路线"
      v-model="value3"
      width="720"
      :mask-closable="false"
      :styles="styles"
    >
      <div>
        <div class="add-title">
          <span>
            <span class="add-tips"><Icon type="md-information-circle" />友情提示：湖北电视台工作人员使用，配置专用账户！</span>
          </span>
        </div>
      </div>
      <div>
        <div class="add-form mt30">
          <div class="add-image">
            <p class="p">上传照片</p>
            <div class="demo-upload-list" v-for="item in uploadList">
              <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
              </template>
              <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
              </template>
            </div>
            <Upload action=""
                    ref="upload"
                    :show-upload-list="false"
                    :default-file-list="defaultList"
                    :on-success="handleSuccess"
                    :format="['jpg','jpeg','png']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :before-upload="handleBeforeUpload"
                    multiple
                    type="drag"
                    style="display: inline-block;width:100px;">
              <div style="width: 100px;height:100px;line-height: 100px;">
                <Icon type="ios-camera" size="40"></Icon>
              </div>
            </Upload>
            <modal title="查看照片" v-model="visible">
              <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" style="width: 100%">
            </modal>
          </div>
          <Form :model="formData" :label-width="100" style="width: 500px;margin-top: 20px;">
            <FormItem label="线路名称">
              <Input type="text" v-model="formData.name"></Input>
            </FormItem>
            <FormItem label="行程时间">
              <DatePicker type="date"  v-model="formData.begTime" style="width: 175px;"></DatePicker><span class="ml15">至</span><DatePicker type="date" v-model="formData.endTime" style="width: 175px;margin-left: 15px"></DatePicker>
            </FormItem>
            <FormItem label="产品价格">
              <Input type="text" v-model="formData.price"></Input>
            </FormItem>
            <FormItem label="费用清单">
              <Input type="text" v-model="formData.orderList"></Input>
            </FormItem>
            <FormItem label="允许人数">
              <Input type="text" v-model="formData.member"></Input>
            </FormItem>
            <FormItem label="景区介绍">
              <Input type="textarea" v-model="formData.ins"></Input>
            </FormItem>
            <FormItem label="行程安排">
              <Input type="textarea" v-model="formData.arrange"></Input>
            </FormItem>
            <FormItem style="width: 200px!important;">
              <Button type="primary" @click="subClick">确认发布</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script>
  export default {
    name: "tourRouteSystem",
    data () {
      return {
        value3:false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        routeType:'',
        routeList:[
          {
            value:'0',
            label:'正常'
          }
        ],
        total:100,
        loading:false,
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'产品编号',
            key:'id',
            align:'center'
          },
          {
            title:'线路名称',
            key:'routeName',
            align:'center'
          },
          {
            title:'状态',
            key:'state',
            align:'center'
          },
          {
            title:'报名人数',
            key:'perNum',
            align:'center'
          },
          {
            title:'线路价格',
            key:'price',
            align:'center'
          },
          {
            title:'创建日期',
            key:'date',
            align:'center'
          },
          {
            title:'操作选项',
            key:'action',
            align:'center',
            width:260,
            render:(h,params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      console.log(params.index);
                    }
                  }
                }, '详情'),
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      // this.remove(params.index)
                    }
                  }
                }, '更新'),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$router.push({path:'/tourSignList'})
                    }
                  }
                }, '报名清单')
              ])
            }
          }
        ],
        listData:[
          {
            id:'0001',
            routeName:'神农架滑雪2日游',
            state:'正常',
            perNum:'300',
            price:'1300元',
            date:'2018-11-23'
          },
          {
            id:'0001',
            routeName:'神农架滑雪2日游',
            state:'正常',
            perNum:'300',
            price:'1300元',
            date:'2018-11-23'
          },
          {
            id:'0001',
            routeName:'神农架滑雪2日游',
            state:'正常',
            perNum:'300',
            price:'1300元',
            date:'2018-11-23'
          },
          {
            id:'0001',
            routeName:'神农架滑雪2日游',
            state:'正常',
            perNum:'300',
            price:'1300元',
            date:'2018-11-23'
          },
          {
            id:'0001',
            routeName:'神农架滑雪2日游',
            state:'正常',
            perNum:'300',
            price:'1300元',
            date:'2018-11-23'
          },
          {
            id:'0001',
            routeName:'神农架滑雪2日游',
            state:'正常',
            perNum:'300',
            price:'1300元',
            date:'2018-11-23'
          },
          {
            id:'0001',
            routeName:'神农架滑雪2日游',
            state:'正常',
            perNum:'300',
            price:'1300元',
            date:'2018-11-23'
          },
          {
            id:'0001',
            routeName:'神农架滑雪2日游',
            state:'正常',
            perNum:'300',
            price:'1300元',
            date:'2018-11-23'
          },
          {
            id:'0001',
            routeName:'神农架滑雪2日游',
            state:'正常',
            perNum:'300',
            price:'1300元',
            date:'2018-11-23'
          },
          {
            id:'0001',
            routeName:'神农架滑雪2日游',
            state:'正常',
            perNum:'300',
            price:'1300元',
            date:'2018-11-23'
          }
        ],
        //新增圈子data
        defaultList:[
          // {
          //   'name': 'a42bdcc1178e62b4694c830f028db5c0',
          //   'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
          // },
          // {
          //   'name': 'bc7521e033abdd1e92222d733590f104',
          //   'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
          // }
        ],
        uploadList:[],
        imgName:'',
        visible:false,
        formData:{
          name:'',
          begTime:'',
          endTime:'',
          price:'',
          orderList:'',
          member:'',
          ins:'',
          arrange:''
        }
      }
    },
    mounted () {
      this.uploadList = this.$refs.upload.fileList;
    },
    methods:{
      selectType:function (t) {

      },
      addCommunity:function () {
        this.value3 = true;
      },
      exportData:function () {

      },
      pageChange:function (page) {
        console.log(page);
      },
      //上传照片方法
      handleSuccess:function () {

      },
      handleFormatError:function () {

      },
      handleMaxSize:function () {

      },
      handleBeforeUpload:function () {

      },
      handleView:function (name) {
        this.imgName = name;
        this.visible = true;
      },
      handleRemove:function () {

      },
      subClick:function () {
        console.log(this.formData.begTime);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .route-fun{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .route-search{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      line-height: 33px;
      padding-right: 30px;
    }
  }
  .route-list{
    padding-right: 20px;
  }
  .add-title{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 20px;
    padding: 10px;
    border-bottom: 1px solid #99BBE8;
    .add-tips{
      font-size: 14px;
    }
    .add-close{
      cursor: pointer;
    }
  }
  .add-image{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    .p{
      width: 100px;
      height: 80px;
      line-height: 80px;
      text-align: right;
      padding: 10px 12px 10px 0;
    }
  }
  .demo-upload-list{
    display: inline-block;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
