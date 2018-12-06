<template>
  <div class="activity-container">
    <div>
      <div class="activity-fun">
        <div class="activity-ope">
          <Button type="default" icon="md-add" @click="activityAdd">新增活动</Button>
          <Button type="default" icon="ios-download" @click="exportData">导出EXCEL</Button>
        </div>
        <div class="activity-search">
          <span class="ml15">创建日期从：</span>
          <span><DatePicker type="date" style="width: 200px;"></DatePicker></span>
          <span class="ml15">创建日期止：</span>
          <span><DatePicker type="date" style="width: 200px;"></DatePicker></span>
          <span class="ml15">圈子名称：</span>
          <span><Input style="width: 200px;"/></span>
          <span class="ml15">圈子类型：</span>
          <span>
        <Select v-model="actType" style="width:200px" @on-change="selectType">
          <Option v-for="(item,index) in actList" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
      </span>
          <span class="ml10"><Button icon="ios-search">查询</Button></span>
        </div>
      </div>
      <div class="activity-list mt30">
        <Table border :columns="columns" :data="listData" :loading="loading"></Table>
        <Page :total="total" v-if="total>10" show-elevator show-total class="mt30"/>
      </div>
    </div>
    <!--<add-view :is-show-pub="showAdd">-->
    <Drawer
      title="发布活动"
      v-model="value3"
      width="720"
      :mask-closable="false"
      :styles="styles"
    >
      <div>
        <div class="add-title">
          <span>
            <span class="add-tips"><Icon type="md-information-circle" />友情提示：平台运营前期，运营人员使用！</span>
          </span>
          <!--<span class="add-close" @click="closeActAdd"><Icon type="md-close-circle" /></span>-->
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
            <FormItem label="活动名称">
              <Input type="text" v-model="formData.name"></Input>
            </FormItem>
            <FormItem label="活动口号">
              <Input type="text" v-model="formData.slogan"></Input>
            </FormItem>
            <FormItem label="开始时间">
              <Input type="text" v-model="formData.beginTime"></Input>
            </FormItem>
            <FormItem label="结束时间">
              <Input type="text" v-model="formData.endTime"></Input>
            </FormItem>
            <FormItem label="活动地址">
              <Input type="text" v-model="formData.location"></Input>
            </FormItem>
            <FormItem label="允许人数">
              <Input type="text" v-model="formData.member"></Input>
            </FormItem>
            <FormItem label="活动内容">
              <Input type="textarea" v-model="formData.ins"></Input>
            </FormItem>
            <FormItem style="width: 200px!important;">
              <Checkbox v-model="formData.isOpen">开放报名</Checkbox>
            </FormItem>
            <FormItem style="width: 200px!important;">
              <Button type="primary">发布活动</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Drawer>
    <!--</add-view>-->
  </div>
</template>

