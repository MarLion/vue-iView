<template>
  <div class="content-pad">
    <div class="community-fun">
      <div class="community-ope">
        <Button type="default" icon="md-add" @click="addHomeNews">添加新闻</Button>
      </div>
      <div class="community-search">
        <span class="ml15">新闻标题：</span>
        <span><Input class="checkWid" v-model="listParams.newTitle"/></span>
        <span class="ml10"><Button icon="ios-search" @click="checkHomeNews">查询</Button></span>
      </div>
    </div>
    <div class="community-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" :current="listParams.pageNum" v-if="total>10" show-elevator show-total @on-change="homePagePageChange" class="mt30"/>
    </div>
    <!--新增资讯-->
    <Drawer
      title='发布资讯'
      v-model="homeNewsValue"
      width="1200"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearHomeNewsData"
    >
      <Form :model="homeNewsData" ref="homeForm" :rules="ruleValidate" style="width: 100%;margin-top: 20px;">
        <FormItem label="所属省：" :label-width="100" prop="newOneType">
          <Select v-model="homeNewsData.newOneType" @on-change="getCity(homeNewsData.newOneType)" style="width: 400px;">
            <Option v-for="(item,index) in provinceList" :key="index" :value="item.areaid">{{item.areaname}}</Option>
          </Select>
        </FormItem>
        <FormItem label="所属市：" :label-width="100" prop="newTwoType">
          <Select v-model="homeNewsData.newTwoType" style="width: 400px;">
            <Option v-for="(item,index) in cityList" :key="index" :value="item.areaid">{{item.areaname}}</Option>
          </Select>
        </FormItem>
        <FormItem label="新闻标题：" prop="newTitle" :label-width="100">
          <Input type="text" :maxlength="80" v-model="homeNewsData.newTitle" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="新闻关键词：" prop="newKeyWord" :label-width="100">
          <Input type="text" :maxlength="80" v-model="homeNewsData.newKeyWord" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="新闻简介：" prop="newBrief" :label-width="100">
          <Input type="text" v-model="homeNewsData.newBrief" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="新闻内容：" :label-width="100">
          <editor-view ref="homeNewsContent" :upload-url="uploadUrl" v-on:transmit-con="getHomeNewsContent"></editor-view>
        </FormItem>
        <FormItem>
          <upload-view ref="homeNewsCover" :upload-url="uploadUrl" title="大众列表图片" :length="9" :width="100" con-width="100%" v-on:success-callback="successHomeNewsCoverPath" v-on:remove-callback="removeHomeNewsCoverPath"></upload-view>
        </FormItem>
        <FormItem>
          <upload-view ref="homeVideoCover" :upload-url="uploadUrl" title="视频背景图" :length="9" :width="100" con-width="100%" v-on:success-callback="successHomeVideoCoverPath" v-on:remove-callback="removeHomeVideoCoverPath"></upload-view>
        </FormItem>
        <FormItem>
          <upload-view ref="homeContentCover" :upload-url="uploadUrl" title="正文背景图" :length="1" :width="100" con-width="100%" v-on:success-callback="successHomeContentCoverPath" v-on:remove-callback="removeHomeContentCoverPath"></upload-view>
        </FormItem>
        <FormItem label="视频类型：" :label-width="100">
          <Select v-model="homeNewsData.videoType" style="width: 400px;">
            <Option v-for="(item,index) in videoTypeList" :key="index" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem v-if="homeNewsData.videoType === '0'">
          <video-view  ref="homeNewsVideo" :upload-url="uploadUrl" title="上传视频" :length="1" :width="100" con-width="100%" v-on:success-callback="successHomeNewsVideo" v-on:remove-callback="removeHomeNewsVideo"></video-view>
        </FormItem>
        <FormItem label="视频链接：" :label-width="100" v-else>
          <Input type="text"  v-model="homeNewsData.videoPath" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="视频时长：" prop="newVideoDuration" :label-width="100">
          <InputNumber v-model="homeNewsData.newVideoDuration" style="width: 400px;"></InputNumber>
        </FormItem>
        <FormItem :label-width="100">
          <Row>
            <Col span="4">
              <FormItem><Checkbox v-model="homeNewsData.isAllowComment" true-value="0" false-value="1">是否允许评论</Checkbox></FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem style="width: 200px!important;" :label-width="100">
          <Button type="primary" @click="homeNewsSub" :loading="homeNewsLoading">确认发布</Button>
        </FormItem>
      </Form>
    </Drawer>
    <!--资讯详情-->
    <Drawer
      title='新闻详情'
      v-model="homeDetailValue"
      width="1200"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearHomeDetailData"
    >
      <h1 style="text-align: center;">{{homeDetailData.title}}</h1>
      <div class="mt30 article" ref="homeContent"></div>
      <video :src="homeDetailData.videoPath" v-if="isHomeVideo" controls="controls" style="width: 50%;margin: 30px auto 0;display: block;"></video>
    </Drawer>
    <!--资讯修改-->
    <Drawer
      title='修改资讯'
      v-model="homeReviseValue"
      width="1200"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearHomeReviseData"
    >
      <Form :model="homeReviseData" ref="homeReForm" :rules="ruleValidate" style="width: 100%;margin-top: 20px;">
        <FormItem label="所属省：" :label-width="100" prop="newOneType">
          <Select v-model="homeReviseData.newOneType" @on-change="reCityChange(homeReviseData.newOneType)" style="width: 400px;">
            <Option v-for="(item,index) in provinceList" :key="index" :value="item.areaid">{{item.areaname}}</Option>
          </Select>
        </FormItem>
        <FormItem label="所属市：" :label-width="100" prop="newTwoType">
          <Select v-model="homeReviseData.newTwoType" style="width: 400px;">
            <Option v-for="(item,index) in cityList" :key="index" :value="item.areaid">{{item.areaname}}</Option>
          </Select>
        </FormItem>
        <FormItem label="新闻标题：" prop="newTitle" :label-width="100">
          <Input type="text" :maxlength="80" v-model="homeReviseData.newTitle" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="新闻关键词：" prop="newKeyWord" :label-width="100">
          <Input type="text" :maxlength="80" v-model="homeReviseData.newKeyWord" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="新闻简介：" prop="newBrief" :label-width="100">
          <Input type="text" v-model="homeReviseData.newBrief" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="新闻内容：" :label-width="100">
          <revise-editor-view ref="homeEdRe" :upload-url="uploadUrl" :original-content="homeReviseData.newContent" :watch-value="isHomeWatch" v-on:transmit-con="getHomeReviseContent"></revise-editor-view>
        </FormItem>
        <FormItem>
          <revise-upload-view ref="homeReNewsCoverRe" :upload-url="uploadUrl" title="大众列表图片" :length="9" :width="100" con-width="100%" :default-list="defaultHomeCover" :list-value="isHomeCoverRe" v-on:success-callback="homeNewsCoverReSuccess" v-on:remove-callback="homeNewsCoverReRemove"></revise-upload-view>
        </FormItem>
        <FormItem>
          <revise-upload-view ref="homeReVideoCoverRe" :upload-url="uploadUrl" title="视频背景图" :length="9" :width="100" con-width="100%" :default-list="defaultHomeVideoCover" :list-value="isHomeVideoCoverRe" v-on:success-callback="homeVideoCoverReSuccess" v-on:remove-callback="homeVideoCoverReRemove"></revise-upload-view>
        </FormItem>
        <FormItem>
          <revise-upload-view ref="homeReContentCoverRe" :upload-url="uploadUrl" title="正文背景图" :length="1" :width="100" con-width="100%" :default-list="defaultHomeContentCover" :list-value="isHomeContentCoverRe" v-on:success-callback="homeContentCoverReSuccess" v-on:remove-callback="homeContentCoverReRemove"></revise-upload-view>
        </FormItem>
        <FormItem label="视频类型：" :label-width="100">
          <Select v-model="homeReviseData.videoType" style="width: 400px;" @on-change="reVideoType(homeReviseData.videoType)">
            <Option v-for="(item,index) in videoTypeList" :key="index" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem v-show="homeReviseData.videoType === '0'">
          <revise-video-view  ref="homeNewsVideoRe" :upload-url="uploadUrl" title="上传视频" :length="1" :width="100" con-width="100%" :default-list="homeDefaultVideo" :watch-value="isHomeVideoShow" v-on:success-callback="homeVideoReSuccess" v-on:remove-callback="homeVideoReRemove"></revise-video-view>
        </FormItem>
        <FormItem  label="视频链接：" :label-width="100" v-show="homeReviseData.videoType === '1'">
          <Input type="text"  v-model="homeReviseData.videoPath" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="视频时长：" prop="newVideoDuration" :label-width="100">
          <InputNumber type="text"  v-model="homeReviseData.newVideoDuration" style="width: 400px;"></InputNumber>
        </FormItem>
        <FormItem :label-width="100">
          <Row>
            <Col span="4">
              <FormItem><Checkbox v-model="homeReviseData.isAllowComment" true-value="0" false-value="1">是否允许评论</Checkbox></FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem style="width: 200px!important;" :label-width="100">
          <Button type="primary" @click="homeNewsRevise" :loading="homeReviseLoading">确认修改</Button>
        </FormItem>
      </Form>
    </Drawer>
    <!--弹框-->
    <Modal
      title="提示"
      v-model="homeNewsTip"
      :mask-closable = "false"
    >
      <p ref="homeNewsTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "@/axios/axios";
  import * as base from '../../axios/base';
  const oneValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请选择省'))
    } else {
      callback();
    }
  };
  const twoValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请选择市'))
    } else {
      callback();
    }
  };
  const titleValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写新闻标题'))
    } else {
      callback();
    }
  };
  const brirfValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写新闻简介'))
    } else {
      callback();
    }
  };
  const keyValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写新闻关键词'))
    } else {
      callback();
    }
  };
  export default {
    name: "configureHomeNews",
    data () {
      return {
        uploadUrl:base.baseUrl.serviceOne + 'documents/saveOSSFiles', //所有的图片视频上传到阿里云
        videoUploadUrl:base.baseUrl.serviceTwo + 'documents/saveFiles',
        loading:false,
        total:'',
        homeNewsTip:false,
        homeNewsValue:false,
        homeNewsLoading:false,
        homeDetailValue:false,
        pushLoading:false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        videoTypeList:[
          {
            value:'0',
            label:'本地视频'
          },
          {
            value:'1',
            label:'在线视频'
          }
        ],
        listParams:{
          pageSize:10,
          pageNum:1,
          newTitle:'',
          owenrId:''
        },
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'新闻标题',
            key:'newTitle',
            align:'center'
          },
          {
            title:'关键字',
            key:'newKeyWord',
            align:'center'
          },
          {
            title:'省',
            key:'newOneType',
            align:'center'
          },
          {
            title:'市',
            key:'newTwoType',
            align:'center'
          },
          {
            title:'推送状态',
            key:'pushResultMessage',
            align:'center'
          },
          {
            title:'发布时间',
            align:'center',
            render:(h,params) => {
              return h('div',{
                style:{
                  height:'100%',
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
                  height:'100%',
                }
              },this.$trans.getTime(params.row.updateTime))
            }
          },
          {
            title:'操作选项',
            align:'center',
            width:230,
            render:(h,params) => {
              const detail = h('Button',{
                props:{
                  type: 'success',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    axios.HomeNewsDetail({id:params.row.id})
                      .then(res => {
                        console.log(res);
                        if (res.code === '0') {
                          this.homeDetailValue = true;
                          this.homeDetailData.title = res.data.newTitle;
                          this.$refs.homeContent.innerHTML = res.data.newContent;
                          this.isHomeVideo = res.data.videoPath !== '';
                          this.homeDetailData.videoPath = res.data.videoPath;
                        } else {
                          this.homeNewsTip = true;
                          this.$refs.homeNewsTip.innerHTML = '查询详情失败！';
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.homeNewsTip = true;
                        this.$refs.homeNewsTip.innerHTML = '查询详情失败！';
                      })
                  }
                }
              },'详情');
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
                    axios.HomeNewsDetail({id:params.row.id})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.homeReviseValue = true;
                          this.isHomeWatch = true;
                          this.isHomeCoverRe = true;
                          this.isHomeVideoCoverRe = true;
                          this.isHomeContentCoverRe = true;
                          this.isHomeVideoShow = true;
                          this.homeReviseData.id = res.data.id;
                          this.homeReviseData.newOneType = parseInt(res.data.provinceId);
                          this.homeReviseData.newTwoType = parseInt(res.data.cityId);
                          this.getProvince(-1);
                          this.getCityMessage(this.homeReviseData.newOneType);
                          this.homeReviseData.newTitle = res.data.newTitle;
                          this.homeReviseData.newKeyWord = res.data.newKeyWord;
                          this.homeReviseData.newBrief = res.data.newBrief;
                          this.homeReviseData.newContent = res.data.newContent;
                          if (res.data.publicPicPath !== '') {
                            this.homeReviseData.publicPicPath = res.data.publicPicPath;
                            res.data.publicPicPath.split(',').forEach(item => {
                              this.defaultHomeCover.push({url:item,status:'finished'})
                            });
                          } else {
                            this.defaultHomeCover = [];
                          }
                          if (res.data.videoPicPath !== '') {
                            this.homeReviseData.videoPicPath = res.data.videoPicPath;
                            res.data.videoPicPath.split(',').forEach(item => {
                              this.defaultHomeVideoCover.push({url:item,status:'finished'})
                            });
                          } else {
                            this.defaultHomeVideoCover = [];
                          }
                          if (res.data.newPicPath !== '') {
                            this.homeReviseData.newPicPath = res.data.newPicPath;
                            res.data.newPicPath.split(',').forEach(item => {
                              this.defaultHomeContentCover.push({url:item,status:'finished'})
                            });
                          } else {
                            this.defaultHomeContentCover = [];
                          }
                          this.homeReviseData.videoType = res.data.videoType;
                          if (res.data.videoType === '0') {
                            if (res.data.videoPath !== '') {
                              this.homeReviseData.videoPath = res.data.videoPath;
                              res.data.videoPath.split(',').forEach(item => {
                                this.homeDefaultVideo.push({url:item,status:'finished'})
                              });
                            } else {
                              this.homeDefaultVideo = [];
                            }
                          } else {
                            this.homeReviseData.videoPath = res.data.videoPath;
                          }
                          this.homeReviseData.newVideoDuration = res.data.newVideoDuration;
                          this.homeReviseData.isAllowComment = res.data.isAllowComment;
                        } else {
                          this.homeNewsTip = true;
                          this.$refs.homeNewsTip.innerHTML = '查询详情失败！';
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.homeNewsTip = true;
                        this.$refs.homeNewsTip.innerHTML = '查询详情失败！';
                      })
                  }
                }
              },'修改');
              const ref = h('Button',{
                props:{
                  type: 'warning',
                  size: 'small',
                },
                domProps:{
                  id: 'ref' + params.row.id
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    let id = 'ref' + params.row.id;
                    let isDisabled = true;
                    document.getElementById(id).setAttribute('disabled',isDisabled);
                    axios.HomeNewsPushToXuanle({id:params.row.id})
                      .then(res => {
                        //console.log(res);
                        this.homeNewsTip = true;
                        this.$refs.homeNewsTip.innerHTML = res.data;
                        this.getHomeNewsList();
                        isDisabled = false;
                        document.getElementById(id).setAttribute('disabled',isDisabled);
                      })
                      .catch(error => {
                        console.log(error);
                        this.homeNewsTip = true;
                        this.$refs.homeNewsTip.innerHTML = '推送失败！';
                        isDisabled = false;
                        document.getElementById(id).setAttribute('disabled',isDisabled);
                      })
                  }
                }
              },'推送');
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
                    axios.HomeNewsDelete({id:params.row.id})
                      .then(res => {
                        //console.log(res);
                        this.homeNewsTip = true;
                        this.$refs.homeNewsTip.innerHTML = res.data;
                        if (res.code === '0') {
                          this.getHomeNewsList();
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.homeNewsTip = true;
                        this.$refs.homeNewsTip.innerHTML = '操作失败！';
                      })
                  }
                }
              },'删除');
              return h('div',[
                detail,
                revise,
                ref,
                del
              ])
            }
          }
        ],
        //新增数据
        provinceList:[],
        cityList:[],
        homeNewsData:{
          newTitle:'',//标题
          newOneType:'',//省
          newTwoType:'',//市
          newBrief:'',//简介
          newContent:'',//内容
          newKeyWord:'',//关键字
          isAllowComment:'0',//是否允许评论 0 允许 1 不允许
          newVideoDuration:null,//视频时长
          publicPicPath:'',//大众列表图片
          videoPicPath:'',//视频背景图
          newPicPath:'',//正文背景图
          videoPath:'',//视频
          videoType:'0',//视频类型
          owenrId:''//登录id
        },
        //详情数据
        isHomeVideo:false,
        homeDetailData:{
          title:'',
          videoPath:'',
        },
        //修改数据
        homeReviseValue:false,
        isHomeWatch:false,
        isHomeCoverRe:false,
        isHomeVideoCoverRe:false,
        isHomeContentCoverRe:false,
        isHomeVideoShow:false,
        homeReviseLoading:false,
        defaultHomeCover:[],
        defaultHomeVideoCover:[],
        defaultHomeContentCover:[],
        homeDefaultVideo:[],
        homeReviseData:{
          id:'',
          newTitle:'',//标题
          newOneType:'',//省
          newTwoType:'',//市
          newBrief:'',//简介
          newContent:'',//内容
          newKeyWord:'',//关键字
          isAllowComment:'0',//是否允许评论 0 允许 1 不允许
          newVideoDuration:null,//视频时长
          publicPicPath:'',//大众列表图片
          videoPicPath:'',//视频背景图
          newPicPath:'',//正文背景图
          videoPath:'',//视频
          videoType:'0',//视频类型
          owenrId:''//登录id
        },
        ruleValidate:{
          newOneType:[
            {validator:oneValidate}
          ],
          newTwoType:[
            {validator:twoValidate}
          ],
          newTitle:[
            {validator:titleValidate}
          ],
          newKeyWord:[
            {validator:keyValidate}
          ],
          newBrief:[
            {validator:brirfValidate}
          ]
        },
      }
    },
    mounted () {
      if (sessionStorage.getItem('userId') != null) {
        this.$store.state.user_id = sessionStorage.getItem('userId');
      }
      this.listParams.owenrId = this.userId;
      this.homeNewsData.owenrId = this.userId;
      this.homeReviseData.owenrId = this.userId;
      this.getHomeNewsList();
    },
    computed:{
      userId:function () {
        return this.$store.state.user_id;
      }
    },
    methods:{
      //获取家乡资讯列表
      getHomeNewsList:function () {
        this.loading = true;
        axios.HomeNewsList(this.listParams)
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.loading = false;
              this.listData = res.data.list;
              this.total = res.data.total;
            } else {
              this.homeNewsTip = true;
              this.$refs.homeNewsTip.innerHTML = '查询出错！';
            }
          })
          .catch(error => {
            console.log(error);
            this.homeNewsTip = true;
            this.$refs.homeNewsTip.innerHTML = '查询出错！';
          })
      },
      //获取地理信息
      getProvince:function (level) {
        axios.HomeNewsArea({parentid:level})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.provinceList = res.data;
            } else {
              this.homeNewsTip = true;
              this.$refs.homeNewsTip.innerHTML = '查询省出错！';
            }
          })
          .catch(error => {
            console.log(error);
            this.homeNewsTip = true;
            this.$refs.homeNewsTip.innerHTML = '查询省出错！';
          })
      },
      getCity:function (level) {
        this.homeNewsData.newTwoType = '';
        this.getCityMessage(level)
      },
      reCityChange:function (level) {
        this.homeReviseData.newTwoType = '';
        this.getCityMessage(level)
      },
      getCityMessage:function (level) {
        axios.HomeNewsArea({parentid:level})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.cityList = res.data;
            } else {
              this.homeNewsTip = true;
              this.$refs.homeNewsTip.innerHTML = '查询市出错！';
            }
          })
          .catch(error => {
            console.log(error);
            this.homeNewsTip = true;
            this.$refs.homeNewsTip.innerHTML = '查询市出错！';
          })
      },
      addHomeNews:function () {
        this.homeNewsValue = true;
        this.getProvince(-1);
        axios.HomeNewsLastPosition({userId:this.listParams.owenrId})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              let data = JSON.parse(res.data);
              this.getCity(data.provinceId);
              this.homeNewsData.newOneType = parseInt(data.provinceId);
              this.homeNewsData.newTwoType = parseInt(data.cityId);
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      checkHomeNews:function () {
        this.listParams.pageNum = 1;
        this.getHomeNewsList();
      },
      homePagePageChange:function (page) {
        this.listParams.pageNum = page;
        this.getHomeNewsList();
      },
      del:function () {
        this.homeNewsTip = false;
      },
      clearHomeNewsData:function () {
        this.$refs.homeForm.resetFields();
        this.homeNewsData.isParticiple = '0';
        this.homeNewsData.isAllowComment = '0';
        this.homeNewsData.newContent = '';
        this.homeNewsData.publicPicPath = '';
        this.homeNewsData.videoPicPath = '';
        this.homeNewsData.newPicPath = '';
        this.homeNewsData.videoPath = '';
        this.$refs.homeNewsContent.clearData();
        this.$refs.homeNewsCover.clearUpload();
        this.$refs.homeVideoCover.clearUpload();
        this.$refs.homeContentCover.clearUpload();
        if (this.homeNewsData.videoType === '0') {
          this.$refs.homeNewsVideo.clearUpload();
        }
        this.homeNewsData.videoType = '0';
        this.cityList = [];
        this.provinceList = [];
      },
      getHomeNewsContent:function (con) {
        this.homeNewsData.newContent = con;
      },
      successHomeNewsCoverPath:function (file,title,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.homeNewsData.publicPicPath = arr.join();
      },
      removeHomeNewsCoverPath:function (file,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.homeNewsData.publicPicPath = arr.join();
      },
      successHomeVideoCoverPath:function (file,title,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.homeNewsData.videoPicPath = arr.join();
      },
      removeHomeVideoCoverPath:function (file,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.homeNewsData.videoPicPath = arr.join();
      },
      successHomeContentCoverPath:function (file,title,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.homeNewsData.newPicPath = arr.join();
      },
      removeHomeContentCoverPath:function (file,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.homeNewsData.newPicPath = arr.join();
      },
      successHomeNewsVideo:function (file,title,fileList) {
        this.homeNewsData.videoPath = file.url;
      },
      removeHomeNewsVideo:function () {
        this.homeNewsData.videoPath = '';
      },
      homeNewsSub:function () {
        this.$refs.homeForm.validate(valid => {
          if (valid) {
            this.homeNewsLoading = true;
            axios.HomeNewsAdd(this.homeNewsData)
              .then(res => {
                //console.log(res);
                this.homeNewsLoading = false;
                this.homeNewsTip = true;
                this.$refs.homeNewsTip.innerHTML = res.data;
                if (res.code === '0') {
                  this.homeNewsValue = false;
                  this.clearHomeNewsData();
                  this.getHomeNewsList();
                }
              })
              .catch(error => {
                console.log(error);
                this.homeNewsLoading = false;
                this.homeNewsTip = true;
                this.$refs.homeNewsTip.innerHTML = '保存失败！';
              })
          }
        })
      },
      //详情清除
      clearHomeDetailData:function () {
        this.isHomeVideo = false;
        this.homeDetailData.title = '';
        this.homeDetailData.videoPath = '';
      },
      //修改清除
      clearHomeReviseData:function () {
        this.cityList = [];
        this.provinceList = [];
        this.isHomeWatch = false;
        this.isHomeCoverRe = false;
        this.isHomeVideoCoverRe = false;
        this.isHomeContentCoverRe = false;
        this.isHomeVideoShow = false;
        this.$refs.homeEdRe.clearData();
        this.$refs.homeReNewsCoverRe.clearUpload();
        this.$refs.homeReVideoCoverRe.clearUpload();
        this.$refs.homeReVideoCoverRe.clearUpload();
        if (this.homeReviseData.videoType === '0') {
          this.$refs.homeNewsVideoRe.clearUpload();
        }
        this.homeReviseData.newContent = '';
        this.homeReviseData.publicPicPath = '';
        this.homeReviseData.videoPicPath = '';
        this.homeReviseData.newPicPath = '';
        this.homeReviseData.videoPath = '';
        this.defaultHomeCover = [];
        this.defaultHomeVideoCover = [];
        this.defaultHomeContentCover = [];
        this.homeDefaultVideo = [];
        this.$refs.homeReForm.resetFields();
      },
      getHomeReviseContent:function (con) {
        this.homeReviseData.newContent = con;
      },
      //大众列表图
      homeNewsCoverReSuccess:function (file,title,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.homeReviseData.publicPicPath = arr.join();
      },
      homeNewsCoverReRemove:function (file,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.homeReviseData.publicPicPath = arr.join();
      },
      //视频背景图
      homeVideoCoverReSuccess:function (file,title,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.homeReviseData.videoPicPath = arr.join();
      },
      homeVideoCoverReRemove:function (file,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.homeReviseData.videoPicPath = arr.join();
      },
      //正文背景图
      homeContentCoverReSuccess:function (file,title,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.homeReviseData.newPicPath = arr.join();
      },
      homeContentCoverReRemove:function (file,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.homeReviseData.newPicPath = arr.join();
      },
      //视频
      homeVideoReSuccess:function (file,titile,fileList) {
        this.homeReviseData.videoPath = file.url;
      },
      homeVideoReRemove:function () {
        this.homeReviseData.videoPath = '';
      },
      reVideoType:function (type) {
        this.homeReviseData.videoPath = '';
        this.$refs.homeNewsVideoRe.clearUpload();
        if (type === '0') {
          this.homeDefaultVideo = [];
        }
      },
      homeNewsRevise:function () {
         this.$refs.homeReForm.validate(valid => {
           if (valid) {
             this.homeReviseLoading = true;
             axios.HomeNewsUpdate(this.homeReviseData)
               .then(res => {
                 //console.log(res);
                 this.homeReviseLoading = false;
                 this.homeNewsTip = true;
                 this.$refs.homeNewsTip.innerHTML = res.data;
                 if (res.code === '0') {
                   this.homeReviseValue = false;
                   this.clearHomeReviseData();
                   this.getHomeNewsList();
                 }
               })
               .catch(error => {
                 console.log(error);
                 this.homeReviseLoading = false;
                 this.homeNewsTip = true;
                 this.$refs.homeNewsTip.innerHTML = '修改失败！';
               })
           }
         })
      }
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
  .article {
    //text-align: left;
    text-indent: 2em;
  }
</style>
