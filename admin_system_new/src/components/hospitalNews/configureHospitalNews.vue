<template>
  <div class="container content-pad">
    <div class="community-fun">
      <div class="community-ope">
        <Button type="default" icon="md-add" @click="addHospNews">新增资讯</Button>
      </div>
      <div class="community-search">
        <span class="ml15">类型名称：</span>
        <span><Input class="checkWid" v-model="listParams.typeName"/></span>
        <!--<span class="ml15">医院名称：</span>-->
        <!--<span><Input class="checkWid" v-model="listParams.hospitalName"/></span>-->
        <span class="ml10"><Button icon="ios-search" @click="checkHospNews">查询</Button></span>
      </div>
    </div>
    <div class="community-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" :current="listParams.pageNum" v-if="total>10" show-elevator show-total @on-change="newsPageChange" class="mt30"/>
    </div>
    <!--新增资讯-->
    <Drawer
      title='发布资讯'
      v-model="hospValue"
      width="1200"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearHospNewsData"
    >
      <Form :model="hospNewsData" ref="hospNewsData" :rules="ruleValidate"  class="mt20">
        <!--<FormItem :label-width="100" label="选择医院：" prop="hospitalId">-->
          <!--<Select v-model="hospNewsData.hospitalId" style="width: 400px;" @on-change="getNewsType">-->
            <!--<Option v-for="item in hospitalList" :key="item.id" :value="item.id">-->
              <!--{{item.hospitalName}}-->
            <!--</Option>-->
          <!--</Select>-->
        <!--</FormItem>-->
        <FormItem :label-width="100" label="资讯类型：" prop="type">
          <Select v-model="hospNewsData.type" style="width: 400px;">
            <Option v-for="(item,index) in typeList" :key="index" :value="item.type">
              {{item.typeName}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="资讯标题：" prop="title" :label-width="100">
          <Input type="text" :maxlength="80" v-model="hospNewsData.title" style="width: 400px;"></Input>
        </FormItem>
        <FormItem>
          <upload-view ref="hospNewsCover" :upload-url="uploadUrl" title="首页展示图" :length="1" :width="100" con-width="100%" v-on:success-callback="successHospCoverPath" v-on:remove-callback="removeHospCoverPath"></upload-view>
        </FormItem>
        <FormItem label="资讯正文：" :label-width="100">
          <editor-view ref="newsContent" :upload-url="uploadUrl" v-on:transmit-con="getHospNewsContent"></editor-view>
        </FormItem>
        <FormItem style="width: 200px!important;" :label-width="100">
          <Button type="primary" @click="hospNewsSub" :loading="hospLoading">确认发布</Button>
        </FormItem>
      </Form>
    </Drawer>
    <!--修改-->
    <Drawer
      title='修改资讯'
      v-model="hospReValue"
      width="1200"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearHospNewsReData"
    >
      <Form :model="hospNewsReData" ref="hospNewsReData" :rules="ruleValidate"  class="mt20">
        <FormItem :label-width="100" label="资讯类型：" prop="type">
          <Select v-model="hospNewsReData.type" style="width: 400px;">
            <Option v-for="(item,index) in reTypeList" :key="index" :value="item.type">
              {{item.typeName}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="资讯标题：" prop="title" :label-width="100">
          <Input type="text" :maxlength="80" v-model="hospNewsReData.title" style="width: 400px;"></Input>
        </FormItem>
        <FormItem>
          <revise-upload-view ref="hospitalCoverRe" :upload-url="uploadUrl" title="首页展示图" :length="1" :width="100" con-width="100%" :default-list="defaultHospCover" :list-value="isHospCoverRe" v-on:success-callback="hospCoverReSuccess" v-on:remove-callback="hospCoverReRemove"></revise-upload-view>
        </FormItem>
        <FormItem label="资讯正文：" :label-width="100">
          <revise-editor-view ref="hospEdRe" :upload-url="uploadUrl" :original-content="hospNewsReData.content" :watch-value="isHospContentWatch" v-on:transmit-con="getReviseHospContent"></revise-editor-view>
        </FormItem>
        <FormItem style="width: 200px!important;" :label-width="100">
          <Button type="primary" @click="hospNewsReSub" :loading="hospReLoading">确认修改</Button>
        </FormItem>
      </Form>
    </Drawer>
    <!--弹框-->
    <Modal
      title="提示"
      v-model="newsTip"
      :mask-closable = "false"
    >
      <p ref="newsTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  import * as base from '../../axios/base';
  const hospValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请选择医院'))
    } else {
      callback();
    }
  };
  const typeValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请选择类型'))
    } else {
      callback();
    }
  };
  const titleValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写资讯标题'))
    } else {
      callback();
    }
  };
  export default {
    name: "configureHospitalNews",
    data () {
     return {
       uploadUrl:base.baseUrl.serviceOne + 'documents/saveOSSFiles',
       styles: {
         height: 'calc(100% - 55px)',
         overflow: 'auto',
         paddingBottom: '53px',
         position: 'static'
       },
       loading:false,
       total:'',
       newsTip:false,
       hospValue:false,
       hospReValue:false,
       hospLoading:false,
       hospReLoading:false,
       listParams:{
         limit:10,
         pageNum:1,
         typeName:'',
         //hospitalName:'',
         owenrId:'',
       },
       hospitalList:[],
       typeList:[],
       reTypeList:[],
       listData:[],
       columns:[
         {
           type: 'index',
           width: 60,
           align: 'center'
         },
         {
           title:'资讯标题',
           key:'title',
           align:'center'
         },
         {
           title:'资讯类型',
           key:'typeName',
           align:'center'
         },
         {
           title:'点击量',
           key:'readingNum',
           align:'center'
         },
         {
           title:'创建时间',
           align:'center',
           render:(h,params) => {
             return h('div',{
               style:{
                 height:'100%'
               }
             },this.$trans.getTime(params.row.createTime))
           }
         },
         {
           title:'更新时间',
           align:'center',
           render:(h,params) => {
             return h('div',{
               style:{
                 height:'100%'
               }
             },this.$trans.getTime(params.row.updateTime))
           }
         },
         {
           title:'操作选项',
           align:'center',
           width:160,
           render:(h,params) => {
             const revise = h('Button',{
               props:{
                 type: 'info',
                 size: 'small'
               },
               style:{
                 marginRight:'5px'
               },
               on:{
                 click:() => {
                   //console.log(JSON.stringify(params.row));
                   this.hospReValue = true;
                   this.isHospCoverRe = true;
                   this.isHospContentWatch = true;
                   this.hospNewsReData.id = params.row.id;
                   axios.HospitalNewsCkasById()
                    .then(res => {
                      //console.log(res);
                      this.reTypeList = res;
                      this.hospNewsReData.type = params.row.type;
                    })
                    .catch(error => {
                      console.log(error);
                      this.newsTip = true;
                      this.$refs.newsTip.innerHTML = '查询类型出错！';
                    });
                  this.hospNewsReData.title = params.row.title;
                  if (params.row.imgUrl && params.row.imgUrl !== '' && params.row.imgUrl !== undefined ) {
                    this.defaultHospCover.push({url:params.row.imgUrl,status:'finished'})
                  } else {
                    this.defaultHospCover = [];
                  }
                  this.hospNewsReData.content = params.row.content;
                 }
               }
             },'修改');
             const del = h('Button',{
               props:{
                 type: 'error',
                 size: 'small'
               },
               style:{
                 marginRight:'5px'
               },
               on:{
                 click:() => {
                   axios.HospitalNewsDelete({id:params.row.id})
                     .then(res => {
                       if (res.code === '0') {
                         this.newsTip = true;
                         this.$refs.newsTip.innerHTML = '删除成功！';
                         this.getHospNewsList();
                       } else {
                         this.newsTip = true;
                         this.$refs.newsTip.innerHTML = '删除失败！';
                       }
                     })
                     .catch(error => {
                       console.log(error);
                       this.newsTip = true;
                       this.$refs.newsTip.innerHTML = '删除失败！';
                     })
                 }
               }
             },'删除');
             return h('div',[
               revise,
               del
             ])
           }
         },
       ],
       hospNewsData:{
         imgstr:'',
         title:'',
         type:'',
         content:'',
         //hospitalId:'',
         owenrId:''
       },
       defaultHospCover:[],
       isHospCoverRe:false,
       isHospContentWatch:false,
       hospNewsReData:{
         id:'',
         imgstr:'',
         title:'',
         type:'',
         content:'',
         //hospitalId:'',
         owenrId:''
       },
       ruleValidate:{
         hospitalId:[
           {validator:hospValidate}
         ],
         type:[
           {validator:typeValidate}
         ],
         title:[
           {validator:titleValidate}
         ]
       },
     }
    },
    mounted () {
      if (sessionStorage.getItem('userId') != null) {
        this.$store.state.user_id = sessionStorage.getItem('userId');
      }
      this.listParams.owenrId = this.userId;
      this.hospNewsData.owenrId = this.userId;
      this.hospNewsReData.owenrId = this.userId;
      this.getHospNewsList();
    },
    computed:{
      userId:function () {
        return this.$store.state.user_id;
      }
    },
    methods:{
      //获取医院
      getHospital:function () {
        axios.HospitalList({limit:1000,pageNum:1})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.hospitalList = res.data;
            } else {
              this.newsTip = true;
              this.$refs.newsTip.innerHTML = res.data;
            }
          })
          .catch(error => {
            console.log(error);
            this.newsTip = true;
            this.$refs.newsTip.innerHTML = '查询医院出错！';
          })
      },
      //获取类型
      getNewsType:function () {
        axios.HospitalNewsCkasById()
          .then(res => {
            //console.log(res);
            this.typeList = res;
          })
          .catch(error => {
            console.log(error);
            this.newsTip = true;
            this.$refs.newsTip.innerHTML = '查询类型出错！';
          })
      },
      //获取资讯列表
      getHospNewsList:function () {
        this.loading = true;
        axios.HospitalNewsList(this.listParams)
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.loading = false;
              this.listData = res.data;
              this.total = res.count;
            } else {
              this.newsTip = true;
              this.$refs.newsTip.innerHTML = res.data;
            }
          })
          .catch(error => {
            console.log(error);
            this.newsTip = true;
            this.$refs.newsTip.innerHTML = '查询出错！';
          })
      },
      addHospNews:function () {
        this.hospValue = true;
        this.getNewsType();
      },
      checkHospNews:function () {
        this.listParams.pageNum = 1;
        this.getHospNewsList();
      },
      newsPageChange:function (page) {
        this.listParams.pageNum = page;
        this.getHospNewsList();
      },
      del:function () {
        this.newsTip = false;
      },
      clearHospNewsData:function () {
        this.$refs.hospNewsData.resetFields();
        this.hospNewsData.imgstr = '';
        this.hospNewsData.content = '';
        this.$refs.hospNewsCover.clearUpload();
        this.$refs.newsContent.clearData();
      },
      successHospCoverPath:function (file,title,fileList) {
        this.hospNewsData.imgstr = file.url;
      },
      removeHospCoverPath:function () {
        this.hospNewsData.imgstr = '';
      },
      getHospNewsContent:function (con) {
        this.hospNewsData.content = con;
      },
      hospNewsSub:function () {
        //console.log(this.hospNewsData);
        this.$refs.hospNewsData.validate(valid => {
          if (valid) {
            this.hospLoading = true;
            axios.HospitalNewsSave(this.hospNewsData)
              .then(res => {
                this.hospLoading = false;
                //console.log(res);
                if (res.code === '0') {
                  this.hospValue = false;
                  this.clearHospNewsData();
                  this.newsTip = true;
                  this.$refs.newsTip.innerHTML = '新增成功！';
                  this.listParams.pageNum = 1;
                  this.getHospNewsList();
                } else {
                  this.newsTip = true;
                  this.$refs.newsTip.innerHTML = '保存失败！';
                }
              })
              .catch(error => {
                console.log(error);
                this.newsTip = true;
                this.$refs.newsTip.innerHTML = '保存失败！';
                this.hospLoading = false;
              })
          }
        })
      },
      clearHospNewsReData:function () {
        this.isHospCoverRe = false;
        this.isHospContentWatch = false;
        this.defaultHospCover = [];
        this.$refs.hospNewsReData.resetFields();
        this.$refs.hospitalCoverRe.clearUpload();
        this.$refs.hospEdRe.clearData();
        this.hospNewsReData.imgstr = '';
        this.hospNewsReData.content = '';
        this.hospNewsReData.id = '';
        //this.hospNewsReData.hospitalId = '';
      },
      hospNewsReSub:function () {
        this.$refs.hospNewsReData.validate(valid => {
          if (valid) {
            this.hospReLoading = true;
            axios.HospitalNewsSave(this.hospNewsReData)
              .then(res => {
                this.hospReLoading = false;
                if (res.code === '0') {
                  this.hospReValue = false;
                  this.clearHospNewsReData();
                  this.newsTip = true;
                  this.$refs.newsTip.innerHTML = '修改成功！';
                  this.getHospNewsList();
                } else {
                  this.newsTip = true;
                  this.$refs.newsTip.innerHTML = '修改失败！';
                }
              })
              .catch(error => {
                console.log(error);
                this.newsTip = true;
                this.$refs.newsTip.innerHTML = '修改失败！';
                this.hospReLoading = false;
              })
          }
        })
      },
      hospCoverReSuccess:function (file,title,fileList) {
        //console.log(file.url);
        this.hospNewsReData.imgstr = file.url;
      },
      hospCoverReRemove:function () {
        this.hospNewsReData.imgstr = '';
      },
      getReviseHospContent:function (con) {
        this.hospNewsReData.content = con;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .community-fun{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .community-search{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      line-height: 33px;
      padding-right: 30px;
    }
  }
  .community-list{
    padding-right: 20px;
  }
</style>
