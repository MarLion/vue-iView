<template>
  <div class="content-pad">
    <div class="route-fun">
      <div class="route-ope">
        <Button type="default" icon="md-add" @click="addQues">发布问题</Button>
      </div>
      <div class="route-search">
        <span class="ml15">发布人：</span>
        <span><Input class="middle-checkWid" v-model="listParams.publisher"/></span>
        <span class="ml15">发布日期从：</span>
        <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="queryStartTime" :options="begOption" class="middle-checkWid"></DatePicker></span>
        <span class="ml15">发布日期止：</span>
        <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="queryEndTime" :options="endOption" class="middle-checkWid"></DatePicker></span>
        <span class="ml10"><Button icon="ios-search" @click="checkQuesClick">查询</Button></span>
      </div>
    </div>
    <div class="route-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading" height="600"></Table>
      <Page :total="total" :current="listParams.page" v-if="total>10" show-elevator show-total class="mt30" @on-change="pageChange"/>
    </div>
    <Modal title="查看大图" v-model="tabBig" width="1000">
      <Carousel :height="500" v-model="carNum" v-if="tabBig">
        <CarouselItem v-for="(item ,index) in this.bigArr" :key="index">
          <img :src="item" class="bigImg">
        </CarouselItem>
      </Carousel>
      <div slot="footer"></div>
    </Modal>
    <modal title="查看视频" v-model="bigVideo" @on-visible-change="videoClose">
      <video :src="videoUrl" controls="controls" style="width: 100%"></video>
      <div slot="footer"></div>
    </modal>
    <!--发布问答-->
    <Drawer
      title="发布问答"
      v-model="quesValue"
      width="720"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearQuesData"
    >
      <Form :model="quesData" ref="quesData" :rules="ruleValidate" style="width: 100%;margin-top: 20px;">
        <FormItem label="问答类型：" prop="type" :label-width="100" >
          <Select v-model="quesData.type" style="width:400px" @on-change="typeChange">
            <Option v-for="(item,index) in quesTypeList" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem v-show="isPic">
          <upload-view ref="quesPic" :upload-url="uploadUrl" title="上传图片" :length="9" :width="100" con-width="100%" v-on:success-callback="successQuesPath" v-on:remove-callback="removeQuesPath"></upload-view>
        </FormItem>
        <FormItem v-show="isVideo">
          <upload-view ref="videoCover" :upload-url="uploadUrl" title="视频封面" :length="1" :width="100" con-width="100%" v-on:success-callback="successCoverPath" v-on:remove-callback="removeCoverPath"></upload-view>
        </FormItem>
        <FormItem v-show="isVideo">
          <video-view ref="quesVideo" :upload-url="uploadUrl" title="上传视频" :length="1" :width="100" con-width="100%" v-on:success-callback="successQuesVideo" v-on:remove-callback="removeQuesVideo"></video-view>
        </FormItem>
        <FormItem label="发布人类型：" prop="ownerType" :label-width="100" >
          <Select v-model="quesData.ownerType" style="width:400px">
            <Option v-for="(item,index) in ownerTypeList" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="玄乐账号：" prop="loginName" :label-width="100" >
          <Input type="text" v-model="quesData.loginName" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="动态内容：" prop="description" :label-width="100" >
          <Input type="textarea" :maxlength="1000" v-model="quesData.description" style="width: 400px;"></Input>
        </FormItem>
        <FormItem :label-width="100" >
          <Checkbox v-model="quesData.status" true-value="1" false-value="0">是否匿名</Checkbox>
        </FormItem>
        <FormItem style="width: 200px!important;" :label-width="100" >
          <Button type="primary" @click="quesSub" :loading="quesLoading">确认发布</Button>
        </FormItem>
      </Form>
    </Drawer>
    <!--提示-->
    <Modal
      title="提示"
      v-model="quesTip"
      :mask-closable = "false"
    >
      <p ref="quesTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  import * as base from '../../axios/base';
  const userValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请选择发布人类型'))
    } else {
      callback();
    }
  };
  const nameValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写发布人账号'))
    } else {
      callback();
    }
  };
  const conValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写问题内容'))
    } else {
      callback();
    }
  };
  export default {
    name: "configureHealthQuestion",
    data () {
      return {
        uploadUrl:base.baseUrl.serviceTwo + 'documents/saveFiles',
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        loading:false,
        quesTip:false,
        total:'',
        tabBig:false,
        tabUrl:'',
        bigArr:[],
        carNum:0,
        bigVideo:false,
        videoUrl:'',
        saveStatus:false,
        statusLoading:true,
        quesValue:false,
        quesLoading:false,
        listParams:{
          page:1,
          rows:10,
          publisher:'',
          queryTimeStart:'',
          queryTimeEnd:''
        },
        begOption:{
          disabledDate : date =>  {
            const d = new Date(this.listParams.queryTimeEnd);
            return date && date.valueOf() > d;
          }
        },
        endOption:{
          disabledDate : date =>  {
            const d = new Date(this.listParams.queryTimeStart);
            return date && date.valueOf() < d - 24*60*60*1000;
          }
        },
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'发布人',
            key:'publisher',
            width:150,
            align:'center'
          },
          {
            title:'类型',
            key:'ownerType',
            width:100,
            align:'center'
          },
          {
            title:'内容',
            key:'description',
            align:'center'
          },
          {
            title:'图片',
            align:'center',
            width:210,
            render:(h,params) => {
              if (params.row.picUrl !== '' && params.row.picUrl != null) {
                const pathArr = params.row.picUrl.split(',');
                const imgArr = [];
                pathArr.forEach((item,index) => {
                  imgArr.push(
                    h('img',{
                      attrs:{
                        src:item
                      },
                      style:{
                        width:'50px',
                        height:'50px',
                        borderRadius:'5px',
                        cursor:'pointer',
                        marginLeft:'5px'
                      },
                      on:{
                        click:() => {
                          this.bigArr = pathArr;
                          this.carNum = index;
                          this.tabBig = true;
                        }
                      }
                    })
                  )
                });
                return h('div',imgArr);
              }
            }
          },
          {
            title:'视频',
            align:'center',
            width:100,
            render:(h,params) => {
              if (params.row.videoUrl !== '' && params.row.videoUrl != null) {
                return h('div',{
                  style:{
                    height:'100%'
                  }
                },'有')
              } else {
                return h('div',{
                  style:{
                    height:'100%'
                  }
                },'无')
              }
            }
          },
          {
            title:'是否置顶',
            key:'indexShow',
            width:100,
            align:'center'
          },
          {
            title:'是否匿名',
            key:'status',
            width:100,
            align:'center'
          },
          {
            title:'发布时间',
            key:'createTime',
            width:200,
            align:'center'
          },
          {
            title:'操作选项',
            align:'left',
            width:220,
            render:(h,params) => {
              const top = h('Button',{
                props:{
                  type: 'success',
                  size: 'small'
                },
                style:{
                  marginRight:'5px',
                  marginTop:'5px'
                },
                on:{
                  click:() => {
                    this.changeStatus(params.row.id,0);
                  }
                }
              },'设为置顶');
              const cancelTop = h('Button',{
                props:{
                  type: 'error',
                  size: 'small'
                },
                style:{
                  marginRight:'5px',
                  marginTop:'5px'
                },
                on:{
                  click:() => {
                    this.changeStatus(params.row.id,0);
                  }
                }
              },'取消置顶');
              const anony = h('Button',{
                props:{
                  type: 'success',
                  size: 'small'
                },
                style:{
                  marginRight:'5px',
                  marginTop:'5px'
                },
                on:{
                  click:() => {
                    this.changeStatus(params.row.id,1);
                  }
                }
              },'设为匿名');
              const cancelAnony = h('Button',{
                props:{
                  type: 'error',
                  size: 'small'
                },
                style:{
                  marginRight:'5px',
                  marginTop:'5px'
                },
                on:{
                  click:() => {
                    this.changeStatus(params.row.id,1);
                  }
                }
              },'取消匿名');
              const status = h('Button',{
                props:{
                  type: 'success',
                  size: 'small'
                },
                style:{
                  marginRight:'5px',
                  marginTop:'5px'
                },
                on:{
                  click:() => {
                    this.saveStatus = true;
                  }
                }
              },'修改状态');
              const checkVideo = h('Button',{
                props:{
                  type: 'info',
                  size: 'small'
                },
                style:{
                  marginRight:'5px',
                  marginTop:'5px'
                },
                on:{
                  click:() => {
                    if (params.row.videoUrl !=='' && params.row.videoUrl != null) {
                      this.bigVideo = true;
                      this.videoUrl = params.row.videoUrl;
                    } else {
                      this.quesTip = true;
                      this.$refs.quesTip.innerHTML= '无视频！'
                    }
                  }
                }
              },'查看视频');
              const del = h('Button',{
                props:{
                  type: 'error',
                  size: 'small'
                },
                style:{
                  marginRight:'5px',
                  marginTop:'5px'
                },
                on:{
                  click:() => {
                    axios.HealthQuesDelete({id:params.row.id})
                      .then(res => {
                        //console.log(res);
                        this.quesTip = true;
                        this.$refs.quesTip.innerHTML= res.message;
                        if (res.code === 200) {
                          this.getQuesList();
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.quesTip = true;
                        this.$refs.quesTip.innerHTML= '删除失败！'
                      })
                  }
                }
              },'删除');
              const list = h('Button',{
                props:{
                  type: 'warning',
                  size: 'small'
                },
                style:{
                  marginRight:'5px',
                  marginTop:'5px'
                },
                on:{
                  click:() => {
                    this.$router.push({path:'/configureHealthQuestionComment',query:{healthId:params.row.id}})
                  }
                }
              },'评论列表');
              if (params.row.indexValue === 0 && params.row.statusValue === 0) {
                return h('div',{
                  style:{
                    paddingBottom:'5px'
                  }
                },[
                  top,
                  anony,
                  del,
                  checkVideo,
                  list
                ])
              } else if (params.row.indexValue === 0 && params.row.statusValue === 1) {
                return h('div',{
                  style:{
                    paddingBottom:'5px'
                  }
                },[
                  top,
                  cancelAnony,
                  del,
                  checkVideo,
                  list
                ])

              } else if (params.row.indexValue === 1 && params.row.statusValue === 0) {
                return h('div',{
                  style:{
                    paddingBottom:'5px'
                  }
                },[
                  cancelTop,
                  anony,
                  del,
                  checkVideo,
                  list
                ])

              } else if (params.row.indexValue === 1 && params.row.statusValue === 1) {
                return h('div',{
                  style:{
                    paddingBottom:'5px'
                  }
                },[
                  cancelTop,
                  cancelAnony,
                  del,
                  checkVideo,
                  list
                ])
              }
            }
          }
        ],
        //发布数据
        isPic:false,
        isVideo:false,
        quesData:{
          type:0, //问答类型
          docUrls:'', //图片路径
          videoUrl:'', //视频路径
          videoPic:'', //视频封面
          status:'0', //是否匿名
          description:'', //问答描述
          loginName:'', //玄乐账号
          ownerType:'' //发布人类型
        },
        quesTypeList:[
          {
            value:0,
            label:'文字'
          },
          {
            value:1,
            label:'文字+图片'
          },
          {
            value:2,
            label:'文字+视频'
          }
        ],
        ownerTypeList:[
          {
            value:1,
            label:'用户'
          },
          {
            value:2,
            label:'营养顾问'
          }
        ],
        ruleValidate:{
          ownerType:[
            {validator:userValidate}
          ],
          loginName:[
            {validator:nameValidate}
          ],
          description:[
            {validator:conValidate}
          ]
        },
      }
    },
    mounted () {
      this.getQuesList();
    },
    methods:{
      //获取列表
      getQuesList:function () {
        this.loading = true;
        axios.HealthQuesList(this.listParams)
          .then(res => {
            //console.log(JSON.stringify(res.result.list[0]));
            if (res.code === 200) {
              this.loading = false;
              this.listData = res.result.list;
              this.total = res.result.total;
            } else {
              this.quesTip = true;
              this.$refs.quesTip.innerHTML = '查询出错！'
            }
          })
          .catch(error => {
            console.log(error);
            this.quesTip = true;
            this.$refs.quesTip.innerHTML = '查询出错！'
          })
      },
      //修改状态操作
      changeStatus:function (id,status) {
        axios.HealrhQuesTop({id:id,type:status})
          .then(res => {
            //console.log(res);
            this.quesTip = true;
            this.$refs.quesTip.innerHTML =res.message;
            if (res.code === 200) {
              this.getQuesList();
            }
          })
          .catch(error => {
            console.log(error);
            this.quesTip = true;
            this.$refs.quesTip.innerHTML = '操作失败！';
          })
      },
      addQues:function () {
        this.quesValue = true;
      },
      queryStartTime:function (date) {
        this.listParams.queryTimeStart = date;
      },
      queryEndTime:function (date) {
        this.listParams.queryTimeEnd = date;
      },
      checkQuesClick:function () {
        this.listParams.page= 1;
        this.getQuesList();
      },
      pageChange:function (page) {
        this.listParams.page= page;
        this.getQuesList();
      },
      videoClose:function (value) {
        if (!value) {
          this.videoUrl = '';
        }
      },
      del:function () {
        this.quesTip = false;
      },
      clearQuesData:function () {
        this.$refs.quesData.resetFields();
        this.quesData.docUrls = '';
        this.quesData.videoPic = '';
        this.quesData.videoUrl = '';
        this.quesData.type = 0;
        this.quesData.status = '0';
        this.$refs.quesPic.clearUpload();
        this.$refs.videoCover.clearUpload();
        this.$refs.quesVideo.clearUpload();
        this.isPic = false;
        this.isVideo = false;
      },
      quesSub:function () {
        this.$refs.quesData.validate(valid => {
          if (valid) {
            this.quesLoading = true;
            axios.HealthQuesAdd(this.quesData)
              .then(res => {
                //console.log(res);
                this.quesTip = true;
                this.$refs.quesTip.innerHTML = res.message;
                if (res.code === 200) {
                  this.quesValue = false;
                  this.clearQuesData();
                  this.listParams.page = 1;
                  this.getQuesList();
                } else {
                  this.quesLoading = false;
                }
              })
              .catch(error => {
                console.log(error);
                this.quesLoading = true;
                this.quesTip = true;
                this.$refs.quesTip.innerHTML = '操作失败！';
              })
          }
        });
      },
      typeChange:function (value) {
        this.isPic = !(value === 0 || value === 2);
        this.isVideo = !(value === 0 || value === 1);
        this.quesData.docUrls = '';
        this.quesData.videoPic = '';
        this.quesData.videoUrl = '';
      },
      successQuesPath:function (file,title,fileList) {
        this.quesPath(fileList);
      },
      removeQuesPath:function (file,fileList) {
        this.quesPath(fileList);
      },
      successCoverPath:function (file,title,fileList) {
        this.quesData.videoPic = file.url;
      },
      removeCoverPath:function (file,fileList) {
        this.quesData.videoPic = '';
      },
      successQuesVideo:function (file,title,fileList) {
        this.quesData.videoUrl = file.url;
      },
      removeQuesVideo:function (file,fileList) {
        this.quesData.videoUrl = '';
      },
      quesPath:function (list) {
        let arr = [];
        list.forEach(item => {
          arr.push(item.url);
        });
        this.quesData.docUrls = arr.join();
      },
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
  .bigImg{
    height: 500px;
    display: block;
    margin: 0 auto;
  }
</style>