<script>
  export default {
    name: "activitySystem",
    data () {
      return {
        value3:false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        showAdd:false,
        loading:false,
        total:100,
        actType:'',
        actList:[
          {
            value:'0',
            label:'读书'
          },
          {
            value:'1',
            label:'看电影'
          }
        ],
        columns:[
          {
            title:'圈子ID',
            key:'id',
            align:'center',
          },
          {
            title:'圈子名称',
            key:'name',
            align:'center',
          },
          {
            title:'活动名称',
            key:'actName',
            align:'center',
          },
          {
            title:'创建人',
            key:'builder',
            align:'center',
          },
          {
            title:'状态',
            key:'state',
            align:'center',
          },
          {
            title:'创建日期',
            key:'date',
            align:'center',
          },
          {
            title:'当期人数',
            key:'member',
            align:'center',
            width:100
          },
          {
            title:'口号',
            key:'slogan',
            align:'center',
          },
          {
            title:'介绍',
            key:'ins',
            align:'center',
          },
          {
            title:'操作选项',
            key:'action',
            align:'center',
            width:260,
            render:(h,params) => {
              return h('div',[
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
                }, '关联用户'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {

                    }
                  }
                }, '解散'),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                    }
                  }
                }, '监管')
              ])
            }
          }
        ],
        listData:[
          {
            id:'0001',
            name:'一起来奔跑',
            actName:'周末约会',
            builder:'张三',
            state:'正常',
            date:'2018-11-22',
            member:'30',
            slogan:'生命在于运动',
            ins:'武汉跑步圈，跑出自信'
          },
          {
            id:'0001',
            name:'一起来奔跑',
            actName:'周末约会',
            builder:'张三',
            state:'正常',
            date:'2018-11-22',
            member:'30',
            slogan:'生命在于运动',
            ins:'武汉跑步圈，跑出自信'
          },
          {
            id:'0001',
            name:'一起来奔跑',
            actName:'周末约会',
            builder:'张三',
            state:'正常',
            date:'2018-11-22',
            member:'30',
            slogan:'生命在于运动',
            ins:'武汉跑步圈，跑出自信'
          },
          {
            id:'0001',
            name:'一起来奔跑',
            actName:'周末约会',
            builder:'张三',
            state:'正常',
            date:'2018-11-22',
            member:'30',
            slogan:'生命在于运动',
            ins:'武汉跑步圈，跑出自信'
          },
          {
            id:'0001',
            name:'一起来奔跑',
            actName:'周末约会',
            builder:'张三',
            state:'正常',
            date:'2018-11-22',
            member:'30',
            slogan:'生命在于运动',
            ins:'武汉跑步圈，跑出自信'
          },
          {
            id:'0001',
            name:'一起来奔跑',
            actName:'周末约会',
            builder:'张三',
            state:'正常',
            date:'2018-11-22',
            member:'30',
            slogan:'生命在于运动',
            ins:'武汉跑步圈，跑出自信'
          },
          {
            id:'0001',
            name:'一起来奔跑',
            actName:'周末约会',
            builder:'张三',
            state:'正常',
            date:'2018-11-22',
            member:'30',
            slogan:'生命在于运动',
            ins:'武汉跑步圈，跑出自信'
          },
          {
            id:'0001',
            name:'一起来奔跑',
            actName:'周末约会',
            builder:'张三',
            state:'正常',
            date:'2018-11-22',
            member:'30',
            slogan:'生命在于运动',
            ins:'武汉跑步圈，跑出自信'
          },
          {
            id:'0001',
            name:'一起来奔跑',
            actName:'周末约会',
            builder:'张三',
            state:'正常',
            date:'2018-11-22',
            member:'30',
            slogan:'生命在于运动',
            ins:'武汉跑步圈，跑出自信'
          },
          {
            id:'0001',
            name:'一起来奔跑',
            actName:'周末约会',
            builder:'张三',
            state:'正常',
            date:'2018-11-22',
            member:'30',
            slogan:'生命在于运动',
            ins:'武汉跑步圈，跑出自信'
          }
        ],
        //发布活动data
        defaultList:[
          {
            'name': 'a42bdcc1178e62b4694c830f028db5c0',
            'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
          },
          {
            'name': 'bc7521e033abdd1e92222d733590f104',
            'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
          }
        ],
        uploadList:[],
        imgName:'',
        visible:false,
        formData:{
          name:'',
          slogan:'',
          beginTime:'',
          endTime:'',
          location:'',
          member:'',
          ins:'',
          isOpen:true
        }
      }
    },
    mounted () {
      // if (sessionStorage.getItem('isActAdd') != null) {
      //   this.showAdd = JSON.parse(sessionStorage.getItem('isActAdd'));
      // }
      this.uploadList = this.$refs.upload.fileList;
    },
    methods: {
      selectType:function (t) {

      },
      exportData:function () {

      },
      activityAdd :function () {
        // this.showAdd = true;
        // sessionStorage.setItem('isActAdd',this.showAdd);
        this.value3 = true;
      },
      //上传头像方法
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
      closeActAdd :function () {
        this.showAdd = false;
        sessionStorage.setItem('isActAdd',this.showAdd);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .activity-fun{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .activity-search{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      line-height: 33px;
      padding-right: 30px;
    }
  }
  .activity-list{
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
